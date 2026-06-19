# VisionPower

[![中文](https://img.shields.io/badge/Language-%E4%B8%AD%E6%96%87-red)](./README.md)
[![npm](https://img.shields.io/npm/v/visionpower)](https://www.npmjs.com/package/visionpower)

VisionPower is an image-understanding MCP server for Codex, Claude Desktop, Cursor, Cline, and other agent apps. Once configured, your agent can call `describe_image` to understand images, read screenshot text, inspect charts, and describe visual content.

VisionPower defaults to Qwen VL through Alibaba Cloud Model Studio / DashScope's OpenAI-compatible endpoint. You can replace the model and base URL with any vision-capable OpenAI-compatible provider.

## Choose A Setup Path

| What you want | Recommended path | Best for |
| --- | --- | --- |
| You do not want to edit config manually | [Path 1: ask your agent to install it](#path-1-ask-your-agent-to-install-it) | Codex, Cursor, Claude Code, and agents that can edit config/run commands |
| Your app uses MCP JSON config | [Path 2: MCP JSON config](#path-2-mcp-json-config) | Claude Desktop, Cursor, Cline, Cherry Studio, and similar apps |
| You use Codex | [Path 3: Codex TOML config](#path-3-codex-toml-config) | Codex CLI / Codex desktop config |
| You are in a restricted network or want long-term stability | [Path 4: install locally first](#path-4-install-locally-first) | Users who prefer a local executable instead of repeated `npx` resolution |

## Requirements

- Node.js 18 or newer
- A vision-capable OpenAI-compatible API key

Alibaba Cloud Model Studio / Bailian API Key page:

https://bailian.console.aliyun.com/?tab=model#/api-key

## Path 1: ask your agent to install it

This is the lowest-friction path. Send the following instruction to your agent and let it choose the right config format, write the MCP config, and test the tool.

```text
Please install and configure VisionPower MCP for me.

My vision model API key is: your-api-key
Use this model: qwen3-vl-flash
Use this base URL: https://dashscope.aliyuncs.com/compatible-mode/v1

If the official npm registry is stable in this environment, use:
npx -y visionpower

If access to the official npm registry is unstable, or this environment is on a mainland China network, prefer:
npx -y --registry=https://registry.npmmirror.com visionpower

If npx startup seems unstable, first run:
npm install -g visionpower --registry=https://registry.npmmirror.com
Then configure the MCP command as visionpower.

Please write the MCP configuration in the format required by the current agent and confirm that the describe_image tool is available.
```

## Path 2: MCP JSON config

Use this for tools that configure MCP servers with JSON, such as Claude Desktop, Cursor, Cline, and Cherry Studio.

### 2.1 Official npm registry

Use this if access to the official npm registry is stable.

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

### 2.2 Mainland China npm mirror

Use this if access to the official npm registry is unstable, or the environment is on a mainland China network. This tells `npx` to fetch VisionPower from npmmirror.

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

## Path 3: Codex TOML config

Codex uses TOML instead of JSON. Add one of the following blocks to `~/.codex/config.toml`.

### 3.1 Official npm registry

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

### 3.2 Mainland China npm mirror

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

## Path 4: install locally first

This is the most stable option for restricted networks and long-term use. Install VisionPower globally, then configure MCP to run the local command.

### 4.1 Install

Recommended for mainland China:

```bash
npm install -g visionpower --registry=https://registry.npmmirror.com
```

Official npm registry:

```bash
npm install -g visionpower
```

### 4.2 JSON config

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

### 4.3 Codex TOML config

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

If a GUI app such as Claude Desktop or Cursor cannot find `visionpower`, run:

```bash
which visionpower
```

Then replace `command` with the absolute path, for example:

```json
"command": "/opt/homebrew/bin/visionpower"
```

## Models And Base URLs

You can replace `RUN_VISION_MODEL` and `RUN_VISION_BASE_URL`. Any provider that supports OpenAI-compatible `/chat/completions` vision input can be used with VisionPower.

| Provider | `RUN_VISION_MODEL` | `RUN_VISION_BASE_URL` | Notes |
| --- | --- | --- | --- |
| Alibaba Cloud Model Studio / DashScope | `qwen3-vl-flash` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Default. Fast and cost-effective for image understanding. |
| Alibaba Cloud Model Studio / DashScope | `qwen3-vl-plus` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Higher quality Qwen VL option, subject to account/model availability. |
| Alibaba Cloud Model Studio / DashScope | `qwen3.6-flash` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Use if this multimodal model is available in your Bailian account. |
| OpenAI | `gpt-4o` | `https://api.openai.com/v1` | Strong general image understanding. |
| OpenAI | `gpt-4o-mini` | `https://api.openai.com/v1` | Lower-cost OpenAI option. |
| Other OpenAI-compatible provider | provider model ID | provider `/v1` base URL | Replace both fields with your provider's model and endpoint. |

OpenAI example:

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

Custom OpenAI-compatible provider example:

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

Start the MCP server directly:

```bash
npm start
```

## Notes

- The first `npx` run downloads VisionPower. After that, npm usually uses local cache, but network resolution may still happen.
- Global install is more stable for restricted networks and long-term use.
- Model availability depends on your provider account, region, and permissions. If a model is unavailable, replace `RUN_VISION_MODEL` with another vision-capable model exposed by your provider.
