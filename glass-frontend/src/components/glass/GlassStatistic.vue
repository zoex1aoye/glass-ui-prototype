<script setup lang="ts">
/**
 * GlassStatistic — Compound Wrapper 盖 t-statistic（Quiet 数字气质）
 *
 * 透传：value / title / unit / prefix / suffix / extra / trend（increase|decrease）/
 * trendPlacement / separator / decimalPlaces / loading / animation / animationStart
 * + title / unit / prefix / suffix / extra 槽。
 * 暴露实例方法 start()（透传底层 t-statistic）。
 *
 * 色调走本仓 tone prop（default | brand | success | warning | danger），
 * 挂 .glass-statistic--tone-*；trend 图标色跟语义走 --trend-increase / --trend-decrease。
 * 禁止对外透传 TD 原始 color 字符串。
 *
 * 视觉由 theme.css 的 .glass-statistic* 收口；组件只挂 class 钩子，禁止魔法 hex/rgba。
 * 透明底、非 Host Tray / Surface / Soft Cite Card（禁双托盘）。
 */
import { computed, ref } from 'vue'

import type { StatisticInstanceFunctions, TdStatisticProps } from 'tdesign-vue-next'

type GlassStatisticTone = 'default' | 'brand' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    value?: TdStatisticProps['value']
    title?: TdStatisticProps['title']
    unit?: TdStatisticProps['unit']
    prefix?: TdStatisticProps['prefix']
    suffix?: TdStatisticProps['suffix']
    extra?: TdStatisticProps['extra']
    trend?: TdStatisticProps['trend']
    trendPlacement?: TdStatisticProps['trendPlacement']
    separator?: TdStatisticProps['separator']
    decimalPlaces?: TdStatisticProps['decimalPlaces']
    loading?: boolean
    animation?: TdStatisticProps['animation']
    animationStart?: boolean
    tone?: GlassStatisticTone
  }>(),
  {
    value: undefined,
    title: undefined,
    unit: undefined,
    prefix: undefined,
    suffix: undefined,
    extra: undefined,
    trend: undefined,
    trendPlacement: undefined,
    separator: undefined,
    decimalPlaces: undefined,
    loading: false,
    animation: undefined,
    animationStart: false,
    tone: 'default',
  },
)

const statRef = ref<StatisticInstanceFunctions>()

function start() {
  statRef.value?.start()
}

defineExpose({ start })

/**
 * 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值
 * （尤其 separator 默认 ',' 与 trendPlacement 默认 'left'）。
 */
const statisticBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {
    loading: props.loading,
    animationStart: props.animationStart,
  }
  if (props.value !== undefined) bind.value = props.value
  if (props.title !== undefined) bind.title = props.title
  if (props.unit !== undefined) bind.unit = props.unit
  if (props.prefix !== undefined) bind.prefix = props.prefix
  if (props.suffix !== undefined) bind.suffix = props.suffix
  if (props.extra !== undefined) bind.extra = props.extra
  if (props.trend !== undefined) bind.trend = props.trend
  if (props.trendPlacement !== undefined) bind.trendPlacement = props.trendPlacement
  if (props.separator !== undefined) bind.separator = props.separator
  if (props.decimalPlaces !== undefined) bind.decimalPlaces = props.decimalPlaces
  if (props.animation !== undefined) bind.animation = props.animation
  return bind
})

const rootClass = computed(() => [
  'glass-statistic',
  `glass-statistic--tone-${props.tone}`,
  props.trend ? `glass-statistic--trend-${props.trend}` : '',
])
</script>

<template>
  <t-statistic
    ref="statRef"
    :class="rootClass"
    v-bind="statisticBind"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.unit" #unit>
      <slot name="unit" />
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
  </t-statistic>
</template>
