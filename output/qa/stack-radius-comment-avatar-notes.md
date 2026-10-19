# Track · Comment stub circle + 紫 Fan Tip + 堆叠圆角 region=16

日期：2026-10-19

## 改动文件

- `glass-frontend/src/styles/theme.css`
- `glass-frontend/src/views/system/lab/LabDataView.vue`
- `glass-frontend/src/views/system/lab/LabLayoutView.vue`
- `glass-frontend/src/components/glass/GlassRail.vue`（仅注释）
- `glass-frontend/src/components/glass/GlassStage.vue`（仅注释）

未改 `docs-nav.ts` / router，未启动 Vite，未 commit。

## A · Comment stub 头像

| Token / 位置 | 调整前 | 调整后 | 结论 |
|---|---|---|---|
| `--glass-wb-comment-avatar-radius` | `12px` | `50%` | Comment 头像改为 circle；List Meta 继续引用该 token，同步 circle |
| `--glass-wb-avatar-radius-round` | `var(--glass-wb-comment-avatar-radius)` | `12px` | 与 Comment 解耦，`GlassAvatar` round 仍为 12px |
| `--glass-wb-avatar-gradient` | `145deg · #8b7cf8 → #6b6ef0` 两停 | `145deg · #c7b8ff → var(--glass-chroma-ai) 52% → #44339e` 三停 | 浅紫 → 芯紫 → 深靛 Fan Tip；无白核 |
| `--glass-wb-avatar-gradient-alt` | 无 | `145deg · #d3c5ff → #8168f1 50% → #3a2f8a` | 新增同族紫备用梯度 |
| `--glass-wb-avatar-shadow` | `0 6px 14px rgba(107,124,250,.28)` | `0 5px 12px rgba(88,70,180,.20)` | 紫影略软化、降低扩散 |
| `--glass-wb-avatar-glow` | 外圈 `.10` / 主影 `.28` | 外圈 `.06` / 主影 `.18` | 保留 token，柔化光晕 |
| `.lab-comment-avatar--alt` | `var(--glass-cta-gradient)` | `var(--glass-wb-avatar-gradient-alt)` | 不再绑定 CTA 渐变 |

- `.lab-comment-avatar` 继续吃 `--glass-wb-comment-avatar-radius` 与 `--glass-wb-avatar-gradient`，因此同时得到 circle 与紫色三停 Fan Tip。
- `--glass-wb-avatar-fill` 未改，`GlassAvatar` 字符 / icon / 图片 fallback / `+N` 仍为冷蓝微透语言；紫色未扩散进该 token。
- Comment 验收文案改为「头像 40 / circle（50%）/ 紫 Fan Tip（无白核）」；List Meta 文案改为「circle（50%）对齐 Comment」。

## B · 堆叠圆角阶梯

| Token | 调整前 | 调整后 | 结论 |
|---|---|---|---|
| `--glass-wb-stack-radius-region` | 无 | `16px` | 新增 Region 圆角单一出处 |
| `--glass-layer-l2-radius` | `14px` | `var(--glass-wb-stack-radius-region)` | PageHeader 统一 16px |
| `--glass-layer-l3-radius` | `14px` | `var(--glass-wb-stack-radius-region)` | Panel 统一 16px |
| `--glass-wb-detail-plate-radius` | `14px` | `var(--glass-wb-stack-radius-region)` | DetailPlate 统一 16px |
| `--glass-layer-l1-radius` | `var(--glass-wb-surface-radius)`（24px） | 保持 | L1 Surface 仍为 24px |
| `GlassSurface.__body` | `calc(var(--glass-layer-l1-radius) - var(--glass-layer-l1-pad))` | 保持 | Flush 外轮廓仍为 24 - 16 = 8px |

- `GlassSurface` 的 `padding: var(--glass-layer-l1-pad)` 与 `overflow: hidden` 均保持，四周 Inset Reveal 未被删除。
- `GlassRail` / `GlassStage` 未新增 radius；注释已写明自身不设圆角，外轮廓由 Surface `__body` 裁切，Rail | Stage 贴缝 `gap=0`、禁止 gutter。
- `LabLayoutView` 的 Living / Flush 验收 note 已写明：`L1=24`、`Region=16`、`Surface __body 外轮廓=calc(L1-pad)=8px`、贴缝无 gutter。

## 对照结论

- 一致：Comment stub 为 circle + 紫系三停 Fan Tip，`--glass-wb-avatar-fill` 冷蓝未被紫色污染。
- 一致：`GlassAvatar` round 明确保持 12px，不再 alias Comment circle。
- 一致：L2 / L3 / DetailPlate 统一 Region 16px；L1 保持 24px，Surface `calc` 与 pad 均未改。
- 一致：Rail / Stage 自身无 radius，贴缝与裁切责任仍归 Surface。
- 待确认：本实现代理未启动 Vite；浏览器同视口截图与硬刷验收由 Cursor 在 `/data`、`/layout` 完成。

## 验证

- `npm --prefix glass-frontend run build`：通过（`vue-tsc -b` + Vite build）。
- 仅有仓库既有的 lightningcss `:deep` 提示与 chunk size 警告，无 TS / build error。
- `git diff --check`：通过。
- 未 commit。
