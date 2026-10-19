<script setup lang="ts">
/**
 * GlassAvatarGroup — Compound Wrapper 盖 t-avatar-group
 *
 * 透传：cascading / max / size / collapseAvatar / popupProps；
 * 默认槽挂多个 GlassAvatar（或任意子节点），可选 collapseAvatar 槽覆盖折叠内容。
 *
 * class 钩子 `glass-avatar-group` 挂在 t-avatar-group 根上。重叠偏移、
 * 折叠 `+N` 面材质与单体头像同源，由 theme.css 的 `--glass-wb-avatar-*`
 * token 收口；组件内零魔法 hex/rgba。
 */
import { computed, useAttrs } from 'vue'

import type { TdAvatarGroupProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    cascading?: TdAvatarGroupProps['cascading']
    max?: TdAvatarGroupProps['max']
    size?: TdAvatarGroupProps['size']
    collapseAvatar?: TdAvatarGroupProps['collapseAvatar']
    popupProps?: TdAvatarGroupProps['popupProps']
  }>(),
  {
    cascading: undefined,
    max: undefined,
    size: undefined,
    collapseAvatar: undefined,
    popupProps: undefined,
  },
)

const attrs = useAttrs()

/** class / style 落在 t-avatar-group 根；其余 attrs 透传 t-avatar-group */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const groupAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const groupBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.cascading !== undefined) bind.cascading = props.cascading
  if (props.max !== undefined) bind.max = props.max
  if (props.size !== undefined) bind.size = props.size
  if (props.collapseAvatar !== undefined) bind.collapseAvatar = props.collapseAvatar
  if (props.popupProps !== undefined) bind.popupProps = props.popupProps
  return { ...bind, ...groupAttrs.value }
})
</script>

<template>
  <t-avatar-group
    class="glass-avatar-group"
    :class="shellClass"
    :style="shellStyle"
    v-bind="groupBind"
  >
    <template v-if="$slots.collapseAvatar" #collapseAvatar>
      <slot name="collapseAvatar" />
    </template>
    <slot />
  </t-avatar-group>
</template>
