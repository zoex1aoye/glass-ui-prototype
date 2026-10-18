<script setup lang="ts">
/**
 * GlassBadge — 玻璃徽章（合并原在线值守徽标）
 *
 * variant=status（默认）：底层 t-tag + 绿点 + --glass-wb-online-*；text 默认「在线值守」。
 * variant=count：底层 t-badge；透传 count / dot / maxCount / offset / shape / size / color。
 *   count 默认满浓双蓝小物件（--glass-wb-badge-bg / --glass-wb-badge-text）；
 *   color 显式传入时走 token / TD 语义覆盖（inline background），文字仍为白。
 *   默认插槽挂载被挂角标的子节点。
 *
 * 本组件只负责挂 class 钩子与透传契约；视觉数值全部在 styles/theme.css 收口
 * （.glass-badge + --status / --count）。组件内禁止魔法 hex/rgba。
 */
import { computed } from 'vue'

import type { BadgeProps } from 'tdesign-vue-next'

const props = withDefaults(
  defineProps<{
    variant?: 'status' | 'count'
    /** status：在线值守文案 */
    text?: string
    /** count：透传 t-badge */
    count?: BadgeProps['count']
    dot?: boolean
    maxCount?: number
    offset?: BadgeProps['offset']
    shape?: BadgeProps['shape']
    size?: BadgeProps['size']
    color?: string
  }>(),
  {
    variant: 'status',
    text: '在线值守',
    count: undefined,
    dot: undefined,
    maxCount: undefined,
    offset: undefined,
    shape: undefined,
    size: undefined,
    color: undefined,
  },
)

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const badgeBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.count !== undefined) bind.count = props.count
  if (props.dot !== undefined) bind.dot = props.dot
  if (props.maxCount !== undefined) bind.maxCount = props.maxCount
  if (props.offset !== undefined) bind.offset = props.offset
  if (props.shape !== undefined) bind.shape = props.shape
  if (props.size !== undefined) bind.size = props.size
  if (props.color !== undefined) bind.color = props.color
  return bind
})
</script>

<template>
  <t-tag
    v-if="variant === 'status'"
    class="glass-badge glass-badge--status"
    shape="round"
    variant="light"
  >
    <span class="glass-badge__dot" aria-hidden="true" />
    <span class="glass-badge__text">{{ text }}</span>
  </t-tag>

  <t-badge
    v-else
    class="glass-badge glass-badge--count"
    v-bind="badgeBind"
  >
    <slot />
  </t-badge>
</template>
