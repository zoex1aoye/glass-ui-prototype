<script setup lang="ts">
/**
 * GlassDateRangePicker — Compound Wrapper 盖 t-date-range-picker
 *
 * 触发器外壳与 GlassDatePicker 同轨：Quiet Field Chrome（rest inset hairline ·
 * hover Fade · focus ring only）。外壳材质由本 wrapper 承担，t-date-range-picker
 * 作内芯；Kill Inner Rect 覆盖 .t-range-input / 内芯 input，禁止双层描边。
 *
 * 面板（popup 传送门）：经 popupProps.overlayInnerClassName 注入 glass-picker-panel，
 * 保留用户已有 class（只追加不覆盖）；enableTimePicker 为 true 时再追加
 * glass-picker-panel--with-time。面板视觉一律由 theme.css 收口（Track B）。
 *
 * 默认 borderless；可选 props 仅显式传入时绑定（避免 disabled: false 挡 Form 级透传）。
 * 事件与 TD 同名透传（change / pick / clear / focus / blur / confirm / input /
 * preset-click / month-change / year-change …）；v-model 走 modelValue + update:modelValue。
 */
import { computed, ref, useAttrs } from 'vue'

import type { TdDateRangePickerProps, TdPopupProps } from 'tdesign-vue-next'

type DateRangeValue = TdDateRangePickerProps['modelValue']

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: DateRangeValue
    /** 受控 value（与 modelValue 互斥，优先级高于 modelValue） */
    value?: DateRangeValue
    /** 非受控初始值 */
    defaultValue?: DateRangeValue
    /** 默认 borderless（true）；可显式传 false 还原 TD 内框 */
    borderless?: boolean
    /** 整体禁用（boolean）或分侧禁用（[start, end]） */
    disabled?: boolean | Array<boolean>
    enableTimePicker?: boolean
    popupProps?: TdPopupProps
  }>(),
  {
    modelValue: undefined,
    value: undefined,
    defaultValue: undefined,
    borderless: true,
    disabled: undefined,
    enableTimePicker: undefined,
    popupProps: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: DateRangeValue]
}>()

const attrs = useAttrs()

/** class / style 落在外壳；其余 attrs（含未声明 listeners）透传 t-date-range-picker */
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
  if (props.enableTimePicker !== undefined) bind.enableTimePicker = props.enableTimePicker
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
 * 注入 glass-picker-panel（enableTimePicker 时追加 --with-time）。
 * t-date-range-picker 内部 useRange 会调用 popupProps.onVisibleChange /
 * on-visible-change，此处包一层并保留用户回调（user.onVisibleChange）。
 */
const mergedPopupProps = computed<TdPopupProps>(() => {
  const user = props.popupProps ?? {}
  let overlayInnerClassName = appendClassName(user.overlayInnerClassName, 'glass-picker-panel')
  if (props.enableTimePicker) {
    overlayInnerClassName = appendClassName(overlayInnerClassName, 'glass-picker-panel--with-time')
  }
  return {
    ...user,
    overlayInnerClassName,
    onVisibleChange: (
      visible: boolean,
      context: Parameters<NonNullable<TdPopupProps['onVisibleChange']>>[1],
    ) => {
      popupOpen.value = visible
      user.onVisibleChange?.(visible, context)
    },
  }
})

function onUpdateModelValue(value: DateRangeValue) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    class="glass-picker glass-daterangepicker"
    :class="[shellClass, { 'is-disabled': isDisabled, 'is-popup-open': popupOpen }]"
    :style="shellStyle"
  >
    <t-date-range-picker
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
