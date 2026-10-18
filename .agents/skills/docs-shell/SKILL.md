---
name: docs-shell
description: >
  当需要实现或修改 Glass 组件实验室宿主壳（DocsShell）时使用：左侧可搜索目录、
  主内容槽、右侧 Live Props 面板、路由与 docs-nav 对齐。典型触发：「DocsShell」
  「实验室壳」「lab 导航」「docs nav」「Live Props 面板」「组件文档壳」。
  玻璃组件本体用 glass-ui；建工程用 glass-scaffold；纯视觉对照用 prototype-qa。
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# docs-shell — Glass Lab 文档宿主壳

## 何时使用

- 改 Lab 宿主布局（左目录 / 主画布 / 右 Props）
- 增删 Lab 路由或左侧导航分组（须与 `docs-nav.ts` + `router` 同步）
- 调整 Live Props 注册 / 选中 / 面板行为

## 权威

- **视觉 / Tone / Density**：已定 `--glass-wb-*` / `--glass-*` token + Lab Living
- **IA**：Lab 目录以 `docs-nav.ts` 为唯一数据源；**禁止**写入历史业务导航

## 视觉与结构锚点

- **DocsShell**：左栏可搜索分组导航 + 中间 `<router-view>` + 可选右栏 Props（`useDocsProps`）
- **Lab 页**：各 `Lab*View.vue` 只消费已导出 `Glass*`；页内用 `LabPageShell` 统一页头
- **禁双托盘**：Living / Poster 舞台遵守 Behind Surface inset + Rail|Stage gap=0（细则见 `prototype-fidelity`）

## 步骤

1. 改导航数据：只动 `glass-frontend/src/layouts/docs-nav.ts`（key / label / path / icon）。
2. 改路由：`glass-frontend/src/router/index.ts` 与 nav path 对齐；旧 path 可留 redirect。
3. 改壳层 UX：`DocsShell.vue` / `DocsPropsPanel.vue` / `useDocsProps.ts`。
4. 新 Lab 页：在 `views/system/lab/` 落盘，经 `LabPageShell` 接入；需要 Live Props 时 `registerDemo`。
5. 样式：壳层尺寸 / 色走 `theme.css` token，禁止魔法 hex。

## 关键文件路径

| 文件 | 约定 |
|---|---|
| `glass-frontend/src/layouts/DocsShell.vue` | Lab 宿主壳唯一出处 |
| `glass-frontend/src/layouts/DocsPropsPanel.vue` | 右栏 Props UI |
| `glass-frontend/src/layouts/docs-nav.ts` | 左侧目录唯一数据源 |
| `glass-frontend/src/layouts/useDocsProps.ts` | Live Props 状态 |
| `glass-frontend/src/router/index.ts` | 扁平 Lab 路由 |
| `glass-frontend/src/views/system/lab/*` | 各 Lab 页 |

## 验收标准

1. `npm --prefix glass-frontend run build` 通过。
2. nav 与 router path 一一对应；无历史业务菜单泄漏进 Docs 目录。
3. Glass 观感对照已定 token + Lab Living；输出一致 / 偏差 / 待确认。
4. 不自动 commit。

## 约束

- 不改 `Glass*` 可发布面契约（那是 `glass-ui`）。
- 不 vendor ui-ux-pro-max；交付 / a11y 抽检走 `glass-ui/references/ux-delivery-checklist.md`。
