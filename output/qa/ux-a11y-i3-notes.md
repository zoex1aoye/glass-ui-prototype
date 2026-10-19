# Track I3 · Feedback a11y（Alert / Message / Notification）

- 日期：2026-10-19
- 范围：`GlassAlert.vue`、`GlassMessage.vue`、`GlassMessagePlugin.ts`、`GlassNotification.vue`、`GlassNotificationPlugin.ts`，新增极小 helper `feedbackA11y.ts`；Lab `/feedback` 仅补验收说明
- 权威：已定 `--glass-wb-*` / `--glass-*` token + Lab Living Demo
- 边界：未改 I1 Overlay / I2 Tabs；未改 `docs-nav`；未改 `node_modules`；未引入依赖；未 commit；未扩到 I4 live region

## 1. 实现结论

1. `feedbackA11y.ts` 只增强 Glass Feedback 根节点内的 TDesign 关闭 / 展开控件：补 `role="button"`、`tabindex="0"`、accessible name、Enter / Space 激活与 `aria-expanded` 同步。
2. Alert 关闭与展开控件、Message / Notification 关闭控件均使用原有 TDesign click 行为；helper 不接管关闭、duration、动画或展开状态。
3. 关闭钮内 SVG 统一补 `aria-hidden="true"` 与 `focusable="false"`，避免装饰图标重复进入 a11y 树。
4. 不调用 `focus()` 迁移焦点；Toast 打开后焦点仍留在触发按钮，关闭控件只进入自然 Tab 序。
5. 静态 Message 在 `closeBtn=false` 时仍会渲染空的关闭 `span`；helper 已按“确有图标 / 内容”过滤，未产生不可见 Tab 停点。
6. 仅新增 `:focus-visible` 焦点环规则，复用 `--glass-wb-control-focus-ring`；未改 Tone、材质、间距或色板。

## 2. 验证

### 构建

```text
npm --prefix glass-frontend run build
→ exit 0
→ 4008 modules transformed
```

构建仅保留既有的 `lab-shared.css` 无效 `:deep()` 警告与 chunk size 警告，本次未新增错误。

### 运行态键盘验收

使用 Playwright Chromium headless shell，对构建产物通过请求路由加载 `/feedback`，执行真实 `Tab`、`Space`、`Enter`：

| 控件 | 实测 |
|---|---|
| Alert 关闭 | Tab 可达；`role=button` / `tabindex=0` / `aria-label=关闭提示`；Enter 后 Alert 进入关闭态 |
| Alert 展开 / 收起 | Tab 可达；初始 `aria-expanded=false`，Space 后为 `true` 且名称变“收起”，Enter 后恢复 `false` / “展开更多” |
| Message 关闭（duration=0） | Tab 可达；`aria-label=关闭消息`；Space 后 Toast 从 DOM 移除 |
| Notification 关闭（duration=0） | Tab 可达；`aria-label=关闭通知`；Enter 后 Toast 从 DOM 移除 |
| 不抢焦点 | 打开常驻 Message 后焦点仍在触发按钮，未自动进入 Toast |
| 装饰 SVG | 上述关闭 / 展开控件内 SVG 均为 `aria-hidden=true` |
| Focus Ring | 键盘聚焦时四项控件均为 `rgba(47, 107, 246, 0.28) 0 0 0 2px` |
| 空关闭控件 | 非 closable 静态 Message 中带 `tabindex` 的空关闭控件数量为 0 |

渲染截图检查 `/feedback` 页面结构与 Tone 未出现可见回归；本轮未另做像素级基线对比。

## 3. 固定结论块

```text
结论：通过
P0-3：Alert 关闭与展开/收起、Message / Notification 关闭均可 Tab 聚焦并用 Enter / Space 触发；accessible name、装饰 SVG aria-hidden、focus-visible 焦点环与“不抢焦点”均已验证；静态空关闭控件未产生额外 Tab 停点。
未测/待确认：同视口像素级视觉基线对比未单独重跑；本次只新增 focus-visible 样式，未改视觉 Tone。live region / 动态播报按范围留给 I4。
```
