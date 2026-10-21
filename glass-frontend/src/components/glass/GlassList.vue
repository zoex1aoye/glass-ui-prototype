<script setup lang="ts">
/**
 * GlassList — Compound Wrapper 盖 t-list（通用 Quiet 列表）
 *
 * 通用 Quiet 列表：透明底、无托盘满铺（非 Host Tray / Surface，禁双托盘）。
 * 透传最小集：split（默认 false）/ stripe / size / header / footer /
 * asyncLoading（'loading' | 'load-more'）+ load-more / scroll 事件 + 默认槽。
 * active = Soft Active Wash，无 lift 且优先于 stripe；rail active 仍走 rail-*。
 * stripe = Soft 中性斑马微洗，无 lift；与 session active 解耦。
 *
 * 视觉由 theme.css 的 .glass-list* 选择器收口；组件只挂 class 钩子，
 * 禁止魔法 hex/rgba。
 */
import { computed, useAttrs } from 'vue'

import type { TdListProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** 是否显示行间分割线（默认 false） */
    split?: boolean
    /** 是否显示斑马纹 */
    stripe?: boolean
    size?: TdListProps['size']
    header?: TdListProps['header']
    footer?: TdListProps['footer']
    asyncLoading?: 'loading' | 'load-more'
  }>(),
  {
    split: false,
    stripe: false,
    size: undefined,
    header: undefined,
    footer: undefined,
    asyncLoading: undefined,
  },
)

const emit = defineEmits<{
  'load-more': [options: { e: MouseEvent }]
  scroll: [options: { e: Event | WheelEvent; scrollTop: number; scrollBottom: number }]
}>()

const attrs = useAttrs()

/** class / style 落在 t-list 根；其余 attrs（含未声明 props）透传 t-list */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const listAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/** split / stripe 带默认值直接落盘；其余可选 props 仅显式传入时绑定 */
const listBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {
    split: props.split,
    stripe: props.stripe,
  }
  if (props.size !== undefined) bind.size = props.size
  if (props.header !== undefined) bind.header = props.header
  if (props.footer !== undefined) bind.footer = props.footer
  if (props.asyncLoading !== undefined) bind.asyncLoading = props.asyncLoading
  return { ...bind, ...listAttrs.value }
})

function onLoadMore(options: { e: MouseEvent }) {
  emit('load-more', options)
}

function onScroll(options: { e: Event | WheelEvent; scrollTop: number; scrollBottom: number }) {
  emit('scroll', options)
}
</script>

<template>
  <t-list
    class="glass-list"
    :class="shellClass"
    :style="shellStyle"
    v-bind="listBind"
    @load-more="onLoadMore"
    @scroll="onScroll"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <slot />
  </t-list>
</template>
