<script setup lang="ts">
/**
 * GlassFormPane — Compound Wrapper 盖 t-dialog
 *
 * 术语：
 * - Form Session Pane：表单整装会话窗（开一窗填表的 Modal 浮层），
 *   与 GlassDialog（Confirm Sheet 短确认托盘）职责分离。
 * - Floating Solid：独立 teleport 的 ContentDialog 面板材质，圆角对齐 Surface radius 体系；
 *   高遮罩近实 fill + blur none，fill/blur/radius/shadow 复用 Dialog token，
 *   仅 width 更宽（480 表单呼吸 > 420 确认）。
 * - 与 Confirm Sheet（Dialog）边界：FormPane 不提供默认 confirm/cancel 脚钮，
 *   脚钮一律由使用方通过 #footer slot 放 GlassButton；组件只包共享动作行
 *   `.glass-overlay-footer`，不注入按钮，也不覆盖使用方的 variant；
 *   取消用 quiet（默认 Pill 38），确认 primary / danger 须配合 shape="round"
 *   进入同一 Pill 密度，禁止与块级 42 确认钮并排；
 *   confirmOnEnter 保持不暴露（表单 Enter 归 Form 自身）。
 *
 * - Header-Footer Rhythm：header 底 / footer 顶仅纯间距（padding 12），
 *   无 hairline box-shadow；body 的 L3 inset tray hairline 只界定内容面。
 * - Header / Body：圆形 #icon 徽标 + 文字列；default 默认进入 L3 inset tray。
 * - 禁 Nested Chrome：禁止搬 .air / .bph / 气泡 / Composer / PosterWash 进本窗；
 *   内部分段用 GlassDialogSection（纯布局，禁双托盘）。
 *
 * 色值一律走 --glass-wb-*（面板只引用 --glass-wb-form-pane-*），禁止魔法色。
 * 面板 / 遮罩由 t-dialog teleport 至 body，故材质写在非 scoped 样式，
 * 以 .glass-form-pane 为锚，避免污染全局。
 */
import { computed, h, nextTick, onBeforeUnmount, useId, useSlots, watch } from 'vue'

import type { TdDialogProps } from 'tdesign-vue-next'

import {
  bindOverlayA11y,
  captureOverlayTrigger,
  restoreOverlayTrigger,
  type OverlayA11yBinding,
} from './overlayA11y'

type DialogWidth = TdDialogProps['width']

const props = withDefaults(
  defineProps<{
    visible?: boolean
    /** 标题（用作 t-dialog header）；自定义时改用 #header slot */
    title?: string
    /** header 槽未自定义时，在 title 下方渲染的小字副标 */
    subtitle?: string
    /** default 使用 L3 inset tray；false 时直接渲染正文 */
    bodyTray?: boolean
    /** 默认走 --glass-wb-form-pane-width（480px） */
    width?: DialogWidth
    showOverlay?: boolean
    destroyOnClose?: boolean
    /** 追加到固定 glass-form-pane 之后 */
    dialogClassName?: string
  }>(),
  {
    visible: false,
    title: undefined,
    subtitle: undefined,
    bodyTray: true,
    width: undefined,
    showOverlay: true,
    destroyOnClose: false,
    dialogClassName: '',
  },
)

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  close: [context: { trigger: string; e: MouseEvent | KeyboardEvent }]
  overlayClick: [context: { e: MouseEvent }]
}>()

const slots = useSlots()

const overlayId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const a11yClassName = `glass-overlay-${overlayId}`

/** 默认 header：徽标可选；无 #icon 时只渲染文字列。 */
const OverlayHeader = () =>
  h('div', { class: 'glass-overlay-header' }, [
    slots.icon
      ? h(
          'span',
          {
            class: 'glass-overlay-header__icon',
            'aria-hidden': 'true',
          },
          slots.icon(),
        )
      : null,
    props.title || props.subtitle
      ? h('div', { class: 'glass-overlay-header__text' }, [
          props.title
            ? h('span', { class: 'glass-overlay-header__title' }, props.title)
            : null,
          props.subtitle
            ? h('p', { class: 'glass-overlay-header__subtitle' }, props.subtitle)
            : null,
        ])
      : null,
  ])

/** 有无 header：自定义 slot 优先，其次 title/subtitle/#icon */
const hasHeader = computed(() =>
  Boolean(slots.header || slots.icon || props.title || props.subtitle),
)

/** 脚钮只用 #footer slot；无 slot 则 footer=false（不渲染任何默认 confirm/cancel） */
const hasFooterSlot = computed(() => Boolean(slots.footer))

const resolvedClass = computed(() =>
  ['glass-form-pane', a11yClassName, props.dialogClassName].filter(Boolean).join(' '),
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
        '.glass-overlay-header__title',
        '.glass-form-pane__title',
        '.t-dialog__header-content h5',
        '.t-dialog__header h5',
        '.t-dialog__header-content',
      ],
      descriptionSelectors: ['.glass-overlay-header__subtitle', '.glass-form-pane__subtitle'],
      initialFocusSelectors: [
        '[data-glass-overlay-autofocus]',
        '.t-dialog__body input:not([disabled]):not([type="hidden"]), .t-dialog__body textarea:not([disabled]), .t-dialog__body select:not([disabled]), .t-dialog__body [contenteditable="true"]',
        '.t-dialog__body a[href], .t-dialog__body button:not([disabled])',
        '.t-dialog__footer button:not([disabled])',
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

function onUpdateVisible(visible: boolean) {
  emit('update:visible', visible)
}
</script>

<template>
  <t-dialog
    :visible="visible"
    :header="hasHeader"
    :width="width"
    :footer="hasFooterSlot"
    :close-btn="true"
    :show-overlay="showOverlay"
    :destroy-on-close="destroyOnClose"
    :dialog-class-name="resolvedClass"
    placement="center"
    mode="modal"
    @update:visible="onUpdateVisible"
    @close="emit('close', $event)"
    @overlay-click="emit('overlayClick', $event)"
    @opened="onDialogOpened"
  >
    <template v-if="$slots.header" #header><slot name="header" /></template>
    <template v-else-if="hasHeader" #header><OverlayHeader /></template>
    <template #default>
      <div v-if="bodyTray !== false" class="glass-overlay-body-tray">
        <slot />
      </div>
      <slot v-else />
    </template>
    <template v-if="$slots.footer" #footer>
      <div class="glass-overlay-footer glass-form-pane__footer-actions">
        <slot name="footer" />
      </div>
    </template>
    <template v-if="$slots.closeBtn" #closeBtn><slot name="closeBtn" /></template>
  </t-dialog>
</template>

<style>
/* teleport 到 body：非 scoped，锚在 .glass-form-pane，禁止魔法色 */
.glass-form-pane.t-dialog {
  position: relative;
  isolation: isolate;
  background: var(--glass-wb-form-pane-fill);
  -webkit-backdrop-filter: var(--glass-wb-form-pane-blur);
  backdrop-filter: var(--glass-wb-form-pane-blur);
  border-radius: var(--glass-wb-form-pane-radius);
  box-shadow: var(--glass-wb-form-pane-shadow);
  border: none;
  width: min(
    var(--glass-wb-form-pane-width),
    calc(100vw - var(--glass-wb-dialog-viewport-gutter))
  );
  max-width: calc(100vw - var(--glass-wb-dialog-viewport-gutter));
}

/* Modal Scrim：降浅共用 Dialog scrim token（DOM：.t-dialog__ctx > .t-dialog__mask） */
.t-dialog__ctx:has(.glass-form-pane) > .t-dialog__mask {
  background: var(--glass-wb-form-pane-scrim);
}

/* 壳层 pad / header·body·footer 节奏见 theme.css（对齐 HTML：14 + gap 12） */
.glass-form-pane .t-dialog__header {
  font-weight: 600;
  color: var(--glass-text-primary);
}

.glass-form-pane .t-dialog__close[data-glass-overlay-close] {
  cursor: pointer;
  border-radius: 8px;
}

.glass-form-pane .t-dialog__close[data-glass-overlay-close]:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

/* 可选 subtitle：弱于 title，走 muted；header 槽自定义时不参与 */
.glass-form-pane__header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.glass-form-pane__title {
  min-width: 0;
  overflow-wrap: anywhere;
}

.glass-form-pane__subtitle {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--glass-text-muted);
}
</style>
