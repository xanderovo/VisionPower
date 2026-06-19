# VisionPower

[![中文](https://img.shields.io/badge/Language-%E4%B8%AD%E6%96%87-red)](./README.md)

VisionPower is a portable image-understanding MCP server for Codex, Claude Desktop, Cursor, Cline, and other MCP-compatible agents.

It exposes one tool:

- `describe_image`: analyze a local image path, image URL, or base64 image with an OpenAI-compatible vision model.

VisionPower defaults to Qwen VL through Alibaba Cloud Model Studio / DashScope's OpenAI-compatible endpoint. You can replace the model and base URL with any vision-capable OpenAI-compatible provider.

## Requirements

- Node.js 18 or newer
- A vision-capable OpenAI-compatible API key

Alibaba Cloud Model Studio / Bailian:

- Official console: https://bailian.console.aliyun.com/cn-beijing#/home
- API Key page: https://bailian.console.aliyun.com/?tab=model#/api-key

## Quick Start

Choose one installation channel based on your network.

### 1. Users with VPN or stable npm access

Use the official npm registry:

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "npx",
      "args": ["-y", "visionpower"],
      "env": {
        "RUN_VISION_API_KEY": "your-api-key",
        "RUN_VISION_MODEL": "qwen3-vl-flash",
        "RUN_VISION_BASE_URL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  }
}
```

### 2. Users in mainland China without VPN: npm mirror

Use npmmirror for the first download:

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "npx",
      "args": ["-y", "--registry=https://registry.npmmirror.com", "visionpower"],
      "env": {
        "RUN_VISION_API_KEY": "your-api-key",
        "RUN_VISION_MODEL": "qwen3-vl-flash",
        "RUN_VISION_BASE_URL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  }
}
```

### 3. Users in mainland China without VPN: install locally first

This is the most stable option for long-term use.

Install VisionPower globally:

```bash
npm install -g visionpower --registry=https://registry.npmmirror.com
```

Then configure your agent to run the local command:

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "visionpower",
      "args": [],
      "env": {
        "RUN_VISION_API_KEY": "your-api-key",
        "RUN_VISION_MODEL": "qwen3-vl-flash",
        "RUN_VISION_BASE_URL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  }
}
```

If a GUI agent cannot find `visionpower`, run:

```bash
which visionpower
```

Then replace `command` with the absolute path, for example:

```json
"command": "/opt/homebrew/bin/visionpower"
```

## Codex TOML Configuration

Codex uses TOML instead of JSON.

Official npm registry:

```toml
[mcp_servers."visionpower"]
type = "stdio"
command = "npx"
args = ["-y", "visionpower"]

[mcp_servers."visionpower".env]
RUN_VISION_API_KEY = "your-api-key"
RUN_VISION_MODEL = "qwen3-vl-flash"
RUN_VISION_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
```

Mainland China mirror:

```toml
[mcp_servers."visionpower"]
type = "stdio"
command = "npx"
args = ["-y", "--registry=https://registry.npmmirror.com", "visionpower"]

[mcp_servers."visionpower".env]
RUN_VISION_API_KEY = "your-api-key"
RUN_VISION_MODEL = "qwen3-vl-flash"
RUN_VISION_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
```

Local global install:

```toml
[mcp_servers."visionpower"]
type = "stdio"
command = "visionpower"
args = []

[mcp_servers."visionpower".env]
RUN_VISION_API_KEY = "your-api-key"
RUN_VISION_MODEL = "qwen3-vl-flash"
RUN_VISION_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
```

## Model And Base URL Options

`RUN_VISION_MODEL` and `RUN_VISION_BASE_URL` are just defaults. You can replace them in the JSON/TOML configuration with any vision-capable OpenAI-compatible model and endpoint.

Common options:

| Provider | `RUN_VISION_MODEL` | `RUN_VISION_BASE_URL` | Notes |
| --- | --- | --- | --- |
| Alibaba Cloud Model Studio / DashScope | `qwen3-vl-flash` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Default. Fast and cost-effective for image understanding. |
| Alibaba Cloud Model Studio / DashScope | `qwen3-vl-plus` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Higher quality Qwen VL option, subject to account/model availability. |
| Alibaba Cloud Model Studio / DashScope | `qwen3.6-flash` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Use if this multimodal model is available in your Bailian account. |
| OpenAI | `gpt-4o` | `https://api.openai.com/v1` | Strong general image understanding. |
| OpenAI | `gpt-4o-mini` | `https://api.openai.com/v1` | Lower-cost OpenAI option. |
| Other OpenAI-compatible provider | provider model ID | provider `/v1` base URL | Replace both fields with your provider's model and endpoint. |

Example: OpenAI configuration:

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "npx",
      "args": ["-y", "visionpower"],
      "env": {
        "RUN_VISION_API_KEY": "your-openai-api-key",
        "RUN_VISION_MODEL": "gpt-4o",
        "RUN_VISION_BASE_URL": "https://api.openai.com/v1"
      }
    }
  }
}
```

Example: custom OpenAI-compatible provider:

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "npx",
      "args": ["-y", "visionpower"],
      "env": {
        "RUN_VISION_API_KEY": "your-provider-api-key",
        "RUN_VISION_MODEL": "your-vision-model-name",
        "RUN_VISION_BASE_URL": "https://your-provider.example.com/v1"
      }
    }
  }
}
```

## Environment Variables

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `RUN_VISION_API_KEY` | Yes | | API key for the configured vision provider. |
| `RUN_VISION_MODEL` | No | `qwen3-vl-flash` | Vision model name. |
| `RUN_VISION_BASE_URL` | No | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI-compatible base URL without `/chat/completions`. |
| `RUN_VISION_MAX_IMAGE_BYTES` | No | `20971520` | Max local image size in bytes. |
| `RUN_VISION_TIMEOUT_MS` | No | `60000` | Upstream API timeout. |
| `RUN_VISION_MAX_TOKENS` | No | `2048` | Max response tokens. |

## Tool Input

Local image path:

```json
{
  "image_path": "/absolute/path/to/image.png",
  "prompt": "Read the text in this screenshot and summarize it."
}
```

Image URL:

```json
{
  "image_url": "https://example.com/image.png",
  "prompt": "What is in this image?"
}
```

Base64 image:

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

## Notes

- The first `npx` run downloads VisionPower. After that, npm usually uses local cache, but network checks may still happen.
- Global install is more stable for long-term use in restricted network environments.
- Model availability depends on your provider account, region, and permissions. If a model is unavailable, replace `RUN_VISION_MODEL` with another vision-capable model exposed by your provider.
