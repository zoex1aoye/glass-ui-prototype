<script setup lang="ts">
/**
 * GlassTimePicker — Compound Wrapper 盖 t-time-picker
 *
 * 触发器外壳与 GlassDatePicker 同轨：Quiet Field Chrome + Kill Inner Rect；
 * 面板经 popupProps.overlayInnerClassName 注入 glass-picker-panel（追加不覆盖），
 * 视觉一律由 theme.css 收口（Track B）。
 *
 * 默认 borderless；可选 props 仅显式传入时绑定。事件与 TD 同名透传
 * （change / pick / clear / focus / blur / confirm / input …）；另声明 open / close
 * 以同步外壳 is-popup-open 态并透传给调用方。
 */
import { computed, ref, useAttrs } from 'vue'

import type { TdPopupProps, TdTimePickerProps } from 'tdesign-vue-next'

type TimeValue = TdTimePickerProps['modelValue']

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: TimeValue
    /** 受控 value（与 modelValue 互斥，优先级高于 modelValue） */
    value?: TimeValue
    /** 非受控初始值 */
    defaultValue?: TimeValue
    /** 默认 borderless（true）；可显式传 false 还原 TD 内框 */
    borderless?: boolean
    disabled?: boolean
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
  'update:modelValue': [value: TimeValue]
  open: [context: { e: MouseEvent }]
  close: [context: { e: MouseEvent }]
}>()

const attrs = useAttrs()

/** class / style 落在外壳；其余 attrs（含未声明 listeners）透传 t-time-picker */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const pickerAttrs = computed(() => {
  const { class: _class, style: _style, onOpen: _onOpen, onClose: _onClose, ...rest } = attrs
  return rest
})

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

const optionalBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.disabled !== undefined) bind.disabled = props.disabled
  return bind
})

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
 * 只注入 glass-picker-panel；不注入 onVisibleChange（t-time-picker 的
 * select-input 依赖自身 onVisibleChange 链驱动 isShowPanel，覆盖会破坏开合）。
 * 外壳 is-popup-open 改由 open / close 事件同步。
 */
const mergedPopupProps = computed<TdPopupProps>(() => {
  const user = props.popupProps ?? {}
  return {
    ...user,
    overlayInnerClassName: appendClassName(user.overlayInnerClassName, 'glass-picker-panel'),
  }
})

function onUpdateModelValue(value: TimeValue) {
  emit('update:modelValue', value)
}

function onOpen(context: { e: MouseEvent }) {
  popupOpen.value = true
  emit('open', context)
}

function onClose(context: { e: MouseEvent }) {
  popupOpen.value = false
  emit('close', context)
}
</script>

<template>
  <div
    class="glass-picker glass-timepicker"
    :class="[shellClass, { 'is-disabled': disabled, 'is-popup-open': popupOpen }]"
    :style="shellStyle"
  >
    <t-time-picker
      class="glass-picker__control"
      :borderless="borderless"
      :popup-props="mergedPopupProps"
      v-bind="{ ...pickerAttrs, ...valueBind, ...optionalBind }"
      @update:model-value="onUpdateModelValue"
      @open="onOpen"
      @close="onClose"
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
  padding: 0;
  border: none;
  border-radius: var(--glass-wb-field-radius);
  background: transparent;
  box-shadow: none;
  outline: none;
}

/* Kill Inner Rect：t-time-picker / t-select-input / t-input 全态不画 border / shadow / 脏 bg */
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
