# Track V · Glass 组件 UX/a11y 交付抽检（矩阵 C）

- 日期：2026-10-19
- 基线提交：`80ff3f4`
- 验收范围：`/actions`、`/overlay`、`/feedback`、`/forms`、`/inputs`、`/layout`、`/data`、`/navigation`，以 `/poster` 补查材质与层级几何
- 执行依据：仓内 `.agents/skills/glass-ui/references/ux-delivery-checklist.md` §3、§5，以及 `.agents/skills/prototype-qa/SKILL.md` 矩阵 C / B
- 来源对照：`~/Downloads/ui-ux-pro-max-skill-2.15.0` 的 `quick-reference.md` §1–§3 与 `pro-rules.md` 仅用于确认“已内化项是否漏项”
- 未运行 `--design-system`；未复制外部分案；未采用白边玻璃、紫渐变、Inter 或外部色板

## 1. 范围与方法

1. 先以 `theme.css` 的 `--glass-wb-*` / `--glass-*` 与 Lab Living Demo 锁定视觉权威，再以仓内清单逐项核对。
2. 静态审查 Lab 页面、Glass Compound Wrapper 与当前安装的 TDesign Vue Next 1.20.10 渲染代码，核对实际生成元素的标签、键盘事件、ARIA、焦点与 token。
3. 对对比度和焦点环做 WCAG 线性化计算；对可点元素做 `role` / `tabindex` / `@keydown` / `cursor` 静态抽查。
4. 执行 `npm --prefix glass-frontend run build`，确认工程可构建。

### 运行态限制

指定 DEV `http://127.0.0.1:5173` 在本次验收环境不可达（`curl` exit 7）。本机 Computer Use 的 Chromium / Safari 未获授权，Playwright Chromium 启动亦被系统 MachPort 权限拒绝；按任务约束未自启 Vite。

因此：

- 本轮**没有**可用同视口 1:1 截图或真实键盘焦点巡检截图，不把静态检查冒充渲染验收。
- `通过` 仅表示“源码 / token / 构建产物层面的指定要求已满足”，不表示已完成浏览器视觉签收。
- 需要真实焦点、遮挡、窄宽溢出或对比度取色的项目，统一标为 `未测`。
- 本轮未新建截图；`output/qa/` 内既有历史截图不作为本轮渲染证据。

### 状态与分级

- 状态只用 `通过` / `偏差` / `未测` / `不适用`。
- P0：核心结构、语义或操作缺失，或外部方案覆盖库权威；必须先修复。
- P1：明显 a11y / 交互 / 视觉偏差；应修复或由用户明确裁决。
- P2：细节近似、示例完整性或工程卫生问题；允许带标注放过。

## 2. 分路由抽检

| 路由 | 抽检块 | 状态 | 结论与证据 |
|---|---|---|---|
| `/actions` | 按钮 State Matrix、FAB、Dropdown、icon-only | 通过 | `GlassButton` 有 hover/active/focus-visible；`disabled/loading` 锁定；icon-only 示例有 `aria-label`；FAB 52 与 focus ring 均走 token。未做真实键盘巡检，故只算静态通过。 |
| `/overlay` | Dialog / FormPane / Scrim / 危险确认 | 偏差 | Scrim、Pure Spacing、无 Nested Chrome、危险确认选型均正确；但模态语义、焦点约束与错误落焦不完整，见 P0-1、P1-1。 |
| `/feedback` | Alert / Message / Notification / Loading | 偏差 | Tone 与材质 token 一致，loading 有 reduced-motion 分支；关闭、展开控件是 click-only `div/span`，动态反馈也没有 live region，见 P0-3、P1-4。 |
| `/forms` | 可见 label、校验、density、readonly | 偏差 | 可见 label、字段旁提示、危险确认与 FormPane 分工正确；label 未程序化关联，错误无 live/alert 且不落焦，见 P1-1。 |
| `/inputs` | Field、Search、Calendar、Picker | 偏差 | Quiet Field Chrome、focus-within、disabled 与 reduced-motion 基本齐全；表单内名称仍受 P1-1 影响，搜索装饰图标缺 `aria-hidden`，见 P2-2。 |
| `/layout` | Tone / 四层栈 / Behind Surface / Flush | 通过 | `GlassSurface` 使用 16px inset pad，`__body` 为 `gap: 0`；`GlassRail` 与 `GlassStage` 只保留外角 radius，贴缝边为 0；未见双托盘或 gutter 冒充露边。 |
| `/data` | Table、Badge、AvatarGroup、Empty、Progress | 偏差 | 状态同时有文字，不单靠颜色；Badge `maxCount` 与 AvatarGroup 折叠能力存在；但拖拽排序无键盘/按钮替代，部分空态无下一步，见 P1-3、P2-1。 |
| `/navigation` | Tabs / Steps | 偏差 | 视觉 token、hover/active 与 reduced-motion 已写；底层 `div` 点击项没有键盘入口、tab 语义或 selected 状态，见 P0-2。 |
| `/poster` | 小物件↔大容器、材质 | 通过 | 图标、color swatch 与装饰层多已 `aria-hidden`；材质使用既定 token，未见 pro-max 色板覆盖。真实观感仍需同视口截图复核。 |

## 3. Checklist 勾选表

### 3.1 过程

| 项 | 状态 | 证据 / 说明 |
|---|---|---|
| 本轮范围对照已定 token + Lab Living | 通过 | 已按路由核对 token 与组件消费路径。 |
| 未运行 / 未引入 `--design-system` | 通过 | 全程只读外部参考，未执行搜索脚本或生成外部设计系统。 |
| `prefers-reduced-motion` 抽检 | 通过 | `GlassButton`、`GlassStickyTool`、Tabs、Steps、Skeleton、Loading 等均有 reduce 分支；实际媒体模拟未测。 |
| Light / Dark 对等 | 不适用 | 当前仓库没有 dark 主题入口或该轮任务。 |
| accessible authentication | 不适用 | 本仓无登录、注册或认证流。 |

### 3.2 视觉（Glass）

| 项 | 状态 | 证据 / 说明 |
|---|---|---|
| 小物件无白核；大面低对比微透 | 通过 | Button / FAB / Surface / Rail / Stage 均消费既定 token；未发现组件内自造白核。 |
| Density 与 token / 宪章一致 | 通过 | Field 38、Pill 38、Primary 块级 42、FAB 52 均由 token / 组件规则收口。 |
| Overlay Scrim 与 Pure Spacing | 通过 | Dialog / FormPane 共用 scrim token；`GlassDialogSection` divider 仅 12px padding，无 hairline。 |
| 图标同源，无 emoji 结构图标 | 通过 | 发布面使用 `tdesign-icons-vue-next`；Lab / Glass 目录未检出 emoji 结构图标。 |
| 无组件内魔法 hex / rgba | 通过 | 可发布 Glass 组件外观均走 token；Lab 的 `#ffa300` 仅作为明确标注的品牌锚 Swatch 展示，不外溢到组件。 |
| 每屏 / 每浮层一个 Primary CTA | 不适用 | 以 `/actions` 为首的 Lab 页是组件全集展厅，不是单一业务任务屏；各 Overlay 示例本身保持单一确认主钮。 |
| Badge / Chip / +N 截断可感知 | 未测 | 源码存在 `maxCount` 与 AvatarGroup 折叠能力，但未在窄宽、长 label、真实 +N 浮层下渲染确认。 |

### 3.3 交互

| 项 | 状态 | 证据 / 说明 |
|---|---|---|
| Hover Whisper + Active Press + Focus Ring 齐 | 偏差 | Button / FAB / Input 通过；Tabs / Steps 只有样式 ring，底层元素不可聚焦，见 P0-2。 |
| 可点表面 `cursor: pointer` | 通过 | TDesign Button 基础样式与 Lab `role=button` 区块均有 pointer；禁用态为 `not-allowed`。 |
| Press 不改变布局 bounds | 通过 | 使用 translate / scale / shadow，不改宽高与 padding。 |
| `disabled` / `loading` 语义及锁定 | 通过 | `GlassButton`、`GlassStickyTool` 有 locked 分支，异步 Dialog 也锁定取消与确认。 |
| 异步提交 loading → 成功/失败反馈 | 通过 | `/overlay` 异步 Dialog 有 2s loading、屏蔽取消/Esc 的示例与回写。 |
| 主操作不依赖 hover | 偏差 | 普通按钮可键盘操作；Tabs / Steps / Alert 展开与若干关闭控件不可键盘操作，见 P0-2、P0-3。 |
| 作者控制拖拽有键盘 / 按钮替代 | 偏差 | `/data` S12 仅提供 `drag-sort="row"`，没有上移/下移按钮或键盘重排，见 P1-3。 |

### 3.4 a11y

| 项 | 状态 | 证据 / 说明 |
|---|---|---|
| 主文案与关键状态对比 ≥4.5:1 | 偏差 | muted、success 与 form error token 未达标，见 P1-2。 |
| icon-only 有 accessible name | 偏差 | 主要 Action icon-only 已有名称；Alert / Message / Notification 的关闭 icon、Alert 展开控件没有 role / name / 键盘入口，见 P0-3。 |
| 装饰图标不进 a11y 树 | 偏差 | 多处已 `aria-hidden`；`GlassInput` / `GlassSearchCapsule` 的搜索装饰图标没有 `aria-hidden`，见 P2-2。 |
| 表单可见 label | 偏差 | 29 处以上 `t-form-item` 都有可见 label，但 Lab 中 `for` 数量为 0；`GlassInput` 又把 placeholder 当 `aria-label`，见 P1-1。 |
| 错误贴字段且读屏可感知 | 偏差 | 错误视觉上贴字段；底层错误 `div` 无 `aria-live` / `role=alert`，控件也无 `aria-invalid` / `aria-describedby`，见 P1-1。 |
| 多错误提交后汇总或聚焦首错 | 偏差 | `GlassForm` 未暴露 `scrollToFirstError`，Lab 只把 `firstError` 写入普通文本 `lab-live`，不移动焦点，见 P1-1、P1-4。 |
| 焦点不被 FAB / sticky / Scrim 永久遮挡 | 未测 | 需要真实键盘 Tab、窄视口与滚动位置巡检。 |
| Overlay Esc / 取消离开 | 通过 | TDesign 安装版保留 Esc 全局监听；Dialog 提供取消；FormPane 有显式 footer 取消。模态焦点约束仍失败，见 P0-1。 |
| 未保存风险时确认 | 未测 | 本轮未验证用户输入后的 X / Esc / 遮罩关闭；同时缺少统一的 dirty-guard 演示。 |
| Toast / Soft Notice 不抢焦点且礼貌播报 | 偏差 | 未发现主动 focus 调用，但源码与 TDesign Message / Notification 安装版均无 `aria-live` / `role=status`，见 P1-4。 |
| 长 URL / ID 可折行 | 未测 | Dialog / FormPane 标题有 `overflow-wrap:anywhere`；表格、Descriptions 长 token 尚未在真实窄列渲染验证。 |

### 3.5 工程

| 项 | 状态 | 证据 / 说明 |
|---|---|---|
| `npm --prefix glass-frontend run build` 绿 | 通过 | exit 0，4005 modules transformed，dist 生成成功。存在无效 `:deep()` 的构建警告，见 P2-3。 |
| 未改 `docs-nav` IA、未引入第二 UI 库、未 commit | 通过 | 本 Track 只新增本 QA 文档；工作树产品代码无改动。 |
| 新交互在对应 Lab 页可演示 | 通过 | 所查交互均有对应路由与 Living Demo。 |
| 已输出一致 / 偏差 / 待确认 | 通过 | 即本文件。 |

## 4. 偏差清单

### P0-1 · Dialog / FormPane 缺少可访问模态语义与焦点约束

**证据**

- `glass-frontend/src/components/glass/GlassDialog.vue:168-180` 与 `GlassFormPane.vue:78-92` 直接委托 `t-dialog mode="modal"`，包装层没有补充 `role="dialog"`、`aria-modal`、标题关联或 `aria-describedby`。
- 当前安装的 `glass-frontend/node_modules/tdesign-vue-next/es/dialog/dialog.mjs:311-340` 最终渲染普通 `div.t-dialog__ctx`；同文件仅见 Esc 监听（`178-214`），没有 Tab 焦点循环、背景 `inert` 或打开后焦点迁移。
- 默认关闭钮在 `dialog-card.mjs:190-198` 是带 `onClick` 的 `span`，没有 `role`、`tabindex`、键盘事件或 accessible name。
- 全仓 `rg "aria-modal|role=.*dialog"` 在 `glass-frontend/src` 无命中。

**影响**

读屏无法可靠识别“模态对话框”及其标题，Tab 可离开浮层落到遮罩后的页面，关闭钮本身也不能由键盘操作。Confirm Sheet 与表单整装窗都受影响。

### P0-2 · Tabs / Steps 是点击 `div`，键盘无法切换

**证据**

- `glass-frontend/node_modules/tdesign-vue-next/es/tabs/tab-nav-item.mjs:95-118` 的每个 tab 是 `createVNode("div", { onClick })`，没有 `tabindex`、`role="tab"`、`aria-selected` 或键盘处理。
- `glass-frontend/node_modules/tdesign-vue-next/es/steps/step-item.mjs:99-115` 的可点击步骤同样只是 `div` + `onClick`。
- `glass-frontend/src/styles/theme.css:1508-1517` 与 `:2152-2155` 写有 `:focus-visible` ring，但目标元素本身不可聚焦，因此该 ring 实际不能由 Tab 触发。

**影响**

键盘用户无法切换 Tabs，也无法通过 Enter / Space 进入其他步骤；读屏也拿不到 tab / selected 语义。该问题直接命中 `/navigation` 的矩阵 C 范围。

### P0-3 · Feedback 的关闭、展开控件不可键盘操作

**证据**

- Alert 关闭：`tdesign-vue-next/es/alert/alert.mjs:88-91` 为 `div` + `onClick`。
- Alert 展开/收起：同文件 `127-132` 为 `div` + `onClick`。
- Message 关闭：`tdesign-vue-next/es/_chunks/dep-e636b09b.mjs:234-239` 为 `span` + `onClick`。
- Notification 关闭：`tdesign-vue-next/es/notification/notification.mjs:94-99` 为 `span` + `onClick`。
- 以上元素均无 `role`、`tabindex`、keydown 与 accessible name；Glass wrapper 只追加视觉样式。

**影响**

可关闭 Alert、常驻 Message / Notice 及长 Alert 展开动作不能仅靠键盘完成。视觉上的 focus ring 也不能弥补不可聚焦结构。

### P1-1 · 表单 label 关联、可访问名称与错误播报不完整

**证据**

- Lab 中共检出 30 个带 label 的 `t-form-item`，`for=` 为 0。示例：`LabFormView.vue:360-380`、`LabOverlayView.vue:542-566`。
- 当前 TDesign `form-item.mjs:114-119` 的 label `for` 直接取 `props.for || null`；未传则不会自动关联。
- `GlassInput.vue:54-60` 将 placeholder 直接用作 `aria-label`，于是可见 label“会话标题”与实际可访问名称“例如：演示条目 01”不一致；空 placeholder 时还可能没有名称。
- 当前 TDesign `form-item.mjs:472-488` 把错误渲染到普通 `div`；仓内与安装版均未检出 `aria-live`、`role=alert`、`aria-invalid` 或 `aria-describedby`。
- `GlassForm.vue` 未透传 TDesign 的 `scrollToFirstError`；Lab 校验失败处理器只写 `lastAction`。

**影响**

读屏用户难以知道字段名称，错误出现时不一定会播报，提交多个错误后也没有焦点或错误汇总引导。

### P1-2 · 关键文字与 focus ring 对比不足

按 WCAG 相对亮度计算：

| 元素 | 前景 / 背景 | 对比度 | 要求 |
|---|---:|---:|---:|
| muted 文案 / Empty description / Lab meta | `#94a3b8` / `#ffffff` | 2.56:1 | 4.5:1 |
| 在线 Badge 文字 | `#18b458` / `#e7f8ef` | 2.47:1 | 4.5:1 |
| success tone / 文案 | `#18b458` / `#ffffff` | 2.72:1 | 4.5:1 |
| 表单 error 提示 | `#d94a4a` / `#ffffff` | 4.18:1 | 4.5:1 |
| focus ring（28% 合成） | `#2f6bf6 @ 0.28` / 白底 | 1.46:1 | 非文本 UI 3:1 |

**影响**

次要正文、空态说明、成功状态数字、在线状态文字与错误提示存在可读性风险；focus ring 虽存在，但视觉识别弱于 WCAG 2.2 焦点指示要求。

### P1-3 · Table 行拖拽没有键盘或按钮替代

**证据**

- `LabDataView.vue:1395-1400` 仅设置 `drag-sort="row"`。
- `GlassTable.vue:143-147`、`:332-338` 只透传 TDesign SortableJS 配置，未提供“上移 / 下移 / 移到指定位置”的键盘或按钮等价操作。

**影响**

触屏、键盘与读屏用户无法完成同一重排任务；这是矩阵 C“作者控制拖拽需替代路径”的直接偏差。

### P1-4 · 动态状态与 Toast / Notice 没有 live region

**证据**

- `glass-frontend/src` 全目录未检出 `aria-live`、`role=status` 或 `role=alert`。
- `LabPageShell.vue:16-18` 的“最近交互”只是普通 `p`。
- TDesign Message / Notification 的当前安装版渲染代码未给列表或消息项增加 live region。

**影响**

表单提交结果、异步状态、Toast 和 Soft Notice 是否成功，视觉用户能看到，读屏用户可能完全无感知。

### P2-1 · 部分 Empty 类型没有下一步操作

`LabDataView.vue:1853-1867` 的 E1–E5 仅展示标题与说明，E6/E7 才提供 action。作为类型矩阵可理解，但若作为业务空态模板直接复用，用户缺少恢复或重试入口。

### P2-2 · 搜索装饰图标未显式隐藏

`GlassInput.vue:64-66` 与 `GlassSearchCapsule.vue:81-84` 的 `SearchIcon` 没有 `aria-hidden="true"`。图标语义可能冗余，建议在 DOM 巡检后确认是否进入 a11y 树。

### P2-3 · 构建警告来自全局 CSS 中无效的 `:deep()`

`glass-frontend/src/views/system/lab/lab-shared.css:189-268` 含 8 处 `:deep()`，但该文件是非 scoped 全局 CSS。构建成功，但 Lightning CSS 报 “`deep` is not a recognized pseudo-class”，对应 Lab rail 规则当前没有使用点，属于死样式与工程卫生问题。

## 5. 结论

```text
结论：不通过
P0：Dialog/FormPane 缺可访问模态语义与焦点约束；Tabs/Steps 为 click-only div 无键盘/tab 语义；Alert/Message/Notification 的关闭与 Alert 展开不可键盘操作
P1：表单 label 未关联且错误无 live/alert/首错落焦；muted/success/form-error 文字与 focus ring 对比不足；Table 拖拽无键盘或按钮替代；动态状态与 Toast/Notice 无 live region
未测/待确认：真实同视口截图、Tab/Shift+Tab 焦点循环与遮挡、Esc/遮罩关闭的脏数据确认、窄宽长 token 折行、Badge/+N 截断；指定 5173 在验收环境不可达
```

本轮与外部分案冲突时已按 token+Lab 裁决。
