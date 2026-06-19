import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ['src/index.js'],
  env: {
    ...process.env,
    RUN_VISION_API_KEY: '',
  },
})

const client = new Client({
  name: 'vision-mcp-smoke-test',
  version: '0.1.0',
})

try {
  await client.connect(transport)
  const tools = await client.listTools()
  const names = tools.tools.map((tool) => tool.name)
  if (!names.includes('describe_image')) {
    throw new Error(`describe_image tool missing; got ${names.join(', ')}`)
  }

  const result = await client.callTool({
    name: 'describe_image',
    arguments: {},
  })
  if (!result.isError) {
    throw new Error('Expected missing-input call to return isError=true')
  }

  console.log('Smoke test passed: describe_image is listed and callable.')
} finally {
  await client.close()
}
