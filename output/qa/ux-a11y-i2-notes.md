# Track I2 · Navigation a11y 落地说明

- 日期：2026-10-19
- 来源偏差：`output/qa/ux-delivery-matrix-c-2026-10-19.md` §P0-2
- 权威口径：已定 `theme.css` token + Lab Living
- 范围：`GlassTabs` / `GlassSteps` / `navA11y.ts`；`/navigation` 仅补键盘验收说明

## 1. 改动摘要

- 新增 `navA11y.ts`：只补偿 TDesign 1.20.10 点击项缺失的键盘与读屏语义，不接管选择状态、点击逻辑、readonly / disabled 或视觉。
- Tabs：
  - `.t-tabs__nav-container` 补 `role="tablist"`，按 placement 暴露 `aria-orientation`；
  - 每个 `.t-tabs__nav-item` 补 `role="tab"` / `aria-selected` / roving `tabindex`；
  - 方向键在当前可选项间移动焦点，Home / End 跳首尾，Enter / Space 激活；
  - 可关联时给面板补 `role="tabpanel"` / `aria-labelledby`，并让 tab 用 `aria-controls` 指向面板；
  - disabled 项保持 `tabindex="-1"`，不进入键盘移动序列。
- Steps：
  - `.t-steps-item__inner.t-steps-item--clickable` 补 `role="button"` / `tabindex="0"`；
  - Enter / Space 交给 TDesign 原有 click 处理；
  - 当前 process 步补 `aria-current="step"`；readonly 态不进入 Tab 序列。
- 两个 wrapper 均在 `onMounted` 后绑定，`onBeforeUnmount` 解绑并恢复被改写的属性；`MutationObserver` 监听 class / 子树变化，覆盖选中态、当前步与列表重渲染。
- `LabNavigationView.vue` 仅补 Tabs / Steps 键盘验收说明；未改 `docs-nav`、Lab IA、token、色板、Density、Tone 或其他 Feedback / Forms 范围。

## 2. DOM 对照

| 目标 | TDesign 1.20.10 现状 | Glass 增强 |
|---|---|---|
| Tabs 导航项 | `.t-tabs__nav-item` 为 `div` + `onClick`，无 role / tabindex / aria-selected / keydown | tablist + tab + aria-selected + roving tabindex + 方向键 / Home / End / Enter / Space |
| Tabs 面板 | `.t-tab-panel.t-is-hidden` 仅靠 `display:none` 隐藏 | 常规 1:1 面板时补 tabpanel 关联；面板数量不一致（如 lazy / destroyOnHide）时回退为不建立可能错误的关联 |
| Steps 可点步 | `.t-steps-item__inner.t-steps-item--clickable` 为 `div` + `onClick` | role="button" + tabindex="0" + Enter / Space |
| Steps 当前步 | 仅 `.t-steps-item--process` 视觉状态 | 当前 process 内层补 `aria-current="step"` |
| Focus Ring | `theme.css` 已有 Tabs / Steps `:focus-visible` token 选择器，但原节点不可聚焦 | 焦点落在既有选择器覆盖的 `.t-tabs__nav-item` / `.t-steps-item__inner` 上，不新增视觉数值 |

## 3. 验证

- `npm --prefix glass-frontend run build`：通过，exit 0，4007 modules transformed。
- 仅保留仓库既有 warning：
  - `lab-shared.css` 非 scoped 文件中的 `:deep()` 无效伪类 warning；
  - 主 chunk 大于 500 kB 的拆包提示。
- DEV `http://127.0.0.1:5173/navigation` 不可达（`curl` 返回 000）；按约束未自启 Vite。
- 尝试用临时静态服务托管 `glass-frontend/dist` 做真实浏览器巡检时，本机沙箱拒绝端口绑定（`Operation not permitted`）；Chromium 计算机操作也未获授权。因此本轮没有可用的真实键盘 / 读屏截图证据。

## 4. 对照结论

一致：视觉仍由既有 `--glass-wb-*` / `--glass-*` token 与 Lab Living 裁决；未改色板、Density、Tone、Lab IA 或 `docs-nav`；未修改 `node_modules`、未引入依赖、未 commit。

偏差：静态实现未发现新增视觉偏差；焦点环真实可见度、方向键焦点顺序与读屏播报仍需浏览器确认。

待确认：请在 `/navigation` 用键盘复核 Tabs 的 Tab / ←→（left 放置为 ↑↓）/ Home / End / Enter / Space，Steps 的 Tab / Enter / Space，以及 disabled / readonly 是否不进入键盘序列；同时抽检四个 Tabs variant 与 default / dot Steps 的 focus ring。

```text
结论：有条件通过
P0-2：Tabs / Steps 的键盘入口、ARIA 语义与当前步状态已在 Glass wrapper 补齐；build 通过
未测/待确认：DEV 与浏览器键盘巡检未执行；请在 /navigation 复核方向键 / Home / End / Enter / Space、focus ring 与 disabled / readonly 边界
```
