<script setup lang="ts">
/**
 * GlassSearchCapsule — Capsule Field / Pill Search
 *
 * Compound Wrapper：外层 Glass 胶囊壳 + 内嵌 t-input（borderless）。
 * 与 GlassInput 的 search 态区分：本组件永远是「胶囊 / Pill」几何
 * （矮控件 + border-radius 999px），对外 API 专门化，不暴露 search 开关。
 *
 * 术语：
 * - Capsule Field / Pill Search：半高胶囊搜索框（height≈32–34px / radius 999px）
 * - Quiet Chrome：≤1px 软描边 var(--glass-border-soft)，不抢焦点
 * - Compound Wrapper：外壳材质（磨砂底 / blur）由本 wrapper 承担，t-input 仅作内芯
 *
 * MCP（vue-next Input）：borderless + size + clearable + #prefixIcon；
 * 搜索图标走 t-input `prefixIcon` 插槽，禁止外层再叠 icon wrap。
 */
import { computed } from 'vue'
import { SearchIcon } from 'tdesign-icons-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '搜索历史会话',
    clearable: true,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  enter: [value: string]
  clear: []
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
}>()

const innerValue = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v),
})

function onEnter() {
  emit('enter', innerValue.value)
}

function onClear() {
  emit('clear')
}

function onFocus(_value: string, context: { e: FocusEvent }) {
  emit('focus', context.e)
}

function onBlur(_value: string, context: { e: FocusEvent }) {
  emit('blur', context.e)
}
</script>

<template>
  <div class="glass-search-capsule" :class="{ 'is-disabled': disabled }">
    <t-input
      v-model="innerValue"
      class="glass-search-capsule__control"
      type="text"
      size="small"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      :aria-label="placeholder"
      borderless
      @enter="onEnter"
      @clear="onClear"
      @focus="onFocus"
      @blur="onBlur"
    >
      <!-- MCP 推荐：搜索图标走 prefixIcon 插槽，不另起外层 icon wrap -->
      <template #prefixIcon>
        <SearchIcon size="14" class="glass-search-capsule__icon" />
      </template>
    </t-input>
  </div>
</template>

<style scoped>
/* Capsule Field / Pill Search：矮控件 + 半高胶囊。
   Input Quiet Chrome（裁定 C）：rest inset hairline · hover Fade · focus ring only。
   禁止按钮式大位移 lift；禁止 field-hover-border / field-focus-border 实线叙事。 */
.glass-search-capsule {
  display: flex;
  align-items: center;
  height: 33px;
  padding: 0 14px;
  border-radius: var(--glass-wb-capsule-radius);
  border: none;
  background: var(--glass-wb-search-bg);
  -webkit-backdrop-filter: var(--glass-wb-search-blur);
  backdrop-filter: var(--glass-wb-search-blur);
  box-sizing: border-box;
  box-shadow: var(--glass-wb-field-hairline);
  transition: box-shadow 0.15s ease;
}

/* hover（非 focus）：hairline Fade，无 lift */
.glass-search-capsule:hover:not(.is-disabled):not(:focus-within) {
  box-shadow: var(--glass-wb-field-hairline-hover);
}

/* Focus Ring Follows Radius：ring only，hairline / border 透明，贴合胶囊圆角 */
.glass-search-capsule:focus-within:not(.is-disabled) {
  border: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

.glass-search-capsule.is-disabled {
  opacity: 0.6;
}

.glass-search-capsule.is-disabled:hover,
.glass-search-capsule.is-disabled:focus-within {
  box-shadow: var(--glass-wb-field-hairline);
}

.glass-search-capsule__icon {
  color: var(--glass-text-muted);
  flex-shrink: 0;
}

.glass-search-capsule__control {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}

/* Kill Inner Rect：内芯不得再画 TDesign 默认 border / box-shadow / 脏 bg */
.glass-search-capsule__control :deep(.t-input),
.glass-search-capsule__control :deep(.t-input:hover),
.glass-search-capsule__control :deep(.t-input:focus),
.glass-search-capsule__control :deep(.t-input--focused),
.glass-search-capsule__control :deep(.t-input--focused:hover),
.glass-search-capsule__control :deep(.t-input--borderless),
.glass-search-capsule__control :deep(.t-input--borderless:hover),
.glass-search-capsule__control :deep(.t-input--borderless:not(.t-input--focused)),
.glass-search-capsule__control :deep(.t-input--borderless:not(.t-input--focused):hover),
.glass-search-capsule__control :deep(.t-input--borderless:not(.t-input--focused).t-is-disabled),
.glass-search-capsule__control :deep(.t-input.t-is-disabled),
.glass-search-capsule__control :deep(.t-input.t-is-disabled:hover),
.glass-search-capsule__control :deep(.t-input.t-is-focused) {
  border-color: transparent;
  box-shadow: none;
  outline: none;
  background-color: transparent;
}

.glass-search-capsule__control :deep(.t-input) {
  border-radius: var(--glass-wb-capsule-radius);
  height: 100%;
}

.glass-search-capsule__control :deep(.t-input__inner) {
  font-size: 13px;
  color: var(--glass-text-primary);
}

.glass-search-capsule__control :deep(.t-input__inner::placeholder) {
  color: var(--glass-text-muted);
}

.glass-search-capsule__control :deep(.t-input__prefix-icon) {
  color: var(--glass-text-muted);
}
</style>
