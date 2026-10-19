# Track II · Data Lab 接线 GlassAvatar / GlassAvatarGroup

日期：2026-10-19

## 改动范围

- `glass-frontend/src/views/system/lab/LabDataView.vue`
- 未改 `docs-nav.ts`、router、`GlassAvatar` / `GlassAvatarGroup` 组件本体或 Comment / List Meta stub。
- 未自启 Vite，未 commit。

## 接线结果

- Live Props 新增 `Avatar` 区块：`shape`（circle / round）、`size`（small / medium / large）、
  `content`（image / character）；点选演示后右栏可调，画布即时反映。
- 状态矩阵使用 `GlassAvatar` 展示 image / 字符 / icon × circle / round × small / medium / large，
  共 18 个单体头像；icon 使用 `tdesign-icons-vue-next` 的 `UserIcon`。
- Group Living 使用 `GlassAvatarGroup` 展示 `right-up · max=3` 与 `left-up · max=4`，
  各挂 6 个 `GlassAvatar` 子项，保留 TDesign 默认 `+N` collapse 内容。
- 增加一行裸 `t-avatar` / `GlassAvatar` 对照，并明确标注裸 `t-avatar` 不进导出面。
- 图片示例使用 TDesign 官方示例资源 `https://tdesign.gtimg.com/site/avatar.jpg`；
  加载失败时仍由组件回落到冷蓝 error 面。

## 与 Track I 对照

引用：`output/qa/glass-avatar-track-i-notes.md`。

| 核对项 | 结论 |
|---|---|
| 导出面 | 演示只消费 `@/components/glass` 导出的 `GlassAvatar` / `GlassAvatarGroup`；通过 |
| 尺寸 | small 32 / medium 40 / large 56 由 Track I token 接管；通过 |
| 形状 | circle 50% / round 12px 由 Track I token 接管；通过 |
| 材质 | 字 / icon / 图片 fallback / `+N` 统一消费 `--glass-wb-avatar-fill` 冷蓝语言；通过 |
| 分组 | `cascading`、`max`、默认 collapse `+N` 均已接线；通过 |
| 遗留紫色 token | 新 Avatar 演示未使用 `--glass-wb-avatar-gradient` / `--glass-avatar-bg`；通过 |
| 既有演示 | Badge / Comment / List / Skeleton / Statistic 未删除或改写；通过 |

## 验收矩阵 B

| 区域 | 核对点 | 结论 |
|---|---|---|
| Tone / Density | 小物件冷蓝微透、尺寸 / 圆角走 token | 通过（静态核对） |
| 尺度与状态 | 矩阵覆盖 shape / size / 内容源；Group 覆盖 cascading / max / collapse | 通过（结构核对） |
| 层级几何 | 使用既有 `GlassSurface → GlassDetailPlate → GlassAvatar` 路径 | 通过 |
| 信息架构 | 未增删左侧目录或路由 | 通过 |
| a11y | 图片有 alt / aria-label，icon 面有可读标签 | 通过（静态核对） |

## 验证

- `npm --prefix glass-frontend run build`：通过（`vue-tsc -b` + Vite build）。
- 构建仅有仓库既有的 lightningcss `:deep` 提示与 chunk size 警告，无 TS / build error。
- `git diff --check`：通过。

结论：有条件通过（构建与静态接线通过；同视口浏览器验收待 Cursor）
P0：无
P1：无
未测/待确认：未做同视口截图与折叠弹层展开验收；图片示例依赖官方头像 URL 的网络可达性
