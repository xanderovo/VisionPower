# VisionPower

[![English](https://img.shields.io/badge/Language-English-blue)](./README.en.md)
[![npm](https://img.shields.io/npm/v/visionpower)](https://www.npmjs.com/package/visionpower)

VisionPower 是一个图片理解 MCP。把它配置到 Codex、Claude Desktop、Cursor、Cline 等 Agent 程序后，Agent 就可以通过 `describe_image` 工具识别图片、读取截图文字、分析图表和描述视觉内容。

默认配置使用阿里云百炼 / DashScope 的 Qwen VL OpenAI-compatible 接口。你也可以把模型和 Base URL 替换成任何支持视觉能力的 OpenAI-compatible 服务。

## 选择安装方式

| 你想怎么用 | 推荐方式 | 适合谁 |
| --- | --- | --- |
| 不想手动改配置 | [方式 1：把安装指令交给 Agent](#方式-1把安装指令交给-agent) | Codex、Cursor、Claude Code 等能修改配置/运行命令的 Agent 用户 |
| 你的工具吃 JSON MCP 配置 | [方式 2：MCP JSON 配置](#方式-2mcp-json-配置) | Claude Desktop、Cursor、Cline、Cherry Studio 等 |
| 你用 Codex | [方式 3：Codex TOML 配置](#方式-3codex-toml-配置) | Codex CLI / Codex 桌面配置 |
| 国内网络或长期使用 | [方式 4：先安装到本地再配置](#方式-4先安装到本地再配置) | 希望启动更稳定、不想每次走 `npx` 解析的用户 |

## 准备工作

- Node.js 18 或更高版本
- 一个支持视觉模型的 OpenAI-compatible API Key

阿里云百炼 API Key 页面：

https://bailian.console.aliyun.com/?tab=model#/api-key

## 方式 1：把安装指令交给 Agent

这是最省事的路径。把下面这段话发给你的 Agent，让它自己判断配置格式、写入 MCP 配置并测试工具。

```text
请帮我安装并配置 VisionPower MCP。

我的视觉模型 API Key 是：填写你的 API Key
模型使用：qwen3-vl-flash
Base URL 使用：https://dashscope.aliyuncs.com/compatible-mode/v1

如果当前环境访问 npm 官方源稳定，请使用：
npx -y visionpower

如果当前环境访问 npm 官方源不稳定，或位于中国大陆网络环境，请优先使用：
npx -y --registry=https://registry.npmmirror.com visionpower

如果你判断 npx 启动不稳定，请先运行：
npm install -g visionpower --registry=https://registry.npmmirror.com
然后把 MCP command 配成 visionpower。

请根据当前 Agent 的配置格式写入 MCP 配置，并确认 describe_image 工具可用。
```

## 方式 2：MCP JSON 配置

适用于 Claude Desktop、Cursor、Cline、Cherry Studio 等使用 JSON 格式配置 MCP 的工具。

### 2.1 官方 npm 源

适合 npm 官方源访问稳定的用户。

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

### 2.2 国内 npm 镜像

适合 npm 官方源访问不稳定，或位于中国大陆网络环境的用户。这个配置会让 `npx` 从 npmmirror 拉取 VisionPower。

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

## 方式 3：Codex TOML 配置

Codex 使用 TOML，不是 JSON。把下面内容写入 `~/.codex/config.toml`。

### 3.1 官方 npm 源

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

### 3.2 国内 npm 镜像

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

## 方式 4：先安装到本地再配置

这是国内网络和长期使用最稳定的方式。先把 VisionPower 安装到本机，再让 MCP 配置直接运行本地命令。

### 4.1 安装

国内用户推荐：

```bash
npm install -g visionpower --registry=https://registry.npmmirror.com
```

官方 npm 源：

```bash
npm install -g visionpower
```

### 4.2 JSON 工具配置

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

### 4.3 Codex TOML 配置

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

如果 Claude Desktop、Cursor 这类 GUI 应用找不到 `visionpower` 命令，先在终端运行：

```bash
which visionpower
```

然后把 `command` 改成绝对路径，例如：

```json
"command": "/opt/homebrew/bin/visionpower"
```

## 模型和 Base URL

`RUN_VISION_MODEL` 和 `RUN_VISION_BASE_URL` 可以替换。只要你的服务商兼容 OpenAI 的 `/chat/completions` 视觉输入格式，就可以配置到 VisionPower。

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
