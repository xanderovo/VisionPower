#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import * as z from 'zod/v4'
import { loadVisionConfig } from './config.js'
import { describeImage } from './vision-core.js'

const server = new McpServer({
  name: 'vision-plus-plus-mcp',
  title: 'Vision++ MCP',
  version: '0.1.0',
})

server.registerTool(
  'describe_image',
  {
    title: 'Describe Image',
    description: 'Analyze an image with an OpenAI-compatible vision model. Supports local image_path, image_url, or image_base64.',
    inputSchema: {
      image_path: z.string().optional().describe('Absolute path to a local raster image file. Use this when the image is available on disk.'),
      image_url: z.string().url().optional().describe('URL of an image that the configured vision model provider can access.'),
      image_base64: z.string().optional().describe('Base64-encoded image data without a data: URI prefix.'),
      image_mime_type: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']).optional().describe('MIME type for image_base64. Defaults to image/jpeg.'),
      prompt: z.string().optional().describe('Specific question or instruction about the image. Leave empty for a full description.'),
    },
  },
  async (args) => {
    try {
      if (!args.image_path && !args.image_url && !args.image_base64) {
        return {
          content: [{ type: 'text', text: 'Provide one of image_path, image_url, or image_base64.' }],
          isError: true,
        }
      }

      const config = loadVisionConfig()
      const text = await describeImage(args, config)
      return {
        content: [{ type: 'text', text }],
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        content: [{ type: 'text', text: `Vision++ MCP failed: ${message}` }],
        isError: true,
      }
    }
  },
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error('Vision++ MCP server error:', error)
  process.exit(1)
})
