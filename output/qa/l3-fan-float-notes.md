# Track · L3 inset 去死色：Fan Tip 过渡 + 更强悬浮

日期：2026-10-19

## 改动文件

- `glass-frontend/src/styles/theme.css`
- `glass-frontend/src/components/glass/GlassPanel.vue`
- `glass-frontend/src/views/system/lab/LabLayoutView.vue`

工作树原有 `glass-frontend/index.html` 修改保持不动；未启动 Vite，未 commit。

## Token 前后对照

### L3 inset 材质

| Token | 调整前 | 调整后 | 结论 |
|---|---|---|---|
| `--glass-layer-l3-inset-fill` | `155deg` · 冰蓝 `.82 @0%` → `.68 @100%` | `145deg` · 白 `.4 @0%` → 冰蓝 `rgba(220,238,255,.48) @46%` → 蓝染 `rgba(22,119,255,.10) @100%` | 两停高 alpha 实色洗改为三停 Fan Tip；左侧更开、右侧蓝染尖 ≤0.10 |
| `--glass-layer-l3-inset-blur` | `none` | `blur(14px) saturate(1.14)` | 轻 frosted，让宿主 L1 可透叠感知，不做二次厚托盘 |
| `--glass-layer-l3-inset-shadow` | `0 10px 26px rgba(15,60,140,.058)` | `0 14px 36px rgba(15,60,140,.10), 0 4px 12px rgba(15,60,140,.05)` | 单层 whisper 改为双层柔影，悬浮更明确 |
| `--glass-layer-l3-inset-lift` | 无 | `1px` | 对齐 L2 lift；组件内消费，reduced-motion 下归零 |
| `--glass-layer-l3-inset-hairline` | `none` | `none` | 保持无外轮廓 hairline |

### 影层级

| 层 | 主影 | 相对关系 |
|---|---|---|
| L2 PageHeader | `0 18px 40px rgba(28,72,150,.14)` + `0 4px 12px rgba(28,72,150,.07)` | 仍是最高一档 |
| L3 inset | `0 14px 36px rgba(15,60,140,.10)` + `0 4px 12px rgba(15,60,140,.05)` | 明显抬起，但弱于 L2 |
| L3 standalone | `0 16px 40px rgba(15,60,140,.105)` + `0 4px 12px rgba(15,60,140,.055)` | 同步略抬，略强于 inset，仍弱于 L2 |

## 消费路径

- `GlassPanel` 默认 `variant` 仍为 `inset`，未把默认切到 `standalone`。
- `.glass-panel--inset` 消费 inset fill / blur / shadow / lift；`box-shadow` 只挂双层柔影，没有拼接 hairline。
- inset 的 `transform: translateY(calc(0px - var(--glass-layer-l3-inset-lift)))` 提供 1px 抬升；`prefers-reduced-motion: reduce` 下重置为 `none`。
- `standalone` 仅同步上调外影；fill、blur、默认值和既有 tonal hairline 未改。
- 未新增嵌套 Surface、内层托盘或第二套材质 token。

## Living 文案与结构

- Living Panel A/B/C 均未显式传 `variant`，继续走默认 `inset`。
- A / B / C 文案统一标注「Fan Tip 过渡 + frosted 微透 + 悬浮影」；C 明示 `lift 1px`。
- Living 验收 note 增加 Panel 材质、L2 影上限与无 hairline 检查项。
- 仍为单个 `GlassSurface` 托盘 + 三块 L3 Panel；未增删 Lab 目录或固定文案槽位。

## 验证

- `npm --prefix glass-frontend run build`：通过（`vue-tsc -b` + Vite build）。
- 构建仅有既有 `:deep` minify 提示与 chunk size 警告，无 TS / build error。
- `git diff --check`：通过。

## 对照结论

- 一致：inset 已从两停实色洗切换到与 L2 / Alert 同语言的 Fan Tip；轻 frosted、双层柔影、1px lift 均由 token 收口。
- 一致：Living 仍单托盘、Panel 仍为 inset，inset 无外轮廓 hairline。
- 一致：L3 inset / standalone 外影均低于 L2 PageHeader，未出现层级倒挂。
- 待确认：本实现代理未自启 Vite；浏览器同视口硬刷验收由 Cursor 在 `http://127.0.0.1:5173/layout` 完成，重点看 Panel 相对 L1 的可读边界、frosted 通透度与悬浮影是否自然。
