<script setup lang="ts">
/**
 * GlassSelect — Compound Wrapper 盖 t-select
 *
 * Quiet Field Chrome：rest hairline · hover Fade · focus ring only（对齐 GlassInput 裁定 C）
 * Kill Inner Rect：内芯 / t-select 根一律不画 border / box-shadow（含 focused / popup-visible）
 * Focus Ring Follows Radius：外壳 :focus-within 或 popup 打开时挂 --glass-wb-field-focus-ring
 * Popup Width Sync：默认注入 popupProps.overlayInnerStyle，面板宽 = 触发器 offsetWidth；
 *   用户已传 overlayInnerStyle.width 或函数则尊重覆盖，不二次锁宽。
 *
 * 色值走 --glass-wb-*。外壳材质由本 wrapper 承担，t-select 仅作内芯。
 */
import { computed, ref, useAttrs } from 'vue'

import type { TdPopupProps, TdSelectProps } from 'tdesign-vue-next'

type SelectValue = TdSelectProps['modelValue']
type SelectOptionData = NonNullable<TdSelectProps['options']>[number]
type OverlayInnerStyle = TdPopupProps['overlayInnerStyle']

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: SelectValue
    options?: SelectOptionData[]
    placeholder?: string
    clearable?: boolean
    filterable?: boolean
    disabled?: boolean
    popupProps?: TdPopupProps
    selectInputProps?: TdSelectProps['selectInputProps']
    inputProps?: TdSelectProps['inputProps']
  }>(),
  {
    modelValue: undefined,
    options: undefined,
    placeholder: undefined,
    clearable: undefined,
    filterable: undefined,
    disabled: undefined,
    popupProps: undefined,
    selectInputProps: undefined,
    inputProps: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue]
  'popup-visible-change': [visible: boolean, context: unknown]
}>()

const attrs = useAttrs()

/** class / style 落在外壳；其余 attrs（含未声明 listeners）透传 t-select */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const selectAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const innerValue = computed({
  get: () => props.modelValue,
  set: (v: SelectValue) => emit('update:modelValue', v),
})

/**
 * 可选 props 仅在显式传入时绑到 t-select。
 * 原因：TDesign useDisabled 在 isBoolean(componentDisabled) 时优先组件 prop，
 * 若绑 undefined→default false，会挡住 Form 级 disabled 透传。
 */
const selectOptionalBind = computed(() => {
  const bind: Record<string, unknown> = {}
  if (props.options !== undefined) bind.options = props.options
  if (props.placeholder !== undefined) bind.placeholder = props.placeholder
  if (props.clearable !== undefined) bind.clearable = props.clearable
  if (props.filterable !== undefined) bind.filterable = props.filterable
  if (props.disabled !== undefined) bind.disabled = props.disabled
  if (props.selectInputProps !== undefined) bind.selectInputProps = props.selectInputProps
  if (props.inputProps !== undefined) bind.inputProps = props.inputProps
  return bind
})

const popupOpen = ref(false)

function onPopupVisibleChange(visible: boolean, context: unknown) {
  popupOpen.value = visible
  emit('popup-visible-change', visible, context)
}

/** 用户显式锁宽（对象 width）或自定义函数 → 完全尊重，不再注入 */
function userOwnsOverlayInnerStyle(user: OverlayInnerStyle | undefined): boolean {
  if (typeof user === 'function') return true
  return typeof user === 'object' && user !== null && user.width !== undefined
}

/**
 * Popup Width Sync（文档推荐 popupProps.overlayInnerStyle）：
 * 默认函数返回 width = trigger.offsetWidth；可与用户传入的非 width style 合并。
 */
const mergedPopupProps = computed<TdPopupProps>(() => {
  const user = props.popupProps
  const userInner = user?.overlayInnerStyle

  if (userOwnsOverlayInnerStyle(userInner)) {
    return { ...user }
  }

  return {
    ...user,
    /**
     * 以外壳 `.glass-select` 为准测宽（非 TDesign trigger 内芯）。
     * Form :deep 曾给 .t-select 再垫 12px padding，trigger.offsetWidth 会偏窄，
     * 导致下拉比可见触发器窄一截。
     */
    overlayInnerStyle: (triggerElement: HTMLElement) => {
      const shell = triggerElement?.closest?.('.glass-select') as HTMLElement | null
      const width = shell?.offsetWidth || triggerElement?.offsetWidth
      const rest: Record<string, string | number> =
        typeof userInner === 'object' && userInner !== null
          ? { ...(userInner as Record<string, string | number>) }
          : {}
      if (width) {
        rest.width = `${width}px`
      }
      return rest
    },
  }
})
</script>

<template>
  <div
    class="glass-select"
    :class="[shellClass, { 'is-disabled': disabled, 'is-popup-open': popupOpen }]"
    :style="shellStyle"
  >
    <t-select
      v-bind="{ ...selectAttrs, ...selectOptionalBind }"
      v-model="innerValue"
      class="glass-select__control"
      :popup-props="mergedPopupProps"
      @popup-visible-change="onPopupVisibleChange"
    />
  </div>
</template>

<style scoped>
/* 外壳 Quiet Field Chrome：rest inset hairline · hover Fade · focus ring only */
.glass-select {
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

.glass-select:hover:not(.is-disabled):not(:focus-within):not(.is-popup-open) {
  box-shadow: var(--glass-wb-field-hairline-hover);
}

/* Focus Ring Follows Radius：focus-within / popup 打开时保持外环 */
.glass-select:focus-within:not(.is-disabled),
.glass-select.is-popup-open:not(.is-disabled) {
  border: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

.glass-select.is-disabled {
  opacity: var(--glass-wb-control-disabled-opacity);
}

.glass-select.is-disabled:hover,
.glass-select.is-disabled:focus-within,
.glass-select.is-disabled.is-popup-open {
  box-shadow: var(--glass-wb-field-hairline);
}

.glass-select__control {
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

/* Kill Inner Rect：t-select 根 / 内芯 t-input / __wrap 全态不画 border / shadow / 脏 bg */
.glass-select__control :deep(.t-select),
.glass-select__control :deep(.t-select:hover),
.glass-select__control :deep(.t-select:focus),
.glass-select__control :deep(.t-select:focus-within),
.glass-select__control :deep(.t-select.t-is-focused),
.glass-select__control :deep(.t-select.t-select-input--popup-visible),
.glass-select__control :deep(.t-select.t-is-disabled),
.glass-select__control :deep(.t-select.t-is-disabled:hover),
.glass-select__control :deep(.t-select-input),
.glass-select__control :deep(.t-select-input:hover),
.glass-select__control :deep(.t-select-input.t-select-input--popup-visible),
.glass-select__control :deep(.t-select .t-input__wrap),
.glass-select__control :deep(.t-select .t-input),
.glass-select__control :deep(.t-select .t-input:hover),
.glass-select__control :deep(.t-select .t-input:focus),
.glass-select__control :deep(.t-select .t-input:focus-within),
.glass-select__control :deep(.t-select .t-input--focused),
.glass-select__control :deep(.t-select .t-input.t-is-focused),
.glass-select__control :deep(.t-select.t-select-input--popup-visible .t-input),
.glass-select__control :deep(.t-select.t-select-input--popup-visible .t-input:hover),
.glass-select__control :deep(.t-select.t-select-input--popup-visible .t-input.t-is-focused),
.glass-select__control :deep(.t-select.t-select-input--popup-visible .t-input--focused),
.glass-select__control :deep(.t-select-input .t-input__wrap),
.glass-select__control :deep(.t-select-input .t-input),
.glass-select__control :deep(.t-select-input .t-input:hover),
.glass-select__control :deep(.t-select-input .t-input:focus),
.glass-select__control :deep(.t-select-input .t-input--focused),
.glass-select__control :deep(.t-input),
.glass-select__control :deep(.t-input:hover),
.glass-select__control :deep(.t-input:focus),
.glass-select__control :deep(.t-input:focus-within),
.glass-select__control :deep(.t-input--focused),
.glass-select__control :deep(.t-input.t-is-focused),
.glass-select__control :deep(.t-input.t-is-readonly),
.glass-select__control :deep(.t-input.t-is-readonly:hover),
.glass-select__control :deep(.t-input.t-is-disabled),
.glass-select__control :deep(.t-input.t-is-disabled:hover) {
  border: none;
  border-color: transparent;
  background-color: transparent;
  box-shadow: none;
  outline: none;
}

/* Collapse Nested Padding：控制链 .t-select / __wrap / .t-input 贴边 100%，
   水平字距只留外壳一层（.glass-select padding 0 12px），内芯 padding 0。
   radius inherit 贴边，禁止 22px 高 radius:12 的「小胶囊」假内框。 */
.glass-select__control :deep(.t-select),
.glass-select__control :deep(.t-select-input),
.glass-select__control :deep(.t-input__wrap),
.glass-select__control :deep(.t-input) {
  height: 100%;
  min-height: 0;
  padding: 0;
  border-radius: inherit;
  background: transparent;
  box-shadow: none;
  border: none;
  outline: none;
}

.glass-select__control :deep(.t-input__inner),
.glass-select__control :deep(.t-select__input) {
  font-size: var(--glass-type-body-field-size);
  color: var(--glass-type-body-field-color);
}

.glass-select__control :deep(.t-input__inner::placeholder) {
  color: var(--glass-type-placeholder-color);
}

.glass-select__control :deep(.t-select__right-icon),
.glass-select__control :deep(.t-input__suffix-icon) {
  color: var(--glass-text-muted);
}

/* multiple / tag：TagInput 内芯同样 Kill */
.glass-select__control :deep(.t-tag-input),
.glass-select__control :deep(.t-tag-input:hover),
.glass-select__control :deep(.t-tag-input.t-is-focused) {
  border: none;
  background: transparent;
  box-shadow: none;
  outline: none;
}
</style>
