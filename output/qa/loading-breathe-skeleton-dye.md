# Track I · Loading 呼吸加强 + Skeleton 微透叠压染色

## 结论

- Loading 仍是 Frost Disc，慢旋保持 12s；呼吸改为 2.1s、
  opacity `0.55 → 1`、scale `0.88 → 1.08`，幅度显著大于改前。
- Skeleton 已从 Ice Wash + 横向软扫光改为 `html .cell-see` 的
  「半透冷蓝底 + 双层软染漂移叠压」；不再使用近白 `--glass-chroma-ice`
  高光带或 chalk / 冰白扫光。
- `gradient` 为两层蓝染独立慢移 + 透明度变化；`flashed` 只让染层深浅交替呼吸，
  TD 骨块本体的灰白 background-color 色跳已关闭。
- `GlassStatistic` 内嵌 TD skeleton 复用同一 fill 与同一套叠压染色规则。
- `prefers-reduced-motion: reduce` 下 Loading 静止（保留 Frost Disc），
  Skeleton 染层静止（保留静态微透染色）。

## Token 新旧对照

| 旧 token | 新 token | 变化 |
|---|---|---|
| `--glass-wb-loading-disc-breathe-duration: 2.6s` | `2.1s` | 呼吸更利落 |
| `--glass-wb-skeleton-fill: rgba(232,244,255,.55)` | `rgba(210,232,255,.4)` | 近白冰洗 → 微透冷蓝叠压底 |
| `--glass-wb-skeleton-shimmer`（Cyan → 近白 → Zhihu 扫光） | `--glass-wb-skeleton-dye-cyan`（Cyan → Alipay 径向软染） | 移除近白高光端；改为第 1 层染色 |
| 同上 | `--glass-wb-skeleton-dye-blue`（Zhihu → Alipay / Cyan 线性染带） | 第 2 层染色；去掉 `.l2` 的近白端 |
| `--glass-wb-skeleton-sweep-duration: 2.8s` | `--glass-wb-skeleton-dye-duration: 5.6s` | 扫光时长 → 染色漂移时长 |
| `--glass-wb-skeleton-flashed-duration: 2.8s` | `--glass-wb-skeleton-breath-duration: 3.6s` | flashed 染层呼吸时长 |
| `--glass-wb-skeleton-flash-opacity: .68` | `--glass-wb-skeleton-dye-opacity: .54` + `--glass-wb-skeleton-dye-breath-opacity: .4` | 改为两层染层的基准透明度 |

## Keyframes 新旧对照

| 旧 keyframes | 新 keyframes | 行为 |
|---|---|---|
| `glass-loading--disc-breathe`：`0.94 → 1.03` / `0.82 → 1` | `0.88 → 1.08` / `0.55 → 1` | 呼吸一眼可感 |
| `glass-skeleton--sweep`：`translateX(-115% → 115%)` + skew | `glass-skeleton--dye-cyan` | 染层漂移 + rotate + opacity，非横向扫光 |
| 同上 | `glass-skeleton--dye-blue` | 第二层反向漂移 + opacity，交叠处加深 |
| `glass-skeleton--flashed`：骨块 opacity 呼吸 | `glass-skeleton--dye-breathe-cyan` / `glass-skeleton--dye-breathe-blue` | 只呼吸两层染色，骨块不跳灰白 |

## 选择器收口

- Skeleton 骨块底与染层使用
  `:is(.glass-skeleton, .glass-statistic) .t-skeleton__col`，
  因此 Lab 的 `GlassSkeleton` 与 `GlassStatistic` 内嵌 skeleton 同源。
- `::before` 承载 Cyan → Alipay 软染团，`::after` 承载 Zhihu → 软蓝染带；
  两层均 `inset: -26%`、`filter: blur(3px)`，由骨块 `overflow: hidden` 裁切。
- 全程无白色渐变端点、无 `--glass-chroma-ice` 高光带、无 `skewX` 扫光。

## 验证

- `npm --prefix crm-frontend run build`：通过，无 TS / 构建 error。
- 构建仍有仓库既有的 `:deep` 伪类与 chunk size 警告。
- 编译产物已确认包含新 keyframes、冷蓝 fill、双层 dye token 与 reduced-motion 收口。
- 未 commit；未启动 Vite。

## 视觉验证限制

本机沙箱阻止终端回连已有 `127.0.0.1:5173`，Chromium / Safari 的
Computer Use 未获授权，因此未取得 `/data` 的 Ld1 / Sk2 同视口截图。
本次不宣称“Lab 截图已验收”；建议在 `/data` 的 Loading 与 Skeleton 区块做最终目视确认。
