<script setup lang="ts">
/**
 * GlassSteps — Compound Wrapper 盖 t-steps（玻璃流程指示控件）
 *
 * UX 术语（源自 tmp-glass-flow-ux-plan.md §2.2）：
 * - default = Quiet Number Path：数字圆标（process=Quiet 蓝底白字 · finish=浅冷 wash ·
 *   default=次要描边圆 · error=danger token；连接线细克制冷灰蓝）
 * - dot     = Soft Dot Path：软点轨（process=Quiet 实心点 · finish=浅点 · default=空心/淡点）
 *
 * 映射：
 *   variant=default → theme="default" + glass-steps--default
 *   variant=dot     → theme="dot"     + glass-steps--dot
 *
 * 本组件只负责挂 class 钩子与透传契约；视觉数值全部在 styles/theme.css 收口
 * （Track B 拥有 .glass-steps* 选择器）。组件内禁止魔法 hex/rgba。
 *
 * 透传最小集：current / defaultCurrent / modelValue（v-model）、layout、options、
 * readonly、separator、sequence；slot：default → GlassStepItem 子节点。
 * 事件：change（经 t-steps onChange 回调透传）、update:modelValue（仅 modelValue 态）。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

import type { TdStepsProps } from 'tdesign-vue-next'

import { bindStepsA11y, type NavA11yBinding } from './navA11y'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'dot'
    /** 受控 current（与 modelValue 互斥，优先级高于 modelValue） */
    current?: TdStepsProps['current']
    /** 非受控初始值 */
    defaultCurrent?: TdStepsProps['defaultCurrent']
    /** v-model 双向绑定 */
    modelValue?: TdStepsProps['modelValue']
    layout?: TdStepsProps['layout']
    options?: TdStepsProps['options']
    readonly?: boolean
    separator?: TdStepsProps['separator']
    sequence?: TdStepsProps['sequence']
  }>(),
  {
    variant: 'default',
    current: undefined,
    defaultCurrent: undefined,
    modelValue: undefined,
    layout: undefined,
    options: undefined,
    readonly: undefined,
    separator: undefined,
    sequence: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [current: string | number]
  change: [
    current: string | number,
    previous: string | number,
    context?: { e?: MouseEvent },
  ]
}>()

const attrs = useAttrs()
const rootRef = ref<HTMLElement | null>(null)
let navA11y: NavA11yBinding | null = null

onMounted(async () => {
  await nextTick()
  if (rootRef.value) navA11y = bindStepsA11y(rootRef.value)
})

onBeforeUnmount(() => {
  navA11y?.destroy()
  navA11y = null
})

/** class / style 落在外壳；其余 attrs 透传 t-steps（change 已 declare 故不在 attrs，显式转发） */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const stepsAttrs = computed(() => {
  const { class: _class, style: _style, theme: _theme, ...rest } = attrs
  return rest
})

const tdTheme = computed<TdStepsProps['theme']>(() =>
  props.variant === 'dot' ? 'dot' : 'default',
)

const variantClass = computed(() => `glass-steps--${props.variant}`)

/** 受控 current > v-model（modelValue）> defaultCurrent；只绑一种，避免 TD useVModel 歧义 */
const valueBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.current !== undefined) {
    bind.current = props.current
  } else if (props.modelValue !== undefined) {
    bind.modelValue = props.modelValue
  }
  if (props.defaultCurrent !== undefined) bind.defaultCurrent = props.defaultCurrent
  return bind
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const optionalBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.layout !== undefined) bind.layout = props.layout
  if (props.options !== undefined) bind.options = props.options
  if (props.readonly !== undefined) bind.readonly = props.readonly
  if (props.separator !== undefined) bind.separator = props.separator
  if (props.sequence !== undefined) bind.sequence = props.sequence
  return bind
})

/** 合并到单一 v-bind（Vue 单元素不允许同名 v-bind 指令重复出现） */
const stepsBind = computed<Record<string, unknown>>(() => ({
  ...valueBind.value,
  ...optionalBind.value,
  ...stepsAttrs.value,
}))

function onUpdateModelValue(current: string | number) {
  emit('update:modelValue', current)
}

function onChange(
  current: string | number,
  previous: string | number,
  context?: { e?: MouseEvent },
) {
  if (props.current === undefined && props.modelValue !== undefined) {
    emit('update:modelValue', current)
  }
  emit('change', current, previous, context)
}
</script>

<template>
  <div
    ref="rootRef"
    class="glass-steps"
    :class="[variantClass, shellClass]"
    :style="shellStyle"
  >
    <t-steps
      class="glass-steps__core"
      :theme="tdTheme"
      v-bind="stepsBind"
      @update:model-value="onUpdateModelValue"
      @change="onChange"
    >
      <slot />
    </t-steps>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留空结构钩子，零视觉 CSS。
   视觉一律由 theme.css 的 .glass-steps* 选择器收口（Track B）。 */
.glass-steps__core {
  display: block;
}
</style>
