# Poster Lab 增强记录

日期：2026-10-18

## 已完成

- `LabOverviewView.vue` / `LabDataView.vue` 删除 P1/P2 收口区与相关常量、注释；演示表 `priority` 数据未改。
- `/poster` 保留 0. Live Props Demo、1. 整装背景舞台。
- 新增七色分工与深度五档、海报三技法、小物件↔大容器、海报→大容器换算表。
- 小物件示例使用 `GlassButton` / `GlassStickyTool` / `GlassBadge` / `GlassProgress`；大容器使用 `GlassSurface` + `GlassPageHeader` + `GlassStage`，底色为 `GlassPosterWash`。
- 导航 label 调整为「Poster 技法」；路由与 key 未改。

## 验证

- 目标 P1/P2 字样：0 命中。
- `LabPosterView.vue` 魔法 hex/rgba：0 命中；颜色均走 `--glass-*` / `--glass-wb-*` 或 `color-mix` 引用 token。
- `npm --prefix glass-frontend run build`：通过；仅有既有 lightningcss `:deep` 提示。
- 未启动 vite，未 commit。

## 对照与限制

- 一致：七色职责、三技法语义、t1 小物件满浓↔大容器改写、四行换算表与 html 信息架构对齐。
- 偏差：花瓣/微透/悬浮示意为 token 驱动的 CSS 近似，非 html 位图级复刻；PosterWash 花瓣精确度沿用现有组件。
- 待确认：目标视口下的最终视觉比例与微透强度，由 Cursor 浏览器验收。
