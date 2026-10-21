<script setup lang="ts">
/**
 * GlassDialog — Compound Wrapper 盖 t-dialog
 *
 * 术语：
 * - Modal Scrim：遮罩降对比，不抢托盘材质
 * - Floating Solid：独立 teleport 的对话框面板，圆角对齐 Surface radius 体系
 * - WinUI ContentDialog Material：高遮罩近实 fill + blur none；
 *   Light 复用 L3 standalone 近白容器，Dark 用同源深冷实板，均不靠 backdrop-filter 透背后；
 *   历史曾对齐 t1 .bchat，当前材质权威改为 ContentDialog；
 * - Floating Shadow (Dialog)：单层 Whisper Lift；浮层体量由 Modal Scrim 承载，不加 Ambient；
 * - 禁区：禁用整装背景技法（PosterWash / hero-air / petals / 多重 radial bloom）
 * - 消费边界（兄弟项目）：Dialog = Confirm Sheet（短确认 / 危险确认），
 *   对齐对象是 ContentDialog Floating Solid 材质，不是 t1 整装会话窗；
 *   禁止期望 Dialog 提供扇形头（.bph）/ 花瓣 air / 聊天气泡 / Composer 输入；
 *   整装会话窗（头 + 气泡 + 输入）见 Composer / Workbench 原语，不在 Dialog；
 *   映射与红线见方案 §1（.agents/tmp-glass-dialog-t1-session-align-plan.md）。
 * - Header-Footer Rhythm：纯间距分区，无 hairline；
 *   用 12px 垂直留白建立分区节奏，不额外抬 lift 影
 * - Destructive vs Neutral Confirm：theme=danger 走红系 token；default 走 Primary Quiet（品牌蓝）
 *
 * 脚钮对齐「按钮与行动」：默认 footer 自制 GlassButton
 * （Neutral 确认 primary / Destructive 确认 danger / 取消 quiet），
 * Hover Whisper · Active Press · Focus Ring 与 Actions Lab 一致；
 * 动作行统一走 theme 层 `.glass-overlay-footer` 与 `--glass-wb-dialog-footer-*`；
 * 默认与 #footer 自定义槽均在组件层包共享动作行。confirmBtn / cancelBtn 仍原样透传，
 * 使用方自管其按钮配置。
 *
 * Dialog × Form 组合协议：
 * - Submit-via-Form Protocol：Dialog confirm 钮 click → formRef.submit() →
 *   onSubmit({validateResult}) → validateResult === true 才 setVisible(false)。
 * - Async Confirm Loading：formRef.submit() 触发异步 validate 期间，透传
 *   confirmLoading=true 锁住 Dialog（遮罩点击 / Esc 关闭的处理交给 Dialog 默认 props，
 *   不额外盖）；validate resolve 后同步切回 false。
 *   默认 footer 现在会自动把 confirmLoading 回灌到内置 GlassButton 的
 *   loading / disabled，故 4.4 一类异步确认场景不写自定义 #footer 也能锁住确认钮。
 * - Enter 协议禁区：confirmOnEnter 默认 false——Dialog × Form 组合里若开 true 会与
 *   Form 内 Input 原生 Enter 触发 submit 产生双触发（先 Form submit 后 Dialog confirm，
 *   或反之，视 DOM 冒泡），本组件默认收口为安全值，使用方按需显式开启需自行处理冲突。
 *
 * - 例外项（不随历史 t1 .bchat 走）：radius 走 --glass-wb-card-radius 库契约（18）；
 *   padding 交 TD t-dialog shell 32 节奏（vs bchat 10×12）；均为自觉选择，不是遗漏。
 * 色值一律走 --glass-wb-*，禁止魔法色。面板 / 遮罩由 t-dialog teleport 至 body，
 * 故材质写在非 scoped 样式并以 .glass-dialog 为锚，避免污染全局。
 */
import { computed, h, nextTick, onBeforeUnmount, useId, useSlots, watch } from 'vue'

import type { TdDialogProps } from 'tdesign-vue-next'

import GlassButton from './GlassButton.vue'
import {
  bindOverlayA11y,
  captureOverlayTrigger,
  restoreOverlayTrigger,
  type OverlayA11yBinding,
} from './overlayA11y'

type DialogTheme = TdDialogProps['theme']
type DialogPlacement = TdDialogProps['placement']
type DialogHeader = TdDialogProps['header']
type DialogFooter = TdDialogProps['footer']
type DialogConfirmBtn = TdDialogProps['confirmBtn']
type DialogCancelBtn = TdDialogProps['cancelBtn']
type DialogCloseBtn = TdDialogProps['closeBtn']
type DialogConfirmLoading = TdDialogProps['confirmLoading']
type DialogConfirmOnEnter = TdDialogProps['confirmOnEnter']
type DialogBody = TdDialogProps['body']
type DialogWidth = TdDialogProps['width']

const props = withDefaults(
  defineProps<{
    visible?: boolean
    header?: DialogHeader
    /** header 槽未自定义时，在 title 下方渲染的小字副标 */
    subtitle?: string
    body?: DialogBody
    /** Neutral=default（确认 primary）；Destructive=danger（确认 danger） */
    theme?: DialogTheme
    /** Confirm Sheet 默认居中 */
    placement?: DialogPlacement
    width?: DialogWidth
    confirmBtn?: DialogConfirmBtn
    cancelBtn?: DialogCancelBtn
    footer?: DialogFooter
    closeBtn?: DialogCloseBtn
    confirmLoading?: DialogConfirmLoading
    confirmOnEnter?: DialogConfirmOnEnter
    destroyOnClose?: boolean
    showOverlay?: boolean
    /** 追加到固定 glass-dialog 之后 */
    dialogClassName?: string
  }>(),
  {
    visible: false,
    header: undefined,
    subtitle: undefined,
    body: undefined,
    theme: 'default',
    placement: 'center',
    width: undefined,
    confirmBtn: undefined,
    cancelBtn: undefined,
    footer: undefined,
    closeBtn: undefined,
    confirmLoading: undefined,
    confirmOnEnter: false,
    destroyOnClose: false,
    showOverlay: true,
    dialogClassName: '',
  },
)

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  confirm: [context: { e: MouseEvent | KeyboardEvent }]
  cancel: [context: { e: MouseEvent }]
  close: [context: { trigger: string; e: MouseEvent | KeyboardEvent }]
  overlayClick: [context: { e: MouseEvent }]
}>()

const slots = useSlots()

const overlayId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const a11yClassName = `glass-overlay-${overlayId}`

/** header 槽未自定义且 subtitle 有值时，用内置 header 渲染 title + subtitle */
const hasSubtitleHeader = computed(() => Boolean(props.subtitle && !slots.header))

const SubtitleHeader = () => {
  const header = props.header
  const title = typeof header === 'function' ? header(h) : header
  return h('div', { class: 'glass-dialog__header' }, [
    h('span', { class: 'glass-dialog__title' }, [title]),
    h('p', { class: 'glass-dialog__subtitle' }, props.subtitle),
  ])
}

const resolvedClass = computed(() =>
  ['glass-dialog', a11yClassName, props.dialogClassName].filter(Boolean).join(' '),
)

let overlayTrigger: HTMLElement | null = null
let overlayBinding: OverlayA11yBinding | null = null
let overlayOpen = false
let overlaySyncToken = 0

async function syncOverlayA11y(visible: boolean) {
  const token = ++overlaySyncToken

  if (visible) {
    await nextTick()
    if (token !== overlaySyncToken || !props.visible) return

    const panel = document.querySelector<HTMLElement>(`.${a11yClassName}`)
    if (!panel) return

    overlayBinding?.destroy()
    overlayBinding = bindOverlayA11y({
      panel,
      idSeed: a11yClassName,
      titleSelectors: [
        '.glass-dialog__title',
        '.t-dialog__header-content h5',
        '.t-dialog__header h5',
        '.t-dialog__header-content',
      ],
      descriptionSelectors: ['.glass-dialog__subtitle'],
      initialFocusSelectors: [
        '[data-glass-overlay-autofocus]',
        '.t-dialog__body input:not([disabled]):not([type="hidden"]), .t-dialog__body textarea:not([disabled]), .t-dialog__body select:not([disabled]), .t-dialog__body [contenteditable="true"]',
        '[data-glass-overlay-initial-focus]',
        '.t-dialog__cancel',
        '.t-dialog__body a[href], .t-dialog__body button:not([disabled])',
        '.t-dialog__close',
      ],
    })
    overlayBinding.focusInitial()
    return
  }

  overlayBinding?.destroy()
  overlayBinding = null

  await nextTick()
  if (token !== overlaySyncToken) return
  restoreOverlayTrigger(overlayTrigger)
  overlayTrigger = null
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      if (!overlayOpen) overlayTrigger = captureOverlayTrigger()
      overlayOpen = true
    } else {
      overlayOpen = false
    }
    void syncOverlayA11y(visible)
  },
  { immediate: true, flush: 'sync' },
)

function onDialogOpened() {
  if (props.visible) overlayBinding?.ensureFocusInside()
}

onBeforeUnmount(() => {
  overlayBinding?.destroy()
  overlayBinding = null
  restoreOverlayTrigger(overlayTrigger)
  overlayTrigger = null
})

/**
 * 默认脚钮自制：无用户 footer 槽 / footer TNode / confirmBtn / cancelBtn 时启用。
 * 自定义任一项则整段透传底层，避免双皮强盖。
 */
const useGlassFooter = computed(() => {
  if (slots.footer) return false
  if (props.footer !== undefined && props.footer !== true) return false
  if (props.confirmBtn !== undefined || props.cancelBtn !== undefined) return false
  return true
})

/** Neutral → primary；Destructive（theme=danger）→ danger */
const confirmVariant = computed(() => (props.theme === 'danger' ? 'danger' : 'primary'))

function onUpdateVisible(v: boolean) {
  emit('update:visible', v)
}

function onGlassConfirm(e: MouseEvent) {
  emit('confirm', { e })
}

function onGlassCancel(e: MouseEvent) {
  emit('cancel', { e })
}
</script>

<template>
  <t-dialog
    :visible="visible"
    :header="header"
    :body="body"
    :theme="theme"
    :placement="placement"
    :width="width"
    :confirm-btn="confirmBtn"
    :cancel-btn="cancelBtn"
    :footer="footer"
    :close-btn="closeBtn"
    :confirm-loading="confirmLoading"
    :confirm-on-enter="confirmOnEnter"
    :destroy-on-close="destroyOnClose"
    :show-overlay="showOverlay"
    :dialog-class-name="resolvedClass"
    mode="modal"
    @update:visible="onUpdateVisible"
    @confirm="emit('confirm', $event)"
    @cancel="emit('cancel', $event)"
    @close="emit('close', $event)"
    @overlay-click="emit('overlayClick', $event)"
    @opened="onDialogOpened"
  >
    <template v-if="$slots.header" #header><slot name="header" /></template>
    <template v-else-if="hasSubtitleHeader" #header><SubtitleHeader /></template>
    <template v-if="$slots.default" #default><slot /></template>
    <template v-if="$slots.body" #body><slot name="body" /></template>
    <!-- 默认脚钮：真 GlassButton（quiet 取消 + primary/danger 确认） -->
    <template v-if="useGlassFooter" #footer>
      <div class="glass-overlay-footer glass-dialog__footer-actions">
        <GlassButton
          variant="quiet"
          :disabled="confirmLoading"
          data-glass-overlay-initial-focus
          @click="onGlassCancel"
        >
          取消
        </GlassButton>
        <GlassButton
          :variant="confirmVariant"
          shape="round"
          :loading="confirmLoading"
          @click="onGlassConfirm"
        >
          确认
        </GlassButton>
      </div>
    </template>
    <template v-else-if="$slots.footer" #footer>
      <div class="glass-overlay-footer glass-dialog__footer-actions">
        <slot name="footer" />
      </div>
    </template>
    <template v-if="$slots.closeBtn" #closeBtn><slot name="closeBtn" /></template>
  </t-dialog>
</template>

<style>
/* teleport 到 body：非 scoped，锚在 .glass-dialog，禁止魔法色 */
.glass-dialog.t-dialog {
  position: relative;
  isolation: isolate;
  background: var(--glass-wb-dialog-fill);
  -webkit-backdrop-filter: var(--glass-wb-dialog-blur);
  backdrop-filter: var(--glass-wb-dialog-blur);
  border-radius: var(--glass-wb-dialog-radius);
  box-shadow: var(--glass-wb-dialog-shadow);
  border: none;
  width: var(--glass-wb-dialog-width);
}

/* Modal Scrim：低对比，不抢 Confirm Sheet 材质
   DOM：.t-dialog__ctx > .t-dialog__mask + .t-dialog__wrap > .glass-dialog */
.t-dialog__ctx:has(.glass-dialog) > .t-dialog__mask {
  background: var(--glass-wb-dialog-scrim);
}

/* 内 padding 交给 TD：壳层 .t-dialog--default 32px + body/footer 垂直节奏，禁止分区水平 padding 叠算 */
.glass-dialog .t-dialog__header {
  font-weight: 600;
  color: var(--glass-text-primary);
  padding-bottom: 12px;
}

/* 可选 subtitle：弱于 title，走 muted；header 槽自定义时不参与 */
.glass-dialog__header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.glass-dialog__title {
  min-width: 0;
  overflow-wrap: anywhere;
}

.glass-dialog__subtitle {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--glass-text-muted);
}

.glass-dialog .t-dialog__body {
  color: var(--glass-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.glass-dialog .t-dialog__footer {
  padding-top: var(--glass-wb-dialog-footer-padding-top);
}

/* Quiet Chrome：关闭钮克制 */
.glass-dialog .t-dialog__close {
  color: var(--glass-text-muted);
  border-radius: 8px;
}

.glass-dialog .t-dialog__close[data-glass-overlay-close] {
  cursor: pointer;
}

.glass-dialog .t-dialog__close[data-glass-overlay-close]:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

.glass-dialog .t-dialog__close:hover {
  background: var(--glass-wb-icon-hover-bg);
  color: var(--glass-text-secondary);
}
</style>
