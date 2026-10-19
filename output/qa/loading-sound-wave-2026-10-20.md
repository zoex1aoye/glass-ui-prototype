# Track I2 · GlassLoading 默认指示器改为三条竖向音浪

日期：2026-10-20

## 改动文件

- `glass-frontend/src/components/glass/GlassLoading.vue`：默认 `#indicator` 改为 `.glass-loading__wave` + 3 个 `aria-hidden` 的 `.glass-loading__wave-bar`；`useFrostDisc` 更名为 `useDefaultIndicator`，自定义 slot / `indicator=false` / 函数型 indicator 逻辑不变。
- `glass-frontend/src/styles/theme.css`：删除 disc 尺寸、渐变、柔影、旋转与呼吸 token / 选择器 / keyframes；新增 `--glass-wb-loading-wave-*` 与三条竖条错峰动画，保留 small / medium / large 三档及轻 mask。
- `glass-frontend/src/views/system/lab/LabFeedbackView.vue`：页头、§4 标题、Ld1 / Ld2 描述改为三条竖向音浪；Ld1–Ld3 结构与固定槽位未改。
- `glass-frontend/src/views/system/lab/LabOverviewView.vue`：反馈导航描述同步 Sound Wave Loading。
- `glass-frontend/src/components/glass/index.ts`：GlassLoading 导出注释同步。
- 规范：`.agents/skills/glass-ui/references/interaction-tokens.md` Loading 段已由 Cursor 补落盘。

## 对照结论

### 一致

- 默认指示器为 3 根竖向圆角胶囊条，水平居中；条宽 18% / 条高 100% / 间隙 8%，整体包围盒沿用 16 / 24 / 32。
- 填充只引用既有 `--glass-chroma-cyan` / `--glass-chroma-alipay` / `--glass-chroma-zhihu` / `--glass-chroma-ice`；无描边、柔影、实白核或 TD 圆环。
- 动效仅对单条使用 `scaleY` 0.38→1，三档音浪以负 delay 错峰；整组不旋转。
- `prefers-reduced-motion: reduce` 下关闭动画，三根条统一为 0.68 倍中等高度。
- `t-loading` 包裹方式未变；自定义 `#indicator`、`indicator=false` 与函数型 indicator 仍原样透传。
- overlay 轻 mask、secondary 文本及 Toast / Message / Banner 均未改。
- `rg 'Frost Disc|loading-disc|glass-loading__disc|glass-loading--disc' glass-frontend` 无结果。
- `git diff --check` 通过。
- `npm --prefix glass-frontend run build` 通过：`vue-tsc -b` + Vite，4011 modules transformed，built in 857ms；仅有既有的大 chunk warning。

### 偏差

- 暂无已确认的静态偏差。
- 三条竖条的动画观感、16px 档清晰度与遮挡态可辨性尚未做同视口浏览器对照；本实现未自启 Vite / Chromium。

### 待确认（Cursor 浏览器验收）

- Lab Feedback §4 · Ld1：small / medium / large 三档均可见 3 条竖条，且相位错开。
- reduced-motion 下三根条等高静止，无残余旋转或缩放。
- 16px 档条宽约 2.88px、间隙约 1.28px；若实际截图偏细，优先只调 `--glass-wb-loading-wave-bar-width` / `--glass-wb-loading-wave-bar-gap`。
- 动画节奏若偏快或偏慢，只调 `--glass-wb-loading-wave-duration` 与三个 delay token。

未自动 commit / push。
