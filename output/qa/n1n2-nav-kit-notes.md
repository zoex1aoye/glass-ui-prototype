# Track N1+N2 · GlassMenu + GlassBreadcrumb 验收记录

## 结论

- **一致**：两个组件均以 TDesign `t-menu` / `t-breadcrumb` 为行为与 a11y 底座，Glass 层只挂 class、透传 props / slots / events；没有扩到 HeadMenu、DocsShell、Dashboard 或 LabNavigationView。
- **一致**：Menu 行态复用 Dashboard Rail Quiet List 的 ice / lilac hover、active、active-hover、pressed 与圆角 token；panel 只复用既有 L3 fill / hairline / radius。
- **一致**：Menu active 左侧残留 strip 已清除，选中语义由 Whisper wash + Action Blue 文字表达；focus-visible 与 reduced-motion 均已覆盖。
- **一致**：Breadcrumb 为透明无卡路径，祖先 secondary、当前项 primary，separator muted；没有硬描边、阴影或新色板。
- **一致**：组件文件内没有魔法 hex / rgba；新增 `--glass-wb-menu-*` / `--glass-wb-breadcrumb-*` 均引用既有 Rail、L3、text、control token。

## TDesign 子件识别核对

- `Breadcrumb`：`useBreadcrumbOptions` 通过 `getChildComponentSlots("TBreadcrumbItem")` 收集子项，helper 按 `type.name.endsWith(...)` 判断。若包薄 SFC 会漏识别，因此 `GlassBreadcrumbItem` 直接 re-export `BreadcrumbItem`。
- `Menu`：`TMenu` 通过 `provide("TdMenu")` 提供上下文，`TMenuItem` / `TSubmenu` 通过 `inject` 协作；`Submenu` 另读取父链 `type.name` 判断 menu 层族。为保留父链与命名空间一致性，`GlassMenuItem` / `GlassSubmenu` / `GlassMenuGroup` 均直接 re-export，不做薄 SFC。

## 改动文件

- `glass-frontend/src/components/glass/GlassMenu.vue`
- `glass-frontend/src/components/glass/GlassBreadcrumb.vue`
- `glass-frontend/src/components/glass/index.ts`
- `glass-frontend/src/styles/theme.css`

## 偏差 / 边界

- 未启动 Vite，未做同视口运行态截图；本轮视觉结论来自 token、TDesign DOM 与选择器静态对照，不等同于 Living Demo 截图验收。
- `collapsed` 下 TDesign 会把 Submenu 内容 Teleport 到 `body` 的 `.t-menu__popup`；当前 `.glass-menu` 作用域覆盖 inline menu，不越权改全局 popup 材质。若后续系统接入需要在折叠态强制 Glass popup，应通过 Submenu 的 `popupProps.overlayClassName` 另立接入约定。

## 待确认

- 后续 Track 将组件接入 Dashboard / Lab Living 时，需要同视口检查 rail 透底、panel L3 fill、ice/lilac 选中 wash 与 Breadcrumb 当前项字色。
- 折叠态 popup 是否纳入下一 Track 的 Glass 浮层规范，需由视觉权威确认；本轮未扩 scope。

## 验证

- `npm --prefix glass-frontend run build`：通过，无 TypeScript / Vite error。
- `git diff --check`：通过。
- 未自动 Git commit。
