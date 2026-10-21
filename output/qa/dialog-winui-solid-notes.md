# Dialog / FormPane · WinUI ContentDialog Floating Solid 收口记录

日期：2026-10-21  
范围：`GlassDialog` / `GlassFormPane`、Light / Dark Dialog token，以及 Overlay 材质说明  
视觉依据：已定 `--glass-wb-*`、WinUI ContentDialog，以及 Feedback Semantic Solid 的
`blur none · 实色 · 影分轨` 思路。

## 一致

- Light / Dark `--glass-wb-dialog-blur` 均为 `none`；FormPane 继续通过
  `--glass-wb-form-pane-blur` 别名跟随 Dialog。
- Dialog fill 不再使用 `.6` 半透 frost，也不靠 `backdrop-filter` 透背后。
  Light / Dark 均复用既有 `--glass-layer-l3-standalone-fill`：Light 为近白冷底，
  Dark 为深冷高遮罩实板，没有新增第二套色板或紫色调。
- Dialog 阴影收敛为单层 Whisper Lift：Light 保留 `0 12px 30px` 低噪蓝影；
  Dark 用同量级单层深影，不再继承 TDesign 的三层 `--td-shadow-3`。
- FormPane 的 fill / blur / radius / shadow / scrim 继续指向 Dialog token，没有分叉材质。
- Scrim 本轮未改：Light 保持 `rgba(15, 40, 80, 0.14)`，Dark 保留既有
  `var(--td-mask-active)` 覆盖；FormPane 继续共用。
- radius 18、Dialog 420 / FormPane 480、shell padding 32、纯间距分区、默认脚钮协议，
  以及 Nested Chrome 禁令均未改。
- Dialog / FormPane 仍只消费 token；组件继续声明
  `backdrop-filter: var(--glass-wb-dialog-blur)` / FormPane 对应 token，
  token 为 `none` 后不会产生磨砂模糊。

## 偏差

- 本轨按约束未启动 Vite，也未运行 Chromium / Playwright，因此没有浏览器截图或像素级
  Render 对照。Light / Dark 的可读性结论来自 token、组件消费关系、构建与 diff 抽检。
- Lab Overlay 页当前没有固定槽写死 `Bchat / Soft Plate / 半透 frost` 等材质标注，
  因此没有改动 Lab 文案或信息架构。
- `.agents/skills/glass-ui/references/overlay-chrome.md` §2 / Scrim / Nested Chrome 引言
  已由 Cursor 规范轨同步为 ContentDialog · Floating Solid（选型与禁令条目本身未改）。

## 待确认

1. 需在真实 Lab Light / Dark 视口中确认：L3 standalone 高遮罩 fill 与冻结的 Scrim
   （Light `rgba(15, 40, 80, 0.14)` / Dark 既有 TD mask）叠加后，正文和脚钮是否仍清晰、
   面板边界是否足够稳定。
2. `GlassTable` 的既有浮层也消费 `--glass-wb-dialog-fill` / `--glass-wb-dialog-blur`；
   本轮 Dialog token 收口会让该浮层同步变为 Floating Solid。该消费关系事实已记录，
   是否为本意需在后续表格视觉验收中确认。

## 改动文件

- `glass-frontend/src/styles/theme.css`
- `glass-frontend/src/components/glass/GlassDialog.vue`
- `glass-frontend/src/components/glass/GlassFormPane.vue`
- `output/qa/dialog-winui-solid-notes.md`

## 抽检记录

- `--glass-wb-dialog-blur`：Light / Dark 均为 `none`。
- `--glass-wb-form-pane-blur`：继续别名 `--glass-wb-dialog-blur`。
- Dialog fill：Light / Dark 均不再出现 `.6` 半透 fill。
- Scrim：Light 仍为 `rgba(15, 40, 80, 0.14)`，Dark 保持既有 TD mask 覆盖，均未修改。
- Nested Chrome：Dialog / FormPane 代码未引入 air / bph / Fan Tip / 气泡 / Composer。
- `--glass-wb-dialog-air*`：仅保留兼容，注释已明确禁止用于 Dialog / FormPane 面板。
- `npm --prefix glass-frontend run build`：通过，无 error；仅保留仓库既有的大 chunk 警告。
- `git diff --check`：通过。
