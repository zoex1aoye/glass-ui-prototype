<script setup lang="ts">
/**
 * GlassListItem — Compound Wrapper 盖 t-list-item（Quiet 列表行）
 *
 * 透传 action / content + 默认槽 / content / action 槽；class 钩子
 * `glass-list-item` 挂在 t-list-item（li）根上，不得包 div
 * （t-list 的 ul 只接受 li 子节点，包 div 会破坏 split/stripe 的 :last-child/:nth-child）。
 *
 * 视觉由 theme.css 的 .glass-list-item* 选择器收口；组件内零魔法 hex/rgba。
 */
import { computed, useAttrs } from 'vue'

import type { TdListItemProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    action?: TdListItemProps['action']
    content?: TdListItemProps['content']
  }>(),
  {
    action: undefined,
    content: undefined,
  },
)

const attrs = useAttrs()

/** class / style 落在 t-list-item 根；其余 attrs 透传 t-list-item */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const itemAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const itemBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.action !== undefined) bind.action = props.action
  if (props.content !== undefined) bind.content = props.content
  return { ...bind, ...itemAttrs.value }
})
</script>

<template>
  <t-list-item
    class="glass-list-item"
    :class="shellClass"
    :style="shellStyle"
    v-bind="itemBind"
  >
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
    <slot />
  </t-list-item>
</template>
