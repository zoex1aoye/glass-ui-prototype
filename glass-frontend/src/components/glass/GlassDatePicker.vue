<script setup lang="ts">
/**
 * GlassDatePicker — Compound Wrapper 盖 t-date-picker
 *
 * 触发器外壳：Quiet Field Chrome（rest inset hairline · hover Fade · focus ring only，
 * 对齐 GlassInput / GlassSelect）。外壳材质由本 wrapper 承担，t-date-picker 作内芯。
 * Kill Inner Rect：内芯 / select-input / t-input 全态不画 border / box-shadow / 脏 bg。
 *
 * 面板（popup 传送门）：经 popupProps.overlayInnerClassName 注入 glass-picker-panel，
 * 保留用户已有 class（只追加不覆盖）。面板视觉一律由 theme.css 的
 * .glass-picker-panel 收口（Track B）；本组件不写面板皮肤。
 *
 * 默认 borderless；可选 props 仅显式传入时绑定（避免 disabled: false 挡 Form 级透传）。
 * 事件与 TD 同名透传（change / pick / clear / focus / blur / confirm / preset-click /
 * month-change / year-change …）；v-model 走 modelValue + update:modelValue。
 */
import { computed, ref, useAttrs } from 'vue'

import type { TdDatePickerProps, TdPopupProps } from 'tdesign-vue-next'

type DateValue = TdDatePickerProps['modelValue']

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: DateValue
    /** 受控 value（与 modelValue 互斥，优先级高于 modelValue） */
    value?: DateValue
    /** 非受控初始值 */
    defaultValue?: DateValue
    /** 默认 borderless（true）；可显式传 false 还原 TD 内框 */
    borderless?: boolean
    disabled?: boolean
    /** 日期 + 时间同窗：为 popup 面板追加 --with-time 钩子 */
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
  'update:modelValue': [value: DateValue]
}>()

const attrs = useAttrs()

/** class / style 落在外壳；其余 attrs（含未声明 listeners）透传 t-date-picker */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const pickerAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
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
 * 注入 glass-picker-panel（enableTimePicker 时追加 --with-time）；
 * onVisibleChange 仅用于外壳 is-popup-open 态。
 * t-date-picker 内部 useSingle 会调用 popupProps.onVisibleChange / on-visible-change，
 * 此处包一层并保留用户回调（user.onVisibleChange；kebab on-visible-change 经 spread 保留）。
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
    onVisibleChange: (visible: boolean, context: Parameters<NonNullable<TdPopupProps['onVisibleChange']>>[1]) => {
      popupOpen.value = visible
      user.onVisibleChange?.(visible, context)
    },
  }
})

function onUpdateModelValue(value: DateValue) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    class="glass-picker glass-datepicker"
    :class="[shellClass, { 'is-disabled': disabled, 'is-popup-open': popupOpen }]"
    :style="shellStyle"
  >
    <t-date-picker
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
  background: var(--glass-wb-white);
  box-shadow: var(--glass-wb-field-hairline);
  box-sizing: border-box;
  transition: box-shadow 0.15s ease;
}

.glass-picker:hover:not(.is-disabled):not(:focus-within):not(.is-popup-open) {
  box-shadow: var(--glass-wb-field-hairline-hover);
}

/* Focus Ring Follows Radius：focus-within / popup 打开时保持外环 */
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
  padding: 0;
  border: none;
  border-radius: var(--glass-wb-field-radius);
  background: transparent;
  box-shadow: none;
  outline: none;
}

/* Kill Inner Rect：t-date-picker / t-select-input / t-input 全态不画 border / shadow / 脏 bg */
.glass-picker__control :deep(.t-select-input),
.glass-picker__control :deep(.t-select-input:hover),
.glass-picker__control :deep(.t-select-input--popup-visible),
.glass-picker__control :deep(.t-input__wrap),
.glass-picker__control :deep(.t-input),
.glass-picker__control :deep(.t-input:hover),
.glass-picker__control :deep(.t-input:focus),
.glass-picker__control :deep(.t-input:focus-within),
.glass-picker__control :deep(.t-input--focused),
.glass-picker__control :deep(.t-input.t-is-focused),
.glass-picker__control :deep(.t-input.t-is-disabled),
.glass-picker__control :deep(.t-input.t-is-disabled:hover),
.glass-picker__control :deep(.t-input.t-is-readonly),
.glass-picker__control :deep(.t-input.t-is-readonly:hover) {
  border: none;
  border-color: transparent;
  background-color: transparent;
  box-shadow: none;
  outline: none;
}

/* Collapse Nested Padding：控制链 .t-select-input / __wrap / .t-input 贴边 100% */
.glass-picker__control :deep(.t-select-input),
.glass-picker__control :deep(.t-input__wrap),
.glass-picker__control :deep(.t-input) {
  height: 100%;
  min-height: 0;
  padding: 0;
  border-radius: inherit;
  background: transparent;
  box-shadow: none;
  border: none;
  outline: none;
}

.glass-picker__control :deep(.t-input__inner) {
  font-size: 13px;
  color: var(--glass-text-primary);
}

.glass-picker__control :deep(.t-input__inner::placeholder) {
  color: var(--glass-text-muted);
}

.glass-picker__control :deep(.t-input__suffix-icon) {
  color: var(--glass-text-muted);
}
</style>
