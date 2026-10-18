---
name: mimo-dispatch
description: >
  DEPRECATED。默认派发已改走 Codex CLI（见 codex-dispatch）。仅当用户明确点名
  mimo / mimocode 时使用。覆盖正确 CLI flag、与 workspace trust / 权限确认的区别、
  命令模板与 dry-run。典型触发：「派 mimo」「mimo run」「--trust」「--yolo」。
  业务实现仍走对应 glass-* / docs-shell skill。
---

# mimo-dispatch — Headless 派发约定（DEPRECATED）

> **已废弃为默认通道**。本仓库默认派发请用 `.agents/skills/codex-dispatch/` + `.agents/rules/codex-dispatch.mdc`。  
> **仅当用户明确点名「派 mimo / mimo run」时**再按本文执行；历史 brief（`.agents/tmp-mimo-*`）可对照，新任务勿再默认写 mimo。

## 根因（勿再踩）

| Flag | 作用面 | 语义 |
|---|---|---|
| `--trust` | **仅 TUI**：`mimo --trust …` | 跳过「是否信任此工作区」交互确认，并把目录记入信任列表 |
| `--dangerously-skip-permissions` / `--yolo` | **TUI 与 `mimo run` 均有** | 自动批准未被显式 deny 的权限（危险；点名派发时默认带） |

**致命误用**：`mimo run … --trust …`  
→ `mimo run` **不认识** `--trust`，yargs 直接打印 help 并退出，任务根本没跑起来。日志里常表现为「刚启动就刷出 Options / help」或会话空跑。

本仓库 `ui-prototype` 已加入本机 `~/.local/share/mimocode/trusted-workspaces.json`（TUI 不再弹 trust）；**headless 仍须 `--yolo`**，否则工具权限 ask 会卡住无头进程。

## Cursor Agent Shell 派发：必须无沙箱（飞轮坑）

**现象**：日志出现 `Failed to run the query 'PRAGMA wal_checkpoint(PASSIVE)'` → mimo 无法写本机 session SQLite（通常在 `~/.local/share/mimocode/`），任务空跑或秒退。

**根因**：Cursor **sandbox** 挡了工作区外 DB 写入；与 `--yolo`（跳过 mimo 工具权限确认）是两件事。

**纪律**：凡经 Cursor `Shell` / 自动化拉起 `mimo run`，**必须**带：

```text
required_permissions: ["all"]
```

（或等价「禁用 sandbox / unsandboxed」）。仅 `--yolo` **不够**。

## 标准命令模板（可复制 · 仅点名 mimo 时）

```bash
mimo run \
  --model xiaomi/mimo-v2.6-pro \
  --variant high \
  --yolo \
  --title "<短标题>" \
  --dir . \
  "$(cat .agents/tmp-mimo-<task>-prompt.txt)" \
  2>&1 | tee .agents/tmp-mimo-<task>-run.log
```

在 Cursor Agent 里执行上式时：**同步请求 `required_permissions: ["all"]`**。

等价长写：`--dangerously-skip-permissions`（与 `--yolo` 同义）。

TUI 手工开仓（可选）：

```bash
mimo --trust --yolo --model xiaomi/mimo-v2.6-pro --variant high
```

## 派发前检查

1. 确认用户点名 mimo；否则改走 `codex-dispatch`。
2. 读本 skill + 对应业务 skill（如 `glass-ui`）。
3. Brief / prompt 落在 `.agents/tmp-mimo-*`；**禁止**在 prompt 里写 `mimo run --trust`。
4. Cursor Shell 派发：**必须** `required_permissions: ["all"]`（防 SQLite WAL / 本机 DB 写入失败）。
5. 短 dry-run（可选）：无沙箱 + `mimo run --yolo … "Reply PONG and stop. No tools."` → 应直接回复、无 help、无 `wal_checkpoint` 报错。

## 禁止

- 把本 skill 当作默认派发通道（默认是 Codex）
- 在 `mimo run` 上使用 `--trust`
- 把 `--trust` 与「跳过工具权限」混为一谈
- 无头派发省略 `--yolo`（除非确定全程无工具权限 ask）
- **在 Cursor sandbox 内派 `mimo run`**（会触发本机 DB `PRAGMA wal_checkpoint` 失败）
- 自动 `git commit`（仍须用户点名）

## 配置说明

- 项目 `.mimocode/mimocode.jsonc`：**无**「默认 trust」键；trust 由 TUI flag / 本机 `trusted-workspaces.json` 管理。任务派发默认已改 Codex，但 mimocode 客户端仍可读 `.agents/skills`。
- 权限策略可用 `permission` 键细调；无头派发仍以 CLI `--yolo` 为准，避免把 `*: allow` 写死进仓库。
