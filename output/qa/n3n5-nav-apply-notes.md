# Track N3+N4+N5 · Navigation Kit 接入验收记录

## 结论

- **一致**：Lab `/navigation` 新增 `GlassMenu` rail / panel 橱窗、分组与选中示例，以及 4 级 `GlassBreadcrumb` Quiet 路径；既有 GlassTabs / GlassSteps 区块保留。
- **一致**：Lab Live Props 已接入 Menu 的 `variant` / `collapsed` / `tone` 与 Breadcrumb 的 `maxItemWidth`，并沿用现有 `docsProps` 注册、选中和右栏控制模式。
- **一致**：DocsShell 左栏改用 `GlassMenu variant="rail"`，每个 `docsNavGroups` 映射为一个 `GlassMenuGroup`，导航项保留 label + desc 双行；`filteredGroups` 仍驱动搜索结果。
- **一致**：DocsShell 左侧选中值跟随 `route.path`，菜单项以相同 path 作为 `value` / `to`，并保留当前项 `aria-current="page"`。
- **一致**：DocsShell 顶栏改用 `GlassBreadcrumb`，数据仍来自 `findDocsEntry`，层级为 brand / group / item，保留 `shell.breadcrumb.aria`。
- **一致**：Dashboard Rail 改为无分组扁平 `GlassMenu variant="rail"`，value 为 section id，选中跟随 `activeSection`，change 继续调用 `focusSection`，tone 绑定 `railTone`。
- **一致**：Dashboard 的 Rail head、`GlassRail` 宿主和 Rail | Stage `gap: 0` 未改；KPI / Table / Quality / Delivery 样式保留。
- **一致**：`docs-nav.ts` 分组、条目、顺序与 path 均未修改；仅更新了 `nav.item.navigation.desc` 的 zh/en 文案内容。
- **一致**：未扩展 HeadMenu、未新增依赖、未在组件内新增魔法色、未自动 commit。

## 行为核对

| 区域 | 接入结果 |
|---|---|
| DocsShell 搜索 | `filteredGroups` 继续作为 Menu 内容源；无匹配分组不渲染 |
| DocsShell 路由高亮 | `GlassMenu :value="route.path"`；MenuItem `value` / `to` 与 docs path 一致 |
| DocsShell breadcrumb | `findDocsEntry(route.path)` → brand / group / item 三层 options |
| DocsShell scheme | locale / color `GlassRadioGroup` 与侧栏布局保留 |
| Dashboard tone | `tone="railTone"` 绑定现有冰蓝 / 淡紫切换，Rail head 切换按钮保留 |
| Dashboard focus | Menu change → section id → `focusSection` → `scrollIntoView` |
| Lab Menu | rail / panel、分组、选中、ice / lilac tone 均有演示入口 |
| Lab Breadcrumb | Live Props 使用 4 级 Quiet 路径并透传 `maxItemWidth` |
| Lab 回归面 | 既有 GlassTabs variants / interaction / placement / bare contrast 与 GlassSteps 区块仍保留 |

## 偏差

- 未做同视口运行态截图对比：当前沙箱不允许本地端口监听，且 Computer Use 未获浏览器操作授权。本轮视觉结论来自已定 token、TDesign Menu / Breadcrumb DOM 契约、样式选择器与 TypeScript / Vite 构建静态核对。
- Menu `collapsed` 态沿用 TDesign 的 Tooltip 标签提示；该 popup 仍属组件库既有边界，本轮未扩全局 popup 样式。

## 待确认

- 是否需要在后续 Track 为 `GlassMenu collapsed` 的 TDesign Tooltip popup 单独定义 Glass 浮层材质；当前接入不擅自越权覆盖全局 popup。
- 是否需要在可用的运行环境中补充 1440 / 1180 / 860 三档同视口截图基线，确认侧栏滚动、双行截断和 collapsed 宽度。

## 改动文件

- `glass-frontend/src/views/system/lab/LabNavigationView.vue`
- `glass-frontend/src/layouts/DocsShell.vue`
- `glass-frontend/src/views/system/lab/LabDashboardView.vue`
- `glass-frontend/src/scheme/messages.ts`
- `output/qa/n3n5-nav-apply-notes.md`

未修改：

- `glass-frontend/src/layouts/docs-nav.ts`
- `.agents/rules/**`
- 本轮新增的 `GlassMenu.vue` / `GlassBreadcrumb.vue` / `index.ts` / `theme.css` 接入面

## 验证

- `npm --prefix glass-frontend run build`：通过，无 TypeScript / Vite error。
- `git diff --check`：通过。
- 组件内 magic hex / rgba 扫描：本轮改动文件无命中。
- 未自动 Git commit。
