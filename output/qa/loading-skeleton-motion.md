# GlassLoading / GlassSkeleton Motion · Track I

> 本页记录首版 Frost Disc + Ice Wash 实现，已被
> `output/qa/loading-breathe-skeleton-dye.md` 的二次修订取代。

## 结论

代码实现与构建已完成：默认 Loading 已从 TDesign 硬圆环切换为 Frost Disc；Skeleton
已切换为 Ice Wash 骨块与 Cyan → 近白 → Zhihu 软扫光。两组件均在
`prefers-reduced-motion: reduce` 下停止动画。

`npm --prefix crm-frontend run build` 通过。仍有仓库既有的 `:deep` 伪类与 chunk size
警告，无 TS / 构建 error。未 commit，未启动 Vite。

## 权威锚点

- Frost Disc：`ai-workbench-glass-workbench-v5.html` 的 `.cell-float .disc` /
  `.gan-demo .disc-on-gan`。径向冰蓝长程、柔影、无硬描边、无锐白高光核。
- Skeleton sweep：同文件 `.bar` / `.bar i`。轨道近白微透，扫光采用
  Cyan → 近白微透 → Zhihu 淡，不采用 chalk 纯白闪带。

## Token

Loading：

- `--glass-wb-loading-disc-size-small: 16px`
- `--glass-wb-loading-disc-size-medium: 24px`
- `--glass-wb-loading-disc-size-large: 32px`
- `--glass-wb-loading-disc-fill`：复用 `--glass-chroma-cyan` /
  `--glass-chroma-alipay` / `--glass-chroma-zhihu` / `--glass-chroma-ice`
- `--glass-wb-loading-disc-shadow`
- `--glass-wb-loading-disc-blur`
- `--glass-wb-loading-disc-rotate-duration: 12s`
- `--glass-wb-loading-disc-breathe-duration: 2.6s`
- `--glass-wb-loading-disc-ease`

Skeleton：

- `--glass-wb-skeleton-fill: rgba(232, 244, 255, 0.55)`
- `--glass-wb-skeleton-shimmer`：Cyan → 近白微透 → Zhihu 淡的长程 gradient
- `--glass-wb-skeleton-sweep-duration: 2.8s`
- `--glass-wb-skeleton-flashed-duration: 2.8s`
- `--glass-wb-skeleton-flash-opacity: 0.68`

## Keyframes / 选择器

- `@keyframes glass-loading--disc-spin`：12s linear infinite，使用独立
  `rotate` 属性，避免与呼吸 `scale` 互相覆盖。
- `@keyframes glass-loading--disc-breathe`：2.6s ease-in-out alternate，
  opacity `0.82 → 1`、scale `0.94 → 1.03`。
- `.glass-loading__disc`：静态尺寸、径向材质、柔影、backdrop blur，无 border。
- `@keyframes glass-skeleton--sweep`：2.8s 软扫光，覆盖
  `.t-skeleton--animation-gradient::after`。
- `@keyframes glass-skeleton--flashed`：弱透明度呼吸，不再切骨块底色。
- reduced-motion：Frost Disc 移除 `animation` 与 `rotate` / `scale`；
  Skeleton sweep 隐藏，flashed 归静止，保留 Ice Wash 静态骨块。

## 组件行为

- `GlassLoading.vue`：无 `#indicator` 槽时默认渲染
  `<span class="glass-loading__disc" aria-hidden="true" />`。
- 用户提供 `#indicator`、函数型 `indicator` 或 `indicator=false` 时保留
  TDesign 原语义，不覆盖自定义。
- Loading / Skeleton 仍由 `t-loading` / `t-skeleton` 承担行为与 a11y 底座，
  仅挂 class 和 indicator 槽钩子。
- Statistic 内嵌 skeleton 继续消费同一个 `--glass-wb-skeleton-fill`，没有第二套骨色。

## 改动文件

- `crm-frontend/src/styles/theme.css`
- `crm-frontend/src/components/glass/GlassLoading.vue`
- `crm-frontend/src/components/glass/GlassSkeleton.vue`
- `crm-frontend/src/components/glass/index.ts`
- `crm-frontend/src/views/system/lab/LabDataView.vue`

## 验证与限制

- 构建：通过。
- 编译产物已核对：Frost Disc default slot、三档盘径、双轨 keyframes、
  Ice Wash token、软扫光、reduced-motion 均进入产物。
- 组件源码无内联色值；颜色只在 `theme.css` token 定义处。
- 本机沙箱阻止终端回连已有 5173 服务；Chromium / Safari 的 Computer Use
  未获授权，运行时截图未取得。因此不宣称“Lab 截图已验收”；需在 `/data`
  的 Ld1 / Sk2 做最终同视口目视确认。
