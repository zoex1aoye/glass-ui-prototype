<script setup lang="ts">
/**
 * GlassEmpty — Compound Wrapper 盖 t-empty（Quiet 空态）
 *
 * 透传最小集：type（empty/success/fail/network-error/maintenance）/ title /
 * description / image / imageStyle / size + action 槽。
 * 视觉由 theme.css 的 .glass-empty* 收口；组件只挂结构钩子。
 *
 * Quiet 空态：透明底、无蓝染满铺；title primary、description muted；
 * image 走 TDesign 默认态（empty/network/maintenance 为 muted 灰，
 * success/fail 为语义色，非脏蓝满铺）。action 用 GlassButton。
 */
import type { ImageProps, SizeEnum, Styles } from 'tdesign-vue-next'

type GlassEmptyType = 'empty' | 'success' | 'fail' | 'network-error' | 'maintenance'

withDefaults(
  defineProps<{
    type?: GlassEmptyType
    title?: string
    description?: string
    /** string = 图片 URL；ImageProps = t-image 配置对象（透传 t-empty） */
    image?: string | ImageProps
    imageStyle?: Styles
    size?: SizeEnum
  }>(),
  {
    type: 'empty',
    title: undefined,
    description: undefined,
    image: undefined,
    imageStyle: undefined,
    size: undefined,
  },
)
</script>

<template>
  <t-empty
    class="glass-empty"
    :type="type"
    :title="title"
    :description="description"
    :image="image"
    :image-style="imageStyle"
    :size="size"
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
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
  </t-empty>
</template>

<style scoped>
/* Compound Wrapper：只保留结构钩子；视觉由 theme.css .glass-empty* 收口 */
.glass-empty {
  display: block;
}
</style>
