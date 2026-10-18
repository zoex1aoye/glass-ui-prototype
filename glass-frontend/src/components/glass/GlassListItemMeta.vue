<script setup lang="ts">
/**
 * GlassListItemMeta — Compound Wrapper 盖 t-list-item-meta（Quiet 元信息）
 *
 * 透传 image / title / description + 同名槽；class 钩子
 * `glass-list-item-meta` 挂在 t-list-item-meta 根上，不得包 div（行内布局）。
 * 头像圆角对齐 Comment（--glass-wb-comment-avatar-radius 近义）。
 *
 * 视觉由 theme.css 的 .glass-list-item-meta* 选择器收口；组件内零魔法 hex/rgba。
 */
import { computed, useAttrs } from 'vue'

import type { TdListItemMetaProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    image?: TdListItemMetaProps['image']
    title?: TdListItemMetaProps['title']
    description?: TdListItemMetaProps['description']
  }>(),
  {
    image: undefined,
    title: undefined,
    description: undefined,
  },
)

const attrs = useAttrs()

/** class / style 落在 t-list-item-meta 根；其余 attrs 透传 t-list-item-meta */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const metaAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const metaBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.image !== undefined) bind.image = props.image
  if (props.title !== undefined) bind.title = props.title
  if (props.description !== undefined) bind.description = props.description
  return { ...bind, ...metaAttrs.value }
})
</script>

<template>
  <t-list-item-meta
    class="glass-list-item-meta"
    :class="shellClass"
    :style="shellStyle"
    v-bind="metaBind"
  >
    <template v-if="$slots.image" #image>
      <slot name="image" />
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </t-list-item-meta>
</template>
