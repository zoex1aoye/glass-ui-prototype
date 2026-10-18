# Radio appearance + Choice Quiet 统一 — QA 对照

日期：2026-10-18

## 范围与结论

| 项 | 结果 |
|---|---|
| `CrmGlassRadioGroup` 新增 `appearance: outline/filled` | 已实现（缺省按 variant 推导，不破坏现网） |
| 外壳 class `--appearance-{outline/filled}` 与 `--default/capsule` 并存 | 已实现 |
| capsule 仍 `theme="button"`，TD `variant` 固定 `outline` | 已实现（并剥离 attrs 注入的 theme/variant） |
| default×outline / default×filled / capsule×outline / capsule×filled 四态视觉 | 已在 theme.css 收口 |
| Choice Quiet 三件（Checkbox/Radio/Switch）统一 Action Blue | 已实现，移除 `--crm-brand-blue` 依赖 |
| Lab D+ 2×2 矩阵 + 文案、Overview desc 同步 | 已实现 |
| `npm --prefix crm-frontend run build` | 绿（vue-tsc + vite build 通过） |

## 视觉矩阵（实现口径）

| variant × appearance | 未选 | 选中 |
|---|---|---|
| default × outline | 空心圆 + soft 边 | 蓝边 + Action Blue 点芯（现状） |
| default × filled | 空心圆 + soft 边 | 整圆实心 Action Blue，无点（::after 透明，禁白核） |
| capsule × outline | 软轨 + 次要字 | 蓝描边（inset hairline）+ 淡冷 wash + Action Blue 字 |
| capsule × filled | 软轨 + 次要字 | 实心 Action Blue + 白字（现状） |

新增 token：

- `--crm-wb-radio-dot-filled-bg: var(--crm-wb-btn-blue)`
- `--crm-wb-radio-capsule-item-outline-bg: rgba(47, 107, 246, 0.1)`
- `--crm-wb-radio-capsule-item-outline-border-color: var(--crm-wb-btn-blue)`
- `--crm-wb-radio-capsule-item-outline-color: var(--crm-wb-btn-blue)`

capsule outline 的描边用 `inset 0 0 0 1px`（hairline），不用 `border`，避免 active/checked 改变宽高导致布局抖动。

## 待 Cursor 浏览器验收（DEV_URL=/system/lab/form）

1. D+ 区 2×2 四格逐一对照 plan 矩阵：悬停（Hover Whisper）、按下（Active Press）、Tab 聚焦（Focus Ring）、禁用项。
2. default × filled：确认选中整圆实心、无白核高光、无内点。
3. capsule × outline：确认选中是「蓝描边 + 淡冷 wash + 蓝字」，而非满铺实心蓝。
4. D 区 Choice Quiet：确认 Checkbox / Radio / Switch 选中色一致为 Action Blue（#2f6bf6），且与按钮主色同族。
5. 槽位纪律回归：options 模式的 capsule 不因空 slot 变空壳；default slot 模式仍可用。
6. `prefers-reduced-motion: reduce` 下无 scale/位移动画（保留颜色态）。

## 边界确认

- 未改一级业务导航；未自动 commit。
- 未新增 Checkbox / Switch 独立 CrmGlass* 组件（本轮仅 Form Choice + Radio）。
