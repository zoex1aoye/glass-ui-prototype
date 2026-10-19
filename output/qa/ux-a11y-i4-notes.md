# Track I4 · 动态反馈 live region（Toast / Notice / Lab 最近交互）

- 日期：2026-10-19
- 范围：`GlassMessage.vue`、`GlassMessagePlugin.ts`、`GlassNotification.vue`、`GlassNotificationPlugin.ts`、`feedbackA11y.ts`、`LabPageShell.vue`
- 权威：已定 `--glass-wb-*` / `--glass-*` token + Lab Living Demo
- 边界：未改 `docs-nav`；未改 I1 Overlay / I2 Tabs；未改 `node_modules`；未引入依赖；未自动 commit

## 1. 实现结论

1. `feedbackA11y.ts` 新增 `getFeedbackLiveRegionAttrs(theme)`：非错误级返回 `role="status"` + `aria-live="polite"`，错误级返回 `role="alert"` + `aria-live="assertive"`；两者均带 `aria-atomic="true"`。
2. 声明式 `GlassMessage` / `GlassNotification` 在首帧把 live region 属性传给 TDesign 根节点，避免内容插入后才补语义。
3. 命令式 `GlassMessagePlugin` / `GlassNotificationPlugin` 在合并 options 时同步写入 live region，保留调用方 `className` 与既有插件 API。
4. `LabPageShell` 的「最近交互」改为 `role="status"` + `aria-live="polite"` + `aria-atomic="true"`；文案槽位与页面结构未改。
5. 未调用 `focus()`，Toast / Notice 根节点不增加 `tabindex`；I3 的关闭控件语义与 Enter / Space 激活逻辑未改动。

## 2. 验证

### 构建

```text
npm --prefix glass-frontend run build
→ exit 0
→ 4008 modules transformed
```

仅保留既有的 `lab-shared.css` 无效 `:deep()` 警告与 chunk size 警告，本次未新增错误。

### SSR 根节点语义

使用 Vite SSR 加载真实组件并渲染：

| 组件 | 实测根节点 |
|---|---|
| `GlassMessage` info | `role="status" aria-live="polite" aria-atomic="true"` |
| `GlassMessage` error | `role="alert" aria-live="assertive" aria-atomic="true"` |
| `GlassNotification` info | `role="status" aria-live="polite" aria-atomic="true"` |
| `GlassNotification` error | `role="alert" aria-live="assertive" aria-atomic="true"` |
| `LabPageShell` live | `<p class="lab-live" role="status" aria-live="polite" aria-atomic="true">` |

以上 5 项全部通过，根节点均无 `tabindex`。

### 插件 options

用 mock TDesign 插件入口捕获真实 wrapper 传给 `MessagePlugin` / `NotificationPlugin` 的 options：

| 场景 | 实测 |
|---|---|
| `GlassMessagePlugin.info` | `status` / `polite` / `aria-atomic=true`，`className=glass-message` |
| `GlassMessagePlugin.error` | `alert` / `assertive` / `aria-atomic=true`，保留调用方 class |
| `GlassNotificationPlugin.info` | `status` / `polite` / `aria-atomic=true`，保留 theme class |
| `GlassNotificationPlugin.error` | `alert` / `assertive` / `aria-atomic=true`，保留 theme class |

4/4 通过。

### 行为边界

- 源码检索确认本次涉及文件无 `.focus(` 调用。
- live region 只加在反馈根节点；I3 的 `.t-message__close` / Alert 展开控件同步逻辑未改。
- 未改导航数据源；未在组件内新增颜色、间距或动画规则。

## 3. 固定结论块

```text
结论：有条件通过
P1-4：GlassMessage / GlassNotification 声明式根节点与两个命令式插件均已写入 live region；非错误级使用 status + polite，错误级使用 alert + assertive，并统一 aria-atomic=true；Lab「最近交互」已改为礼貌 live region；未增加 focus 调用或 Tab 停点，I3 关闭控件逻辑未改。
未测/待确认：真读屏器（VoiceOver / NVDA）播报顺序与实际停顿未测；本机沙箱阻止 Playwright Chromium 启动（Mach port rendezvous permission denied），故浏览器级点击 / 焦点 / I3 键盘联动未重跑。`/feedback` 同时存在 Lab 最近交互与 Toast/Notice 两个 live region，是否产生重复播报需真机确认；实验室首屏静态 error 示例在部分读屏器上可能被当作 alert 播报。
```
