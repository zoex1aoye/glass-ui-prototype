# Track I · GlassAvatar + GlassAvatarGroup

日期：2026-10-19

## 改动文件

- `glass-frontend/src/components/glass/GlassAvatar.vue`
- `glass-frontend/src/components/glass/GlassAvatarGroup.vue`
- `glass-frontend/src/components/glass/index.ts`
- `glass-frontend/src/styles/theme.css`

未改 Lab / `docs-nav` / router / Comment / List Meta stub；未启动 Vite，未 commit。

## 组件契约

- `GlassAvatar`：透传 `image` / `alt` / `hideOnLoadFailed` / `shape` / `size` /
  `imageProps`；提供 `icon` 与默认字符槽；转出 `error`（`{ e }`）。
- `GlassAvatarGroup`：透传 `cascading` / `max` / `size` / `collapseAvatar` /
  `popupProps`；默认槽与可选 `collapseAvatar` 槽。
- 所有可选 props 只在显式传入时绑定，避免 `undefined` 冲掉 TDesign 默认值。
- `glass-avatar` / `glass-avatar-group` class 均挂在对应 TDesign 根节点上；
  外部 class / style / 其余 attrs 继续透传根节点。

## Token 表

| Token | 值 | 用途 |
|---|---|---|
| `--glass-wb-avatar-size-small` | `32px` | small 头像 |
| `--glass-wb-avatar-size-medium` | `var(--glass-wb-comment-avatar-size)` | 默认 medium，对齐 Comment 40px |
| `--glass-wb-avatar-size-large` | `56px` | large 头像 |
| `--glass-wb-avatar-radius-round` | `var(--glass-wb-comment-avatar-radius)` | round 圆角，对齐 Comment 12px |
| `--glass-wb-avatar-radius-circle` | `50%` | circle 圆角 |
| `--glass-wb-avatar-font-size-small` | `12px` | small 字符面 |
| `--glass-wb-avatar-font-size-medium` | `15px` | medium 字符面 |
| `--glass-wb-avatar-font-size-large` | `22px` | large 字符面 |
| `--glass-wb-avatar-icon-size-small` | `15px` | small icon 面 |
| `--glass-wb-avatar-icon-size-medium` | `18px` | medium icon 面 |
| `--glass-wb-avatar-icon-size-large` | `26px` | large icon 面 |
| `--glass-wb-avatar-font-weight` | `600` | 字符 / 折叠面字重 |
| `--glass-wb-avatar-fill` | 冰青 → 支付宝蓝微透渐变 | 字面、图片 loading / error、`+N` 同源材质 |
| `--glass-wb-avatar-text` | `var(--glass-wb-pill-quiet-color)` | 字 / icon 色 |
| `--glass-wb-avatar-backdrop` | `blur(8px) saturate(1.08)` | 小物件轻磨砂 |
| `--glass-wb-avatar-rim` | 16% 行动蓝 inset hairline | 图片 / 字 / 折叠面轻 rim |
| `--glass-wb-avatar-image-shadow` | 轻知乎蓝柔影 | 图片面轻浮起 |
| `--glass-wb-avatar-group-overlap` | `10px` | Group 左右重叠偏移 |

既有 `--glass-wb-comment-avatar-*` 原样保留；Avatar medium / round 通过引用对齐，
未改写 Comment / List Meta 的消费逻辑。

## 视觉收口

- 字 / icon 面：冷蓝微透渐变 + 行动蓝字色，无白色高光核、无粉笔白实底。
- 图片面：圆角继承头像形状，使用轻 inset rim + 柔影，没有 1px 实线硬框。
- Group：TDesign 原生生成的 `t-avatar__collapse` 同步吃同源 fill / text / rim；
  左右 cascading 的负 margin 统一由 token 控制。
- 未增加 hover / active / focus 视觉；Avatar 本体不是可点控件，交互语义仍由使用方决定。

## 验证

- `npm --prefix glass-frontend run build`：通过（`vue-tsc -b` + Vite build）。
- 构建仅有仓库既有的 `:deep` lightningcss 提示与 chunk size 警告，无 TS / build error。
- `git diff --check`：通过。
- 两个组件文件无魔法 hex / rgb / rgba。
- 待 Track II：在 Lab Living 中补默认 / round / circle / 图片 / icon / 分组折叠的同视口验收。
