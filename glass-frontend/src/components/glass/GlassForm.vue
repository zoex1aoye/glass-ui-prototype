<script setup lang="ts">
/**
 * GlassForm — Compound Wrapper 盖 t-form + t-form-item
 *
 * UI/UX 术语：
 * - Glass Form Density：标签、控件、校验提示同一垂直节奏；控件高度对齐 Capsule Field（38px）
 * - Quiet Field Chrome：裸 t-input / t-select / t-textarea 同 Input Quiet Chrome 裁定 C——
 *   rest hairline · hover Fade · focus ring only · Kill Inner Rect；禁止亮实线脏箍
 * - Validation Whisper：error / warning / success 文案 tip 轻提示（12px 柔色），不砸布局
 * - Form a11y：可见 label 自动关联控件；错误写 aria-describedby / aria-invalid；
 *   提交失败落焦首个无效字段（scrollToFirstError 默认 smooth）
 * - Label Rhythm：top 标签在上留 6–8px 下距；left/right 与控件垂直居中、取消下 padding
 * - Choice Quiet：Checkbox / Radio / Switch 字色 secondary、选中统一 Action Blue、禁用降透
 *
 * 内嵌 GlassInput 时自带外壳，Field Chrome 不对内芯二次描边（禁双环）。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

import type {
  FormInstanceFunctions,
  FormProps,
  FormRules,
  FormValidateMessage,
  SubmitContext,
  ValidateResultContext,
} from 'tdesign-vue-next'

import { bindFormA11y, type FormA11yBinding } from './formA11y'

type FormData = NonNullable<FormProps['data']>

const props = withDefaults(
  defineProps<{
    data?: FormData
    rules?: FormRules
    /** 展厅默认 top：标签在上，密度更稳 */
    labelAlign?: FormProps['labelAlign']
    labelWidth?: FormProps['labelWidth']
    colon?: boolean
    requiredMark?: boolean
    showErrorMessage?: boolean
    /** 默认 false —— Validation Whisper 安静，不加 statusIcon */
    statusIcon?: boolean
    disabled?: boolean
    /** 整表只读（TDesign Form API 透传） */
    readonly?: boolean
    resetType?: FormProps['resetType']
    /** 多错时滚动到首个错误；默认 smooth，reduced-motion 由 focus helper 处理 */
    scrollToFirstError?: FormProps['scrollToFirstError']
  }>(),
  {
    data: undefined,
    rules: undefined,
    labelAlign: 'top',
    labelWidth: undefined,
    colon: false,
    requiredMark: undefined,
    showErrorMessage: true,
    statusIcon: false,
    disabled: false,
    readonly: undefined,
    resetType: undefined,
    scrollToFirstError: 'smooth',
  },
)

const emit = defineEmits<{
  submit: [context: SubmitContext<FormData>]
  reset: [context: { e?: Event }]
  validate: [result: ValidateResultContext<FormData>]
}>()

const formRef = ref<FormInstanceFunctions>()
const rootRef = ref<HTMLElement | null>(null)
const a11yId = useId().replace(/[^a-zA-Z0-9_-]/g, '')

let formA11y: FormA11yBinding | null = null

const resolvedScrollToFirstError = computed<FormProps['scrollToFirstError']>(() => {
  if (props.scrollToFirstError !== 'smooth') return props.scrollToFirstError
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    return 'auto'
  }
  return 'smooth'
})

onMounted(async () => {
  await nextTick()
  if (rootRef.value) {
    formA11y = bindFormA11y(rootRef.value, {
      idPrefix: `glass-form-${a11yId}`,
    })
  }
})

onBeforeUnmount(() => {
  formA11y?.destroy()
  formA11y = null
})

function validate(...args: Parameters<FormInstanceFunctions['validate']>) {
  return formRef.value?.validate(...args)
}

function validateOnly(...args: Parameters<FormInstanceFunctions['validateOnly']>) {
  return formRef.value?.validateOnly(...args)
}

function submit(...args: Parameters<FormInstanceFunctions['submit']>) {
  formRef.value?.submit(...args)
}

function reset(...args: Parameters<FormInstanceFunctions['reset']>) {
  formRef.value?.reset(...args)
}

function clearValidate(...args: Parameters<FormInstanceFunctions['clearValidate']>) {
  formRef.value?.clearValidate(...args)
}

/** 供 Lab E 演示 Validation Whisper（error / warning / success） */
function setValidateMessage(message: FormValidateMessage<FormData>) {
  formRef.value?.setValidateMessage(message)
}

/** 供调用方在校验失败后主动落焦首个无效字段 */
async function focusFirstError() {
  await nextTick()
  formA11y?.sync()
  return formA11y?.focusFirstError() ?? false
}

/** TDesign 的 @submit 在异步校验完成后触发；失败时补首错聚焦 */
async function onSubmit(context: SubmitContext<FormData>) {
  if (context.validateResult !== true) {
    await focusFirstError()
  }
  emit('submit', context)
}

defineExpose({
  validate,
  validateOnly,
  submit,
  reset,
  clearValidate,
  setValidateMessage,
  focusFirstError,
})
</script>

<template>
  <div ref="rootRef" class="glass-form">
    <t-form
      ref="formRef"
      class="glass-form__form"
      :data="data"
      :rules="rules"
      :label-align="labelAlign"
      :label-width="labelWidth"
      :colon="colon"
      :required-mark="requiredMark"
      :show-error-message="showErrorMessage"
      :status-icon="statusIcon"
      :disabled="disabled"
      :readonly="readonly"
      :reset-type="resetType"
      :scroll-to-first-error="resolvedScrollToFirstError"
      layout="vertical"
      @submit="onSubmit"
      @reset="emit('reset', $event)"
      @validate="emit('validate', $event)"
    >
      <slot />
    </t-form>
  </div>
</template>

<style scoped>
/* Glass Form Density：表单项垂直节奏 16–18px */
.glass-form__form :deep(.t-form__item) {
  margin-bottom: 17px;
}

.glass-form__form :deep(.t-form__item--last) {
  margin-bottom: 0;
}

/* Label Rhythm — 公共：13px 次级色 */
.glass-form__form :deep(.t-form__label) {
  font-size: 13px;
  font-weight: 500;
  color: var(--glass-text-secondary);
  line-height: 1.4;
}

/* Required Mark — 柔化：收敛 TDesign 默认粉红至 Validation Whisper error 同族 token */
.glass-form__form :deep(.t-form__required-mark) {
  color: var(--glass-wb-form-required-mark);
}

.glass-form__form :deep(.t-form__label--required label::before) {
  color: var(--glass-wb-form-required-mark);
}

/* top：标签在上，与控件 6–8px */
.glass-form__form :deep(.t-form__label--top),
.glass-form__form :deep(.t-form__label):not(.t-form__label--left):not(.t-form__label--right) {
  float: none;
  padding: 0 0 7px;
}

/* left / right：取消下 padding，与 Field 38 垂直居中 */
.glass-form__form :deep(.t-form__label--left),
.glass-form__form :deep(.t-form__label--right) {
  padding: 0 16px 0 0;
  padding-bottom: 0;
  min-height: var(--glass-wb-field-height);
  line-height: var(--glass-wb-field-height);
  box-sizing: border-box;
}

.glass-form__form :deep(.t-form__controls) {
  display: block;
}

/* left / right：控件列与 38 Field 对齐 */
.glass-form__form :deep(.t-form__controls-content) {
  min-height: var(--glass-wb-field-height);
  align-items: center;
}

/* Quiet Field Chrome — 裸控件 rest hairline（裁定 C）
   禁止实线 --glass-border-soft 箍边；禁止 focus 亮实线 --glass-wb-field-focus-border
   Single Chrome Layer：.t-input 仅当「自身即字段外壳」时画 hairline；
   Select 内芯 .t-input 不得画（:not 排除），否则与 .t-select 外壳叠成双环。
   GlassSelect / GlassInput 已自带外壳，内层不得再画（:not(.glass-select *) / :not(.glass-input *)）。 */
.glass-form__form
  :deep(
    .t-input:not(.t-select .t-input):not(.t-select-input .t-input):not(.glass-select *):not(.glass-input *)
  ),
.glass-form__form :deep(.t-select:not(.glass-select *)),
.glass-form__form :deep(.t-textarea__inner) {
  border: none;
  border-radius: var(--glass-wb-field-radius);
  background: var(--glass-wb-field-bg);
  box-shadow: var(--glass-wb-field-hairline);
  transition: box-shadow 0.15s ease;
}

/* Collapse Nested Padding：控制链贴边 100%，水平字距只留外壳一层
   （裸 Select = .t-select padding 0 12px；内芯 padding 0，禁 12+8 假内框） */
.glass-form__form :deep(.t-select .t-input__wrap),
.glass-form__form :deep(.t-select .t-input),
.glass-form__form :deep(.t-select-input .t-input__wrap),
.glass-form__form :deep(.t-select-input .t-input) {
  height: 100%;
  min-height: 0;
  padding: 0;
  border-radius: inherit;
  background: transparent;
  box-shadow: none;
  border: none;
  outline: none;
}

.glass-form__form :deep(.t-input),
.glass-form__form :deep(.t-select) {
  height: var(--glass-wb-field-height);
  min-height: var(--glass-wb-field-height);
}

.glass-form__form :deep(.t-input__inner),
.glass-form__form :deep(.t-select__input) {
  font-size: 13px;
  color: var(--glass-text-primary);
}

/* Textarea：Quiet chrome 挂在 __inner（TDesign 真实芯），外层 t-textarea 只做布局 */
.glass-form__form :deep(.t-textarea) {
  min-height: 80px;
  padding: 0;
  border: none;
  box-shadow: none;
  background: transparent;
}

.glass-form__form :deep(.t-textarea__inner) {
  font-size: 13px;
  color: var(--glass-text-primary);
  min-height: 80px;
  padding: 10px 12px;
  line-height: 1.5;
  resize: vertical;
}

/* Kill Inner Rect：Select / Textarea 内芯不得再画 TDesign 默认 border / box-shadow
   注意：TDesign 的 t-is-focused / t-input--focused 挂在内芯 .t-input，不在 .t-select 根；
   popup 打开时还有 .t-select-input--popup-visible，须一并 Kill，避免内脏框回潮。
   含 .t-input__wrap：Collapse Nested Padding 链（wrap / input 贴边 100%，禁 22/38 小胶囊）。 */
.glass-form__form :deep(.t-select .t-input__wrap),
.glass-form__form :deep(.t-select .t-input),
.glass-form__form :deep(.t-select .t-input:hover),
.glass-form__form :deep(.t-select .t-input:focus),
.glass-form__form :deep(.t-select .t-input:focus-within),
.glass-form__form :deep(.t-select .t-input--focused),
.glass-form__form :deep(.t-select .t-input.t-is-focused),
.glass-form__form :deep(.t-select.t-select-input--popup-visible .t-input),
.glass-form__form :deep(.t-select.t-select-input--popup-visible .t-input:hover),
.glass-form__form :deep(.t-select.t-select-input--popup-visible .t-input.t-is-focused),
.glass-form__form :deep(.t-select.t-select-input--popup-visible .t-input--focused),
.glass-form__form :deep(.t-select-input .t-input__wrap),
.glass-form__form :deep(.t-select-input .t-input),
.glass-form__form :deep(.t-select-input .t-input:hover),
.glass-form__form :deep(.t-select-input .t-input:focus),
.glass-form__form :deep(.t-select-input .t-input--focused),
.glass-form__form :deep(.t-select-input .t-input.t-is-focused),
.glass-form__form :deep(.t-select-input.t-select-input--popup-visible .t-input) {
  border: none;
  background: transparent;
  box-shadow: none;
  outline: none;
  height: 100%;
  min-height: 0;
  padding: 0;
  border-radius: inherit;
}

/* Select 外壳画 Quiet chrome；内芯已 Kill，避免双环
   Collapse Nested Padding：水平字距只留外壳一层（0 12px）；内芯链贴边，禁 12+8 双 pad
   仅裸 Select 外壳；GlassSelect 内层 .t-select 由组件自带 padding 0 */
.glass-form__form :deep(.t-select:not(.glass-select *)) {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

/* hover（非 focus）：hairline Fade；禁止 field-hover-border 实线加深；输入无 lift
   Select 根无 t-is-focused，排除用 :not(:focus-within) + 非 popup-visible
   GlassSelect / GlassInput 内层除外（外壳承担 Fade，禁双环） */
.glass-form__form
  :deep(.t-input:hover:not(.t-is-disabled):not(:focus-within):not(.glass-select *):not(.glass-input *)),
.glass-form__form
  :deep(
    .t-select:hover:not(.t-is-disabled):not(:focus-within):not(.t-select-input--popup-visible):not(.glass-select
        *)
  ),
.glass-form__form :deep(.t-textarea__inner:hover:not(.t-is-disabled):not(:focus):not(.t-is-focused)) {
  box-shadow: var(--glass-wb-field-hairline-hover);
}

/* focus：ring only —— 裸控件；GlassInput / GlassSelect 由外壳 :focus-within 承担（禁双环）
   Select：优先 :focus-within / :has(.t-input.t-is-focused)；popup 打开时用 --popup-visible 保持外环
   （t-select.t-is-focused / .t-select--focused 仅作无害兜底）。壳内叠环由文末隔离块清零。 */
.glass-form__form :deep(.t-select:focus-within:not(.t-is-disabled)),
.glass-form__form :deep(.t-select:has(.t-input.t-is-focused):not(.t-is-disabled)),
.glass-form__form :deep(.t-select.t-select-input--popup-visible:not(.t-is-disabled)),
.glass-form__form :deep(.t-select-input--popup-visible:not(.t-is-disabled)),
.glass-form__form :deep(.t-select.t-is-focused:not(.t-is-disabled)),
.glass-form__form :deep(.t-select--focused:not(.t-is-disabled)),
.glass-form__form :deep(.t-textarea__inner:focus:not(.t-is-disabled)),
.glass-form__form :deep(.t-textarea__inner.t-is-focused:not(.t-is-disabled)) {
  border: none;
  outline: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

/* 裸 t-input（非 Glass 壳内）：focus ring only */
.glass-form__form
  :deep(.t-form__controls > .t-input:focus-within:not(.t-is-disabled)),
.glass-form__form
  :deep(.t-form__controls > .t-input.t-input--focused:not(.t-is-disabled)),
.glass-form__form
  :deep(.t-form__controls > .t-input.t-is-focused:not(.t-is-disabled)) {
  border: none;
  outline: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

/* disabled：rest hairline + 降透；无 ring / 无 hover Fade
   Single Chrome Layer：hairline 只挂最外 chrome；
   Select / GlassInput 内芯一律不写（否则内层 t-is-disabled 回写双环） */
.glass-form__form
  :deep(
    .t-input.t-is-disabled:not(.t-select .t-input):not(.t-select-input .t-input):not(.glass-select
        *):not(.glass-input *)
  ),
.glass-form__form :deep(.t-select.t-is-disabled:not(.glass-select *)),
.glass-form__form :deep(.t-textarea__inner.t-is-disabled),
.glass-form__form :deep(.t-textarea .t-is-disabled) {
  opacity: var(--glass-wb-control-disabled-opacity);
  box-shadow: var(--glass-wb-field-hairline);
}

.glass-form__form
  :deep(
    .t-input.t-is-disabled:hover:not(.t-select .t-input):not(.t-select-input .t-input):not(.glass-select
        *):not(.glass-input *)
  ),
.glass-form__form :deep(.t-select.t-is-disabled:hover:not(.glass-select *)),
.glass-form__form :deep(.t-textarea__inner.t-is-disabled:hover) {
  box-shadow: var(--glass-wb-field-hairline);
}

/* GlassInput 自带外壳 + Kill Nested Input Frame + Collapse Nested Padding。
   Form 兜底：内芯 / wrap 全态无边无影，贴满外壳（禁 22px 嵌套假框）。 */
.glass-form__form :deep(.glass-input .t-input__wrap),
.glass-form__form :deep(.glass-input .t-input),
.glass-form__form :deep(.glass-input .t-input:hover),
.glass-form__form :deep(.glass-input .t-input:focus),
.glass-form__form :deep(.glass-input .t-input:focus-within),
.glass-form__form :deep(.glass-input .t-input--focused),
.glass-form__form :deep(.glass-input .t-input--borderless:not(.t-input--focused):hover),
.glass-form__form :deep(.glass-input .t-input.t-is-focused) {
  border: none;
  border-color: transparent;
  background: transparent;
  border-radius: inherit;
  box-shadow: none;
  outline: none;
  height: 100%;
  min-height: 0;
  padding: 0;
}

/* GlassSelect 自带外壳 Quiet Chrome + Popup Width Sync；
   Form 内不得再给 .t-select 根/内芯画 hairline / ring / 额外 padding（禁双环 / 禁内脏框 / 禁测宽偏窄）
   P3：裸 .t-input:hover:not(.t-is-disabled):not(:focus-within) 特异性 0,5,0，
   高于本块旧 `.glass-select .t-input:hover`（0,4,0）。filterable 内芯无 t-is-readonly，
   hover 会被回写 field-hairline-hover 内环；须对齐 :not 链并以 .glass-select 加一档胜出。 */
.glass-form__form :deep(.glass-select .t-select),
.glass-form__form :deep(.glass-select .t-select:hover),
.glass-form__form :deep(.glass-select .t-select:focus),
.glass-form__form :deep(.glass-select .t-select:focus-within),
.glass-form__form :deep(.glass-select .t-select.t-is-focused),
.glass-form__form :deep(.glass-select .t-select.t-select-input--popup-visible),
.glass-form__form :deep(.glass-select .t-select.t-is-disabled),
.glass-form__form :deep(.glass-select .t-select-input),
.glass-form__form :deep(.glass-select .t-select-input:hover),
.glass-form__form :deep(.glass-select .t-select-input.t-select-input--popup-visible),
.glass-form__form :deep(.glass-select .t-input),
.glass-form__form :deep(.glass-select .t-input:hover),
.glass-form__form
  :deep(.glass-select .t-input:hover:not(.t-is-disabled):not(:focus-within)),
.glass-form__form :deep(.glass-select .t-input:focus),
.glass-form__form :deep(.glass-select .t-input:focus-within),
.glass-form__form :deep(.glass-select .t-input--focused),
.glass-form__form :deep(.glass-select .t-input.t-is-focused),
.glass-form__form :deep(.glass-select .t-input.t-is-disabled) {
  border: none;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  outline: none;
  height: 100%;
  min-height: 0;
  min-width: 0;
  padding: 0;
  opacity: 1;
}

/* error / warning：柔边只挂外壳 —— 完整态见下方 Glass 壳隔离块（须盖在裸控件 error 规则之后） */

/* 整表 disabled 落到 Glass 壳（旧 P1）：内芯 t-is-disabled 时外壳同步降透 */
.glass-form__form :deep(.glass-input:has(.t-input.t-is-disabled)),
.glass-form__form :deep(.glass-select:has(.t-is-disabled)) {
  opacity: var(--glass-wb-control-disabled-opacity);
}

/* Validation Whisper：tip 轻提示，不砸布局 */
.glass-form__form :deep(.t-input__extra),
.glass-form__form :deep(.t-input__help),
.glass-form__form :deep(.t-tips),
.glass-form__form :deep(.t-form__status) {
  font-size: 12px;
  line-height: 1.35;
  margin-top: 4px;
  color: var(--glass-wb-form-error);
  text-align: left;
}

.glass-form__form :deep(.t-form__status.t-is-success),
.glass-form__form :deep(.t-tips.t-is-success),
.glass-form__form :deep(.t-is-success .t-input__extra),
.glass-form__form :deep(.t-is-success .t-input__help) {
  color: var(--glass-wb-form-success);
}

.glass-form__form :deep(.t-form__status.t-is-warning),
.glass-form__form :deep(.t-tips.t-is-warning),
.glass-form__form :deep(.t-is-warning .t-input__extra),
.glass-form__form :deep(.t-is-warning .t-input__help) {
  color: var(--glass-wb-form-warning);
}

/* error 态：柔和 error hairline；GlassInput 只画外壳，内芯随后 Kill */
.glass-form__form :deep(.t-is-error .t-input),
.glass-form__form :deep(.t-is-error .t-select),
.glass-form__form :deep(.t-is-error .t-textarea__inner),
.glass-form__form :deep(.t-is-error .glass-input) {
  border: none;
  box-shadow: inset 0 0 0 1px var(--glass-wb-field-error-border);
}

/* 裸控件 error + focus：ring only（勿用泛 .t-input，以免盖住 GlassInput 内芯）
   Select 同根因：focused 类在内芯，改用 :focus-within / popup-visible / :has */
.glass-form__form :deep(.t-is-error .t-select:focus-within),
.glass-form__form :deep(.t-is-error .t-select:has(.t-input.t-is-focused)),
.glass-form__form :deep(.t-is-error .t-select.t-select-input--popup-visible),
.glass-form__form :deep(.t-is-error .t-select.t-is-focused),
.glass-form__form :deep(.t-is-error .t-textarea__inner:focus),
.glass-form__form :deep(.t-is-error .t-textarea__inner.t-is-focused) {
  border: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

/* GlassInput：error/warning 内芯永远 Kill；环只在外壳 focus-within */
.glass-form__form :deep(.t-is-error .glass-input .t-input),
.glass-form__form :deep(.t-is-error .glass-input .t-input:hover),
.glass-form__form :deep(.t-is-error .glass-input .t-input:focus),
.glass-form__form :deep(.t-is-error .glass-input .t-input:focus-within),
.glass-form__form :deep(.t-is-error .glass-input .t-input--focused),
.glass-form__form :deep(.t-is-error .glass-input .t-input.t-is-focused),
.glass-form__form :deep(.t-is-warning .glass-input .t-input),
.glass-form__form :deep(.t-is-warning .glass-input .t-input:hover),
.glass-form__form :deep(.t-is-warning .glass-input .t-input:focus-within),
.glass-form__form :deep(.t-is-warning .glass-input .t-input.t-is-focused) {
  border: none;
  background: transparent;
  box-shadow: none;
  outline: none;
}

.glass-form__form :deep(.t-is-error .glass-input:focus-within),
.glass-form__form :deep(.t-is-warning .glass-input:focus-within) {
  border: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

/* warning 态：柔和 warning hairline；GlassInput 走外壳 */
.glass-form__form :deep(.t-is-warning .t-select),
.glass-form__form :deep(.t-is-warning .t-textarea__inner),
.glass-form__form :deep(.t-is-warning .glass-input) {
  border: none;
  box-shadow: inset 0 0 0 1px var(--glass-wb-field-warning-border);
}

.glass-form__form :deep(.t-is-warning .t-select:focus-within),
.glass-form__form :deep(.t-is-warning .t-select:has(.t-input.t-is-focused)),
.glass-form__form :deep(.t-is-warning .t-select.t-select-input--popup-visible),
.glass-form__form :deep(.t-is-warning .t-select.t-is-focused),
.glass-form__form :deep(.t-is-warning .t-textarea__inner:focus) {
  box-shadow: var(--glass-wb-field-focus-ring);
}

/* GlassSelect：error / warning 柔边只挂外壳；内芯永远 Kill（盖在裸控件 error/warning 规则之后） */
.glass-form__form :deep(.t-is-error .glass-select .t-select),
.glass-form__form :deep(.t-is-error .glass-select .t-select:hover),
.glass-form__form :deep(.t-is-error .glass-select .t-select:focus-within),
.glass-form__form :deep(.t-is-error .glass-select .t-select.t-select-input--popup-visible),
.glass-form__form :deep(.t-is-error .glass-select .t-select.t-is-focused),
.glass-form__form :deep(.t-is-error .glass-select .t-input),
.glass-form__form :deep(.t-is-error .glass-select .t-input:hover),
.glass-form__form :deep(.t-is-error .glass-select .t-input:focus-within),
.glass-form__form :deep(.t-is-error .glass-select .t-input.t-is-focused),
.glass-form__form :deep(.t-is-warning .glass-select .t-select),
.glass-form__form :deep(.t-is-warning .glass-select .t-select:hover),
.glass-form__form :deep(.t-is-warning .glass-select .t-select:focus-within),
.glass-form__form :deep(.t-is-warning .glass-select .t-select.t-select-input--popup-visible),
.glass-form__form :deep(.t-is-warning .glass-select .t-select.t-is-focused),
.glass-form__form :deep(.t-is-warning .glass-select .t-input),
.glass-form__form :deep(.t-is-warning .glass-select .t-input:hover),
.glass-form__form :deep(.t-is-warning .glass-select .t-input:focus-within),
.glass-form__form :deep(.t-is-warning .glass-select .t-input.t-is-focused) {
  border: none;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  outline: none;
  opacity: 1;
}

.glass-form__form
  :deep(.t-is-error .glass-select:not(:focus-within):not(.is-popup-open):not(.is-disabled)) {
  border: none;
  box-shadow: inset 0 0 0 1px var(--glass-wb-field-error-border);
}

.glass-form__form
  :deep(.t-is-warning .glass-select:not(:focus-within):not(.is-popup-open):not(.is-disabled)) {
  border: none;
  box-shadow: inset 0 0 0 1px var(--glass-wb-field-warning-border);
}

.glass-form__form :deep(.t-is-error .glass-select:focus-within),
.glass-form__form :deep(.t-is-error .glass-select.is-popup-open),
.glass-form__form :deep(.t-is-warning .glass-select:focus-within),
.glass-form__form :deep(.t-is-warning .glass-select.is-popup-open) {
  border: none;
  box-shadow: var(--glass-wb-field-focus-ring);
}

/* Choice Quiet — Checkbox / Radio：字色 secondary、勾选统一 Action Blue、禁用降透、无脏方框 */
.glass-form__form :deep(.t-checkbox),
.glass-form__form :deep(.t-radio) {
  color: var(--glass-text-secondary);
  font-size: 13px;
}

.glass-form__form :deep(.t-checkbox__label),
.glass-form__form :deep(.t-radio__label) {
  color: var(--glass-text-secondary);
  font-size: 13px;
}

.glass-form__form :deep(.t-checkbox__input),
.glass-form__form :deep(.t-radio__input) {
  border-color: var(--glass-border-soft);
  background-color: var(--glass-wb-field-bg);
}

/* 选中：Checkbox / Radio / Switch 三者统一 Action Blue（对齐按钮与行动），禁止脏方框加深 */
.glass-form__form :deep(.t-checkbox.t-is-checked .t-checkbox__input),
.glass-form__form :deep(.t-checkbox.t-is-indeterminate .t-checkbox__input) {
  border-color: var(--glass-wb-btn-blue);
  background-color: var(--glass-wb-btn-blue);
}

/* Radio：选中 / hover 与独立 GlassRadio 同轨 Action Blue */
.glass-form__form :deep(.t-radio.t-is-checked .t-radio__input) {
  border-color: var(--glass-wb-btn-blue);
  background-color: var(--glass-wb-btn-blue);
}

.glass-form__form :deep(.t-checkbox:hover .t-checkbox__input) {
  border-color: var(--glass-wb-btn-blue);
}

.glass-form__form :deep(.t-radio:hover .t-radio__input) {
  border-color: var(--glass-wb-btn-blue);
}

/* Switch：选中统一 Action Blue，字色 secondary */
.glass-form__form :deep(.t-switch) {
  background-color: var(--glass-border-soft);
}

.glass-form__form :deep(.t-switch.t-is-checked) {
  background-color: var(--glass-wb-btn-blue);
}

.glass-form__form :deep(.t-switch.t-is-checked:hover) {
  background-color: var(--glass-wb-btn-blue);
}

/* Choice 禁用：降透，不抢戏 */
.glass-form__form :deep(.t-checkbox.t-is-disabled),
.glass-form__form :deep(.t-radio.t-is-disabled),
.glass-form__form :deep(.t-switch.t-is-disabled) {
  opacity: var(--glass-wb-control-disabled-opacity);
}

/* 只读 Quiet 边界：只挂最外 chrome
   - 裸 Input（非 Select 内芯）readonly 保留 hairline
   - Select 内芯 .t-input.t-is-readonly 一律不画（下方扩面 Kill 收口，含 hover）
   - 裸 Select 外壳 .t-select.t-is-readonly 保留 hairline（Single Chrome Layer） */
.glass-form__form :deep(.t-input.t-is-readonly),
.glass-form__form :deep(.t-select.t-is-readonly),
.glass-form__form :deep(.input-readonly.t-is-readonly) {
  box-shadow: var(--glass-wb-field-hairline);
}

/* P2：非 filterable Select 内芯 .t-is-readonly 会被上行回写 inset hairline → rest 双环。
   扩面 Kill：凡 .t-select / .t-select-input 内的 .t-input（含 readonly / hover）一律无边无影，
   即使用户未包 GlassSelect。只读 hairline 只允许挂在最外 chrome（.t-select / .glass-select）。
   特异性须盖过上行 .t-input.t-is-readonly（0,3,0）与 .t-input:hover:not(...)(...) 链。 */
.glass-form__form :deep(.t-select .t-input.t-is-readonly),
.glass-form__form :deep(.t-select .t-input.t-is-readonly:hover),
.glass-form__form :deep(.t-select-input .t-input.t-is-readonly),
.glass-form__form :deep(.t-select-input .t-input.t-is-readonly:hover),
.glass-form__form
  :deep(.t-select .t-input:hover:not(.t-is-disabled):not(:focus-within)),
.glass-form__form
  :deep(.t-select-input .t-input:hover:not(.t-is-disabled):not(:focus-within)),
.glass-form__form :deep(.t-select .t-input__wrap),
.glass-form__form :deep(.t-select-input .t-input__wrap),
.glass-form__form :deep(.glass-select .t-input.t-is-readonly),
.glass-form__form :deep(.glass-select .t-input.t-is-readonly:hover) {
  border: none;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  outline: none;
  height: 100%;
  min-height: 0;
  padding: 0;
  border-radius: inherit;
}

/* 文末收口：GlassSelect 内芯相对裸 Select focus / hover 规则特异性持平时仍可能叠环。
   带 :not(.t-is-disabled) 对齐裸规则，并靠源序最后胜出。
   filterable 内芯无 readonly：须再 Kill `.t-input:hover:not(...):not(:focus-within)`，
   否则裸 Input hover Fade 回写内环（外壳 Quiet hairline Fade 仍由 .glass-select 承担）。
   裸 Select 内芯同等 Kill + Collapse Nested Padding（height 100% / padding 0 / radius inherit）。 */
.glass-form__form
  :deep(.glass-select .t-select:focus-within:not(.t-is-disabled)),
.glass-form__form
  :deep(.glass-select .t-select:has(.t-input.t-is-focused):not(.t-is-disabled)),
.glass-form__form
  :deep(.glass-select .t-select.t-select-input--popup-visible:not(.t-is-disabled)),
.glass-form__form
  :deep(.glass-select .t-select.t-is-focused:not(.t-is-disabled)),
.glass-form__form
  :deep(.glass-select .t-select--focused:not(.t-is-disabled)),
.glass-form__form
  :deep(.glass-select .t-select:hover:not(.t-is-disabled)),
.glass-form__form
  :deep(.glass-select .t-input:hover:not(.t-is-disabled):not(:focus-within)),
.glass-form__form :deep(.t-select .t-input__wrap),
.glass-form__form :deep(.t-select .t-input),
.glass-form__form :deep(.t-select .t-input:hover),
.glass-form__form :deep(.t-select .t-input:focus),
.glass-form__form :deep(.t-select .t-input:focus-within),
.glass-form__form :deep(.t-select .t-input.t-is-focused),
.glass-form__form :deep(.t-select .t-input.t-is-readonly),
.glass-form__form :deep(.t-select .t-input.t-is-readonly:hover),
.glass-form__form
  :deep(.t-select .t-input:hover:not(.t-is-disabled):not(:focus-within)),
.glass-form__form :deep(.t-select-input .t-input__wrap),
.glass-form__form :deep(.t-select-input .t-input),
.glass-form__form :deep(.t-select-input .t-input:hover),
.glass-form__form :deep(.t-select-input .t-input.t-is-readonly),
.glass-form__form
  :deep(.t-select-input .t-input:hover:not(.t-is-disabled):not(:focus-within)),
.glass-form__form :deep(.glass-select .t-input__wrap),
.glass-form__form :deep(.glass-select .t-input),
.glass-form__form :deep(.glass-select .t-input:hover),
.glass-form__form :deep(.glass-select .t-input.t-is-readonly) {
  border: none;
  outline: none;
  box-shadow: none;
  padding: 0;
  background: transparent;
  height: 100%;
  min-height: 0;
  border-radius: inherit;
}
</style>
