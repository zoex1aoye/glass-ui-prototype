/**
 * Glass Compound Wrapper 统一出口 — 四层栈分组导出（Glass Container 4layer plan）。
 *
 * 术语锚点见 `.agents/tmp-glass-container-4layer-plan.md`：
 * L0 Poster Wash · L1 Host Tray · L2 Region/PageHeader · L3 Focus Panel。
 * 其它锚点：Inset Reveal / Flush Stitch / Floating Plate / Nested Chrome / Frost Glass。
 *
 * 禁双托盘：Surface 外不再包 Host Tray；tray 表不再套 tray；
 * Panel 内禁止再放 Surface；Stage 内嵌板吃 Stage blur，不得再抬 lift 影 / 二次 blur。
 * 材质统一消费 theme.css 的 :root workbench token，无运行时方案切换。
 */

// ── L0 Page / Poster Wash ──────────────────────────────────────────────────
// 页底海报灰白：简化近似走 --glass-layer-l0-*；整装权威场见 GlassPosterWash + --glass-poster-*
// fit 仅 cover（光栅 center cover）；禁止 contain / safe 选项
// token: --glass-layer-l0-fill / --glass-layer-l0-wash / --glass-layer-l0-air
// 壳层接线：background: var(--glass-layer-l0-air), var(--glass-layer-l0-wash)
export { default as GlassPosterWash } from './GlassPosterWash.vue'

// ── L1 Host Tray / Behind Surface · Material Stack 托盘 ────────────────────
// html: `.surface` · `.big`(+`.air`+`.pane`) · `.t1 .big`
export { default as GlassSurface } from './GlassSurface.vue'

// ── L2 Region / PageHeader · 分区壳 / 页头条 ───────────────────────────────
// html: `.hero-top` · `.bph`（扇形 / 缎带条）
export { default as GlassPageHeader } from './GlassPageHeader.vue'

// ── L3 Focus Panel · 焦点面（非 Flush 多容器场景） ────────────────────────
// html: `.chat` / `.bchat` / `.bsurf` / soft card；inset=嵌套 · standalone=橱窗
export { default as GlassPanel } from './GlassPanel.vue'

// ── Soft Cite Card · 会话流引用软卡（html `.card-soft`）──────────────────
// 原生玻璃壳 + 默认 slot；不包 t-card，非 Host Tray / Panel，不占 L1–L3 层语义。
export { default as GlassCard } from './GlassCard.vue'

// ── Conversation Content · 会话内容态（html `.bub-u` / `.bub-a` / `.bar`）──
// GlassBubble = 会话消息气泡（role: user | assistant）；不替代 GlassPanel variant="standalone" 的密信息阅读面。
// GlassProgress = Quiet Progress Whisper（盖 t-progress line；label 可自动百分比或 `.bar-cap` 文案）。
export { default as GlassBubble } from './GlassBubble.vue'
export { default as GlassProgress } from './GlassProgress.vue'

// ── Comment / Quote · 会话流评论与引用槽（盖 t-comment）──────────────────
// Quiet 排版；quote 区可嵌 GlassCard；不占 L1–L3 层语义。
export { default as GlassComment } from './GlassComment.vue'

// ── Avatar / AvatarGroup · 头像与头像组（盖 t-avatar / t-avatar-group）────
// 小物件：medium 40 对齐 Comment；round 12 / circle 50%；Group 折叠面与单体同源。
export { default as GlassAvatar } from './GlassAvatar.vue'
export { default as GlassAvatarGroup } from './GlassAvatarGroup.vue'

// ── L3 Flush 变体 · Rail | Stage（工作台双栏 gap=0，非第五层） ─────────────
// html: `.rail` · `.chat` / `.bchat`
export { default as GlassRail } from './GlassRail.vue'
export { default as GlassStage } from './GlassStage.vue'

// ── Composer Shell（L3 内控件壳） ──────────────────────────────────────────
// html: `.inrow` / `.input` · `.bin`
export { default as GlassComposer } from './GlassComposer.vue'

// ── Table tray | inset（tray≈L1 特例 · inset≈L3 Nested Chrome） ───────────
// html: tray=`.big` 语义复用；inset=Stage 内嵌（禁双托盘）
// variant="tray"（默认）→ t1 Host Tray：Lab 独立橱窗 / 无 Stage 宿主
// variant="inset"      → Stage Nested Chrome：吃 Stage blur、无 lift 影
export { default as GlassTable } from './GlassTable.vue'
export { moveTableRow } from './tableRowMove'
export type {
  GlassTableRowMoveContext,
  GlassTableRowMoveDirection,
} from './tableRowMove'

// ── Descriptions · 描述列表（盖 t-descriptions） ───────────────────────────
// GlassDescriptions = Compound Wrapper 盖 t-descriptions（host-first；阅读焦点三档
//   label=secondary / content=primary / secondary 内容=muted；bordered 为
//   Tone Grid + soft hairline（底 wash + 偶数行底色差 + label 淡染 + 柔和 1px 网格），
//   content 透明吃宿主，不自带实心底卡；hairline 只作用于组件网格，不补容器外轮廓）
// 推荐宿主：GlassPanel variant="standalone"（Focus Panel L3；页内 / 浮层内通用）；
//   Descriptions 透明吃宿主，不再套第二块托盘。Don't：挂进 GlassStage——Stage 是
//   html `.chat` 会话画布，不扛密 KV。GlassCard 不适用：它是会话流 Soft Cite 引用
//   软卡，不是 KV 详情阅读面；FormPane 仅用于填表会话，不作只读详情宿主。
// GlassDescriptionsItem = TD DescriptionsItem 的干净再导出：TD Descriptions 靠
//   slot 子节点 type.name 以 "TDescriptionsItem" 结尾识别条目，薄包装会破坏该识别，
//   故与 GlassTabPanel / GlassStepItem 同纪律，不建薄 SFC 包装。
export { default as GlassDescriptions } from './GlassDescriptions.vue'
export { DescriptionsItem as GlassDescriptionsItem } from 'tdesign-vue-next'

// ── Empty · 空态（盖 t-empty；Quiet 空态，无蓝染满铺） ─────────────────────
// 组件透明底、非托盘；Lab 橱窗宿主可 Surface → Panel(standalone) 展示真实消费路径。
export { default as GlassEmpty } from './GlassEmpty.vue'

// ── List · 通用 Quiet 列表（盖 t-list / t-list-item / t-list-item-meta） ─────
// GlassList = Compound Wrapper 盖 t-list（组件透明底；Lab 橱窗宿主可 Surface → Panel(standalone)）
// GlassListItem 盖 t-list-item（li 根，不得包 div）；GlassListItemMeta 盖 t-list-item-meta
export { default as GlassList } from './GlassList.vue'
export { default as GlassListItem } from './GlassListItem.vue'
export { default as GlassListItemMeta } from './GlassListItemMeta.vue'

// ── Navigation / Tabs（导航切换控件 · Quiet Ink / Soft Segment / Capsule / Soft Card） ─
// GlassTabs = Compound Wrapper 盖 t-tabs（variant: line|soft|card|capsule，视觉在 theme.css）
// GlassTabPanel = TD TabPanel 的干净再导出：TD Tabs 靠 slot 子节点 type.name === "TTabPanel"
//   识别面板，薄包装会破坏该识别，故直接 re-export 而非自建第二层 wrapper。
export { default as GlassTabs } from './GlassTabs.vue'
export { TabPanel as GlassTabPanel } from 'tdesign-vue-next'

// ── Navigation / Menu + Breadcrumb（WinUI / Content-on-Mica 导航） ─────────
// GlassMenu = Compound Wrapper 盖 t-menu（variant: rail|panel；tone: ice|lilac）。
// TD Menu 子件主要通过 provide/inject 协作，Submenu 仍读取父链 type.name；
// 故 MenuItem / Submenu / MenuGroup 均直接 re-export，避免薄 SFC 破坏父链判断。
export { default as GlassMenu } from './GlassMenu.vue'
export {
  MenuGroup as GlassMenuGroup,
  MenuItem as GlassMenuItem,
  Submenu as GlassSubmenu,
} from 'tdesign-vue-next'
// GlassBreadcrumb = Compound Wrapper 盖 t-breadcrumb（Quiet ancestor/current 层级）。
// TD Breadcrumb 靠 slot 子节点 type.name.endsWith("TBreadcrumbItem") 识别条目；
// GlassBreadcrumbItem 必须直接 re-export，不能包薄 SFC。
export { default as GlassBreadcrumb } from './GlassBreadcrumb.vue'
export { BreadcrumbItem as GlassBreadcrumbItem } from 'tdesign-vue-next'

// ── Flow / Picker（流程指示 · 日期与时间字段） ─────────────────────────────
// GlassSteps = Compound Wrapper 盖 t-steps（variant: default|dot，视觉在 theme.css）
// GlassStepItem = TD StepItem 的干净再导出（与 TabPanel 同纪律，不建薄 SFC 包装）
// GlassDatePicker / GlassTimePicker = Quiet Field Chrome 触发器 + Floating Plate 面板
export { default as GlassSteps } from './GlassSteps.vue'
export { StepItem as GlassStepItem } from 'tdesign-vue-next'
export { default as GlassDatePicker } from './GlassDatePicker.vue'
export { default as GlassTimePicker } from './GlassTimePicker.vue'
// GlassDateRangePicker / GlassTimeRangePicker = Range Compound Wrapper（Quiet Field + Kill range-input）
export { default as GlassDateRangePicker } from './GlassDateRangePicker.vue'
export { default as GlassTimeRangePicker } from './GlassTimeRangePicker.vue'
// GlassCalendar = Compound Wrapper 盖 t-calendar（theme: full|card，视觉在 theme.css）
export { default as GlassCalendar } from './GlassCalendar.vue'

// ── Disclosure / Collapse（折叠轨 · Borderless Glass Rail / Quiet Header） ──
// GlassCollapse = Compound Wrapper 盖 t-collapse（borderless 优先，视觉在 theme.css）
// GlassCollapsePanel = Compound Wrapper 盖 t-collapse-panel（玻璃微透 header + Quiet 分隔）
// TD Collapse 靠 provide/inject 而非子节点 type.name 识别面板，薄包装不破坏其契约。
export { default as GlassCollapse } from './GlassCollapse.vue'
export { default as GlassCollapsePanel } from './GlassCollapsePanel.vue'

// ── Controls / Capsules（小物件：不占层，可满浓支付宝蓝；禁白核） ──────────
export { default as GlassButton } from './GlassButton.vue'
export { default as GlassInput } from './GlassInput.vue'
export { default as GlassSelect } from './GlassSelect.vue'
export { default as GlassDropdown } from './GlassDropdown.vue'
export { default as GlassSearchCapsule } from './GlassSearchCapsule.vue'
export { default as GlassSuggestChip } from './GlassSuggestChip.vue'
export { default as GlassBadge } from './GlassBadge.vue'
export { default as GlassToolbarActions } from './GlassToolbarActions.vue'
export { default as GlassStickyTool } from './GlassStickyTool.vue'
// Radio：Compound Wrapper 盖 t-radio / t-radio-group（variant: default|rounded|capsule，视觉在 theme.css）
export { default as GlassRadio } from './GlassRadio.vue'
export { default as GlassRadioGroup } from './GlassRadioGroup.vue'

// ── Feedback / Overlay ─────────────────────────────────────────────────────
export { default as GlassAlert } from './GlassAlert.vue'
export { default as GlassMessage } from './GlassMessage.vue'
export { GlassMessagePlugin } from './GlassMessagePlugin'
export { default as GlassNotification } from './GlassNotification.vue'
export { GlassNotificationPlugin } from './GlassNotificationPlugin'
export { default as GlassForm } from './GlassForm.vue'
export { default as GlassDialog } from './GlassDialog.vue'
// 表单整装会话窗 · Floating Plate（与 Dialog 的 Confirm Sheet 边界分离）
export { default as GlassFormPane } from './GlassFormPane.vue'
// Dialog 内分段原语 · 禁双托盘
export { default as GlassDialogSection } from './GlassDialogSection.vue'
export { default as GlassPopconfirm } from './GlassPopconfirm.vue'
export { default as GlassTooltip } from './GlassTooltip.vue'
export { default as GlassTooltipLite } from './GlassTooltipLite.vue'

// ── Loading · Sound Wave（盖 t-loading；三条竖向音浪 / 错峰伸缩 / 轻 mask） ──
// 组件透明底、非托盘；Lab 橱窗宿主可 Surface → Panel(standalone) 展示真实消费路径。
export { default as GlassLoading } from './GlassLoading.vue'

// ── Skeleton · 骨架屏（盖 t-skeleton；微透 · 叠压染色） ──────────────────
// 组件透明底、非托盘；Lab 橱窗宿主可 Surface → Panel(standalone) 展示真实消费路径。
export { default as GlassSkeleton } from './GlassSkeleton.vue'

// ── Statistic · 统计数字（盖 t-statistic；Quiet 数字气质 / tone 五态） ──────
// 组件非托盘、透明底；Lab 橱窗宿主可 Surface → Panel(standalone)。tone 走本仓 prop，禁透传 TD color。
export { default as GlassStatistic } from './GlassStatistic.vue'

