# Glass UX 交付清单（内化自 ui-ux-pro-max）

> **来源**：本机 `Downloads/ui-ux-pro-max-skill-2.15.0`（目录 2.15.0；包内 `skill.json` 仍标 2.13.0）。  
> **再同步日**：2026-10-18（对照 `.claude/skills/ui-ux-pro-max/references/quick-reference.md` + `pro-rules.md`）。  
> **策略**：**改写内化**，禁止把整包 / 搜索脚本 / 79 styles / brand·landing·slides 栈复制进仓。  
> **权威覆盖**：本清单的「风格 / 色板 / 字体 / 玻璃教条」一律让位于  
> `theme.css` 已定 `--glass-wb-*` / `--glass-*` + Lab Living。  
> **产品语境**：桌面 Glass 组件库 + DocsShell Lab（Vue 3 · TDesign Vue Next），非移动 App、非营销落地页。

对照关系：

| 层 | 文件 |
|---|---|
| 实现 SOP + 短 checklist | `../SKILL.md`「交付前 Checklist」 |
| 本文件 | 完整交付矩阵 + 吸收/删除表 + 与 Lab 对照 |
| 视觉/结构验收 | `../../prototype-qa/SKILL.md`（矩阵 B / C） |
| 红线 | `.agents/rules/glass-component-kit.mdc` |

---

## 0. 吸收 / 删除（再同步时先扫这张表）

| 吸收（改写成 Glass 口径） | 删除 / 禁止照搬 |
|---|---|
| a11y：contrast、focus-visible、icon-only name、decorative `aria-hidden`、keyboard tab 序、focus-not-obscured、dragging-alternative、color-not-only、reduced-motion、aria-live 错误/Toast、heading-hierarchy | `--design-system` 搜索脚本与 79 styles；强制 Inter / 通用字体配对；brand / logo / slides / banner / CIP |
| Interaction：press ≤150ms、`cursor-pointer`（Web）、loading disable、hover 非唯一手段、active 不改布局 bounds | 「glassmorphism dark / purple / 白边 1px」审美教条 |
| Compact UI：chip/badge 语义截断、集合先换行再 `+n` 可操作披露、长 token `overflow-wrap` | React/Next/Flutter/SwiftUI 专项；落地页 Hero 模式 |
| Forms：可见 label、错误贴字段、submit loading→结果、危险确认、未保存 dismiss | 原生安全区 / iOS 44pt 作**硬门槛**（本仓桌面；见 §2 软约束） |
| Anti-pattern：emoji-as-icon、魔法 hex、布局抖动 press、placeholder-only label | 暗色主题对等验收（无 dark 主题前标 N/A）；认证/密码管理器项（本仓无登录流 → N/A） |
| Vue / Web：语义控件、勿 `div` 冒充按钮（TDesign Compound Wrapper） | 把 `pro-rules.md` 整表当桌面硬门禁 |

**冲突裁决口令**：pro-max 说「该用玻璃白边 / 紫渐变 / 通用 SaaS 蓝 / `--design-system`」→ **忽略**，回已定 token + Lab。

---

## 1. 现状锚点（2026-10 对照）

- 可发布面：`glass-frontend/src/components/glass/*` + `index.ts`
- Token：`glass-frontend/src/styles/theme.css`（`--glass-wb-control-*` · `--glass-wb-dialog-scrim` 等）
- Lab 宿主：DocsShell + 扁平路由（`/` · `/layout` · `/poster` · `/actions` · `/inputs` · `/forms` · `/overlay` · `/feedback` · `/data` · `/navigation`）
- Lab 目录以 `docs-nav.ts` 为准；**不是**随意增删许可

---

## 2. 优先级（Glass 改编 · 对标 pro-max 1→10）

| P | 类别 | 本仓 Must | 本仓 Avoid / 改写 |
|---|---|---|---|
| 1 | Accessibility | 正文对比 ≥4.5:1；`:focus-visible` 走 token ring；icon-only 可访问名；装饰图标 `aria-hidden`；Tab≈视觉序；focus-not-obscured（FAB/sticky/Scrim）；拖拽另有指针/键盘替代；表单错误 `aria-live` / role=alert；Toast 不抢焦点 | 去掉 ring；仅色示错；用外部分案覆盖 token |
| 2 | Interaction | Hover Whisper + Active Press + Focus Ring；可点元素 `cursor: pointer`；loading 锁交互；反馈 ≤150ms；reduced-motion 关 scale | 仅靠 hover；active 改宽高；自造第二套 loading DOM |
| 3 | Performance（轻） | 长列表注意 CLS；复用 Skeleton/Loading；禁无故布局读写下动画 | 每轮强制虚拟列表 / 拆包 |
| 4 | Style | Glass Tone（小物件满浓、大面微透）；图标 `tdesign-icons-vue-next`；有意义图标非文字对比 ≥3:1 | emoji 图标；紫大面积 / 白核 |
| 5 | Layout | Density 跟 token；Overlay Pure Spacing；Behind Surface inset + Rail\|Stage gap=0 | 中间 gutter 冒充露玻璃；Surface padding=0 铺满 |
| 6 | Type & Color | 语义色走 token；禁魔法 hex；chip/badge 语义截断可感知；长 URL/ID 可 wrap | 组件内散落 hex；集合硬裁切无 `+n` 披露 |
| 7 | Animation | transform/opacity；token transition；exit ≤ enter；自动轮播须 pause（触及再勾） | 动 width/height；无限装饰动画 |
| 8 | Forms & Feedback | FormPane 可见 label / 错误贴字段；Dialog 危险确认；Message/Notification 不抢焦点 | placeholder 当唯一 label；Toast 顶替字段错误 |
| 9 | Navigation | Lab 目录冻结于 `docs-nav.ts`；不泄漏示范壳业务菜单 | 擅自增删 Lab 项；套用 mobile bottom-nav≤5 |
| 10 | Charts & Data | Table/Statistic/Empty：色不唯一表意；空态有下一步 | 仅靠色区分状态 |

**触控尺寸（软）**：桌面指针目标优先 Density；icon-only / FAB 可点区建议 ≥24×24 CSS px（WCAG 2.2 指针目标），FAB 视觉 52。勿把 iOS 44pt 写成失败硬门槛。

---

## 3. 交付前 Checklist（Glass 唯一完整版）

实现收口或用户要「专业度 / a11y / 交付检查」时勾选。标 **N/A** 须写原因。

### 3.1 过程

- [ ] 本轮范围已对照 **已定 token + Lab Living**
- [ ] 未运行 / 未引入 ui-ux-pro-max `--design-system` 覆盖本仓色板
- [ ] `prefers-reduced-motion: reduce` 下抽检：无强制 scale/位移，颜色态仍在
- [ ] 无 dark 主题任务 → Light/Dark 对等项标 N/A
- [ ] 无登录 / 认证流 → accessible-authentication 标 N/A

### 3.2 视觉（Glass）

- [ ] 小物件无白核；大面低对比微透；蓝染约 5–15%（大容器）
- [ ] Density 与 token / 宪章一致
- [ ] Overlay：Scrim = `--glass-wb-dialog-scrim`；分区 Pure Spacing；无 Nested Chrome
- [ ] 图标同源（TDesign Icons），无 emoji 当结构图标；有意义图标对比够用
- [ ] 无组件内魔法 hex/rgba；阴影/blur/radius 走 token
- [ ] 每屏 / 每浮层 **一个** Primary CTA 视觉重心（其余 Quiet）
- [ ] Badge / Chip / 标签：语义清晰；截断可感知；集合优先换行，溢出用可操作 `+n`（触及再勾）

### 3.3 交互

- [ ] 可点控件：Hover Whisper + Active Press + Focus Ring
- [ ] 可点表面有 `cursor: pointer`（含自定义 div/role=button）
- [ ] Press 不改变布局 bounds
- [ ] `disabled` / `loading` 语义正确且不可点
- [ ] 异步提交：loading → 成功/失败反馈
- [ ] 不依赖 hover 才能完成主操作（键盘可走完）
- [ ] 作者控制的拖拽（如 Table 行拖）另有键盘 / 按钮等价操作（触及再勾）

### 3.4 a11y

- [ ] 主文案对比 ≥4.5:1；状态色不单独表意
- [ ] icon-only 有 accessible name；装饰图标不进 a11y 树；适用时暴露 selected/pressed/expanded
- [ ] 表单：可见 label；错误在字段旁 + 读屏可感知（`aria-live` / alert）
- [ ] 多错误提交后：汇总或焦点落到首个无效字段（FormPane）
- [ ] 焦点不被 FAB / sticky / 降浅 Scrim 永久遮挡（focus-not-obscured）
- [ ] Overlay 可 Esc / 取消离开；未保存风险时确认（FormPane）
- [ ] Toast / Soft Notice 不抢焦点；用礼貌 live region 告知（触及再勾）
- [ ] 长 token（URL / ID）可折行，不撑破布局（触及再勾）

### 3.5 工程

- [ ] `npm --prefix glass-frontend run build` 绿
- [ ] 未擅自改 `docs-nav` IA；未自动 commit；未引入第二 UI 库
- [ ] 新交互在对应 Lab 页可演示
- [ ] 对照结论已输出：一致 / 偏差 / 待确认（Glass→token + Lab）

---

## 4. 反模式速查（pro-max ∩ 本仓飞轮）

| 反模式 | 正确做法 |
|---|---|
| 用 pro-max glassmorphism「白边 + 炫彩底」改主题 | 跟 token：近白微透、无硬描边当玻璃、小物件满浓蓝 |
| 强制 Inter / 换字体栈「更专业」 | 保持工程既有字体；不另开 font pairing 任务 |
| emoji 导航 / 设置图标 | `tdesign-icons-vue-next` |
| `outline: none` 且无替代 ring | `--glass-wb-control-focus-ring` |
| 可点区域无 `cursor: pointer` | 自定义可点节点补 pointer |
| active `padding`/`height` 变化 | `transform: scale` + 影收紧 |
| Dialog 塞长表单 | **GlassFormPane** |
| FormPane 当删确认 | **GlassDialog** `theme=danger` |
| 外部分案色板覆盖 Lab | 已定 token + Lab 裁决 |
| 复制 ui-ux-pro-max 进 `.agents/skills/` | 只维护本文件 + SKILL 短清单 |

---

## 5. 与 Lab / 组件面的抽检映射

| Checklist 块 | 优先打开 |
|---|---|
| 交互 / State Matrix | `/actions` |
| Overlay / Scrim / 确认 | `/overlay` · `/feedback` |
| 表单 label / 校验 | `/forms` · `/inputs` |
| Tone / 容器材质 / 四层栈 | `/layout` |
| 海报技法 / 小物件↔大容器 | `/poster` |
| 数据 / Table 拖拽替代 | `/data` |
| 导航 Tabs / Steps | `/navigation` |

---

## 6. 再同步操作说明（包升级时）

1. 打开新版 `references/pro-rules.md` + `quick-reference.md` §1–§3（CRITICAL + HIGH）。  
2. 只把**新增**且本仓尚未覆盖的条目改写入本文件 §0 / §2 / §3。  
3. 继续遵守 §0 删除表；**不要** vendor 脚本、`styles.csv` 或 `--design-system`。  
4. 同步改：`glass-ui/SKILL.md` 短清单、`prototype-qa` 矩阵 C、`glass-component-kit.mdc`（若有新硬约束）。  
5. 更新本文件顶部「来源 / 再同步日」。
