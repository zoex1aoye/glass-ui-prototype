# Track N6 · WinUI Glass Nav 合流验收

## 对照结论

### 一致
- `GlassMenu` / `GlassBreadcrumb` 已导出；子件 re-export，未破坏 TDesign 识别。
- Menu 选中语义走 Rail Quiet List token（ice/lilac）；theme 盖掉 TD 左侧指示条；组件内无魔法色。
- Breadcrumb Quiet：祖先 secondary、当前 primary。
- Lab `/navigation`：Menu rail/panel + Breadcrumb 橱窗；Tabs/Steps 保留；`docs-nav` IA 未增删项。
- DocsShell：左栏 `GlassMenu` 分组 + label/desc 双行；顶栏 `GlassBreadcrumb`；搜索 / scheme 保留。
- Dashboard Rail：扁平 `GlassMenu` + tone 绑定；`dashboard-flush-row` 仍 `gap: 0`。
- `npm --prefix glass-frontend run build` 通过（仅既有 chunk 体积警告）。

### 偏差
- 未做同视口运行态截图（dev 浏览器验收未跑）；视觉依赖静态 token / DOM 契约核对。
- `collapsed` 下 TD popup / tooltip 未纳入 Glass 浮层材质（N1/N2 已记边界）。

### 待确认
- collapsed popup 是否后续单独立 Glass overlay 约定。
- 是否补 1440 / 1180 / 860 三档截图基线。

### 改动文件（全量）
- `glass-frontend/src/components/glass/GlassMenu.vue`（新）
- `glass-frontend/src/components/glass/GlassBreadcrumb.vue`（新）
- `glass-frontend/src/components/glass/index.ts`
- `glass-frontend/src/styles/theme.css`
- `glass-frontend/src/layouts/DocsShell.vue`
- `glass-frontend/src/views/system/lab/LabNavigationView.vue`
- `glass-frontend/src/views/system/lab/LabDashboardView.vue`
- `glass-frontend/src/scheme/messages.ts`
- `output/qa/n1n2-nav-kit-notes.md`
- `output/qa/n3n5-nav-apply-notes.md`
- `output/qa/n6-nav-qa-notes.md`

未改：`docs-nav.ts` 结构、`.agents/rules`、未自动 commit。
