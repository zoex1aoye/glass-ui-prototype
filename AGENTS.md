# AGENTS.md — Glass 组件库 / Lab 工作区

> 本文件做：仓库身份 / 路由表 / 红线 / 协作契约 / 验证命令。任务 SOP 在 `.agents/skills/`，文件纪律在 `.agents/rules/`。

## 一、仓库身份

| 项 | 值 |
|---|---|
| 项目类型 | 基于 TDesign 的 Glass 主题定制组件库（可发布 `Glass*` + DocsShell Lab） |
| 视觉权威 | `glass-frontend/src/styles/theme.css` 已定 `--glass-wb-*` / `--glass-*` + Lab Living Demo |
| 默认操作目录 | `glass-frontend/`（Glass 可发布面 + DocsShell / Lab） |
| 技术栈 | Vue 3 + TypeScript + Vite + TDesign Vue Next + Vue Router（后续可能 Pinia） |
| 包管理 | npm；Node 18+ |
| 回复语言 | 统一中文；代码 / 命令 / 标识符可英文 |

当前产品面：DocsShell（左目录 + 主画布 + Live Props）承载 Lab 页族（Overview / Layout / Poster / Actions / Inputs / Forms / Overlay / Feedback / Data / Navigation）。层级几何（Behind Surface inset · Rail|Stage gap=0）与权威裁决见 `.agents/rules/prototype-fidelity.mdc`。

## 话题 → 默认操作目录

| 用户在谈 | 默认落点 |
|---|---|
| 脚手架 / 工程 / 依赖 / 构建 | `glass-frontend/` 根（package.json、vite.config.ts、tsconfig.json） |
| DocsShell / Lab 导航 / Live Props | `glass-frontend/src/layouts/` |
| 主题色 / 间距 / 圆角变量 | `glass-frontend/src/styles/` |
| 玻璃组件 / Dialog / FormPane / Lab 页 | `glass-frontend/src/components/glass/` · `views/system/lab/` |
| 路由表 | `glass-frontend/src/router/` |
| 规范本身（本文件 / rules / skills） | `AGENTS.md`、`.agents/` |

## 二、路由表（何时读什么）

| 你要做的事 | 先读 |
|---|---|
| **Cursor 总规划** / 拆 Track / 控上下文噪音 / 何时自做 vs 派 Codex | `.agents/skills/cursor-planner/` + `.agents/rules/cursor-planner.mdc` |
| 创建 / 重建 Vue 脚手架、装 TDesign / Router | `.agents/skills/glass-scaffold/`（**由 Codex 执行**；Cursor 只写 brief） |
| 实现 / 修改 DocsShell Lab 宿主（导航 · Props · 路由对齐） | `.agents/skills/docs-shell/` + `.agents/rules/vue-tdesign-conventions.mdc`（**Codex 执行**） |
| 玻璃组件 / Lab / Overlay（Dialog Confirm Sheet · FormPane 表单整装）/ 按钮交互态 | `.agents/skills/glass-ui/`（含 `references/overlay-chrome.md` · `ux-delivery-checklist.md`）+ `.agents/rules/glass-component-kit.mdc`（**Codex 执行**） |
| UX / a11y / 专业度交付检查（内化 ui-ux-pro-max，非整包） | `.agents/skills/glass-ui/references/ux-delivery-checklist.md`；验收抽检走 `prototype-qa` 矩阵 C |
| 派发 Codex / headless（`codex exec`；Cursor Shell 须 `all`） | `.agents/skills/codex-dispatch/` + `.agents/rules/codex-dispatch.mdc` |
| 派发 mimo（仅用户点名；DEPRECATED） | `.agents/skills/mimo-dispatch/` + `.agents/rules/mimo-dispatch.mdc` |
| 对照截图做视觉 / 结构验收（含可选 UX/a11y 矩阵 C） | `.agents/skills/prototype-qa/`（V 轨 flash；返工 I 轨默认仍 flash；Cursor 只合流结论） |
| 写 Vue / TDesign 组件、定目录 | `.agents/rules/vue-tdesign-conventions.mdc` |
| 决定布局、间距、色值、权威裁决 | `.agents/rules/prototype-fidelity.mdc` |
| 分步实现、验收节奏 | `.agents/rules/execution-discipline.mdc` |
| 分支 / 提交 | `.agents/rules/git-conventions.mdc` |
| 建 / 改规范文件本身 | 参照本文件分层：AGENTS = 常驻认知；rules = 文件纪律；skills = 任务 SOP（**规范轨可由 Cursor 自做**） |

## 三、红线（违反 = 立即停止并报告）

1. **视觉权威**：Glass / Lab / theme / 组件库观感以 **已定 `--glass-wb-*` / `--glass-*` token** 与 Lab Living Demo 裁决。冲突仍不确定 → 停笔问用户，禁止取平均或自创。
2. **信息架构**：禁止擅自增删 / 重排 Lab 目录与固定文案槽位；`docs-nav.ts` 为 Lab 导航唯一数据源。文案缺失时先列出待确认项，不自造业务词。
3. **技术栈**：Vue 3 + TS + Vite + TDesign Vue Next + Vue Router + npm。禁止换 UI 库、换构建工具、换包管理器；引入新依赖（含 Pinia）须用户确认。
4. **禁止业务 UI 与脚手架超前**：规范任务只写 `AGENTS.md` 与 `.agents/`；脚手架与 UI 实现须用户点名对应任务。
5. **提交**：AI 不自动 commit；须用户明确指令。commit 格式 `type(scope): 中文描述`。
6. **规范治理**：`AGENTS.md` / rules / skills 变更须用户确认；同一坑出现 2 次当场写回规范。
7. **机器路径**：禁止写死本机绝对路径；命令须跨 macOS / Linux 可执行。
8. **回复语言**：正文统一中文。

## 四、协作契约

- **规约分层**：skills = 任务 SOP；rules = 文件 / 常驻纪律；AGENTS.md = 仓库认知与红线。冲突以 AGENTS.md + rules 为准；每条内容只允许一个出处。
- **外部 UX skill 内化**：`ui-ux-pro-max` 只改写进 `glass-ui/references/ux-delivery-checklist.md`（a11y / 交互 / 表单 / 反模式）；**禁止**复制整包、搜索脚本或用其 `--design-system` 覆盖已定 `--glass-wb-*`。再同步步骤见该清单 §6。
- **Cursor = 总规划师（控噪音）**：默认只编排（方案 / Track / brief / 派发 / 验收摘要 / 向用户汇报），**不**默认实现 `glass-frontend/**`。实现与重读码派 Codex；Cursor 全文载入业务 skill、整文件读产品代码、把整份 run.log 堆进对话 → 禁止。白名单自做与编排 SOP → `.agents/rules/cursor-planner.mdc` + `.agents/skills/cursor-planner/`。
- **执行节奏**：分步实现、每步可验收；Glass / Lab 对照已定 token + Living Demo。对 Cursor：「写实现」= 写 brief + 派 Codex（白名单除外）；对 Codex：按业务 skill 落盘（细则 `.agents/rules/execution-discipline.mdc`）。
- **目录约定**：前端代码只进 `glass-frontend/`。
- **技术栈口径**：Vue 3 Composition API + `<script setup lang="ts">`；路由 vue-router 4.x；UI 仅 TDesign Vue Next；样式变量集中在 `src/styles/`。Pinia 等新依赖须用户确认后才引入。
- **默认操作目录**：代码只写 `glass-frontend/`；跨目录改动先在回复中列出文件清单。
- **验证命令**（脚手架落地后启用；落地前仅做文件与命令存在性检查）：

```bash
node -v   # >= 18
npm --prefix glass-frontend install
npm --prefix glass-frontend run dev
npm --prefix glass-frontend run build
# 派 Codex（默认执行面）：npm 版 @openai/codex；非交互 export DEEPSEEK_API_KEY；必须显式 -m
# 默认 -m deepseek-flash（唯一 Vision + 常规实现）；deepseek-v4-pro 仅例外（无 Vision、贵约 3–7×）
# 视觉目标：V=flash 看图 → I=默认 flash 按偏差改码；禁止指望 pro 看图（见 codex-dispatch）
# Cursor Shell 派发须 required_permissions: ["all"]（与 Codex 自身 -s 是两件事；尤其 -i Vision）
# 假成功：run.log 仅有 Operation not permitted / app-server 初始化失败 → FAIL 重派，勿凭 exit 0 勾完成
# Auto-review 拦 codex exec：同命令 + request_smart_mode_approval + smart_mode_block_reason，等用户 Approve；禁默默自做产品代码；禁 grep ~/.zshrc 抠 key
# 规范轨 / .agents 落盘：优先 Cursor（见 cursor-planner）；Codex 若拒写 .agents/ 则 Cursor 挪入
# codex --version
# codex exec -m deepseek-flash -s workspace-write --skip-git-repo-check "$(cat .agents/tmp-codex-<task>-prompt.txt)"
# 仅当用户点名 mimo：见 .agents/skills/mimo-dispatch/（DEPRECATED；须 --yolo，禁 run --trust）
```

- **截图 / Playwright**：本机未装系统 Chrome 时，禁止默认 `chrome` channel。统一：
  `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright"` + `open … --browser chromium`。
  （偶用 mimo 内置 Playwright 时）包装脚本须可执行：`chmod +x ~/.local/share/mimocode/builtin_skills/*/skills/playwright/scripts/playwright_cli.sh`。

- **验收底线**：`run build` 无 error（TS error 视同 error）；Glass / Lab 对照已定 token + Lab Living 输出「一致 / 偏差清单 / 待确认项」；TDesign 组件未用第三方替代；未自动 commit。

- **Cursor ↔ Codex CLI 派发 + 共用技能（单一真相）**：执行面默认 **Codex CLI**（见 `codex-dispatch`）；Cursor 按 `cursor-planner` 编排。SOP / 纪律只写在 `.agents/skills/` 与 `.agents/rules/`。Cursor 常驻只靠 `AGENTS.md` + always-apply rules；**业务 skill 由 Codex 按 prompt 路径 Read**，Cursor 不为实现全文预载。`.cursor/rules` 符号链接到 `.agents/rules`；Codex CLI / ChatGPT Desktop 加载根目录 `AGENTS.md` 并扫描 `.agents/skills/*/SKILL.md`。偶开 mimo 可读同一套 skills，但**不作为默认派发**。**禁止**在 `.mimocode/skills/`、`.cursor/skills/` 或 `.codex/skills/` **复制第二份正文**（仅允许符号链接指向 `.agents/skills`）。

- **Codex 加载说明**：Codex 动手前按本文件路由表 `Read` 对应 `.agents/skills/*/SKILL.md`；纪律类 `.agents/rules/*.mdc` 由 skills / 路由表引用，Codex 未必自动解析 `.mdc`——**按路由表显式 Read**。派发通道见 `codex-dispatch`；Cursor 编排见 `cursor-planner`。

## 五、目录速览

```
ui-prototype/
├── AGENTS.md
├── glass-frontend/                          # 前端代码（含 components/glass 可发布面）
├── .gitignore
├── .mimocode/mimocode.jsonc               # 偶用 mimo 客户端：指向 AGENTS + .agents/skills（派发默认 Codex）
├── .cursor/rules → ../.agents/rules       # Cursor Rules 共用符号链接
└── .agents/
    ├── rules/                             # cursor-planner + codex-dispatch + glass-component-kit …
    └── skills/                            # cursor-planner（编排）+ codex-dispatch（通道）+ glass-* / docs-shell（Codex 执行时 Read）
```
