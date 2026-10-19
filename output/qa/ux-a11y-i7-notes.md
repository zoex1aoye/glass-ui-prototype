# Track I7 · Table 行拖拽键盘 / 按钮替代路径

- 日期：2026-10-19
- 来源：`output/qa/ux-delivery-matrix-c-2026-10-19.md` §P1-3
- 权威：已定 `--glass-wb-*` / `--glass-*` token + Lab `/data`
- 范围：`GlassTable.vue` · `tableRowMove.ts` · `components/glass/index.ts` · `LabDataView.vue` S12
- 边界：未改 `docs-nav`；未删除 `drag-sort`；未换 UI 库；未自动 commit

## 1. 实现

| 面 | 变更 |
|---|---|
| `GlassTable` | 新增 `rowMove` / `moveColumnTitle` / `moveColumnWidth` / `rowMoveDisabled` / `moveRowLabel` props |
| 操作列 | `rowMove` 开启时自动前置「排序」列；首行上移、末行下移自动禁用；`loading` 时全禁用 |
| 事件 | 新增 `row-move`，回传 `GlassTableRowMoveContext { row, rowIndex, targetIndex, direction, newData }` |
| 可复用工具 | `moveTableRow(data, from, to)` 返回新数组；`GlassTableRowMoveContext` / `GlassTableRowMoveDirection` 从 `components/glass` 导出 |
| 拖拽并存 | `dragSort` / `drag-sort` 原样保留；拖拽与按钮共用同一份 `newData` 回写约定 |
| Lab S12 | `dragSort="row"` + `rowMove` 同时开启；按钮和拖拽都回写 `dragRows`，不维护第二套排序状态 |

交互与 a11y：

- 每行两枚 24×24 原生 `button`，`aria-label` 带行标题（如「上移「演示条目 01」」）。
- 行首操作组使用 `role="group"`，并带「「演示条目 01」排序」可访问名。
- 按钮有 hover（Quiet 提亮）、active（token 缩放 / 压入）、`focus-visible`（token ring）、disabled 态。
- 排序后焦点留在原按钮；新增 `role="status"` live region 播报「已上移 / 下移至第 N 行」。
- `prefers-reduced-motion: reduce` 下关闭 transform 动画，保留颜色态。
- 移动按钮拦截 `pointerdown` / `dragstart`，不会误触整行 Sortable 拖拽；标题区拖拽仍可用。
- 行移动仅覆盖扁平表；`tree` 模式不生成操作列，避免压平父子结构。

## 2. 验证

### 2.1 构建

```text
npm --prefix glass-frontend run build
→ exit 0
→ 4010 modules transformed
→ built in 658ms
```

仅保留仓库既有 warning：`lab-shared.css` 非 scoped 文件的 `:deep()` 提示、主 chunk > 500 kB。

### 2.2 `/data` S12 真实交互

使用 production build + headless Chromium（离线路由回填 `dist`），视口 1440×1200。

| 场景 | 结果 |
|---|---|
| 初始顺序 | `01 → 02 → 03 → 04 → 05 → 06` |
| 键盘：聚焦第 1 行「下移」→ Enter | `02 → 01 → 03 → 04 → 05 → 06` |
| 键盘：Shift+Tab 回到「上移」→ Enter | 恢复 `01 → 02 → 03 → 04 → 05 → 06` |
| 鼠标：第 3 行「下移」按钮 | `01 → 02 → 04 → 03 → 05 → 06` |
| 排序后焦点 | 仍为 `下移「演示条目 01」` 按钮；`:focus-visible` 为真 |
| 读屏状态 | `「演示条目 01」已下移至第 2 行` |
| 边界禁用 | 首行上移 disabled；末行下移 disabled；共 12 枚按钮 |
| 行高 | S12 与 S1 均为 41px，未因操作列抬高行高 |
| 拖拽回归 | 从第 1 行标题区拖到第 2 行后顺序实际变化，`drag-sort` 仍工作 |
| reduced-motion | `transitionProperty = background-color, color, box-shadow`，不再包含 `transform` |

截图：

- `output/qa/ux-a11y-i7-table-move.png`（初始态）
- `output/qa/ux-a11y-i7-table-move-after.png`（按钮重排后）

测试控制台仅出现离线环境无法加载的外部头像：
`https://tdesign.gtimg.com/site/avatar.jpg`。该资源来自既有 Lab 头像示例，与本 Track 无关。

## 3. 交付清单

| 项 | 结果 |
|---|---|
| 键盘 / 按钮可完成重排 | 通过 |
| `drag-sort` 仍可用 | 通过 |
| hover / active / focus-visible / disabled | 通过（token） |
| icon-only 可访问名 + 装饰图标 `aria-hidden` | 通过 |
| 排序后焦点保持 | 通过 |
| 状态不只靠颜色 | 通过（`disabled` + 可访问名 + live region） |
| 行密度一致 | 通过（41px，与 S1 相同） |
| reduced-motion | 通过 |
| 未改 `docs-nav` / 未换 UI 库 / 未 commit | 通过 |

## 4. 未测 / 待确认

- 未运行 VoiceOver / NVDA；已核对 live region 文本与 DOM 语义，但未做真实读屏播报。
- `rowMoveDisabled` 已实现并通过类型 / 构建，但 Lab 未单独演示权限锁定行。
- `tree` 模式行移动按设计标 N/A；当前只覆盖扁平表。
- 仅验证 1440px 桌面视口；未做窄屏 / 触摸设备抽检。

```text
结论：通过
P1-3：GlassTable 新增可复用 rowMove 操作列与 row-move 事件；Lab /data S12 可不拖拽、仅用键盘或按钮完成重排；drag-sort 保留且回归通过；build 绿。
未测/待确认：VoiceOver / NVDA 手工播报未测；rowMoveDisabled 未在 Lab 单独演示；tree 模式按设计 N/A；仅 1440px 桌面视口。
```
