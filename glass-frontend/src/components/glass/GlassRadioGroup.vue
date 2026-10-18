<script setup lang="ts">
/**
 * GlassRadioGroup — Compound Wrapper 盖 t-radio-group
 *
 * UX 术语（源自 tmp-tabs-radio-ux-plan.md §Track B）：
 * - default = 经典圆点：空心圆 + Action Blue 点芯（对齐「按钮与行动」--glass-wb-btn-blue）
 * - rounded = 分段圆角矩形：微透软轨 + 选中实心 Action Blue 白字（小物件满浓，禁白核）
 * - capsule = 分段真胶囊：与 rounded 同轨，仅圆角为 pill（两端半圆，一眼可辨）
 *
 * appearance 管描边/填充（默认不破坏现网）：
 *   variant=default → appearance 默认 outline（空心圆 + 选中 Action Blue 点芯）
 *   variant=rounded / capsule → appearance 默认 filled（选中实心 Action Blue 白字）
 *
 * 映射：
 *   variant=default → theme="radio"
 *   variant=rounded / capsule → theme="button"（视觉不依赖 TD primary-filled 脏默认，全部在 theme.css 收口）
 *   TD variant 固定 outline，避免外部 attrs 注入 primary-filled 灰边；描边/填充由 theme.css 收口。
 *
 * 本组件只负责挂 class 钩子与透传契约；视觉数值全部在 styles/theme.css 收口。
 * 组件内禁止魔法 hex/rgba。
 *
 * 透传最小集：value / defaultValue / modelValue（v-model）、options、disabled、readonly、
 * direction、size、name、allowUncheck；slot：default。
 * 事件：change（与 TD 同名）、update:modelValue（仅 modelValue 态）。
 */
import { computed, useAttrs } from 'vue'

import type { RadioValue, TdRadioGroupProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'rounded' | 'capsule'
    /** 受控 value（与 modelValue 互斥，优先级高于 modelValue） */
    value?: RadioValue
    /** 非受控初始值 */
    defaultValue?: RadioValue
    /** v-model 双向绑定 */
    modelValue?: RadioValue
    options?: TdRadioGroupProps['options']
    /** 描边/填充：variant=rounded/capsule 默认 filled，variant=default 默认 outline */
    appearance?: 'outline' | 'filled'
    disabled?: boolean
    readonly?: boolean
    direction?: TdRadioGroupProps['direction']
    size?: TdRadioGroupProps['size']
    name?: string
    allowUncheck?: boolean
  }>(),
  {
    variant: 'default',
    value: undefined,
    defaultValue: undefined,
    modelValue: undefined,
    options: undefined,
    appearance: undefined,
    disabled: undefined,
    readonly: undefined,
    direction: undefined,
    size: undefined,
    name: undefined,
    allowUncheck: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: RadioValue]
  change: [value: RadioValue, context: { e: Event; name?: string }]
}>()

const attrs = useAttrs()

/** default → TD theme=radio；rounded / capsule → TD theme=button（视觉仍由 theme.css 接管） */
const tdTheme = computed<'radio' | 'button'>(() =>
  props.variant === 'default' ? 'radio' : 'button',
)

const variantClass = computed(() => `glass-radio-group--${props.variant}`)

/** appearance 显式传入优先；缺省按 variant 推导：default→outline，rounded/capsule→filled */
const resolvedAppearance = computed<'outline' | 'filled'>(() =>
  props.appearance ?? (props.variant === 'default' ? 'outline' : 'filled'),
)

const appearanceClass = computed(
  () => `glass-radio-group--appearance-${resolvedAppearance.value}`,
)

/** class / style 落在外壳；其余 attrs（含未声明 listeners）透传 t-radio-group */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const groupAttrs = computed(() => {
  const { class: _class, style: _style, theme: _theme, variant: _variant, ...rest } = attrs
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
  if (props.options !== undefined) bind.options = props.options
  if (props.disabled !== undefined) bind.disabled = props.disabled
  if (props.readonly !== undefined) bind.readonly = props.readonly
  if (props.direction !== undefined) bind.direction = props.direction
  if (props.size !== undefined) bind.size = props.size
  if (props.name !== undefined) bind.name = props.name
  if (props.allowUncheck !== undefined) bind.allowUncheck = props.allowUncheck
  return bind
})

/** 合并到单一 v-bind（Vue 单元素不允许同名 v-bind 指令重复出现） */
const groupBind = computed<Record<string, unknown>>(() => ({
  ...valueBind.value,
  ...optionalBind.value,
  ...groupAttrs.value,
}))

function onChange(value: RadioValue, context: { e: Event; name?: string }) {
  if (props.value === undefined && props.modelValue !== undefined) {
    emit('update:modelValue', value)
  }
  emit('change', value, context)
}
</script>

<template>
  <div
    class="glass-radio-group"
    :class="[variantClass, appearanceClass, shellClass]"
    :style="shellStyle"
  >
    <!--
      TD RadioGroup：`renderSlot('default') || renderOptions()`。
      若始终挂空 <slot />，空 slot 为真会挡住 options 渲染（capsule / Form Choice 会空壳）。
      有 options 时不挂 default slot；仅 slot 模式时才透出。
    -->
    <t-radio-group
      v-if="props.options !== undefined"
      class="glass-radio-group__core"
      :theme="tdTheme"
      variant="outline"
      v-bind="groupBind"
      @change="onChange"
    />
    <t-radio-group
      v-else
      class="glass-radio-group__core"
      :theme="tdTheme"
      variant="outline"
      v-bind="groupBind"
      @change="onChange"
    >
      <slot />
    </t-radio-group>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留空结构钩子，零视觉 CSS。
   视觉一律由 theme.css 的 .glass-radio-group* 选择器收口。 */
.glass-radio-group__core {
  display: inline-flex;
}
</style>
