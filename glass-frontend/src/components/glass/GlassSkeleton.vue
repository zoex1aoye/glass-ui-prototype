<script setup lang="ts">
/**
 * GlassSkeleton — Compound Wrapper 盖 t-skeleton（微透 · 叠压染色）
 *
 * 透传：theme / animation（默认 gradient）/ rowCol / loading / delay + 默认槽（content）。
 * 骨块走 html `.cell-see` 的半透冷蓝底（--glass-wb-skeleton-*），两层低透明度
 * 蓝染区缓慢漂移叠压出深度；gradient 不再扫光，flashed 仅呼吸染层透明度；
 * loading=false 时默认槽渲染真实内容。prefers-reduced-motion 下染层静止。
 *
 * 视觉由 theme.css 的 .glass-skeleton 收口；组件只挂 class 钩子，禁止魔法 hex/rgba。
 */
import type { TdSkeletonProps } from 'tdesign-vue-next'

withDefaults(
  defineProps<{
    theme?: TdSkeletonProps['theme']
    animation?: TdSkeletonProps['animation']
    rowCol?: TdSkeletonProps['rowCol']
    loading?: boolean
    delay?: TdSkeletonProps['delay']
  }>(),
  {
    theme: undefined,
    animation: 'gradient',
    rowCol: undefined,
    loading: true,
    delay: undefined,
  },
)
</script>

<template>
  <t-skeleton
    class="glass-skeleton"
    :theme="theme"
    :animation="animation"
    :row-col="rowCol"
    :loading="loading"
    :delay="delay"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </t-skeleton>
</template>
