import { readFileSync, realpathSync, statSync } from 'node:fs'
import { extname, isAbsolute, resolve, sep } from 'node:path'

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
}

function inferImageMimeTypeFromFile(filePath, data) {
  const ext = extname(filePath).toLowerCase()
  const expectedMimeType = MIME_BY_EXT[ext]
  if (!expectedMimeType) {
    throw new Error(`Unsupported image extension: ${ext || 'unknown'}`)
  }

  const detectedMimeType =
    data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff
      ? 'image/jpeg'
      : data.length >= 8
        && data[0] === 0x89
        && data[1] === 0x50
        && data[2] === 0x4e
        && data[3] === 0x47
        && data[4] === 0x0d
        && data[5] === 0x0a
        && data[6] === 0x1a
        && data[7] === 0x0a
          ? 'image/png'
          : data.length >= 12
            && data.subarray(0, 4).toString('ascii') === 'RIFF'
            && data.subarray(8, 12).toString('ascii') === 'WEBP'
              ? 'image/webp'
              : data.length >= 6
                && (data.subarray(0, 6).toString('ascii') === 'GIF87a'
                  || data.subarray(0, 6).toString('ascii') === 'GIF89a')
                    ? 'image/gif'
                    : data.length >= 2 && data.subarray(0, 2).toString('ascii') === 'BM'
                      ? 'image/bmp'
                      : null

  if (!detectedMimeType) {
    throw new Error('File content is not a supported raster image')
  }
  if (detectedMimeType !== expectedMimeType) {
    throw new Error(`Image extension does not match file content: ${ext} / ${detectedMimeType}`)
  }

  return detectedMimeType
}

function normalizePathForCompare(filePath) {
  return process.platform === 'win32' ? filePath.toLowerCase() : filePath
}

function isPathInsideDir(filePath, dirPath) {
  const normalizedFile = normalizePathForCompare(filePath)
  const normalizedDir = normalizePathForCompare(dirPath)
  return normalizedFile === normalizedDir || normalizedFile.startsWith(`${normalizedDir}${sep}`)
}

function assertAllowedPath(realImagePath, allowedDirs) {
  if (!allowedDirs || allowedDirs.length === 0) return

  const realAllowedDirs = allowedDirs.map((dir) => realpathSync(resolve(dir)))
  if (!realAllowedDirs.some((dir) => isPathInsideDir(realImagePath, dir))) {
    throw new Error(`image_path is outside RUN_VISION_ALLOWED_DIRS: ${realImagePath}`)
  }
}

export function readLocalImageAsBase64(imagePath, config) {
  if (!isAbsolute(imagePath)) {
    throw new Error('image_path must be an absolute path')
  }

  const realImagePath = realpathSync(imagePath)
  assertAllowedPath(realImagePath, config.allowedDirs)

  const stat = statSync(realImagePath)
  if (!stat.isFile()) {
    throw new Error('image_path must point to a regular image file')
  }
  if (stat.size <= 0) {
    throw new Error('Image file is empty')
  }
  if (stat.size > config.maxImageBytes) {
    throw new Error(`Image file is too large; max is ${Math.round(config.maxImageBytes / 1024 / 1024)}MB`)
  }

  const data = readFileSync(realImagePath)
  return {
    base64: data.toString('base64'),
    mimeType: inferImageMimeTypeFromFile(realImagePath, data),
  }
}

function imageBlockFromInput(params, config) {
  let resolvedBase64 = params.image_base64
  let resolvedMimeType = params.image_mime_type

  if (params.image_path && !resolvedBase64) {
    const image = readLocalImageAsBase64(params.image_path, config)
    resolvedBase64 = image.base64
    resolvedMimeType = image.mimeType
  }

  if (resolvedBase64) {
    const mimeType = resolvedMimeType || 'image/jpeg'
    return {
      type: 'image_url',
      image_url: { url: `data:${mimeType};base64,${resolvedBase64}` },
    }
  }

  if (params.image_url) {
    return {
      type: 'image_url',
      image_url: { url: params.image_url },
    }
  }

  throw new Error('Provide one of image_path, image_base64, or image_url')
}

function extractTextContent(data) {
  const content = data?.choices?.[0]?.message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => typeof part?.text === 'string' ? part.text : '')
      .filter(Boolean)
      .join('\n')
  }
  return ''
}

export async function describeImage(params, config) {
  if (!config.apiKey) {
    throw new Error('RUN_VISION_API_KEY is not configured')
  }

  const imageContent = imageBlockFromInput(params, config)
  const prompt = params.prompt?.trim()
    || 'Please describe this image in detail, including visible text, people, objects, scene, layout, colors, and any important details.'

  const requestBody = {
    model: config.model,
    messages: [
      {
        role: 'user',
        content: [
          imageContent,
          { type: 'text', text: prompt },
        ],
      },
    ],
    max_tokens: config.maxTokens,
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs)

  let response
  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Vision model request timed out after ${Math.round(config.requestTimeoutMs / 1000)}s`)
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Vision model API request failed (${response.status}): ${text.slice(0, 500)}`)
  }

  const data = await response.json()
  if (data?.error?.message) {
    throw new Error(`Vision model API error: ${data.error.message}`)
  }

  const content = extractTextContent(data)
  if (!content) {
    throw new Error('Vision model returned no text content')
  }

  return content
}
