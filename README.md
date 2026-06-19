# VisionPower

[![English](https://img.shields.io/badge/Language-English-blue)](./README.en.md)

VisionPower 是一个可直接配置到 Codex、Claude Desktop、Cursor、Cline 等 Agent 程序里的图片理解 MCP。它可以让原本不支持看图的 Agent 通过工具调用识别图片、读取截图文字、分析图表和描述视觉内容。

它提供一个 MCP 工具：

- `describe_image`：使用 OpenAI-compatible 视觉模型分析本地图片路径、图片 URL 或 base64 图片。

VisionPower 默认使用阿里云百炼 / DashScope 的 Qwen VL OpenAI-compatible 接口。你也可以在 JSON / TOML 配置中把模型和 Base URL 替换成任何支持视觉能力的 OpenAI-compatible 服务。

## 准备工作

- Node.js 18 或更高版本
- 一个支持视觉模型的 OpenAI-compatible API Key

阿里云百炼：

- API Key 页面：https://bailian.console.aliyun.com/?tab=model#/api-key

## 快速开始

根据你的网络环境选择一种安装渠道。

### 1. 最简单：把安装指令交给 Agent

如果你的 Agent 能编辑自己的 MCP 配置，可以直接把下面这段话发给它，让它自动完成安装和配置：

```text
请帮我安装并配置 VisionPower MCP。

我的视觉模型 API Key 是：填写你的 API Key
模型使用：qwen3-vl-flash
Base URL 使用：https://dashscope.aliyuncs.com/compatible-mode/v1

如果当前环境访问 npm 官方源稳定，请用 npx -y visionpower。
如果当前环境在中国大陆且没有 VPN，请优先用 npx -y --registry=https://registry.npmmirror.com visionpower。
如果你判断 npx 启动不稳定，请先运行 npm install -g visionpower --registry=https://registry.npmmirror.com，再把 MCP command 配成 visionpower。

请根据当前 Agent 的配置格式写入 MCP 配置，并确认工具名 describe_image 可用。
```

### 2. 有 VPN 或 npm 官方源访问稳定的用户

使用 npm 官方源：

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "npx",
      "args": ["-y", "visionpower"],
      "env": {
        "RUN_VISION_API_KEY": "填写你的 API Key",
        "RUN_VISION_MODEL": "qwen3-vl-flash",
        "RUN_VISION_BASE_URL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  }
}
```

### 3. 没有 VPN 的国内用户：使用 npm 镜像

使用 npmmirror 作为首次下载渠道：

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "npx",
      "args": ["-y", "--registry=https://registry.npmmirror.com", "visionpower"],
      "env": {
        "RUN_VISION_API_KEY": "填写你的 API Key",
        "RUN_VISION_MODEL": "qwen3-vl-flash",
        "RUN_VISION_BASE_URL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  }
}
```

### 4. 没有 VPN 的国内用户：先下载到本地

这是长期使用最稳定的方式。

先全局安装 VisionPower：

```bash
npm install -g visionpower --registry=https://registry.npmmirror.com
```

然后把 Agent 配置为直接运行本地命令：

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "visionpower",
      "args": [],
      "env": {
        "RUN_VISION_API_KEY": "填写你的 API Key",
        "RUN_VISION_MODEL": "qwen3-vl-flash",
        "RUN_VISION_BASE_URL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  }
}
```

如果 Claude Desktop、Cursor 这类 GUI 应用找不到 `visionpower` 命令，先在终端运行：

```bash
which visionpower
```

然后把 `command` 改成绝对路径，例如：

```json
"command": "/opt/homebrew/bin/visionpower"
```

## Codex 配置

Codex 使用 TOML，不是 JSON。

npm 官方源：

```toml
[mcp_servers."visionpower"]
type = "stdio"
command = "npx"
args = ["-y", "visionpower"]

[mcp_servers."visionpower".env]
RUN_VISION_API_KEY = "填写你的 API Key"
RUN_VISION_MODEL = "qwen3-vl-flash"
RUN_VISION_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
```

国内 npm 镜像：

```toml
[mcp_servers."visionpower"]
type = "stdio"
command = "npx"
args = ["-y", "--registry=https://registry.npmmirror.com", "visionpower"]

[mcp_servers."visionpower".env]
RUN_VISION_API_KEY = "填写你的 API Key"
RUN_VISION_MODEL = "qwen3-vl-flash"
RUN_VISION_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
```

本地全局安装：

```toml
[mcp_servers."visionpower"]
type = "stdio"
command = "visionpower"
args = []

[mcp_servers."visionpower".env]
RUN_VISION_API_KEY = "填写你的 API Key"
RUN_VISION_MODEL = "qwen3-vl-flash"
RUN_VISION_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
```

## 可选模型和 Base URL

`RUN_VISION_MODEL` 和 `RUN_VISION_BASE_URL` 只是默认配置。你可以在 JSON / TOML 里替换成任何支持视觉能力的 OpenAI-compatible 模型和接口地址。

常用选项：

| 服务商 | `RUN_VISION_MODEL` | `RUN_VISION_BASE_URL` | 说明 |
| --- | --- | --- | --- |
| 阿里云百炼 / DashScope | `qwen3-vl-flash` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | 默认选项，适合快速图片理解。 |
| 阿里云百炼 / DashScope | `qwen3-vl-plus` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | 更高质量的 Qwen VL 选项，取决于你的账号权限。 |
| 阿里云百炼 / DashScope | `qwen3.6-flash` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | 如果你的百炼账号可用该多模态模型，可以直接替换。 |
| OpenAI | `gpt-4o` | `https://api.openai.com/v1` | 通用视觉理解能力强。 |
| OpenAI | `gpt-4o-mini` | `https://api.openai.com/v1` | 成本更低的 OpenAI 选项。 |
| 其他 OpenAI-compatible 服务 | 服务商提供的模型 ID | 服务商提供的 `/v1` Base URL | 把模型名和接口地址替换成你的服务商配置即可。 |

OpenAI 示例：

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "npx",
      "args": ["-y", "visionpower"],
      "env": {
        "RUN_VISION_API_KEY": "填写你的 OpenAI API Key",
        "RUN_VISION_MODEL": "gpt-4o",
        "RUN_VISION_BASE_URL": "https://api.openai.com/v1"
      }
    }
  }
}
```

自定义 OpenAI-compatible 服务示例：

```json
{
  "mcpServers": {
    "visionpower": {
      "command": "npx",
      "args": ["-y", "visionpower"],
      "env": {
        "RUN_VISION_API_KEY": "填写你的服务商 API Key",
        "RUN_VISION_MODEL": "your-vision-model-name",
        "RUN_VISION_BASE_URL": "https://your-provider.example.com/v1"
      }
    }
  }
}
```

## 环境变量

| 名称 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `RUN_VISION_API_KEY` | 是 | | 视觉模型服务商的 API Key。 |
| `RUN_VISION_MODEL` | 否 | `qwen3-vl-flash` | 视觉模型名称。 |
| `RUN_VISION_BASE_URL` | 否 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI-compatible Base URL，不要包含 `/chat/completions`。 |
| `RUN_VISION_MAX_IMAGE_BYTES` | 否 | `20971520` | 本地图片最大字节数。 |
| `RUN_VISION_TIMEOUT_MS` | 否 | `60000` | 上游接口超时时间。 |
| `RUN_VISION_MAX_TOKENS` | 否 | `2048` | 最大输出 token 数。 |

## 工具输入

本地图片路径：

```json
{
  "image_path": "/absolute/path/to/image.png",
  "prompt": "读取这张截图里的文字并总结。"
}
```

图片 URL：

```json
{
  "image_url": "https://example.com/image.png",
  "prompt": "这张图片里有什么？"
}
```

Base64 图片：

```json
{
  "image_base64": "...",
  "image_mime_type": "image/png",
  "prompt": "提取所有可见文字。"
}
```

## 本地开发

```bash
npm install
npm run smoke
```

直接启动 MCP server：

```bash
npm start
```

## 说明

- 第一次使用 `npx` 会下载 VisionPower。下载成功后 npm 通常会使用本地缓存，但仍可能进行网络解析。
- 国内网络或长期使用场景，推荐先全局安装再配置本地命令。
- 模型是否可用取决于你的服务商账号、地域和权限。如果某个模型不可用，把 `RUN_VISION_MODEL` 替换成你的服务商提供的其他视觉模型即可。
