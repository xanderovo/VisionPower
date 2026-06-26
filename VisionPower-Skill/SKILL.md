---
name: visionpower
description: 理解图片：读取截图文字（OCR）、解读图表和示意图，并使用视觉模型描述照片、UI 设计稿或文档扫描件。当用户分享或指向图片、截图、照片、图表、示意图，或询问 "what's in this picture"、"read the text in this image"、分析视觉内容时使用。运行内置的 describe_image.mjs 脚本（Node 18+），并需要视觉模型 API Key。
---

# VisionPower

使用视觉模型理解一张或多张图片。这个 skill 是**自包含**的：
脚本 `describe_image.mjs` 与本文件位于同一目录，可直接用 Node.js 运行，
无需 `npm install`、无需安装 CLI、无需额外依赖。它只需要 **Node 18+**
和一个视觉模型 **API Key**。

请通过脚本的绝对路径调用它。不同 Agent 的 skill 安装目录可能不同；不要假设
`~/.claude/skills/visionpower/` 一定存在。如果该 skill 安装在某个目录
`<skill>` 下，脚本路径就是 `<skill>/describe_image.mjs`。

## 路径与沙箱环境

很多 Agent 会在独立的沙箱、容器或私有根目录中运行。这里的 `~` 表示**运行脚本
的当前 Agent 环境的 home**，不一定是系统用户的 home。为避免写入系统环境或错误
的 home，优先选择一个 Agent 私有、可写、持久的目录作为 `<vp-config-dir>`，例如
Agent 提供的状态目录或工作区下已忽略提交的 `.visionpower/` 目录。

不要修改 shell profile、全局环境变量或系统级配置。需要指定配置路径时，只在运行
脚本的那条命令前临时传入：

```bash
VISIONPOWER_CONFIG="<vp-config-dir>/config.json" \
VISIONPOWER_SKILL_STATE="<vp-config-dir>/skill-state.json" \
node <skill>/describe_image.mjs --help
```

## 回复风格（重要）

隐藏执行细节。用户要的是图片内容的答案，不是执行过程说明。

- **正常调用时不要叙述或预检查。** 不要运行 `node --version`，不要
  `cat` 配置文件，也不要宣布“检查环境”“配置存在”“正在运行脚本”等。
  直接运行一次脚本并回答。首次设置是唯一例外。
- **直接运行脚本。** 默认它已经配置好。脚本会在 Node 或 API Key 缺失时
  快速失败并给出清晰错误；只有这时才回到设置流程。
- **记住已验证的设置。** 每次模型调用成功后，脚本会在状态文件中写入标记。
  使用沙箱配置时，该文件应是 `<vp-config-dir>/skill-state.json`；未指定时才使用
  当前 Agent home 下的 `~/.visionpower/skill-state.json`。如果该标记显示
  `"configVerified": true`，后续调用不要再做设置/配置预检查；只有当脚本再次
  因为缺少 key、鉴权失败或配置错误而失败时，才要求用户重新配置。
- **不要在回复中暴露内部细节**：不要给出命令行、绝对路径、原始请求 JSON、
  模型或配置细节。只呈现结果；如果失败，给出简短的自然语言错误说明。
- 使用**用户的语言**回复，简洁直接，就像你直接看到了图片一样。

## 首次设置（仅在尚未配置时）

**正常调用时跳过本节。** 只在第一次使用，或脚本返回缺少 key、鉴权失败、
配置错误时执行。设置应保存到 Agent 私有的**持久配置文件**。沙箱环境优先使用
`<vp-config-dir>/config.json`，并在每次运行脚本时通过 `VISIONPOWER_CONFIG`
指向它。只有在确认当前 `~` 是该 Agent 专属且可写时，才使用默认的
`~/.visionpower/config.json`。

脚本还会维护一个**设置状态标记**：

```json
{ "configVerified": true, "verifiedAt": "..." }
```

该文件默认位于当前 Agent home 下的 `~/.visionpower/skill-state.json`，但沙箱环境
应使用 `VISIONPOWER_SKILL_STATE="<vp-config-dir>/skill-state.json"` 覆盖。分析或
验证成功后会自动写入 `configVerified: true`。缺少 key 或鉴权失败时，会尽力写入
`configVerified: false`。该标记只用于避免重复设置检查；不要读取或打印 API Key。

1. **确认 Node 18+**（仅在这里执行，正常调用不要执行）：`node --version`。

2. **询问用户要使用哪个视觉模型**，并提供默认选项：
   - `qwen3-vl-flash`：**默认**，阿里云百炼 / DashScope，速度快、成本低。
     获取 key：https://bailian.console.aliyun.com/?tab=model#/api-key
   - `qwen3-vl-plus`：DashScope，质量更高。
   - `gpt-4o`：OpenAI（将 `baseUrl` 设为 `https://api.openai.com/v1`）。
     获取 key：https://platform.openai.com/api-keys

   如果用户没有偏好，使用 `qwen3-vl-flash`。

3. **向用户索取 API Key，然后保存**到 Agent 私有持久配置文件。先选择一个
   `<vp-config-dir>`，它必须是当前 Agent 可写、不会被提交到仓库的目录。创建
   `<vp-config-dir>/config.json`（权限 mode 600）。只有在不是默认值时，
   才需要包含 `model`/`baseUrl`：

   ```bash
   mkdir -p "<vp-config-dir>"
   cat > "<vp-config-dir>/config.json" <<'JSON'
   {
     "apiKey": "PASTE_THE_KEY_HERE",
     "model": "qwen3-vl-flash"
   }
   JSON
   chmod 600 "<vp-config-dir>/config.json"
   ```

   如果使用 OpenAI，添加 `"baseUrl": "https://api.openai.com/v1"`，
   并将 `"model"` 设为 `"gpt-4o"`。不要把 key 原样回显给用户，只确认已保存。

4. **验证**：运行下面的命令。它只为本次调用设置环境变量，不修改系统环境：

   ```bash
   VISIONPOWER_CONFIG="<vp-config-dir>/config.json" \
   VISIONPOWER_SKILL_STATE="<vp-config-dir>/skill-state.json" \
   node <skill>/describe_image.mjs --image-url <some public image> --prompt "describe"
   ```

   此时它应该能访问模型，而不是报告缺少 key。成功运行会记录
   `configVerified: true`，以后应直接进入图片分析，不再检查配置。

> 脚本也接受环境变量 `VISIONPOWER_API_KEY` 中的 API Key，并且它会覆盖配置文件。
> 推荐使用 `VISIONPOWER_CONFIG` 指向 Agent 私有配置文件，因为 Agent 启动的子
> shell 通常**不会**继承你写在 shell profile 里的环境变量。不要为了本 skill
> 修改 shell profile 或系统级环境。

## 使用方法

正常请求时，**只运行一次脚本**并把图片分析结果告诉用户：
不要做预检查，不要叙述执行过程（见上方“回复风格”）。选择下面最简单的形式，
并将 `<skill>` 替换为该文件夹的绝对路径。如果首次设置使用了 `<vp-config-dir>`，
每次调用都要在命令前带上同样的 `VISIONPOWER_CONFIG` 和
`VISIONPOWER_SKILL_STATE`。

### 单张本地图片（使用绝对路径）

```bash
VISIONPOWER_CONFIG="<vp-config-dir>/config.json" \
VISIONPOWER_SKILL_STATE="<vp-config-dir>/skill-state.json" \
node <skill>/describe_image.mjs --image-path /absolute/path/to/image.png --prompt "Read the text and summarize it."
```

### 公网图片 URL

```bash
VISIONPOWER_CONFIG="<vp-config-dir>/config.json" \
VISIONPOWER_SKILL_STATE="<vp-config-dir>/skill-state.json" \
node <skill>/describe_image.mjs --image-url https://example.com/image.png --prompt "What is in this image?"
```

### 多张图片、Base64 或复杂请求：使用 JSON

将请求写入文件并作为参数传入，或通过 stdin 管道传入：

```bash
VISIONPOWER_CONFIG="<vp-config-dir>/config.json" \
VISIONPOWER_SKILL_STATE="<vp-config-dir>/skill-state.json" \
node <skill>/describe_image.mjs /tmp/visionpower-request.json
# or
cat /tmp/visionpower-request.json | VISIONPOWER_CONFIG="<vp-config-dir>/config.json" VISIONPOWER_SKILL_STATE="<vp-config-dir>/skill-state.json" node <skill>/describe_image.mjs
```

请求格式：

```json
{
  "images": [
    { "image_path": "/absolute/path/to/first.png" },
    { "image_url": "https://example.com/second.jpg" }
  ],
  "prompt": "Read each image in order and summarize."
}
```

## 输出

脚本会将模型答案打印到 stdout。失败时会将
`VisionPower error: <reason>` 打印到 stderr，并以非零状态退出。读取错误原因并修正输入，
例如：使用绝对路径、使用公网可访问 URL，或执行首次设置来配置 API Key。

## 规则

- `image_path` 必须是运行脚本的机器上的**绝对路径**。
- `image_url` 必须**公网可访问**；本地或私网地址会被拒绝。
- 每张图片必须且只能提供**一个**来源：`image_path`、`image_url` 或 `image_base64`。
- 不要将顶层图片字段与 `images[]` 混用。

## 配置参考

设置默认来自当前 Agent home 下的 `~/.visionpower/config.json`。沙箱或多 Agent
环境应使用 `VISIONPOWER_CONFIG="<vp-config-dir>/config.json"` 覆盖路径，避免写入
系统用户 home。匹配的 `VISIONPOWER_*` 环境变量会覆盖配置文件；推荐只在单次
命令中临时传入，不写入系统环境。

| config.json key | env override | Default | Purpose |
| --- | --- | --- | --- |
| `apiKey` | `VISIONPOWER_API_KEY` | — | 视觉服务 API Key |
| `model` | `VISIONPOWER_MODEL` | `qwen3-vl-flash` | 视觉模型名称 |
| `baseUrl` | `VISIONPOWER_BASE_URL` | DashScope `/compatible-mode/v1` | OpenAI-compatible Base URL |
| `maxImages` | `VISIONPOWER_MAX_IMAGES` | `8` | 单次调用最多图片数 |
| `timeoutMs` | `VISIONPOWER_TIMEOUT_MS` | `60000` | 上游请求超时时间（毫秒） |
| — | `VISIONPOWER_SKILL_STATE` | `~/.visionpower/skill-state.json` | 已验证设置状态标记路径 |
