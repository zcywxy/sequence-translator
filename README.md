# Sequence Translator

一个简约、开源的双语对照翻译浏览器扩展。

## 项目说明

本项目基于 [KISS Translator](https://github.com/fishjar/kiss-translator) 进行二次开发，在保留原有核心功能的基础上，对用户界面进行了全面优化和改进。

## 主要功能

### 翻译服务支持

- Google / Microsoft 翻译
- 腾讯翻译 / 火山引擎
- OpenAI / Gemini / Claude / Ollama / DeepSeek / OpenRouter
- DeepL / DeepLX / 牛津翻译
- AzureAI / CloudflareAI
- Chrome 浏览器内置 AI 翻译

### 翻译场景覆盖

- **网页双语对照翻译** - 自动识别网页内容并进行双语对照显示
- **划词翻译** - 选中文字后点击悬浮按钮即可翻译，支持多翻译服务对比
- **输入框翻译** - 通过快捷键快速翻译输入框内容
- **鼠标悬停翻译** - 悬停在段落上即可查看翻译结果
- **YouTube 字幕翻译** - 支持视频字幕实时翻译与双语显示

### 翻译效果定制

- 自动识别文本模式与手动规则模式
- 自定义译文样式（颜色、字体、背景等）
- 支持富文本翻译，保留原文链接和样式
- 支持仅显示译文模式

### 高级功能

- 自定义翻译接口，支持任意翻译服务
- 文本聚合发送，减少 API 调用次数
- 流式传输，实时显示翻译结果
- AI 上下文会话记忆
- 自定义 AI 术语词典
- 跨客户端数据同步（WebDAV）
- 自定义翻译规则与规则订阅

## 界面优化

本项目对原版界面进行了以下优化：

- **科技感设计风格** - 采用青蓝色渐变主题，配合流动边框动画和发光效果
- **悬浮按钮优化** - 简洁的 "ST" 标识，带有脉冲发光动画
- **翻译弹窗美化** - 渐变边框、发光光晕、圆角设计
- **交互体验增强** - 按钮悬停动画、输入框聚焦发光效果
- **整合式布局** - 弹出窗口集成翻译输入框，操作更便捷

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Alt+Q` | 开启/关闭翻译 |
| `Alt+C` | 切换译文样式 |
| `Alt+K` | 打开设置弹窗 |
| `Alt+S` | 打开翻译弹窗/翻译选中文字 |
| `Alt+O` | 打开设置页面 |
| `Alt+I` | 输入框翻译 |

## 安装

### 浏览器扩展

- **Chrome** - 加载已解压的扩展程序（`build/chrome` 目录）
- **Firefox** - 临时加载附加组件（`build/firefox` 目录）
- **Edge** - 加载解压缩的扩展（`build/chrome` 目录）

### 油猴脚本

支持 Chrome/Edge/Firefox 的 Tampermonkey 或 Violentmonkey。

## 开发指引

```sh
# 安装依赖
pnpm install

# 开发模式
pnpm start

# 构建 Chrome 版本
pnpm build:chrome

# 构建 Firefox 版本
pnpm build:firefox

# 构建所有版本
pnpm build
```

## 致谢

本项目源自 [KISS Translator](https://github.com/fishjar/kiss-translator)，感谢原作者的开源贡献。

## 许可证

GPL-3.0 License
