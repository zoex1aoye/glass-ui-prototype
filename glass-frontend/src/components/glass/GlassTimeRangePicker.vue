<script setup lang="ts">
/**
 * GlassTimeRangePicker — Compound Wrapper 盖 t-time-range-picker
 *
 * 触发器外壳与 GlassTimePicker 同轨：Quiet Field Chrome + Kill Inner Rect
 * （覆盖 .t-range-input / 内芯 input）。面板经 popupProps.overlayInnerClassName
 * 注入 glass-picker-panel（追加不覆盖），视觉一律由 theme.css 收口（Track B）。
 *
 * 开合态同步：t-time-range-picker 依赖 popupProps.onVisibleChange 驱动自身开合链
 * （内部 useEventForward），故只包一层并保留用户回调，不覆盖 TD 链。
 *
 * 默认 borderless；可选 props 仅显式传入时绑定。事件与 TD 同名透传
 * （change / pick / clear / focus / blur / input …）；v-model 走 modelValue +
 * update:modelValue。
 */
import { computed, ref, useAttrs } from 'vue'

import type { TdPopupProps, TdTimeRangePickerProps } from 'tdesign-vue-next'

type TimeRangeValue = TdTimeRangePickerProps['modelValue']

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: TimeRangeValue
    /** 受控 value（与 modelValue 互斥，优先级高于 modelValue） */
    value?: TimeRangeValue
    /** 非受控初始值 */
    defaultValue?: TimeRangeValue
    /** 默认 borderless（true）；可显式传 false 还原 TD 内框 */
    borderless?: boolean
    /** 整体禁用（boolean）或分侧禁用（[start, end]） */
    disabled?: boolean | Array<boolean>
    popupProps?: TdPopupProps
  }>(),
  {
    modelValue: undefined,
    value: undefined,
    defaultValue: undefined,
    borderless: true,
    disabled: undefined,
    popupProps: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: TimeRangeValue]
}>()

const attrs = useAttrs()

/** class / style 落在外壳；其余 attrs（含未声明 listeners）透传 t-time-range-picker */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const pickerAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/** 整体禁用：true，或 [true, true]（分侧全禁）才给外壳 is-disabled */
const isDisabled = computed(() => {
  if (props.disabled === true) return true
  if (Array.isArray(props.disabled)) return props.disabled.every(Boolean)
  return false
})

/** 受控 value > v-model（modelValue）> defaultValue；只绑一种 */
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

/** 可选 props 仅显式传入时绑定 */
const optionalBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.disabled !== undefined) bind.disabled = props.disabled
  return bind
})

/** ClassName（string | array | object）合并：追加不覆盖，保留用户 class */
function appendClassName(
  user: TdPopupProps['overlayInnerClassName'],
  appended: string,
): TdPopupProps['overlayInnerClassName'] {
  if (user === undefined || user === null) return appended
  if (typeof user === 'string') return [user, appended]
  if (Array.isArray(user)) return [...user, appended]
  return { ...user, [appended]: true }
}

const popupOpen = ref(false)

/**
 * 注入 glass-picker-panel；onVisibleChange 包一层用于外壳 is-popup-open，
 * 并保留用户回调（user.onVisibleChange）。TD 内部 useEventForward 会把内部开合
 * handleShowPopup 与用户回调合并执行，故不会打断 t-time-range-picker 的开合链。
 */
const mergedPopupProps = computed<TdPopupProps>(() => {
  const user = props.popupProps ?? {}
  return {
    ...user,
    overlayInnerClassName: appendClassName(user.overlayInnerClassName, 'glass-picker-panel'),
    onVisibleChange: (
      visible: boolean,
      context: Parameters<NonNullable<TdPopupProps['onVisibleChange']>>[1],
    ) => {
      popupOpen.value = visible
      user.onVisibleChange?.(visible, context)
    },
  }
})

function onUpdateModelValue(value: TimeRangeValue) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    class="glass-picker glass-timerangepicker"
    :class="[shellClass, { 'is-disabled': isDisabled, 'is-popup-open': popupOpen }]"
    :style="shellStyle"
  >
    <t-time-range-picker
      class="glass-picker__control"
      :borderless="borderless"
      :popup-props="mergedPopupProps"
      v-bind="{ ...pickerAttrs, ...valueBind, ...optionalBind }"
      @update:model-value="onUpdateModelValue"
    />
  </div>
</template>

<style scoped>
/* 外壳 Quiet Field Chrome：rest inset hairline · hover Fade · focus ring only */
.glass-picker {
  display: flex;
  align-items: center;
  height: var(--glass-wb-field-height);
  padding: 0 12px;
  border-radius: var(--glass-wb-field-radius);
  border: none;
  background: var(--glass-wb-field-bg);
  box-shadow: var(--glass-wb-field-hairline);
  box-sizing: border-box;
  transition: box-shadow 0.15s ease;
}

.glass-picker:hover:not(.is-disabled):not(:focus-within):not(.is-popup-open) {
  box-shadow: var(--glass-wb-field-hairline-hover);
}

.glass-picker:focus-within:not(.is-disabled),
.glass-picker.is-popup-open:not(.is-disabled) {
  border: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

.glass-picker.is-disabled {
  opacity: var(--glass-wb-control-disabled-opacity);
}

.glass-picker.is-disabled:hover,
.glass-picker.is-disabled:focus-within,
.glass-picker.is-disabled.is-popup-open {
  box-shadow: var(--glass-wb-field-hairline);
}

.glass-picker__control {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  border-radius: var(--glass-wb-field-radius);
  background: transparent;
  box-shadow: none;
  outline: none;
}

/* RangeInputPopup 是 t-range-input 的直接高度容器：不撑满会把 TD 的
   32px 内芯留在 38px 外壳顶部。 */
.glass-picker__control :deep(.t-range-input-popup) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

/* Kill Inner Rect：t-range-input / t-range-input-popup / 内芯 input 全态不画 border / shadow / 脏 bg */
.glass-picker__control :deep(.t-range-input),
.glass-picker__control :deep(.t-range-input:hover),
.glass-picker__control :deep(.t-range-input--borderless),
.glass-picker__control :deep(.t-range-input--borderless:hover),
.glass-picker__control :deep(.t-range-input.t-is-focused),
.glass-picker__control :deep(.t-range-input-popup--visible .t-range-input) {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  height: 100%;
  padding: 0;
  border: none;
  border-color: transparent;
  background-color: transparent;
  box-shadow: none;
  outline: none;
}

.glass-picker__control :deep(.t-range-input__inner) {
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 0;
  gap: 2px;
}

.glass-picker__control :deep(.t-range-input__inner .t-input),
.glass-picker__control :deep(.t-range-input__inner .t-input__wrap),
.glass-picker__control :deep(.t-range-input__inner .t-input:hover),
.glass-picker__control :deep(.t-range-input__inner .t-input.t-is-focused),
.glass-picker__control :deep(.t-range-input__inner .t-input.t-is-disabled),
.glass-picker__control :deep(.t-range-input__inner .t-input.t-is-disabled:hover) {
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 0;
  padding: 0;
  border: none;
  border-color: transparent;
  background-color: transparent;
  box-shadow: none;
  outline: none;
}

.glass-picker__control :deep(.t-range-input__inner-left),
.glass-picker__control :deep(.t-range-input__inner-right) {
  flex: 1 1 0;
  min-width: 0;
}

.glass-picker__control :deep(.t-range-input__inner-separator) {
  display: flex;
  align-items: center;
  height: 100%;
  flex: none;
  padding: 0 4px;
  line-height: normal;
  color: var(--glass-text-muted);
}

.glass-picker__control :deep(.t-range-input__suffix),
.glass-picker__control :deep(.t-range-input__suffix-icon),
.glass-picker__control :deep(.t-input__suffix-icon) {
  display: flex;
  align-items: center;
  height: 100%;
  color: var(--glass-text-muted);
}

.glass-picker__control :deep(.t-input__inner) {
  height: auto;
  line-height: normal;
  font-size: 13px;
  color: var(--glass-text-primary);
}

.glass-picker__control :deep(.t-input__inner::placeholder) {
  color: var(--glass-text-muted);
}
</style>
