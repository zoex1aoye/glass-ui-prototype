# Track I · Layout Living 色调 / inset 悬浮 / Alert 饱和

日期：2026-10-19

## 改动文件

- `glass-frontend/src/styles/theme.css`
- `glass-frontend/src/components/glass/GlassPanel.vue`
- `glass-frontend/src/views/system/lab/LabLayoutView.vue`

范围外未改。工作树原有 `glass-frontend/index.html` 修改保持不动；未 commit。

## Token 前后对照

### L2 PageHeader

| Token | 调整前 | 调整后 | 意图 |
|---|---|---|---|
| `--glass-layer-l2-fill` | `115deg` · 白 `.46 @0%` · 冰蓝 `rgba(226,242,255,.4) @32%` · 蓝尖 `rgba(22,119,255,.12) @100%` | `115deg` · 白 `.46 @0%` · 冰蓝 `rgba(226,242,255,.28) @42%` · 蓝尖 `rgba(22,119,255,.10) @100%` | 中段后移、降 alpha，尖端轻收；仍为单扇形语言 |
| `--glass-layer-l2-fill-weighted` | `118deg` · 白 `.4 @0%` · 冰蓝 `.42 @30%` · 蓝 `.14 @72%` · 深蓝 `.10 @100%` | `118deg` · 白 `.4 @0%` · 冰蓝 `.27 @40%` · 蓝 `.12 @72%` · 深蓝 `.085 @100%` | 中段与 default 同步减重，右端保留 Actions 压感；中段不重于 default |

### L3 Panel inset

| Token | 调整前 | 调整后 |
|---|---|---|
| `--glass-layer-l3-inset-shadow` | `none` | `0 6px 18px rgba(15, 60, 140, 0.045)` |
| `--glass-layer-l3-standalone-shadow` | `0 12px 30px rgba(15, 60, 140, 0.07)` | 不变 |

inset 影为单层、低 offset / blur / alpha，弱于 standalone；`--glass-layer-l3-inset-hairline` 仍为 `none`。

### Alert / Message

| 状态 | 中段色停 | 尖端 alpha |
|---|---|---|
| success | `rgba(231,248,239,.55)` → `rgba(220,246,230,.56)` | `.12` → `.16` |
| info | `rgba(226,242,255,.50)` → `rgba(214,235,255,.53)` | `.12` → `.16` |
| warning | `rgba(255,246,230,.55)` → `rgba(255,239,211,.56)` | `.12` → `.16` |
| error | `rgba(255,240,240,.55)` → `rgba(255,229,229,.56)` | `.12` → `.16` |

Message 四态 fill 继续别名 Alert fill，因此同步跟随；未新增色带或实底。

## 消费路径与契约核对

- `GlassPanel` 的 `.glass-panel--inset` 已改为消费 `var(--glass-layer-l3-inset-shadow)`；未拼接 hairline，未增加第二层影。
- Living Panel A/B/C 均未传 `variant`，继续走 `GlassPanel` 默认 `inset`，未改为 `standalone`。
- Living PageHeader 仍显式 `:weighted="false"`，继续消费 `--glass-layer-l2-fill`，并保留 `#actions`。
- Living 仍为单个 `GlassSurface` 托盘 + 三块 Panel；Rail/Stage Flush、Surface pad、scheme/density 均未改。
- Lab Panel A 文案已改为「whisper 悬浮影，仍无外轮廓 hairline」，保留原槽位结构；未增删 Lab 目录。

## 验证与对照结论

- `npm --prefix glass-frontend run build`：通过（`vue-tsc -b` + Vite build）。
- 构建仅有既有 `:deep` minify 提示与 chunk size 警告，无 TS / build error。
- `git diff --check`：通过。
- 一致：PageHeader 仍为 L2 单扇形；Panel 仍为 inset；Alert 仍为 Fan Tip + icon 语义，无左侧色带。
- 偏差：代码 / token 契约内未发现偏差。
- 待确认：浏览器渲染观感尚未由本实现代理验收。按约定由 Cursor 打开 `http://127.0.0.1:5173/layout` 同视口对照 PageHeader 冰蓝重量、Panel whisper 影与 Alert 饱和度；本代理未自启 Vite。
