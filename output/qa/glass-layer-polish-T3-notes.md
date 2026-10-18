# T3 · 统一 Overlay footer 按钮语言

## 统一 API

- 动作行：`.glass-overlay-footer`（theme 层共享 class）
- 行语言：右对齐、`align-items: center`、可换行、`gap: var(--glass-wb-dialog-footer-gap)`
- 间距 token：`--glass-wb-dialog-footer-gap: 10px`、`--glass-wb-dialog-footer-padding-top: 12px`
- 按钮主次：取消 `GlassButton variant="quiet"`；确认 `primary`，危险确认 `danger`
- GlassDialog：有默认脚钮；自定义 `#footer` / `confirmBtn` / `cancelBtn` 仍透传，不强盖
- GlassFormPane：无默认脚钮；引入方仍通过 `#footer` 提供按钮，组件只包共享动作行，不覆盖 variant
- GlassPopconfirm：默认仍为紧凑 38px Pill 密度，取消 `quiet`、确认 `primary` / `danger`；横向 gap 与 Dialog / FormPane 共用同一 token

## 改动文件

- `crm-frontend/src/styles/theme.css`
- `crm-frontend/src/components/glass/GlassDialog.vue`
- `crm-frontend/src/components/glass/GlassFormPane.vue`
- `crm-frontend/src/components/glass/GlassPopconfirm.vue`
- `crm-frontend/src/views/system/lab/LabFeedbackView.vue`
- `crm-frontend/src/views/system/lab/lab-shared.css`

## 对照结论

- Dialog 默认 footer 与 FormPane / Lab 自定义 footer 已使用同一 GlassButton 主次语言与共享动作行。
- Lab FormPane 的 `#footer` 已移除页面私有的 gap 容器，统一由 GlassFormPane 包共享动作行。
- Lab 4.4 自定义 Dialog footer 显式使用 `.glass-overlay-footer`，loading 仍同步锁定确认钮。
- 未改 scheme / density / L3 layer token，未给 FormPane 增加默认确认/取消，未改一级导航，未 commit。
- `npm --prefix crm-frontend run build` 通过；仅有仓库既有的 lightningcss `:deep` 与 chunk size warning。

## 待确认

- `127.0.0.1:5173` 当前无服务监听；按任务约束未自启 Vite，因此本轮未做浏览器截图 / 同视口渲染验收。
- GlassTable 列配置弹层由 TDesign 内部 `DialogPlugin` 渲染，footer 仍为独立样式的原生 `t-button`，无法在不扩大改动范围的前提下直接换成 GlassButton；本轮未改，建议另立小任务确认是否接入。
