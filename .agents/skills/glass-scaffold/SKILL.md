---
name: glass-scaffold
description: >
  当需要在 glass-frontend/ 创建或重建 Glass 前端脚手架时使用：Vite 创建
  Vue3+TS 工程、接入 TDesign Vue Next 与 Vue Router、建立 src 目录骨架
  与构建命令。典型触发：「搭脚手架」「初始化 glass-frontend」「装 TDesign」
  「create vite project」「配置 vue-router」「工程跑不起来要重建」。
  不要做业务页面 UI（那是 docs-shell）。
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# glass-scaffold — Vue3 脚手架落地

## 何时使用

- 用户点名创建 / 重建 `glass-frontend/`
- `glass-frontend/` 不存在且下一步要做 UI 实现
- 需要接入 TDesign Vue Next、vue-router、TypeScript、Vite 配置

## 前置检查

1. `node -v` ≥ 18，否则停笔报告。
2. `glass-frontend/` 已存在且 `package.json` 可用 → 不要重建，改走增量接入（步骤 3 起）。
3. 确认包管理为 npm（根目录约定），禁止 pnpm / yarn / bun。

## 步骤

1. **创建工程**（目标名固定 `glass-frontend`）：

```bash
npm create vite@latest glass-frontend -- --template vue-ts
```

2. **安装依赖**：

```bash
npm --prefix glass-frontend install
npm --prefix glass-frontend install tdesign-vue-next vue-router
```

3. **建立目录骨架**（缺什么补什么，禁止空目录凑数）：

```
glass-frontend/src/
├── assets/  components/  layouts/  router/  styles/  views/
├── App.vue  main.ts
```

4. **接入路由**：`src/router/index.ts` 导出 `createRouter` + `createWebHistory`；至少注册一条占位路由（后续由 docs-shell / glass-ui 补 Lab 路由）。
5. **接入 TDesign**：`main.ts` 注册 TDesign（全量或按需其一，与项目实际安装方式一致）；`src/styles/theme.css` 预留变量覆盖入口。
6. **配置别名**：`vite.config.ts` 配置 `@` → `src`，并同步 `tsconfig.json` paths。
7. **清理模板**：删除 Vite 欢迎页、HelloWorld 等模板噪音。

## 关键文件路径

| 文件 | 约定 |
|---|---|
| `glass-frontend/package.json` | 私有包、脚本含 `dev` / `build` / `preview` |
| `glass-frontend/vite.config.ts` | alias `@`、server 端口可默认 |
| `glass-frontend/src/router/index.ts` | 唯一路由表出处 |
| `glass-frontend/src/main.ts` | 插件注册入口 |
| `glass-frontend/src/styles/theme.css` | TDesign 变量覆盖唯一出处 |

## 验收标准

1. `npm --prefix glass-frontend run build` 成功，无 TS error。
2. `npm --prefix glass-frontend run dev` 可打开空白壳路由（非 Vite 模板页）。
3. 目录骨架与别名生效（代码里能 `import x from '@/…'`）。
4. 依赖仅含：vue、vue-router、tdesign-vue-next、vite、typescript 及模板必需项；无第二套 UI 库。
5. 未写任何业务 UI（导航、会话、欢迎态不属于本技能范围）。
