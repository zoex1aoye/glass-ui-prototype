# Glass UI Prototype / Glass 玻璃组件原型

[English](#english) · [中文](#中文)

---

## 中文

基于 **TDesign Vue Next** 的 Glass 主题组件库原型：可复用的 `Glass*` 组件 + DocsShell 组件实验室（Lab）。

> 当前以**源码开源**为主，**尚未发布 npm 包**。兄弟项目请暂从本仓库引用源码；包路径与 `exports` 以后再定。

### 技术栈

- Vue 3 + TypeScript + Vite
- TDesign Vue Next + Vue Router
- Node 18+（推荐 20）· npm

### 快速开始

```bash
npm --prefix glass-frontend install
npm --prefix glass-frontend run dev
```

浏览器打开终端提示的本地地址（通常为 `http://localhost:5173`）。

```bash
# 生产构建
npm --prefix glass-frontend run build

# 预览构建产物
npm --prefix glass-frontend run preview
```

### 目录导览

| 路径 | 说明 |
|---|---|
| `glass-frontend/` | 前端工程（Lab + 可发布组件面） |
| `glass-frontend/src/components/glass/` | `Glass*` 组件；统一出口 `index.ts` |
| `glass-frontend/src/styles/theme.css` | 视觉权威：`--glass-wb-*` / `--glass-*` token |
| `glass-frontend/src/layouts/` | DocsShell（目录 · 画布 · Live Props） |
| `glass-frontend/src/views/system/lab/` | Lab 活文档页 |
| `AGENTS.md` · `.agents/` | 协作规范与技能（给 AI / 贡献者） |

### Lab 页面

Overview · Layout · Poster · Actions · Inputs · Forms · Overlay · Feedback · Data · Navigation

### 使用组件（源码引用）

主题须先引入；底层依赖 `vue` 与 `tdesign-vue-next`：

```ts
import 'tdesign-vue-next/es/style/index.css'
// 按你的工程路径指向本仓 theme
import '@/styles/theme.css'

import { GlassButton, GlassSurface } from '@/components/glass'
```

视觉与交互以 **已定 token + Lab Living Demo** 为准，请勿在组件内另写魔法色。

### 许可

[MIT](./LICENSE) © 2026 x1aoye

---

## English

A **Glass**-themed component prototype on **TDesign Vue Next**: reusable `Glass*` components plus a DocsShell component lab.

> Source is open on GitHub. **Not published to npm yet.** Consume via this repo until a package `exports` surface is defined.

### Stack

- Vue 3 + TypeScript + Vite
- TDesign Vue Next + Vue Router
- Node 18+ (20 recommended) · npm

### Quick start

```bash
npm --prefix glass-frontend install
npm --prefix glass-frontend run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

```bash
npm --prefix glass-frontend run build
npm --prefix glass-frontend run preview
```

### Layout

| Path | Purpose |
|---|---|
| `glass-frontend/` | App + publishable Glass surface |
| `glass-frontend/src/components/glass/` | `Glass*` components; barrel `index.ts` |
| `glass-frontend/src/styles/theme.css` | Visual source of truth: `--glass-wb-*` / `--glass-*` |
| `glass-frontend/src/layouts/` | DocsShell (nav · canvas · Live Props) |
| `glass-frontend/src/views/system/lab/` | Living lab pages |
| `AGENTS.md` · `.agents/` | Contributor / agent conventions |

### Lab pages

Overview · Layout · Poster · Actions · Inputs · Forms · Overlay · Feedback · Data · Navigation

### Using components (from source)

Load the theme and peer UI stack first:

```ts
import 'tdesign-vue-next/es/style/index.css'
import '@/styles/theme.css'

import { GlassButton, GlassSurface } from '@/components/glass'
```

Treat **committed tokens + Lab Living Demo** as authoritative; avoid magic colors inside components.

### License

[MIT](./LICENSE) © 2026 x1aoye
