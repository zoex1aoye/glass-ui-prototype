# Track I1 · 弃用 DetailPlate，统一 GlassPanel standalone

日期：2026-10-20

## 改动文件

- `glass-frontend/src/components/glass/GlassDetailPlate.vue`：删除。
- `glass-frontend/src/components/glass/index.ts`：移除旧导出；推荐宿主改为 `GlassPanel variant="standalone"`。
- `glass-frontend/src/components/glass/GlassBubble.vue`：同步宿主分工注释。
- `glass-frontend/src/components/glass/GlassDescriptions.vue`：同步推荐宿主与容器边界注释。
- `glass-frontend/src/components/glass/GlassStage.vue`：密 KV 推荐宿主改为 Panel standalone。
- `glass-frontend/src/styles/theme.css`：删除旧详情板 token 块与相关注释；L3 standalone token 未改。
- `glass-frontend/src/views/system/lab/LabLayoutView.vue`：删除独立详情板橱窗与 import；保留 standalone Focus Panel 橱窗。
- `glass-frontend/src/views/system/lab/LabDataView.vue`：29 个宿主改为 `GlassPanel variant="standalone"`，保留 `title` / `class` / 槽内容；宿主路径文案同步。
- `glass-frontend/src/views/system/lab/LabFeedbackView.vue`：3 个 Loading 宿主改为 `GlassPanel variant="standalone"`，保留原内容与布局 class。

## 对照结论

- 一致：所有 Data / Feedback 橱窗宿主均消费既有 L3 standalone token；未引入魔法色、第二套密信息容器或嵌套 Surface。
- 一致：`rg -i 'GlassDetailPlate|detail[-_]?plate|DetailPlate|Detail Plate' glass-frontend` 无结果；`--glass-wb-detail-plate-*` 无结果。
- 一致：`npm --prefix glass-frontend run build` 通过（`vue-tsc -b` + Vite；4011 modules transformed）。仅有既有的大 chunk warning。
- 偏差：详情类 Lab 容器改为 L3 Focus Panel 的 header/body 间距与 standalone 轻影，不再沿用旧详情板材质；这是本次容器收口的预期视觉变化。
- 待确认：实际浏览器截图、同视口视觉验收由 Cursor 执行；本实现未自启 Vite / Chromium。
- 一致（Cursor 补落盘）：`.agents/skills/glass-ui/references/interaction-tokens.md` Descriptions 宿主段已改为 Panel standalone。

未自动 commit / push。
