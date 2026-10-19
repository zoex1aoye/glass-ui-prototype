<script setup lang="ts">
/**
 * GlassTabs — Compound Wrapper 盖 t-tabs（玻璃导航切换控件）
 *
 * UX 术语（源自 tmp-glass-tabs-ux-plan.md）：
 * - line  = Quiet Ink Track：无底轨，选中冷蓝字 + 品牌蓝 ink bar（克制 2px）
 * - soft  = Soft Segment Track：近白微透圆角轨槽托住多项，选中 Soft Active Wash
 * - capsule = Soft Segment Track 的真胶囊形变：材质 / 选中 / 交互同 soft，仅圆角改 pill
 * - card  = Soft Card Track：去 TD 灰脏边，选中近白浮片 + Quiet 蓝字
 *
 * 映射：
 *   variant=line    → theme="normal" + glass-tabs--line
 *   variant=soft    → theme="normal" + glass-tabs--soft
 *   variant=capsule → theme="normal" + glass-tabs--capsule
 *   variant=card    → theme="card"   + glass-tabs--card
 *
 * 本组件只负责挂 class 钩子与透传契约；视觉数值全部在 styles/theme.css 收口
 * （Track B 拥有 .glass-tabs* 选择器）。组件内禁止魔法 hex/rgba。
 *
 * 透传最小集：value / defaultValue / modelValue（v-model）、list、placement、
 * size、disabled、addable、dragSort、scrollPosition、action；slot：default、action。
 * 事件：change / add / remove / drag-sort（与 TD 同名）。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

import type { TabValue, TabsDragSortContext, TdTabsProps } from 'tdesign-vue-next'

import { bindTabsA11y, type NavA11yBinding } from './navA11y'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'line' | 'soft' | 'card' | 'capsule'
    /** 受控 value（与 defaultValue 互斥，优先级高于 modelValue） */
    value?: TabValue
    /** 非受控初始值 */
    defaultValue?: TabValue
    /** v-model 双向绑定 */
    modelValue?: TabValue
    list?: TdTabsProps['list']
    placement?: TdTabsProps['placement']
    size?: TdTabsProps['size']
    disabled?: boolean
    addable?: boolean
    dragSort?: boolean
    scrollPosition?: TdTabsProps['scrollPosition']
    action?: TdTabsProps['action']
  }>(),
  {
    variant: 'line',
    value: undefined,
    defaultValue: undefined,
    modelValue: undefined,
    list: undefined,
    placement: undefined,
    size: undefined,
    disabled: undefined,
    addable: undefined,
    dragSort: undefined,
    scrollPosition: undefined,
    action: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: TabValue]
  change: [value: TabValue]
  add: [context: { e: MouseEvent }]
  remove: [context: { value: TabValue; index: number; e: MouseEvent }]
  'drag-sort': [context: TabsDragSortContext]
}>()

const attrs = useAttrs()
const rootRef = ref<HTMLElement | null>(null)
let navA11y: NavA11yBinding | null = null

onMounted(async () => {
  await nextTick()
  if (rootRef.value) navA11y = bindTabsA11y(rootRef.value)
})

onBeforeUnmount(() => {
  navA11y?.destroy()
  navA11y = null
})

/** line / soft / capsule 共用 TD normal；card 才走 TD card theme（视觉仍由 theme.css 接管） */
const tdTheme = computed<TdTabsProps['theme']>(() =>
  props.variant === 'card' ? 'card' : 'normal',
)

const variantClass = computed(() => `glass-tabs--${props.variant}`)

/** class / style 落在外壳；其余 attrs（含未声明 listeners）透传 t-tabs */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const tabsAttrs = computed(() => {
  const { class: _class, style: _style, theme: _theme, ...rest } = attrs
  return rest
})

/** 受控 value > v-model（modelValue）> defaultValue；只绑一种，避免 TD useVModel 歧义 */
const valueBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.value !== undefined) {
    bind.value = props.value
  } else if (props.modelValue !== undefined) {
    bind.modelValue = props.modelValue
  }
  if (props.defaultValue !== undefined) bind.defaultValue = props.defaultValue
  return bind
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const optionalBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.list !== undefined) bind.list = props.list
  if (props.placement !== undefined) bind.placement = props.placement
  if (props.size !== undefined) bind.size = props.size
  if (props.disabled !== undefined) bind.disabled = props.disabled
  if (props.addable !== undefined) bind.addable = props.addable
  if (props.dragSort !== undefined) bind.dragSort = props.dragSort
  if (props.scrollPosition !== undefined) bind.scrollPosition = props.scrollPosition
  if (props.action !== undefined) bind.action = props.action
  return bind
})

/** 合并到单一 v-bind（Vue 单元素不允许同名 v-bind 指令重复出现） */
const tabsBind = computed<Record<string, unknown>>(() => ({
  ...valueBind.value,
  ...optionalBind.value,
  ...tabsAttrs.value,
}))

function onChange(value: TabValue) {
  if (props.value === undefined && props.modelValue !== undefined) {
    emit('update:modelValue', value)
  }
  emit('change', value)
}

function onAdd(context: { e: MouseEvent }) {
  emit('add', context)
}

function onRemove(context: { value: TabValue; index: number; e: MouseEvent }) {
  emit('remove', context)
}

function onDragSort(context: TabsDragSortContext) {
  emit('drag-sort', context)
}
</script>

<template>
  <div
    ref="rootRef"
    class="glass-tabs"
    :class="[variantClass, shellClass]"
    :style="shellStyle"
  >
    <t-tabs
      class="glass-tabs__core"
      :theme="tdTheme"
      v-bind="tabsBind"
      @change="onChange"
      @add="onAdd"
      @remove="onRemove"
      @drag-sort="onDragSort"
    >
      <template #action>
        <slot name="action" />
      </template>
      <slot />
    </t-tabs>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留空结构钩子，零视觉 CSS。
   视觉一律由 theme.css 的 .glass-tabs* 选择器收口（Track B）。 */
.glass-tabs__core {
  display: block;
}
</style>
