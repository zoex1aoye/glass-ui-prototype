<script setup lang="ts">
/**
 * GlassDropdown — Compound Wrapper 盖 t-dropdown
 *
 * 触发钮 = 真 GlassButton（按钮与行动）：默认 soft（Composer 角色）；
 * triggerVariant 可切 quiet / primary（Actions 对照）。default slot = 自定义触发器，
 * 无 slot 时 label + chevron 默认 soft 钮。禁止自绘第二套灰边触发器。
 *
 * 菜单面板：overlayClassName 必含 glass-dropdown（teleport 非 scoped 锚）。
 * Quiet Chrome：近白微透 fill、主题蓝 item hover/active whisper、禁灰脏边。
 * 色值一律走 --glass-wb-dropdown-*。
 */
import { computed } from 'vue'

import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import type { DropdownOption, TdDropdownProps, TdPopupProps } from 'tdesign-vue-next'

import GlassButton from './GlassButton.vue'

type DropdownTrigger = TdDropdownProps['trigger']
type DropdownPlacement = TdDropdownProps['placement']
type DropdownPopupProps = TdDropdownProps['popupProps']
type TriggerVariant = 'soft' | 'quiet' | 'primary'

const props = withDefaults(
  defineProps<{
    options?: TdDropdownProps['options']
    /** 默认 click（按钮触发）；TD 默认 hover */
    trigger?: DropdownTrigger
    placement?: DropdownPlacement
    disabled?: boolean
    hideAfterItemClick?: boolean
    popupProps?: DropdownPopupProps
    /** 默认触发钮 Glass 变体；primary → Primary Pill（shape round） */
    triggerVariant?: TriggerVariant
    /** 无 slot 时的触发钮文案 */
    label?: string
    /** 无 slot 且仅 chevron 时的无障碍名称 */
    ariaLabel?: string
  }>(),
  {
    options: undefined,
    trigger: 'click',
    placement: undefined,
    disabled: undefined,
    hideAfterItemClick: undefined,
    popupProps: undefined,
    triggerVariant: 'soft',
    label: undefined,
    ariaLabel: undefined,
  },
)

const emit = defineEmits<{
  click: [dropdownItem: DropdownOption, context: { e: MouseEvent }]
}>()

/**
 * overlayClassName 必含 glass-dropdown；用户 class 只追加不覆盖。
 * t-dropdown 会把 t-dropdown 挂在 overlayInnerClassName，面板体样式锚在
 * .glass-dropdown .t-dropdown。
 */
const mergedPopupProps = computed<DropdownPopupProps>(() => {
  const base = props.popupProps ?? {}
  const userClass = (base as TdPopupProps).overlayClassName
  const append = (list: string[]) => [...list, 'glass-dropdown']

  let overlayClassName: TdPopupProps['overlayClassName']
  if (typeof userClass === 'function') {
    const fn = userClass
    overlayClassName = ((...args: unknown[]) => {
      const resolved = (fn as (...a: unknown[]) => unknown)(...args)
      const list = Array.isArray(resolved)
        ? resolved.map(String)
        : String(resolved ?? '').split(/\s+/).filter(Boolean)
      return append(list).join(' ')
    }) as TdPopupProps['overlayClassName']
  } else if (Array.isArray(userClass)) {
    overlayClassName = append(userClass.map(String)).join(' ')
  } else {
    overlayClassName = append(String(userClass ?? '').split(/\s+/).filter(Boolean)).join(' ')
  }

  return { ...base, overlayClassName }
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认 */
const dropdownOptionalBind = computed(() => {
  const bind: Record<string, unknown> = {}
  if (props.options !== undefined) bind.options = props.options
  if (props.placement !== undefined) bind.placement = props.placement
  if (props.disabled !== undefined) bind.disabled = props.disabled
  if (props.hideAfterItemClick !== undefined) bind.hideAfterItemClick = props.hideAfterItemClick
  return bind
})

/** primary 落 Primary Pill（round），勿落 42px 块级几何 */
const triggerShape = computed(() =>
  props.triggerVariant === 'primary' ? ('round' as const) : undefined,
)

function onClick(data: DropdownOption, context: { e: MouseEvent }) {
  emit('click', data, context)
}
</script>

<template>
  <t-dropdown
    :trigger="trigger"
    :popup-props="mergedPopupProps"
    v-bind="dropdownOptionalBind"
    @click="onClick"
  >
    <slot>
      <GlassButton
        :variant="triggerVariant"
        :shape="triggerShape"
        :disabled="disabled"
        :aria-label="ariaLabel"
      >
        <span v-if="label">{{ label }}</span>
        <template #suffix>
          <ChevronDownIcon size="13" />
        </template>
      </GlassButton>
    </slot>
  </t-dropdown>
</template>

<style>
/* teleport 到 body：非 scoped，锚在 overlayClassName glass-dropdown。
   DOM：.t-popup.glass-dropdown > .t-popup__content.t-dropdown
        > .t-dropdown__menu > .t-dropdown__item */

/* Quiet Chrome 面板：近白微透；杀掉 TD 0.5px 灰脏边 */
.glass-dropdown .t-dropdown {
  background: var(--glass-wb-dropdown-fill);
  -webkit-backdrop-filter: var(--glass-wb-dropdown-blur);
  backdrop-filter: var(--glass-wb-dropdown-blur);
  border: none;
  border-radius: var(--glass-wb-dropdown-radius);
  box-shadow: var(--glass-wb-dropdown-shadow);
}

.glass-dropdown .t-dropdown__submenu {
  background: var(--glass-wb-dropdown-fill);
  -webkit-backdrop-filter: var(--glass-wb-dropdown-blur);
  backdrop-filter: var(--glass-wb-dropdown-blur);
  border: none;
  border-radius: var(--glass-wb-dropdown-radius);
  box-shadow: var(--glass-wb-dropdown-shadow);
}

/* 项：圆角 + 品牌冷色 ripple（盖 TD 灰 ripple） */
.glass-dropdown .t-dropdown__item {
  border-radius: var(--glass-wb-dropdown-item-radius);
  color: var(--glass-wb-dropdown-item-color);
  --ripple-color: var(--glass-wb-dropdown-ripple);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

/* 主题蓝 hover / active whisper（特异性压过 TD theme-*） */
.glass-dropdown .t-dropdown__item--theme-default:hover {
  background-color: var(--glass-wb-dropdown-item-hover-bg);
  color: var(--glass-wb-dropdown-item-hover-color);
}

.glass-dropdown .t-dropdown__item--theme-default:active {
  background-color: var(--glass-wb-dropdown-item-active-bg);
  color: var(--glass-wb-dropdown-item-active-color);
}

.glass-dropdown .t-dropdown__item--theme-default.t-dropdown__item--active,
.glass-dropdown .t-dropdown__item--theme-default.t-dropdown__item--active:hover {
  background-color: var(--glass-wb-dropdown-item-active-bg);
  color: var(--glass-wb-dropdown-item-active-color);
}

/* 语义项只换 hover 底，保留 TD 主题字色 */
.glass-dropdown .t-dropdown__item--theme-success:hover,
.glass-dropdown .t-dropdown__item--theme-warning:hover,
.glass-dropdown .t-dropdown__item--theme-error:hover {
  background-color: var(--glass-wb-dropdown-item-hover-bg);
}

/* disabled：降强调，无抬升；盖掉 TD disabled:hover 仍染底 */
.glass-dropdown .t-dropdown__item--theme-default.t-dropdown__item--disabled,
.glass-dropdown .t-dropdown__item--theme-default.t-dropdown__item--disabled:hover {
  background-color: transparent;
  color: var(--glass-wb-dropdown-item-disabled-color);
  cursor: not-allowed;
}

/* 键盘焦点可见 */
.glass-dropdown .t-dropdown__item:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}
</style>
