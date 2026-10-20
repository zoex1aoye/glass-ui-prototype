<script setup lang="ts">
/**
 * GlassBreadcrumb — Compound Wrapper 盖 t-breadcrumb（Quiet 路径导航）
 *
 * Quiet 语义：祖先 secondary、当前项 primary；透明底、无描边卡。
 * 透传 options / separator / maxItemWidth / maxItems / ellipsis /
 * itemsBeforeCollapse / itemsAfterCollapse / theme，并转发默认与命名槽。
 */
import { computed, useAttrs } from 'vue'

import type { TdBreadcrumbProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    options?: TdBreadcrumbProps['options']
    separator?: TdBreadcrumbProps['separator']
    maxItemWidth?: TdBreadcrumbProps['maxItemWidth']
    maxItems?: TdBreadcrumbProps['maxItems']
    ellipsis?: TdBreadcrumbProps['ellipsis']
    itemsBeforeCollapse?: TdBreadcrumbProps['itemsBeforeCollapse']
    itemsAfterCollapse?: TdBreadcrumbProps['itemsAfterCollapse']
    theme?: TdBreadcrumbProps['theme']
  }>(),
  {
    options: undefined,
    separator: undefined,
    maxItemWidth: undefined,
    maxItems: undefined,
    ellipsis: undefined,
    itemsBeforeCollapse: undefined,
    itemsAfterCollapse: undefined,
    theme: undefined,
  },
)

const attrs = useAttrs()

/** class / style 留在 Glass 外壳；其余 attrs 透传 t-breadcrumb */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const breadcrumbAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const breadcrumbBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.options !== undefined) bind.options = props.options
  if (props.separator !== undefined) bind.separator = props.separator
  if (props.maxItemWidth !== undefined) bind.maxItemWidth = props.maxItemWidth
  if (props.maxItems !== undefined) bind.maxItems = props.maxItems
  if (props.ellipsis !== undefined) bind.ellipsis = props.ellipsis
  if (props.itemsBeforeCollapse !== undefined) {
    bind.itemsBeforeCollapse = props.itemsBeforeCollapse
  }
  if (props.itemsAfterCollapse !== undefined) bind.itemsAfterCollapse = props.itemsAfterCollapse
  if (props.theme !== undefined) bind.theme = props.theme
  return { ...bind, ...breadcrumbAttrs.value }
})
</script>

<template>
  <div class="glass-breadcrumb" :class="shellClass" :style="shellStyle">
    <t-breadcrumb class="glass-breadcrumb__core" v-bind="breadcrumbBind">
      <template v-if="$slots.separator" #separator>
        <slot name="separator" />
      </template>
      <template v-if="$slots.ellipsis" #ellipsis>
        <slot name="ellipsis" />
      </template>
      <slot />
    </t-breadcrumb>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留结构钩子；视觉统一由 theme.css 的 .glass-breadcrumb* 收口。 */
.glass-breadcrumb__core {
  display: flex;
}
</style>
