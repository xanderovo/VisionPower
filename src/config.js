export const DEFAULT_VISION_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
export const DEFAULT_VISION_MODEL = 'qwen3-vl-flash'
export const DEFAULT_MAX_IMAGE_BYTES = 20 * 1024 * 1024
export const DEFAULT_REQUEST_TIMEOUT_MS = 60_000
export const DEFAULT_MAX_TOKENS = 2048

export const VISION_MODEL_PRESETS = [
  { model: 'qwen3-vl-flash', label: 'Qwen3-VL Flash', baseUrl: DEFAULT_VISION_BASE_URL },
  { model: 'qwen3-vl-plus', label: 'Qwen3-VL Plus', baseUrl: DEFAULT_VISION_BASE_URL },
  { model: 'qwen3.6-flash', label: 'Qwen3.6 Flash', baseUrl: DEFAULT_VISION_BASE_URL },
  { model: 'gpt-4o', label: 'GPT-4o', baseUrl: 'https://api.openai.com/v1' },
  { model: 'gpt-4o-mini', label: 'GPT-4o mini', baseUrl: 'https://api.openai.com/v1' },
]

export function getDefaultBaseUrlForModel(model) {
  return VISION_MODEL_PRESETS.find((preset) => preset.model === model)?.baseUrl ?? DEFAULT_VISION_BASE_URL
}

function parsePositiveInteger(value, fallback) {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseAllowedDirs(value) {
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function loadVisionConfig(env = process.env) {
  const model = (env.RUN_VISION_MODEL || DEFAULT_VISION_MODEL).trim()
  const baseUrl = (env.RUN_VISION_BASE_URL || getDefaultBaseUrlForModel(model)).trim().replace(/\/$/, '')
  const apiKey = (env.RUN_VISION_API_KEY || env.OPENAI_API_KEY || '').trim()

  return {
    apiKey,
    model,
    baseUrl,
    allowedDirs: parseAllowedDirs(env.RUN_VISION_ALLOWED_DIRS),
    maxImageBytes: parsePositiveInteger(env.RUN_VISION_MAX_IMAGE_BYTES, DEFAULT_MAX_IMAGE_BYTES),
    requestTimeoutMs: parsePositiveInteger(env.RUN_VISION_TIMEOUT_MS, DEFAULT_REQUEST_TIMEOUT_MS),
    maxTokens: parsePositiveInteger(env.RUN_VISION_MAX_TOKENS, DEFAULT_MAX_TOKENS),
  }
}
