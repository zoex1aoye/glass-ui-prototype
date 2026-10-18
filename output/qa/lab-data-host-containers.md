# Lab `/data` 数据面宿主容器（Track I）

## 路径

统一为 `GlassSurface → GlassDetailPlate → GlassXxx`。DetailPlate 自身无外轮廓 hairline；
组件本体仍为透明底 host-first，不新增材质。

## 卡片清单

| 段 | DetailPlate |
|---|---|
| Empty | E1 `type=empty` · E2 `success` · E3 `fail` · E4 `network-error` · E5 `maintenance` · E6 `action/size=small` · E7 `action/size=large` |
| List | L1 基础 · L2 Meta+action · L3a split · L3b stripe · L4a asyncLoading=loading · L4b asyncLoading=load-more |
| Loading | Ld1 独立 spinner · Ld2 包裹块 + 轻 mask · Ld3 fullscreen 触发说明（fullscreen 实例仍挂 section 末） |
| Skeleton | Sk1 theme 矩阵 · Sk2 animation 矩阵；内部只保留排版 grid |
| Statistic | St1 Quiet 默认 · St2 tone 五态 · St3 trend · St4 prefix/suffix/extra · St5 loading/animation |

Descriptions 同步改用共享 `.lab-surface-host` / `.lab-plate-grid` / `.lab-plate`。

## 已撤

`.lab-empty-cell`、`.lab-empty-action-cell`、`.lab-list-panel`、`.lab-loading-panel`、
`.lab-skeleton-panel`、`.lab-skeleton-cell`（外框）、`.lab-statistic-panel` 的 Soft Surface
外轮廓与页底 accent 填充。

## 验证

- `npm --prefix crm-frontend run build`：通过（exit 0）。
- 未启动 Vite；本机 5173 / 4173 / 5174 无运行实例，本轮未做截图对比。
- 构建中仅保留既有 `lab-shared.css` 的 `:deep` minify 警告，不影响 exit 0。
