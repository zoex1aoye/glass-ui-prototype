<script setup lang="ts">
/**
 * GlassTooltip — Compound Wrapper 盖 t-tooltip
 *
 * 触发元素走 default slot；文本 / TNode 走 TDesign content 或 #content。
 * 浮层 teleport 到 body，以 glass-tooltip 为材质锚；用户 overlayClassName 只追加。
 *
 * 材质口径：
 * - default：跟随当前 Glass scheme（浅色 frosted / 深色炭黑实板）
 * - light：显式玻璃浅色分支（近白微透 + blur）
 * - 箭头只吃 tip fill，不加粗边或高饱和描边
 */
import { computed } from 'vue'

import type { TdPopupProps, TdTooltipProps } from 'tdesign-vue-next'

type GlassTooltipTheme = 'default' | 'light'
type GlassTooltipProps = Omit<TdTooltipProps, 'theme'> & {
  theme?: GlassTooltipTheme
}

const props = withDefaults(defineProps<GlassTooltipProps>(), {
  /** Tooltip.delay 是 number；Popup 的信号语义最终为 [show, hide]。 */
  delay: 300,
  placement: 'top',
  showArrow: true,
  theme: 'default',
})

function appendGlassClasses(
  userClass: TdPopupProps['overlayClassName'],
  className: string,
  theme: GlassTooltipTheme,
): TdPopupProps['overlayClassName'] {
  const userClasses = Array.isArray(userClass) ? userClass : userClass ? [userClass] : []
  return [
    ...userClasses,
    't-tooltip',
    `t-tooltip--${theme}`,
    className,
    `${className}--${theme}`,
  ]
}

const tooltipBind = computed(() => ({
  ...props,
  overlayClassName: appendGlassClasses(
    props.overlayClassName,
    'glass-tooltip',
    props.theme,
  ),
}))
</script>

<template>
  <t-tooltip v-bind="tooltipBind">
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
    <slot />
  </t-tooltip>
</template>

<style>
/* DOM：.t-popup.t-tooltip.glass-tooltip.glass-tooltip--{theme}
        > .t-popup__content.t-popup__content--text.t-popup__content--arrow
        > .t-popup__arrow */
.glass-tooltip.t-tooltip > .t-popup__content {
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

.glass-tooltip--light.t-tooltip > .t-popup__content {
  background: var(--glass-wb-tooltip-light-fill);
  -webkit-backdrop-filter: var(--glass-wb-tooltip-light-blur);
  backdrop-filter: var(--glass-wb-tooltip-light-blur);
  box-shadow: var(--glass-wb-tooltip-light-shadow);
  color: var(--glass-wb-tooltip-light-color);
}

/* TTooltip 默认让整枚箭头 inherit 内容底板；这里只保留弱伪三角。 */
.glass-tooltip.t-tooltip > .t-popup__content > .t-popup__arrow {
  background: transparent;
}

.glass-tooltip.t-tooltip > .t-popup__content > .t-popup__arrow::before {
  background: var(--glass-wb-tooltip-arrow-fill);
  box-shadow: none;
}

.glass-tooltip--light.t-tooltip > .t-popup__content > .t-popup__arrow::before {
  background: var(--glass-wb-tooltip-light-arrow-fill);
  box-shadow: none;
}
</style>
