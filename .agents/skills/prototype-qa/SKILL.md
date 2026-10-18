---
name: prototype-qa
description: >
  当需要对照权威源做视觉与结构验收时使用：Glass / Lab 对照已定
  --glass-wb-* / --glass-* token + Lab Living Demo；可选抽检内化自
  ui-ux-pro-max 的 Glass UX/a11y 交付清单（矩阵 C）。输出逐区核对清单、
  偏差分级、待确认项与验收结论。典型触发：「验收」「对照原型」
  「visual QA」「像不像」「检查还原度」「prototype qa」「截图对比」
  「a11y 验收」「UX 交付抽检」。实现类技能完成后应调用本技能收口；
  本技能不改业务代码。
allowed-tools: Read, Bash, Glob, Grep
---

# prototype-qa — 对照验收

> **执行面**：优先由 Cursor 按 `cursor-planner` 派 Codex **V 轨**（`-m deepseek-flash`，可 `-i`）执行本 SOP；Cursor 默认只合流 QA 结论，不为验收全文预载业务源码。本技能不改业务代码。若验收 FAIL 需返工实现 → 另开 **I 轨**（默认仍 `deepseek-flash`；`deepseek-v4-pro` 仅例外，见 `codex-dispatch`），把本技能产出的偏差清单写入 I 的 prompt。
>
> **派发通道（V 轨硬纪律）**：经 Cursor Shell 拉起的 Vision / `-i` 派发，**必须**走 `codex-dispatch` 的 `required_permissions: ["all"]`（与 Codex `-s workspace-write` 是两件事）。缺 `all` 常见 `failed to initialize in-process app-server` / PATH aliases `Operation not permitted`；`tee` 仍可能 exit 0 但无 QA md → **假成功，判定 FAIL，立即带 `all` 重派**，禁止勾「视觉验收完成」。

## 权威（验收对照谁）

| 任务面 | 对照 |
|---|---|
| Glass / Lab / theme / `Glass*` | 已定 `--glass-wb-*` / `--glass-*` token + Lab Living Demo |

## 何时使用

- 单区域或多区域实现完成后收口
- 用户要求「检查是否还原」「像不像」
- 回归：重构后确认未破坏 Glass / Lab 观感

## 验收矩阵 B — Glass / Lab（对照 token + Living）

| 区域 | 核对点 |
|---|---|
| Tone / Density | 小物件满浓蓝、大面低对比微透；Pill 38 / 块 42 等与 token 一致 |
| Quiet Field / Kill Inner Rect | 触发器无双重矩形；focus ring only |
| Action Blue | Steps / Picker 强调色对齐 `--glass-wb-btn-blue`（若本轮涉及） |
| Overlay | Scrim / Pure Spacing / Nested Chrome 禁令（见 overlay-chrome.md） |
| 尺度与状态 | hover / active / focus-visible / disabled 齐；无布局抖动 |
| 层级几何 | Behind Surface inset 露边；Rail\|Stage gap=0（触及 Living / Poster 再勾） |

## 验收矩阵 C — UX / a11y 交付抽检（可选；对照内化清单）

> 完整勾选表见 `.agents/skills/glass-ui/references/ux-delivery-checklist.md`。  
> **不**引入 ui-ux-pro-max 色板 / 字体 / glassmorphism 教条；风格仍以矩阵 B 为准。  
> 适用：用户点名「专业度 / a11y / 交付检查」，或 Glass 实现收口需要补交互·无障碍项。

| 块 | 核对点（抽检） |
|---|---|
| 交互 | Hover·Active·Focus 齐；`cursor: pointer`；loading/disabled；reduced-motion；主操作不靠 hover；拖拽有替代（触及） |
| a11y | 对比 ≥4.5:1；icon-only 名；色不唯一表意；focus-not-obscured；错误 live/alert；Toast 不抢焦点 |
| 表单/反馈 | 可见 label；错误贴字段；危险用 Dialog；长表单用 FormPane |
| Compact | Chip/Badge 截断可感知；集合换行 / 可操作 `+n`（触及） |
| 反模式 | 无 emoji 图标、无魔法 hex、无白核、无 Nested Chrome 偷渡、无 pro-max 色板覆盖 |

每项标 `通过 / 偏差 / 未测 / 不适用`；与矩阵 B 冲突时以 **B（token + Lab）** 胜出。

## 偏差分级

| 级别 | 定义 | 处理 |
|---|---|---|
| P0 | 结构缺失、文案错、信息架构偏差；或组件库色板被魔法色 / 外部分案覆盖 | 必须修复后才能宣称完成 |
| P1 | 明显视觉偏差（间距 / 色值 / 字号档位错） | 修复或列为待确认 |
| P2 | 细节近似（图标非精确复刻、微阴影差） | 允许带标注放过 |

## 步骤

1. 确认待验范围（用户点名或按本次变更文件推断）；选矩阵 B / C（可组合；Glass 默认 B，交付/a11y 可选 C）。
2. 启动预览：`npm --prefix glass-frontend run dev`（若仅规范期则跳过，改为文件存在性检查）。
3. 逐项填验收矩阵；不确定项进「待确认」，禁止臆断为通过。
4. 输出结论块（固定四行）：

```
结论：通过 / 有条件通过 / 不通过
P0：…
P1：…
未测/待确认：…
```

## 约束

- 本技能只出报告；修复走对应实现技能（`docs-shell` / `glass-ui`）。
- V 轨派发后须确认产出 QA md / 结论块存在；run.log 仅有 app-server EPERM → 未完成（见上「派发通道」）。
- 无同视口对照不得写「视觉验收完成」。
- **Glass Overlay**（Dialog / FormPane / Scrim / Nested Chrome）验收口径见 `.agents/skills/glass-ui/references/overlay-chrome.md`，勿用 t1 整装会话窗附图去否决 Confirm Sheet。
- **矩阵 C** 细节与吸收/删除策略见 `.agents/skills/glass-ui/references/ux-delivery-checklist.md`；禁止为「对齐 pro-max」覆盖已定 token。
