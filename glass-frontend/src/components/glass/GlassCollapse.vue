<script setup lang="ts">
/**
 * GlassCollapse — Compound Wrapper 盖 t-collapse（玻璃折叠轨）
 *
 * 视觉术语：
 * - borderless（默认）：Borderless Glass Rail。容器吃玻璃轨（微透 + blur + inset hairline），
 *   panel header 微透，展开内容用 Quiet 分隔（顶部淡 hairline）。
 * - bordered：保留 TD 分栏，但把灰边 / 灰底换成本仓 token hairline，不引入魔法色。
 *
 * 映射：
 *   borderless=true  → t-collapse borderless + .glass-collapse--borderless
 *   borderless=false → .glass-collapse--bordered
 *
 * 本组件只负责挂 class 钩子与透传契约；视觉数值全部在 styles/theme.css 收口
 * （--glass-wb-collapse-* token + .glass-collapse* 选择器）。组件内禁止魔法 hex/rgba。
 *
 * 透传最小集：value / defaultValue / modelValue（v-model）、borderless、defaultExpandAll、
 * disabled、expandIcon、expandIconPlacement、expandMutex、expandOnRowClick；
 * slot：default → GlassCollapsePanel 子节点；expandIcon（collapse 级图标回退）。
 * 事件：change（与 TD 同名）、update:modelValue（仅 modelValue 态）。
 */
import { computed, useAttrs } from 'vue'

import type { CollapseValue, TdCollapseProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** 受控 value（与 modelValue 互斥，优先级高于 modelValue） */
    value?: CollapseValue
    /** 非受控初始值 */
    defaultValue?: CollapseValue
    /** v-model 双向绑定 */
    modelValue?: CollapseValue
    /** borderless 玻璃轨（默认开；bordered 仅作对照） */
    borderless?: boolean
    defaultExpandAll?: boolean
    disabled?: boolean
    expandIcon?: TdCollapseProps['expandIcon']
    expandIconPlacement?: TdCollapseProps['expandIconPlacement']
    expandMutex?: boolean
    expandOnRowClick?: boolean
  }>(),
  {
    value: undefined,
    defaultValue: undefined,
    modelValue: undefined,
    borderless: true,
    defaultExpandAll: undefined,
    disabled: undefined,
    expandIcon: undefined,
    expandIconPlacement: undefined,
    expandMutex: undefined,
    expandOnRowClick: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: CollapseValue]
  change: [value: CollapseValue]
}>()

const attrs = useAttrs()

const variantClass = computed(() =>
  props.borderless ? 'glass-collapse--borderless' : 'glass-collapse--bordered',
)

/** class / style 落在外壳；其余 attrs（含未声明 listeners）透传 t-collapse */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const collapseAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
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
  if (props.borderless !== undefined) bind.borderless = props.borderless
  if (props.defaultExpandAll !== undefined) bind.defaultExpandAll = props.defaultExpandAll
  if (props.disabled !== undefined) bind.disabled = props.disabled
  if (props.expandIcon !== undefined) bind.expandIcon = props.expandIcon
  if (props.expandIconPlacement !== undefined) {
    bind.expandIconPlacement = props.expandIconPlacement
  }
  if (props.expandMutex !== undefined) bind.expandMutex = props.expandMutex
  if (props.expandOnRowClick !== undefined) bind.expandOnRowClick = props.expandOnRowClick
  return bind
})

/** 合并到单一 v-bind（Vue 单元素不允许同名 v-bind 指令重复出现） */
const collapseBind = computed<Record<string, unknown>>(() => ({
  ...valueBind.value,
  ...optionalBind.value,
  ...collapseAttrs.value,
}))

function onChange(value: CollapseValue) {
  if (props.value === undefined && props.modelValue !== undefined) {
    emit('update:modelValue', value)
  }
  emit('change', value)
}
</script>

<template>
  <div
    class="glass-collapse"
    :class="[variantClass, shellClass]"
    :style="shellStyle"
  >
    <t-collapse
      class="glass-collapse__core"
      v-bind="collapseBind"
      @change="onChange"
    >
      <template v-if="$slots.expandIcon" #expandIcon>
        <slot name="expandIcon" />
      </template>
      <slot />
    </t-collapse>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留空结构钩子，零视觉 CSS。
   视觉一律由 theme.css 的 .glass-collapse* 选择器收口。 */
.glass-collapse__core {
  display: block;
}
</style>
