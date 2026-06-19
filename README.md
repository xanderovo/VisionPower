# Vision++ MCP

Vision++ MCP is a portable image-understanding MCP server for Codex, Claude Desktop, Cursor, Cline, and other MCP-compatible agents.

It exposes one tool:

- `describe_image`: analyze a local image path, image URL, or base64 image with an OpenAI-compatible vision model.

The default provider is Qwen VL through DashScope's OpenAI-compatible endpoint, but you can point it at any compatible vision API, such as OpenAI `gpt-4o`.

## Requirements

- Node.js 18 or newer
- A vision-capable OpenAI-compatible API key

## Configuration

Environment variables:

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `RUN_VISION_API_KEY` | Yes | | API key for the configured vision provider. |
| `RUN_VISION_MODEL` | No | `qwen3-vl-flash` | Vision model name. |
| `RUN_VISION_BASE_URL` | No | DashScope compatible endpoint | Base URL without `/chat/completions`. |
| `RUN_VISION_ALLOWED_DIRS` | No | unrestricted | Comma-separated directories local `image_path` may read from. |
| `RUN_VISION_MAX_IMAGE_BYTES` | No | `20971520` | Max local image size in bytes. |
| `RUN_VISION_TIMEOUT_MS` | No | `60000` | Upstream API timeout. |
| `RUN_VISION_MAX_TOKENS` | No | `2048` | Max response tokens. |

## Codex

Add this to `~/.codex/config.toml`:

```toml
[mcp_servers."vision-mcp"]
type = "stdio"
command = "npx"
args = ["-y", "github:RunhuaHuang/vision-mcp#v0.1.0"]

[mcp_servers."vision-mcp".env]
RUN_VISION_API_KEY = "your-api-key"
RUN_VISION_MODEL = "qwen3-vl-flash"
RUN_VISION_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
RUN_VISION_ALLOWED_DIRS = "/Users/you/Desktop,/Users/you/Downloads"
```

## Claude Desktop / Cursor / Cline

Add this to the app's MCP configuration:

```json
{
  "mcpServers": {
    "vision-mcp": {
      "command": "npx",
      "args": ["-y", "github:RunhuaHuang/vision-mcp#v0.1.0"],
      "env": {
        "RUN_VISION_API_KEY": "your-api-key",
        "RUN_VISION_MODEL": "qwen3-vl-flash",
        "RUN_VISION_BASE_URL": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "RUN_VISION_ALLOWED_DIRS": "/Users/you/Desktop,/Users/you/Downloads"
      }
    }
  }
}
```

## OpenAI Example

```json
{
  "RUN_VISION_API_KEY": "your-openai-api-key",
  "RUN_VISION_MODEL": "gpt-4o",
  "RUN_VISION_BASE_URL": "https://api.openai.com/v1"
}
```

## Tool Input

```json
{
  "image_path": "/absolute/path/to/image.png",
  "prompt": "Read the text in this screenshot and summarize it."
}
```

Alternative inputs:

```json
{
  "image_url": "https://example.com/image.png",
  "prompt": "What is in this image?"
}
```

```json
{
  "image_base64": "...",
  "image_mime_type": "image/png",
  "prompt": "Extract all visible text."
}
```

## Local Development

```bash
npm install
npm run smoke
```

Start the server directly:

```bash
npm start
```

## Security Notes

`image_path` lets an agent ask this MCP server to read local raster image files. Set `RUN_VISION_ALLOWED_DIRS` when giving this MCP to agents you do not fully trust.

The server validates absolute paths, file type, file signature, and file size before sending image data to the configured vision provider.
