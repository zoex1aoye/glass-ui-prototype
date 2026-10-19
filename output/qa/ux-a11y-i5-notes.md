# Track I5 · 表单 a11y：label 关联、错误播报、首错落焦

- 日期：2026-10-19
- 来源偏差：`output/qa/ux-delivery-matrix-c-2026-10-19.md` §P1-1
- 权威口径：已定 `theme.css` token + Lab Living Demo
- 范围：`GlassForm` / `GlassInput` / 表单内必要控件语义；`/forms`、`/inputs`、`/overlay` 仅补可验收入口说明
- 边界：未改 `docs-nav`；未改 token / 色板 / Density；未修改 `node_modules`；未引入依赖；未自动 commit

## 1. 实现结论

1. 新增 `formA11y.ts`，由 `GlassForm` 在挂载后绑定，只补语义与焦点，不接管 TDesign 的校验、提交或视觉。
2. 原生 `input` / `textarea` / `select`：
   - 可见 label 自动补 `for`，控件自动补稳定 `id`；
   - 调用方已有的有效 `for` 不覆盖；
   - 多个原生字段（如范围输入）全部关联错误描述，label 指向首个主字段。
3. Checkbox group / radio group / switch / 按钮型控件：
   - label 的 `id` 写入 `aria-labelledby`；
   - radio group 补 `role="radiogroup"`；
   - switch 在 `GlassForm` 内补 `role="switch"` / `aria-checked` / `tabindex`，支持 Enter / Space，disabled / loading 不进入 Tab 序列。
4. `GlassInput` 不再把 placeholder 写成 `aria-label`：
   - 新增 `ariaLabel` / `ariaLabelledby` / `id` props，只同步到真实内芯 `input`；
   - 独立使用时由调用方显式提供名称；Form 内由可见 label 关联；
   - search 装饰图标补 `aria-hidden="true"`。
5. 错误语义：
   - 字段错误 / warning / success 文案写入控件 `aria-describedby`；
   - error 时控件 `aria-invalid="true"`，文案节点 `role="alert"` + `aria-live="assertive"` + `aria-atomic="true"`；
   - warning / success 使用 `role="status"` + `aria-live="polite"`。
6. 多错提交：
   - `GlassForm` 透传并默认启用 `scrollToFirstError="smooth"`；
   - `@submit` 校验失败后调用 `focusFirstError()`，焦点落到首个无效字段；
   - 额外暴露 `focusFirstError()`，方便调用方在自定义校验流程中主动落焦；
   - `prefers-reduced-motion` 下 `scrollToFirstError` 从 smooth 降为 auto，焦点辅助滚动也使用 instant 行为。
7. DOM 变化由 `MutationObserver` 重新同步，覆盖条件字段、错误出现 / 消失、TDesign 内部重渲染；每个 `GlassForm` 独立托管属性，卸载时只恢复本实例写入的 DOM。

## 2. Lab 可验证入口

- `/forms` A · Living：不填写直接点「提交」，应显示多项错误，焦点落到「会话标题」。
- `/forms` E · Validation Whisper：点「触发 error」，会走 submit 校验并落焦「账号」。
- `/forms` D · Choice Quiet：Tab 到 Switch 后可用 Enter / Space 切换；label 通过 `aria-labelledby` 关联。
- `/inputs` §2 / §4：独立 `GlassInput` 由显式 `aria-label` 命名；Form 内嵌例由可见 label 自动关联。
- `/overlay` · FormPane「新建演示条目」：空表单点「确认」，焦点落到「条目标题」并关联错误描述。

## 3. 验证

### 构建

```text
npm --prefix glass-frontend run build
→ exit 0
→ 4009 modules transformed
```

仅保留仓库既有 warning：

- `lab-shared.css` 非 scoped 文件中的 `:deep()` 无效伪类 warning；
- 主 chunk 大于 500 kB 的拆包提示。

### SSR 首帧抽查

使用 Vite SSR 加载真实 `GlassInput.vue` 并渲染：

| 场景 | 内芯 input |
|---|---|
| 仅 `placeholder="例如：演示条目 01"` | 只有 `placeholder`，无 `aria-label` |
| 外层 wrapper | 无 `aria-label`，placeholder 不再冒充可访问名 |

### 行为边界

- `GlassInput` 的显式 `ariaLabel` / `ariaLabelledby` / `id` 通过 `onMounted` + `nextTick` 写到真实内芯；SSR 首帧不包含这部分客户端同步属性。
- 错误节点 `role="alert"` 在 TDesign 创建节点后补写；同时保留 `aria-describedby` + `aria-invalid` 作为读屏到字段时的稳定语义。
- 未修改 `GlassComposer` / `GlassSearchCapsule` 的 placeholder 命名策略；它们不属于本轮 Form 范围，后续若纳入独立输入轨需单独处理。

## 4. 未测 / 待确认

- 本机 Vite 启动被沙箱拒绝：`listen EPERM 127.0.0.1:5173`；Computer Use 未获 Chromium / Safari 授权，因此未做真实浏览器键盘、焦点环与 DOM 巡检。
- 未运行 VoiceOver / NVDA，实际播报顺序、多条错误是否重复播报、`role="alert"` 动态补写的读屏兼容性需真机确认。
- 建议在 `/forms` 复核：空表提交后焦点是否落到首错、错误文案是否被读屏读出、Choice Quiet 的 Switch 是否可 Enter / Space 切换。
- 建议在 `/overlay` FormPane 空表确认后复核：首错落焦是否仍局限在浮层内、关闭后焦点是否回到触发按钮。

```text
结论：有条件通过
P1-1：GlassForm 已自动建立可见 label 与控件的 for/id 或 aria-labelledby 关联；GlassInput 停止用 placeholder 冒充可访问名并改为显式 aria-label / aria-labelledby；错误文案已关联 aria-describedby + aria-invalid，并按 error/warning/success 写入 alert/polite live region；多错提交默认启用 scrollToFirstError 并落焦首个无效字段；build 通过。
未测/待确认：本机端口绑定与 Computer Use 均受限，未做真实浏览器键盘 / 焦点 / VoiceOver 巡检；请在 /forms 与 /overlay FormPane 复核首错落焦、错误播报及 Switch 的 Enter / Space 行为。
```
