# T12 · workbench only / comfortable only / L3 Panel 可读性

日期：2026-10-18  
落点说明：`.agents/` 当前只读，按约定写入 `output/qa/`。

## 改动文件

- `crm-frontend/src/styles/theme.css`
- `crm-frontend/src/layouts/DocsShell.vue`
- `crm-frontend/src/components/glass/index.ts`
- `crm-frontend/src/components/glass/GlassPanel.vue`
- `crm-frontend/src/components/glass/GlassSurface.vue`（仅注释口径）
- `crm-frontend/src/views/system/lab/LabContainersView.vue`
- `crm-frontend/src/views/system/lab/LabOverviewView.vue`

## Scheme / Density 清理

- 删除 `[data-scheme='workbench']` 重复映射，保留 `:root` 作为唯一 workbench 默认值，避免双份漂移。
- 删除 `[data-scheme='frost-host']` / `[data-scheme='warm-satin']` / `[data-scheme='veil-dye']` 全部 CSS 块。
- 删除 DocsShell 的 `SchemeId` / `DensityId` 类型、state、选项数组、两组 radiogroup 与对应样式。
- DocsShell 根不再挂 `data-scheme` / `data-density`；子树直接消费 `:root`。
- 删除 `[data-density='compact']`；comfortable 控件高度保持 `:root` 原值。
- 清理 `components/glass/index.ts`、Containers / Overview Lab 文案里的多方案与 `data-scheme` 说明。
- 保留 `LabDataView` 的 `lab-plate-grid--compact`：它是网格布局类，不是全局 density 开关。

## L3 token 前后对照

仅调整 `--glass-layer-l3-inset-fill`；`--glass-layer-l3-fill`、standalone、hairline 与 shadow 未改，避免连带影响 DocsShell 侧栏、Tabs / Collapse 轨道与侧栏轻影。

| 项目 | 调整前 | 调整后 |
|---|---|---|
| 渐变角度 | `160deg` | `155deg` |
| 起点 | `rgba(238, 247, 255, 0.42)` | `rgba(212, 234, 254, 0.82)` |
| 终点 | `rgba(212, 231, 252, 0.36)` | `rgba(188, 219, 250, 0.68)` |

以 L1 基准 `#EAF3FB` 做近似合成（非实际截图取色）：

- 调整前约 `#ECF5FD` → `#E2EFFB`，相对基准亮度差 `+0.017` → `-0.037`。
- 调整后约 `#D8ECFD` → `#CBE3FA`，相对基准亮度差 `-0.069` → `-0.140`。
- 意图：Panel 顶部边界即可见，向下逐步加深；用冷蓝与略低明度拉出 L3，不依赖粉笔白实底、hairline、第二层 lift 或大 gutter。
- 文字对比：以 `--glass-text-secondary` `#4A5568` 计算，调整后近似对比约 `6.21:1` → `5.70:1`，仍高于正文 `4.5:1`。

## Living 消费路径

- Lab Living 的 Panel A/B/C 均使用 `GlassPanel` 默认 `variant="inset"`，正确消费 `--glass-layer-l3-inset-fill`。
- `.lab-living-panels` 保持 `gap: 12px`，未出现 gap=0。
- 未增加 Panel 外轮廓、双托盘、额外阴影或大 gutter；L1 仍只有一块 `GlassSurface`。

## 验证与对照结论

- `npm --prefix crm-frontend run build`：通过（`vue-tsc` + Vite build；仅有既有 `:deep` minify 警告与 chunk size 提示）。
- `rg "frost-host|warm-satin|veil-dye|data-scheme|data-density|\\[data-density='compact'\\]" crm-frontend/src`：无命中。
- `lab-plate-grid--compact`：保留 2 处（模板 + 样式定义），符合任务约束。
- 一致：仍为 html L3 冷蓝微透语言，单层 inset、无外轮廓、无二次 lift。
- 有意偏差：L3 inset 比 html `.bsurf` 样本更冷、略深；原因是本仓 L1 `surface-air` bloom 更亮，需 token 层补偿阅读边界。
- 待确认：DEV 进程在 `127.0.0.1:5173` 监听，但当前 shell 无法连通，CUA 浏览器会话也不可用，故未完成同视口改后截图；已用 token 合成与 Lab 消费路径完成静态核验。
- 未自启 vite，未 commit。

## Cursor 合流 · 浏览器轻量对照（Vite 重启后）

- 重启前 Vite 内存仍服务旧 DocsShell/theme；磁盘已是新稿。Cursor 重启 `127.0.0.1:5173` 后：
  - Scheme / Density 顶栏切换：**已消失**
  - Panel 计算样式：`--glass-layer-l3-inset-fill` = `155deg / rgba(212,234,254,.82) → rgba(188,219,250,.68)`
  - `.lab-living-panels` gap 仍为 `12px`
- 截图：`output/qa/qa-lab-living-panel-abc-after.png`
- 对照结论：相对用户附图「几乎融进 L1」已有可感知冷蓝加深；仍为单托盘 + 小 gap，无双托盘/假 Inset。若仍觉偏淡，可再加深 inset 终点或略提 L1 通透（待用户裁决）。
