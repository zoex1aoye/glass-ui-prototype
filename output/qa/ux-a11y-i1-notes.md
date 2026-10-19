# Track I1 · Overlay a11y 落地说明

- 日期：2026-10-19
- 来源偏差：`output/qa/ux-delivery-matrix-c-2026-10-19.md` §P0-1
- 权威口径：已定 `theme.css` token + Lab Living + `overlay-chrome.md`
- 范围：`GlassDialog` / `GlassFormPane` 及二者共用的小型 a11y helper；`/overlay` 仅补验收入口说明

## 1. 改动摘要

- 新增 `overlayA11y.ts`：只补偿 TDesign `t-dialog` 缺失的面板语义、关闭控件键盘能力与焦点约束，不接管开关、Esc、遮罩点击或视觉。
- `GlassDialog` / `GlassFormPane` 打开后定位 teleport 面板并补：
  - `role="dialog"` + `aria-modal="true"`；
  - `aria-labelledby` 指向可见标题节点；有 `subtitle` 时用 `aria-describedby` 关联可见描述；
  - 默认关闭 `span` 补 `role="button"` / `tabindex="0"` / `aria-label="关闭"`，支持 Enter / Space，装饰 SVG `aria-hidden`；
  - 打开后按「消费方指定 → 首字段 → 安全取消钮 → 主内容动作 → 关闭钮」落焦；
  - Tab / Shift+Tab 在面板内循环；
  - 关闭后焦点回到打开前的触发器（若仍连接在 DOM）。
- 未使用 `inert`：本轮采用最小侵入的 `aria-modal` + 面板内焦点循环；遮罩仍由 TDesign 的 modal 行为承担。
- 未改 Scrim、面板材质、Pure Spacing、footer 密度或 Dialog / FormPane 选型；未引入依赖、未修改 `node_modules`、未改 `docs-nav`。
- 本轮不拆 I1b：语义、关闭键盘化、打开落焦、完整 Tab 循环与关闭回焦均已落地；仅背景 `inert` 未做，若读屏仍需限制背景游走再单拆 I1b。

## 2. Lab 可验证入口

`/overlay` §0 新增「键盘与读屏验收（I1）」说明；现有示例可直接验证：

- 「打开信息确认」→ 焦点落到「取消」，可 Tab 到「确认」并循环；
- 「新建演示条目」→ 焦点落到「条目标题」首字段；
- 两种浮层均可用 Esc、右上角「关闭」或「取消」退出，关闭后焦点回到各自触发按钮；
- Neutral Dialog 与 FormPane 补了 `subtitle`，用于核对 `aria-describedby`。

## 3. 验证

- `npm --prefix glass-frontend run build`：通过，exit 0，4006 modules transformed。
- 仅保留仓库既有 warning：
  - `lab-shared.css` 非 scoped 文件中的 `:deep()` 无效伪类 warning；
  - 主 chunk 大于 500 kB 的拆包提示。
- 本轮未自启 Vite；DEV `127.0.0.1:5173` 当时不可达，未做真实键盘 / 读屏浏览器巡检，也未截图冒充渲染验收。

## 4. 对照结论

一致：Scrim 仍走 `--glass-wb-dialog-scrim` / FormPane 共用 token；分区仍为 Pure Spacing；无 Nested Chrome；Confirm vs FormPane 选型不变；新增 focus ring 走既有 `--glass-wb-control-focus-ring`。

偏差：静态实现未发现新增视觉偏差；真实焦点环可见度、关闭后回焦与读屏播报需浏览器确认。

待确认：请在 `/overlay` 用键盘复验 Tab / Shift+Tab 循环、Esc、关闭钮 Enter / Space、回焦；若读屏仍能游走背景，可另拆 I1b 评估背景 `inert`。

```text
结论：有条件通过
P0-1：ARIA 模态语义、标题/描述关联、打开落焦、面板内 Tab 循环、关闭钮键盘操作、关闭回焦均已在 Glass wrapper 补齐；build 通过
未测/待确认：未做真实浏览器键盘与读屏巡检；请在 /overlay 复核焦点环可见度、Esc / 关闭 / 回焦与背景读屏行为
```
