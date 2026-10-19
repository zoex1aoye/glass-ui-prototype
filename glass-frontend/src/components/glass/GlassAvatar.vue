<script setup lang="ts">
/**
 * GlassAvatar — Compound Wrapper 盖 t-avatar
 *
 * 透传：image / alt / hideOnLoadFailed / shape（circle | round）/ size / imageProps；
 * 槽：icon / 默认字符内容；事件：error（TDesign 的 `{ e }` 上下文原样转出）。
 *
 * class 钩子 `glass-avatar` 挂在 t-avatar 根上；medium 默认 40（对齐 Comment），
 * round / circle、冷蓝微透字面与图片轻 rim 全部由 theme.css 的
 * `--glass-wb-avatar-*` token 收口。组件内零魔法 hex/rgba。
 */
import { computed, useAttrs } from 'vue'

import type { TdAvatarProps } from 'tdesign-vue-next'

type AvatarErrorContext = Parameters<NonNullable<TdAvatarProps['onError']>>[0]

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    image?: TdAvatarProps['image']
    alt?: TdAvatarProps['alt']
    hideOnLoadFailed?: TdAvatarProps['hideOnLoadFailed']
    shape?: 'circle' | 'round'
    size?: TdAvatarProps['size']
    imageProps?: TdAvatarProps['imageProps']
  }>(),
  {
    image: undefined,
    alt: undefined,
    hideOnLoadFailed: undefined,
    shape: undefined,
    size: undefined,
    imageProps: undefined,
  },
)

const emit = defineEmits<{
  error: [context: AvatarErrorContext]
}>()

const attrs = useAttrs()

/** class / style 落在 t-avatar 根；其余 attrs 透传 t-avatar */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const avatarAttrs = computed(() => {
  const { class: _class, style: _style, onError: _onError, ...rest } = attrs
  return rest
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const avatarBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.image !== undefined) bind.image = props.image
  if (props.alt !== undefined) bind.alt = props.alt
  if (props.hideOnLoadFailed !== undefined) bind.hideOnLoadFailed = props.hideOnLoadFailed
  if (props.shape !== undefined) bind.shape = props.shape
  if (props.size !== undefined) bind.size = props.size
  if (props.imageProps !== undefined) bind.imageProps = props.imageProps
  return { ...bind, ...avatarAttrs.value }
})

const rootClass = computed(() => [
  'glass-avatar',
  `glass-avatar--${props.shape ?? 'circle'}`,
  shellClass.value,
])

function onError(context: AvatarErrorContext) {
  emit('error', context)
}
</script>

<template>
  <t-avatar
    :class="rootClass"
    :style="shellStyle"
    v-bind="avatarBind"
    @error="onError"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <slot />
  </t-avatar>
</template>
