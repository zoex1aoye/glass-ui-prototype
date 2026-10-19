<script setup lang="ts">
/**
 * GlassAlert — 玻璃 Inline Banner / Status Alert（Compound Wrapper 盖 t-alert）
 * Tone Spectrum 四态（success / info / warning / error）+ Dismissible Quiet。
 * Status Soft Plate：Fan Tip 115deg 扇形 fill · Light Frost（.bph 级 blur16）
 * · Whisper Lift（单层柔影）。语义靠 icon + Fan Tip，无左侧色带。边界 = 材质差 + 影。
 * 色值只走 theme token；禁止 Surface 级 blur36 / Ambient+Key 双影 / air / petals。
 */
import { onMounted } from 'vue'

import { ensureFeedbackA11y } from './feedbackA11y'

type GlassAlertTheme = 'success' | 'info' | 'warning' | 'error'

withDefaults(
  defineProps<{
    theme?: GlassAlertTheme
    title?: string
    /** 单条 string，或 string[]（TDesign maxLine 按数组项折叠） */
    message?: string | string[]
    closeBtn?: boolean | string
    maxLine?: number
  }>(),
  {
    theme: 'info',
    title: undefined,
    message: undefined,
    closeBtn: true,
    maxLine: undefined,
  },
)

const emit = defineEmits<{
  close: [context: { e: MouseEvent }]
  closed: [context: { e: TransitionEvent }]
}>()

onMounted(() => {
  ensureFeedbackA11y()
})
</script>

<template>
  <t-alert
    class="glass-alert"
    :class="`glass-alert--${theme}`"
    :theme="theme"
    :title="title"
    :message="message"
    :close-btn="closeBtn"
    :max-line="maxLine"
    @close="emit('close', $event)"
    @closed="emit('closed', $event)"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.message || $slots.default" #message>
      <slot name="message">
        <slot />
      </slot>
    </template>
    <template v-if="$slots.operation" #operation>
      <slot name="operation" />
    </template>
  </t-alert>
</template>

<style scoped>
/* Compound Wrapper：语义壳盖 t-alert，:deep 覆写材质 */
.glass-alert {
  border: none;
  border-radius: var(--glass-wb-alert-radius);
  padding: var(--glass-wb-alert-padding-y) var(--glass-wb-alert-padding-x);
  -webkit-backdrop-filter: var(--glass-wb-alert-blur);
  backdrop-filter: var(--glass-wb-alert-blur);
}

/* —— Status Soft Plate 四态：Fan Tip fill + Light Frost + Whisper Lift（无左侧色带） —— */
.glass-alert--success {
  background: var(--glass-wb-alert-success-fill);
  box-shadow: var(--glass-wb-alert-shadow);
}

.glass-alert--info {
  background: var(--glass-wb-alert-info-fill);
  box-shadow: var(--glass-wb-alert-shadow);
}

.glass-alert--warning {
  background: var(--glass-wb-alert-warning-fill);
  box-shadow: var(--glass-wb-alert-shadow);
}

.glass-alert--error {
  background: var(--glass-wb-alert-error-fill);
  box-shadow: var(--glass-wb-alert-shadow);
}

/* 图标：Tone Spectrum 色相识别 */
.glass-alert--success :deep(.t-alert__icon) {
  color: var(--glass-wb-alert-success-icon);
}

.glass-alert--info :deep(.t-alert__icon) {
  color: var(--glass-wb-alert-info-icon);
}

.glass-alert--warning :deep(.t-alert__icon) {
  color: var(--glass-wb-alert-warning-icon);
}

.glass-alert--error :deep(.t-alert__icon) {
  color: var(--glass-wb-alert-error-icon);
}

.glass-alert :deep(.t-alert__title) {
  color: var(--glass-text-primary);
  font-weight: 600;
}

.glass-alert :deep(.t-alert__description) {
  color: var(--glass-text-secondary);
}

/* Operation 宿主：去掉 TD brand 字色与左右内距，让 #operation 内的 Glass text CTA 单轨接管。
   message 行仍由 TDesign 的 flex 布局承载，不改变 slot 的挂载位置。 */
.glass-alert :deep(.t-alert__operation) {
  padding: 0;
  color: inherit;
}

/* Collapse 是 TD 内置 div（无 slot）：仅做视觉契约对齐，不替换折叠行为。
   密度 / 字色 / hover wash / active 均与 GlassButton variant="text" 共用同一组 token。 */
.glass-alert :deep(.t-alert__collapse) {
  display: inline-flex;
  align-items: center;
  height: var(--glass-wb-text-cta-height);
  padding: 0 var(--glass-wb-text-cta-pad-x);
  border-radius: var(--glass-wb-text-cta-radius);
  font-size: var(--glass-wb-text-cta-font-size);
  color: var(--glass-wb-text-cta-color);
  background: transparent;
  cursor: pointer;
  transition: var(--glass-wb-control-transition);
  margin-top: var(--td-comp-margin-s);
}

.glass-alert :deep(.t-alert__collapse:hover) {
  background: var(--glass-wb-text-cta-hover-bg);
  color: var(--glass-wb-text-cta-hover-color);
}

.glass-alert :deep(.t-alert__collapse:active) {
  background: var(--glass-wb-text-cta-active-bg);
  color: var(--glass-wb-text-cta-active-color);
  transform: scale(var(--glass-wb-control-active-scale));
}

.glass-alert :deep(.t-alert__collapse:focus-visible) {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

/* Dismissible Quiet：Hover Whisper / Active Press / Focus Ring */
.glass-alert :deep(.t-alert__close) {
  color: var(--glass-text-muted);
  transition: var(--glass-wb-control-transition);
}

.glass-alert :deep(.t-alert__close:hover) {
  color: var(--glass-text-secondary);
}

.glass-alert :deep(.t-alert__close:active) {
  transform: scale(var(--glass-wb-control-active-scale));
}

.glass-alert :deep(.t-alert__close:focus-visible) {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

@media (prefers-reduced-motion: reduce) {
  .glass-alert :deep(.t-alert__close) {
    transition:
      color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .glass-alert :deep(.t-alert__close:active) {
    transform: none;
  }

  .glass-alert :deep(.t-alert__collapse) {
    transition:
      color 0.15s ease,
      background-color 0.15s ease;
  }

  .glass-alert :deep(.t-alert__collapse:active) {
    transform: none;
  }
}
</style>
