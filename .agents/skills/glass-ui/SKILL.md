---
name: glass-ui
description: >
  当需要实现或修改 Glass 组件（Glass*）、theme token、组件实验室 Lab、
  按钮/胶囊/FAB 交互态，或 Overlay（GlassDialog Confirm Sheet /
  GlassFormPane 表单整装会话窗）时使用。覆盖 Material / Density / Tone /
  Interaction（Hover Whisper · Active Press · Focus Ring）、Nested Chrome 禁令、
  TDesign Compound Wrapper 纪律、State Matrix 验收，以及内化自 ui-ux-pro-max
  的 Glass UX 交付 / a11y checklist。典型触发：「玻璃组件」「GlassButton」
  「GlassDialog」「GlassFormPane」「Confirm Sheet」「表单整装」
  「Hover Whisper」「Active Press」「lab/actions」「lab/feedback」
  「玻璃主题」「glass kit」「按钮与行动」「Modal Scrim」「UX 交付」
  「a11y checklist」「专业度检查」「pre-delivery」。
  Lab 宿主用 docs-shell；纯视觉对照用 prototype-qa。
---

# glass-ui — Glass 语言（TDesign Theme Layer）

## Important（权威顺序）

1. **已定 `--glass-wb-*` / `--glass-*` token**（`glass-frontend/src/styles/theme.css`）— 材质 / Tone / Density / 色板
2. **Lab Living Demo + 已导出 `Glass*`** — 实现与对照面
3. **TDesign Vue Next 默认** — 行为与 a11y 底座；视觉由 Glass 覆盖

冲突时停笔问用户。禁止第二 UI 库。禁止自动 commit。禁止擅自改 `docs-nav` IA。

详表指针：
- Overlay / Nested Chrome → `references/overlay-chrome.md`
- Interaction tokens → `references/interaction-tokens.md`
- **UX / a11y 交付清单**（内化 ui-ux-pro-max，禁整包入库）→ `references/ux-delivery-checklist.md`
- Material / Density / Tone 宪章 → `.agents/tmp-glass-demo-plan.md`
- 红线 → `.agents/rules/glass-component-kit.mdc`

## 何时使用

- 新增 / 修改 `glass-frontend/src/components/glass/*`
- 调整按钮、胶囊、FAB、Toolbar 的 **hover / active / focus / disabled / loading**
- 调整 **Dialog / FormPane / Scrim / Overlay 分区节奏**
- 增强 `/system/lab/*`（尤其 `actions`、`feedback`、`form`）
- 交付前 UX / a11y / 专业度检查（读 `references/ux-delivery-checklist.md`，勿另开通用 UX skill）
- 为兄弟项目约定可发布面（本 skill 只定契约，不擅自拆包）

## 术语速查

| 术语 | 含义 |
|---|---|
| Quiet CTA | 近白微透次要行动（分享等） |
| Primary Pill | 满浓蓝圆角主行动（页头「新会话」等） |
| Affordant Orb | FAB 52 哑光行动点（StickyTool） |
| Hover Whisper | 悬停轻提亮 / 轻抬影；不大跳色 |
| Active Press | 按下轻微压入（scale 0.96–0.98 + 影收紧）；无布局抖动 |
| Focus Ring | `:focus-visible` 可见环；键盘可达 |
| State Matrix | Lab 对照 TDesign 态（theme/variant/shape/size/ghost/loading/disabled） |
| Confirm Sheet | **GlassDialog**：短确认 / 危险确认浮层 |
| Form Session Pane | **GlassFormPane**：表单整装会话窗（多段 Form）；拼写 Form 非 From |
| Floating Plate | t1 Bchat 语义：近白微透浮板材质 |
| Nested Chrome | 禁止搬进 Overlay 的整装零件（air / bph / 气泡 / bin…） |
| Pure Spacing | Overlay header/footer/section 只用 padding 分区，不用 inset hairline |
| Modal Scrim | 降浅遮罩（`--glass-wb-dialog-scrim` ≈ 0.14）；FormPane 共用 |

## Overlay 选型 SOP

1. 短确认 / `theme=danger` → **Dialog**（可用默认 quiet + primary/danger 脚钮）。  
2. 多字段创建/编辑表单 → **FormPane** + `#footer` 自备按钮；内嵌 `GlassForm` + `GlassDialogSection`。  
3. 先读 `references/overlay-chrome.md`；改 scrim / 分区节奏 / `.bchat` 材质时同步核对 Dialog 与 FormPane token。  
4. **禁止**把 t1 附图整装（扇形头 / 花瓣 / 气泡）塞进 Dialog「好看一下」。  
5. Lab：`/system/lab/feedback` 必须能看出 FormPane vs Dialog 边界。

## Tone 铁律（须遵守）

- **小物件**（Pill / 发送 / FAB / 徽章）：可满浓双蓝；**禁止白色高光核**
- **大容器**（Surface / Rail / Stage / Overlay 板 / 输入条）：同色相拉长、降对比、微透；蓝染约 5–15%
- 魔法 hex/rgba 禁止进组件；一律 token

## Interaction SOP（按钮与行动）

1. 先读 `theme.css` 现有 `--glass-wb-*`；缺态则**先加 token**再写组件 CSS。
2. Compound Wrapper 盖 `t-button`（或已有 Glass*）；透传 `disabled` / `loading` 等原生能力，勿自造第二套 DOM。
3. 为每个可点变体补齐：
   - **Hover Whisper**：`filter: brightness(≤1.06)` 或 quiet hover-bg；影可略抬
   - **Active Press**：`transform: scale(0.96–0.98)`；影收紧；`transition` 120–180ms
   - **Focus Ring**：`:focus-visible` → `--glass-wb-control-focus-ring`（或复用 field ring）
   - **Disabled**：降强调 + `cursor: not-allowed`；无 hover 抬升
   - **Loading**：透传 `t-button` loading；交互锁定
4. `@media (prefers-reduced-motion: reduce)`：禁用 scale / 位移动画，保留颜色态。
5. Icon-only 必须 `aria-label`。
6. Lab：在 `LabActionsView` 用 State Matrix 分区展示 Glass 变体 +（可选）裸 `t-button` 对照；不污染 Glass 公共 API。

## 反模式（Do Not）

- 另起第二套色板绕过 token；擅自增删 Lab 目录
- 把 Dialog 当表单整装会话窗，或把 FormPane 当危险确认托盘
- 向 Overlay 面板塞 `.air` / `.bph` / PosterWash / 气泡
- Overlay 分区用 inset hairline（应用 Pure Spacing）
- 强制 Inter / 通用「AI 紫大面积」/ 暗色玻璃教条
- 白核渐变、粉笔白实色大卡、1px 硬描边当玻璃
- 仅靠 hover、无 active / 无 focus-visible
- active 改变宽高导致周围跳动
- 引入 Element / Ant / naive 等第二 UI 库
- 在组件内散落魔法色；绕过 `components/glass/index.ts` 私自深路径复用未导出内部

## 可发布面契约（演进目标，本轮示范级）

```
glass-frontend/src/components/glass/   # 唯一可发布组件面
glass-frontend/src/components/glass/index.ts
glass-frontend/src/styles/theme.css    # token 唯一出处
```

- 未来包：`peerDependencies` = `vue` + `tdesign-vue-next` + `tdesign-icons-vue-next`
- 兄弟项目：`import { GlassButton, GlassDialog, GlassFormPane } from '…'` + 引入 theme；**本轮不拆 monorepo / 不发 npm**

## 交付前 Checklist（短版）

> 完整矩阵 / 吸收删除表 / Lab 映射 → **`references/ux-delivery-checklist.md`**（内化自 ui-ux-pro-max；风格裁决仍以已定 token + Lab 为准）。

### 视觉

- [ ] 小物件无白核；大面低对比；token 全覆盖
- [ ] Density 与宪章表一致（Pill 38 / 块 42 / Soft 32 / FAB 52）
- [ ] Overlay：Scrim 降浅口径；分区 Pure Spacing；无 Nested Chrome 偷渡
- [ ] 图标来自 `tdesign-icons-vue-next`，无 emoji 当图标；每浮层/区域一个 Primary CTA 重心

### 交互

- [ ] Hover Whisper + Active Press + Focus Ring 齐全；可点面有 `cursor: pointer`
- [ ] disabled / loading 语义正确；Press 无布局抖动
- [ ] reduced-motion 下无强制缩放动画
- [ ] 点击反馈 ≤150ms 感知；主操作不依赖 hover
- [ ] 拖拽能力另有键盘/按钮替代（触及再勾）

### a11y

- [ ] 对比度文本 ≥4.5:1（主文案）；Scrim 降浅后抽检正文对比
- [ ] icon-only 有 aria-label；装饰图标 `aria-hidden`；色不单独表意
- [ ] 表单可见 label；错误贴字段 + live/alert；多错时焦点/汇总可感知（FormPane）
- [ ] 焦点不被 sticky/FAB 永久遮挡（focus-not-obscured / FAB Safe Offset）
- [ ] Toast 不抢焦点（触及再勾）

### 工程

- [ ] `npm --prefix glass-frontend run build` 绿
- [ ] 未擅自改 `docs-nav` IA；未自动 commit；未引入第二 UI 库 / 未 vendor ui-ux-pro-max
- [ ] 对照结论：Glass → 已定 token + Lab Living — 一致 / 偏差 / 待确认
- [ ] 动 Overlay 时 Lab overlay/feedback 边界文案仍正确

## 关键路径

| 路径 | 用途 |
|---|---|
| `glass-frontend/src/components/glass/*` | Glass 组件（含 Dialog / FormPane） |
| `glass-frontend/src/styles/theme.css` | Token |
| `glass-frontend/src/views/system/lab/LabActionsView.vue` | 按钮与行动 Lab |
| `glass-frontend/src/views/system/lab/LabFeedbackView.vue` | Overlay / Alert / Popconfirm Lab |
| `references/overlay-chrome.md` | Dialog ↔ FormPane ↔ Nested Chrome |
| `references/interaction-tokens.md` | 按钮交互 token |
| `references/ux-delivery-checklist.md` | UX/a11y 完整交付清单（pro-max 内化） |
| `.agents/tmp-glass-demo-plan.md` | Material/Density/Tone 详宪章 |
| `.agents/rules/glass-component-kit.mdc` | 红线 |
| `.agents/skills/prototype-qa/` | 视觉验收；矩阵 C = 本清单抽检 |
| `.agents/skills/cursor-planner/` | Cursor 总规划：拆 Track / brief；本 skill 由 **Codex** Read，勿 Cursor 为改码全文预载 |
| `.agents/skills/codex-dispatch/` | 派 Codex（默认执行面；`codex exec` + Cursor `all`） |
| https://tdesign.tencent.com/vue-next/components/dialog | TDesign Dialog 文档 |
| https://tdesign.tencent.com/vue-next/components/button | TDesign Button 文档 |
