# Overlay footer 观感收口 + 列配置同套

## 根因

- T3 只统一了 `.glass-overlay-footer` 的行几何（flex / gap / padding-top），未统一脚钮密度。
- GlassFormPane 的取消钮是 quiet Pill 38；确认钮仍是 primary 块级 42 / radius 12，形成「38 胶囊 + 42 方块」并排。
- GlassDialog 自定义 `#footer` 槽未在组件层包 `.glass-overlay-footer`，使用方仍可能漏掉共享行几何。
- GlassTable 列配置的 TDesign `DialogPlugin` footer 使用原生 `t-button`，旧 CSS 是 tonal-hairline + primary `box-shadow: none`，与 Overlay 的 quiet/primary Pill 语言不一致。

## 改动文件

- `crm-frontend/src/components/glass/GlassDialog.vue`
- `crm-frontend/src/components/glass/GlassFormPane.vue`
- `crm-frontend/src/components/glass/GlassTable.vue`
- `crm-frontend/src/styles/theme.css`（仅补充脚钮密度契约注释）
- `crm-frontend/src/views/system/lab/LabFeedbackView.vue`
- `output/qa/overlay-footer-unify-notes.md`

## 最终 footer 规格

- 行容器：`.glass-overlay-footer`，右对齐、`align-items: center`、可换行。
- gap：`var(--glass-wb-dialog-footer-gap)`，当前 10px。
- footer 顶部间距：`var(--glass-wb-dialog-footer-padding-top)`，当前 12px。
- 取消：`GlassButton variant="quiet"`，默认 Pill 38。
- 确认：`GlassButton variant="primary"` 或 `variant="danger"`，并显式 `shape="round"`，同入 Pill 38。
- 分区：纯间距，无 footer hairline / 实色底栏。
- GlassDialog 默认 footer 与自定义 `#footer` 都在组件层包 `.glass-overlay-footer`；使用方槽内只放 GlassButton。
- GlassFormPane 继续无默认确认/取消，保留 `#footer` 契约；其共享动作行包装不变。
- Lab「新建演示条目」FormPane 与 4.4 异步 Dialog 的确认钮均进入 Pill 38。

## 列配置接法（采用方案 1）

- 保留 TDesign `DialogPlugin` 与原生 cancel/confirm 按钮，不改列配置确认流程。
- `.glass-table-column-controller .t-dialog__footer` 复用 Overlay footer 的 12px 顶部间距。
- footer 内按钮组复用同一 10px gap、右对齐与居中。
- `.t-dialog__cancel` 映射到 quiet Pill 38 token：微透近白底、品牌蓝字、quiet 影与 hover / active / focus。
- `.t-dialog__confirm` 映射到 primary Pill 38 token：满浓品牌蓝、pill-pri 影、hover bloom / active tighten / focus ring。
- 原生按钮的 `t-button + t-button` 默认 margin 已清零，避免与 gap 叠算。

## 验证

- `npm --prefix crm-frontend run build` 通过。
- 仅出现仓库既有 lightningcss `:deep` warning 与 chunk size warning。
- Grep 已确认：
  - GlassDialog 默认确认钮 `shape="round"`。
  - GlassDialog 默认与自定义 footer 均经 `.glass-overlay-footer`。
  - Lab「新建演示条目」确认钮 `shape="round"`。
  - 列配置 footer 使用共享 gap / padding token 与 quiet/primary Pill 映射。

## Cursor 浏览器验收（接力）

- DEV：`http://127.0.0.1:5173`（已有 vite；未重启）。
- FormPane「新建演示条目」：取消 / 确认均为 **Pill 38 / radius 999**；确认 `glass-button--primary glass-button--pill`，影为 `--glass-wb-pill-pri-shadow`。截图：`output/qa/overlay-footer-formpane-after.png`。
- 列配置弹层：`.t-dialog__cancel` / `__confirm` 同为 **38 / 999**；gap 10px；quiet / primary token 与 Overlay 同源。截图：`output/qa/overlay-footer-column-controller-after.png`。
- build：Cursor 复跑 `npm --prefix crm-frontend run build` 通过。

## 待确认

- quiet 仍按 html `.pill` 使用 Shadow-only Chrome；近白 Dialog 面板上轮廓仍偏弱（肉眼接近「字 + 软影」）。是否仅在 `.glass-overlay-footer` 叠用已有 `--glass-wb-tonal-hairline` → **需用户视觉裁决**，本轮未自造第三套 chrome。
