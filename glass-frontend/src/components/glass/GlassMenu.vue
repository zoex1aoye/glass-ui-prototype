<script setup lang="ts">
/**
 * GlassMenu — Compound Wrapper 盖 t-menu（WinUI / Content-on-Mica 导航菜单）
 *
 * variant=rail  透底导航带，直接继承 GlassRail / Surface 宿主材质；
 * variant=panel Quiet 面板，使用既有 L3 fill / hairline token。
 * tone=ice / lilac 分别映射 Dashboard Rail Quiet List 的 hover / active / pressed wash。
 *
 * 本组件只负责透传 TDesign 行为、挂 class 钩子与转发事件；视觉全部在 theme.css 收口。
 * 子件从 tdesign-vue-next 直接 re-export：Menu 主要通过 provide/inject 协作，
 * Submenu 仍读取父链 type.name；薄 SFC 包装会破坏该父链判断。
 */
import { computed, useAttrs } from 'vue'

import type { MenuValue, TdMenuProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'rail' | 'panel'
    tone?: 'ice' | 'lilac'
    /** 受控 value（优先级高于 modelValue） */
    value?: MenuValue
    /** 非受控初始值 */
    defaultValue?: MenuValue
    /** v-model 双向绑定 */
    modelValue?: MenuValue
    /** 受控展开项 */
    expanded?: MenuValue[]
    /** 非受控初始展开项 */
    defaultExpanded?: MenuValue[]
    collapsed?: boolean
    width?: TdMenuProps['width']
    expandMutex?: boolean
    expandType?: TdMenuProps['expandType']
    theme?: TdMenuProps['theme']
  }>(),
  {
    variant: 'rail',
    tone: 'ice',
    value: undefined,
    defaultValue: undefined,
    modelValue: undefined,
    expanded: undefined,
    defaultExpanded: undefined,
    collapsed: undefined,
    width: undefined,
    expandMutex: undefined,
    expandType: undefined,
    theme: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: MenuValue]
  change: [value: MenuValue]
  expand: [value: MenuValue[]]
}>()

const attrs = useAttrs()

/** class / style 留在 Glass 外壳；其余 attrs（含对外 update:value listener）透传 t-menu */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const menuAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/** 受控 value > v-model > defaultValue；只绑一种，避免 TD useVModel 歧义 */
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
  if (props.expanded !== undefined) bind.expanded = props.expanded
  if (props.defaultExpanded !== undefined) bind.defaultExpanded = props.defaultExpanded
  if (props.collapsed !== undefined) bind.collapsed = props.collapsed
  if (props.width !== undefined) bind.width = props.width
  if (props.expandMutex !== undefined) bind.expandMutex = props.expandMutex
  if (props.expandType !== undefined) bind.expandType = props.expandType
  if (props.theme !== undefined) bind.theme = props.theme
  return bind
})

const menuBind = computed<Record<string, unknown>>(() => ({
  ...valueBind.value,
  ...optionalBind.value,
  ...menuAttrs.value,
}))

const variantClass = computed(() => `glass-menu--${props.variant}`)
const toneClass = computed(() => `glass-menu--tone-${props.tone}`)

function onValueUpdate(value: MenuValue) {
  emit('update:modelValue', value)
}

function onModelUpdate(value: MenuValue) {
  emit('update:modelValue', value)
}

function onChange(value: MenuValue) {
  emit('change', value)
}

function onExpand(value: MenuValue[]) {
  emit('expand', value)
}
</script>

<template>
  <div class="glass-menu" :class="[variantClass, toneClass, shellClass]" :style="shellStyle">
    <t-menu
      class="glass-menu__core"
      v-bind="menuBind"
      @update:value="onValueUpdate"
      @update:model-value="onModelUpdate"
      @change="onChange"
      @expand="onExpand"
    >
      <template v-if="$slots.logo" #logo>
        <slot name="logo" />
      </template>
      <template v-if="$slots.operations" #operations>
        <slot name="operations" />
      </template>
      <slot />
    </t-menu>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留结构钩子；视觉统一由 theme.css 的 .glass-menu* 收口。 */
.glass-menu__core {
  display: block;
}
</style>
