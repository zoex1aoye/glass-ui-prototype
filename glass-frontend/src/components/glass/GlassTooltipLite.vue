<script setup lang="ts">
/**
 * GlassTooltipLite — TDesign TooltipLite 契约的 Glass 薄封装
 *
 * TDesign 1.20.10 的 helper 元数据已声明 TooltipLite，但运行时尚未导出
 * TooltipLite 组件；此处复用同一套 TDesign Popup 内核，并挂 t-tooltip-lite +
 * glass-tooltip-lite 锚类，保持 Lite 的六个公开 props 与未来原生实现可迁移。
 *
 * 材质复用 --glass-wb-tooltip-*：default 跟随 Glass scheme，light 为显式 frost。
 */
import { computed } from 'vue'

import type { TdPopupProps } from 'tdesign-vue-next'

type GlassTooltipLiteTheme = 'light' | 'default'

const props = withDefaults(
  defineProps<{
    content?: TdPopupProps['content']
    placement?: 'top' | 'bottom'
    showArrow?: boolean
    showShadow?: boolean
    theme?: GlassTooltipLiteTheme
    triggerElement?: TdPopupProps['triggerElement']
  }>(),
  {
    content: undefined,
    placement: 'top',
    showArrow: true,
    showShadow: true,
    theme: 'default',
    triggerElement: undefined,
  },
)

const popupBind = computed<TdPopupProps>(() => ({
  content: props.content,
  placement: props.placement,
  showArrow: props.showArrow,
  triggerElement: props.triggerElement,
  overlayClassName: [
    't-tooltip-lite',
    `t-tooltip-lite--${props.theme}`,
    'glass-tooltip-lite',
    `glass-tooltip-lite--${props.theme}`,
  ],
  overlayInnerClassName: [
    'glass-tooltip-lite__content',
    props.showShadow ? undefined : 'glass-tooltip-lite__content--no-shadow',
  ],
}))
</script>

<template>
  <t-popup v-bind="popupBind">
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
    <slot />
  </t-popup>
</template>

<style>
/* TDesign 1.20.10 无 TooltipLite 运行时；沿用 Popup DOM，并保留原生 Lite 根类契约。
   DOM：.t-popup.t-tooltip-lite.glass-tooltip-lite--{theme}
        > .t-popup__content.glass-tooltip-lite__content
        > .t-popup__arrow */
.glass-tooltip-lite > .t-popup__content {
  padding: var(--glass-wb-tooltip-pad);
  border: none;
  border-radius: var(--glass-wb-tooltip-radius);
  background: var(--glass-wb-tooltip-fill);
  -webkit-backdrop-filter: var(--glass-wb-tooltip-blur);
  backdrop-filter: var(--glass-wb-tooltip-blur);
  box-shadow: var(--glass-wb-tooltip-shadow);
  color: var(--glass-wb-tooltip-color);
  font-size: var(--glass-wb-tooltip-font-size);
  line-height: var(--glass-wb-tooltip-line-height);
}

.glass-tooltip-lite--light > .t-popup__content {
  background: var(--glass-wb-tooltip-light-fill);
  -webkit-backdrop-filter: var(--glass-wb-tooltip-light-blur);
  backdrop-filter: var(--glass-wb-tooltip-light-blur);
  box-shadow: var(--glass-wb-tooltip-light-shadow);
  color: var(--glass-wb-tooltip-light-color);
}

.glass-tooltip-lite > .glass-tooltip-lite__content--no-shadow {
  box-shadow: none;
}

.glass-tooltip-lite > .t-popup__content > .t-popup__arrow {
  background: transparent;
}

.glass-tooltip-lite > .t-popup__content > .t-popup__arrow::before {
  background: var(--glass-wb-tooltip-arrow-fill);
  box-shadow: none;
}

.glass-tooltip-lite--light > .t-popup__content > .t-popup__arrow::before {
  background: var(--glass-wb-tooltip-light-arrow-fill);
  box-shadow: none;
}
</style>
