<script setup lang="ts">
/**
 * GlassLoading — Compound Wrapper 盖 t-loading（Frost Disc / 轻 mask）
 *
 * 透传：loading / size / text / fullscreen / showOverlay / delay / indicator /
 * preventScrollThrough / attach / zIndex / inheritColor + 默认槽（content）。
 * 默认指示器为磨砂液态盘（Frost Disc）：径向冰蓝长程渐变对齐 html `.disc-on-gan` /
 * `.cell-float .disc`，12s 慢旋 + 1.8s 强呼吸合成（opacity 0.38→1 /
 * scale 0.82→1.14）；禁 TD 硬圆环 / 实心核 / 描边。
 * 自定义 #indicator、indicator=false 或函数型 indicator 原样透传，不覆盖。
 * 包裹态遮罩轻 mask（--glass-wb-table-loading-mask 近义，勿实白盖板）；
 * 文本走 secondary Quiet，不抢指示。
 *
 * 视觉由 theme.css 的 .glass-loading* 收口；组件只挂 class 钩子，禁止魔法 hex/rgba。
 * 默认槽仅在提供时透传：无内容走 t-loading 独立 indicator 分支，
 * 有内容走 t-loading__parent + overlay 包裹分支（与底层 t-loading 语义一致）。
 * prefers-reduced-motion 下停旋 / 呼吸，保留静态 Frost Disc。
 */
import { computed, useSlots } from 'vue'
import type { TdLoadingProps } from 'tdesign-vue-next'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    size?: TdLoadingProps['size']
    text?: TdLoadingProps['text']
    fullscreen?: boolean
    showOverlay?: boolean
    delay?: TdLoadingProps['delay']
    indicator?: TdLoadingProps['indicator']
    preventScrollThrough?: TdLoadingProps['preventScrollThrough']
    attach?: TdLoadingProps['attach']
    zIndex?: TdLoadingProps['zIndex']
    inheritColor?: TdLoadingProps['inheritColor']
  }>(),
  {
    loading: true,
    size: undefined,
    text: undefined,
    fullscreen: false,
    showOverlay: undefined,
    delay: undefined,
    indicator: undefined,
    preventScrollThrough: undefined,
    attach: undefined,
    zIndex: undefined,
    inheritColor: undefined,
  },
)

const slots = useSlots()
const useFrostDisc = computed(() => {
  if (slots.indicator) return false
  return props.indicator === undefined || props.indicator === true
})
</script>

<template>
  <t-loading
    class="glass-loading"
    :loading="loading"
    :size="size"
    :text="text"
    :fullscreen="fullscreen"
    :show-overlay="showOverlay"
    :delay="delay"
    :indicator="indicator"
    :prevent-scroll-through="preventScrollThrough"
    :attach="attach"
    :z-index="zIndex"
    :inherit-color="inheritColor"
  >
    <template v-if="$slots.indicator" #indicator>
      <slot name="indicator" />
    </template>
    <template v-else-if="useFrostDisc" #indicator>
      <span class="glass-loading__disc" aria-hidden="true" />
    </template>
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </t-loading>
</template>
