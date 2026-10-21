<script setup lang="ts">
/**
 * GlassInput — Compound Wrapper 盖 t-input
 * 普通态 / 搜索态（search）两种材质；色值走 --glass-wb-*。
 * MCP：搜索图标优先走 t-input `prefixIcon` 插槽，避免外层再叠一层 icon wrap。
 * 外壳材质保留（磨砂底 / blur），由本 wrapper 承担，与 t-input 的 borderless 内芯分离。
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { SearchIcon } from 'tdesign-icons-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    /** 搜索态：prefixIcon 挂 SearchIcon + 磨砂底；圆角仍走 Field（--glass-wb-field-radius） */
    search?: boolean
    clearable?: boolean
    /** 显式传入才绑 t-input；undefined 时留给 Form 级 disabled 透传 */
    disabled?: boolean
    /** 原生 input 的 id；用于外部 label 的 for 关联 */
    id?: string
    /** 独立使用时显式提供可访问名；不再回退到 placeholder */
    ariaLabel?: string
    /** 引用页面上另一段可见文案作为可访问名 */
    ariaLabelledby?: string
  }>(),
  {
    modelValue: '',
    placeholder: '',
    search: false,
    clearable: undefined,
    disabled: undefined,
    id: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  enter: [value: string]
}>()

const innerValue = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v),
})

const rootRef = ref<HTMLElement | null>(null)

/**
 * TDesign 1.20.10 没有把 aria-label / aria-labelledby / id 透传到内芯 input；
 * 直接写在 t-input 上只会落到外层 div。这里只同步调用方显式提供的可访问名，
 * 不生成 placeholder 名称，也不覆盖 GlassForm 自动写入的关联。
 */
function syncNativeInputA11y() {
  const input = rootRef.value?.querySelector<HTMLInputElement>('input')
  if (!input) return

  if (props.id) input.id = props.id
  if (props.ariaLabel) input.setAttribute('aria-label', props.ariaLabel)
  if (props.ariaLabelledby) input.setAttribute('aria-labelledby', props.ariaLabelledby)
}

onMounted(syncNativeInputA11y)

watch(
  () => [props.id, props.ariaLabel, props.ariaLabelledby],
  () => {
    void nextTick(syncNativeInputA11y)
  },
)

/** 可选 props 仅显式传入时绑 t-input，避免 default false 挡住 Form 级 disabled */
const inputOptionalBind = computed(() => {
  const bind: Record<string, boolean> = {}
  if (props.clearable !== undefined) bind.clearable = props.clearable
  if (props.disabled !== undefined) bind.disabled = props.disabled
  return bind
})
</script>

<template>
  <div
    ref="rootRef"
    class="glass-input"
    :class="{ 'glass-input--search': search, 'is-disabled': disabled }"
  >
    <t-input
      v-model="innerValue"
      v-bind="inputOptionalBind"
      class="glass-input__control"
      :type="search ? 'search' : 'text'"
      :placeholder="placeholder"
      borderless
      @enter="emit('enter', innerValue)"
    >
      <!-- MCP 推荐：搜索图标走 prefixIcon 插槽，不另起外层 icon wrap -->
      <template v-if="search" #prefixIcon>
        <SearchIcon size="14" class="glass-input__icon" aria-hidden="true" />
      </template>
    </t-input>
  </div>
</template>

<style scoped>
/* 外壳只负责玻璃材质；内部 t-input borderless 作内芯，避免双层描边。
   Input Quiet Chrome（裁定 C）：rest inset hairline · hover Fade · focus ring only。
   禁止按钮式大位移 lift；禁止 field-hover-border / field-focus-border 实线叙事。 */
.glass-input {
  display: flex;
  align-items: center;
  height: var(--glass-wb-field-height);
  padding: 0 12px;
  border-radius: var(--glass-wb-field-radius);
  border: none;
  background: var(--glass-wb-field-bg);
  box-shadow: var(--glass-wb-field-hairline);
  transition: box-shadow 0.15s ease;
}

.glass-input--search {
  background: var(--glass-wb-search-bg);
  -webkit-backdrop-filter: var(--glass-wb-search-blur);
  backdrop-filter: var(--glass-wb-search-blur);
}

/* hover（非 focus）：hairline Fade，无 lift */
.glass-input:hover:not(.is-disabled):not(:focus-within) {
  box-shadow: var(--glass-wb-field-hairline-hover);
}

/* Focus Ring Follows Radius：ring only，hairline / border 透明，不叠亮边 */
.glass-input:focus-within:not(.is-disabled) {
  border: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

.glass-input.is-disabled {
  opacity: 0.6;
}

.glass-input.is-disabled:hover,
.glass-input.is-disabled:focus-within {
  box-shadow: var(--glass-wb-field-hairline);
}

.glass-input__icon {
  color: var(--glass-text-muted);
  flex-shrink: 0;
}

/* __control 挂在 t-input 根（.t-input__wrap）：贴满外壳，禁 22px 小胶囊 */
.glass-input__control {
  flex: 1;
  align-self: stretch;
  min-width: 0;
  height: 100%;
  background: transparent;
  padding: 0;
}

/* Kill Nested Input Frame + Collapse Nested Padding：内芯无边无影，贴边 100% */
.glass-input__control :deep(.t-input),
.glass-input__control :deep(.t-input:hover),
.glass-input__control :deep(.t-input:focus),
.glass-input__control :deep(.t-input--focused),
.glass-input__control :deep(.t-input--focused:hover),
.glass-input__control :deep(.t-input--borderless),
.glass-input__control :deep(.t-input--borderless:hover),
.glass-input__control :deep(.t-input--borderless:not(.t-input--focused)),
.glass-input__control :deep(.t-input--borderless:not(.t-input--focused):hover),
.glass-input__control :deep(.t-input--borderless:not(.t-input--focused).t-is-disabled),
.glass-input__control :deep(.t-input.t-is-disabled),
.glass-input__control :deep(.t-input.t-is-disabled:hover),
.glass-input__control :deep(.t-input.t-is-readonly),
.glass-input__control :deep(.t-input.t-is-readonly:hover),
.glass-input__control :deep(.t-input.t-is-focused) {
  border: none;
  border-color: transparent;
  box-shadow: none;
  outline: none;
  background: transparent;
  background-color: transparent;
  height: 100%;
  min-height: 0;
  padding: 0;
  border-radius: inherit;
}

.glass-input__control :deep(.t-input__inner) {
  font-size: var(--glass-type-body-field-size);
  color: var(--glass-type-body-field-color);
}

.glass-input__control :deep(.t-input__inner::placeholder) {
  color: var(--glass-type-placeholder-color);
}

.glass-input__control :deep(.t-input__prefix-icon) {
  color: var(--glass-text-muted);
}
</style>
