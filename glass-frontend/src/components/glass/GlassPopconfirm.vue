<script setup lang="ts">
/**
 * GlassPopconfirm — Compound Wrapper 盖 t-popconfirm
 *
 * 术语：
 * - Inline Confirm：锚点旁轻确认，非全屏 Dialog
 * - Destructive vs Neutral Confirm：theme=danger 走红系；default 走 Primary Quiet
 * - 脚钮 = 真 GlassButton（按钮与行动）：Primary/Danger Pill + Quiet CTA；
 *   密度贴 Soft/Quiet，禁止自绘 28px 灰边取消钮
 *
 * 色值走 --glass-wb-*。Popup teleport 至 body，材质写在非 scoped 并以
 * .glass-popconfirm 为锚。popupProps.overlayClassName 会覆盖默认 t-popconfirm，
 * 故需同时保留 t-popconfirm 以沿用底层结构样式。
 */
import { computed, h, ref, watch } from 'vue'

import type { TdPopconfirmProps } from 'tdesign-vue-next'

import GlassButton from './GlassButton.vue'

type PopconfirmTheme = TdPopconfirmProps['theme']
type PopconfirmPlacement = TdPopconfirmProps['placement']
type PopconfirmContent = TdPopconfirmProps['content']
type PopconfirmConfirmBtn = TdPopconfirmProps['confirmBtn']
type PopconfirmCancelBtn = TdPopconfirmProps['cancelBtn']

const props = withDefaults(
  defineProps<{
    visible?: boolean
    content?: PopconfirmContent
    /** Neutral=default；Destructive=danger */
    theme?: PopconfirmTheme
    placement?: PopconfirmPlacement
    /** string=Glass 钮文案；null=隐藏；TNode/ButtonProps=透传底层 */
    confirmBtn?: PopconfirmConfirmBtn
    cancelBtn?: PopconfirmCancelBtn
  }>(),
  {
    visible: undefined,
    content: undefined,
    theme: 'default',
    placement: 'top',
    confirmBtn: undefined,
    cancelBtn: undefined,
  },
)

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  confirm: [context: { e: MouseEvent }]
  cancel: [context: { e: MouseEvent }]
  visibleChange: [visible: boolean, context: unknown]
}>()

/**
 * 覆盖默认 overlayClassName 时必须带上 t-popconfirm，保留底层类。
 * 底层无 t-popconfirm--danger 根类，故自挂 glass-popconfirm--{theme} 供 Destructive 覆盖。
 */
const popupProps = computed(() => ({
  overlayClassName: `t-popconfirm glass-popconfirm glass-popconfirm--${props.theme}`,
  overlayInnerClassName: 'glass-popconfirm__inner',
}))

/** 包装层持有可见态：Glass 脚钮自管 confirm/cancel 关闭，受控/非受控同一路径 */
const uncontrolledVisible = ref(false)

const mergedVisible = computed(() =>
  props.visible !== undefined ? props.visible : uncontrolledVisible.value,
)

watch(
  () => props.visible,
  (v) => {
    if (v !== undefined) uncontrolledVisible.value = v
  },
  { immediate: true },
)

function setClosed(e: MouseEvent, trigger: 'confirm' | 'cancel') {
  if (props.visible === undefined) {
    uncontrolledVisible.value = false
  }
  emit('update:visible', false)
  if (trigger === 'confirm') {
    emit('confirm', { e })
  } else {
    emit('cancel', { e })
  }
  emit('visibleChange', false, { e, trigger })
}

function onConfirmClick(e: MouseEvent) {
  setClosed(e, 'confirm')
}

function onCancelClick(e: MouseEvent) {
  setClosed(e, 'cancel')
}

/** 确认钮：Neutral=Primary Pill；Destructive=Danger Pill（shape=round 小档） */
const confirmVariant = computed(() => (props.theme === 'danger' ? 'danger' : 'primary'))

function renderGlassBtn(
  variant: 'primary' | 'danger' | 'quiet' | 'soft',
  label: string,
  onActivate: (e: MouseEvent) => void,
) {
  return h(
    GlassButton,
    {
      variant,
      shape: 'round',
      onClick: onActivate,
    },
    () => label,
  )
}

/**
 * 缺省挂 GlassButton；string 视作 Glass 文案；null 隐藏；
 * ButtonProps / TNode 原样透传（逃生口，不拦）。
 */
const resolvedConfirmBtn = computed<PopconfirmConfirmBtn>(() => {
  if (props.confirmBtn === null) return null as unknown as PopconfirmConfirmBtn
  if (props.confirmBtn === undefined) {
    return (() => renderGlassBtn(confirmVariant.value, '确认', onConfirmClick)) as PopconfirmConfirmBtn
  }
  if (typeof props.confirmBtn === 'string') {
    return (() =>
      renderGlassBtn(confirmVariant.value, props.confirmBtn as string, onConfirmClick)) as PopconfirmConfirmBtn
  }
  return props.confirmBtn
})

/** 取消钮：Quiet CTA（无灰边）；空间更紧可换 soft */
const resolvedCancelBtn = computed<PopconfirmCancelBtn>(() => {
  if (props.cancelBtn === null) return null as unknown as PopconfirmCancelBtn
  if (props.cancelBtn === undefined) {
    return (() => renderGlassBtn('quiet', '取消', onCancelClick)) as PopconfirmCancelBtn
  }
  if (typeof props.cancelBtn === 'string') {
    return (() => renderGlassBtn('quiet', props.cancelBtn as string, onCancelClick)) as PopconfirmCancelBtn
  }
  return props.cancelBtn
})

const popconfirmBind = computed(() => ({
  content: props.content,
  theme: props.theme,
  placement: props.placement,
  confirmBtn: resolvedConfirmBtn.value,
  cancelBtn: resolvedCancelBtn.value,
  popupProps: popupProps.value,
  visible: mergedVisible.value,
}))

function onUpdateVisible(v: boolean) {
  if (props.visible === undefined) {
    uncontrolledVisible.value = v
  }
  emit('update:visible', v)
}

function onVisibleChange(v: boolean, ctx: unknown) {
  emit('visibleChange', v, ctx)
}
</script>

<template>
  <t-popconfirm
    v-bind="popconfirmBind"
    @update:visible="onUpdateVisible"
    @confirm="emit('confirm', $event)"
    @cancel="emit('cancel', $event)"
    @visible-change="onVisibleChange"
  >
    <slot />
  </t-popconfirm>
</template>

<style>
/* teleport 到 body：非 scoped，禁止魔法色。
   DOM：.t-popup.t-popconfirm.glass-popconfirm > .t-popup__content.glass-popconfirm__inner
        > .t-popconfirm__content > .t-popconfirm__body / __buttons */
.glass-popconfirm.t-popconfirm {
  min-width: 160px;
}

/* Inline Confirm 面板：材质落在 popup content（视觉底板） */
.glass-popconfirm__inner.t-popup__content {
  background: var(--glass-wb-popconfirm-fill);
  -webkit-backdrop-filter: var(--glass-wb-popconfirm-blur);
  backdrop-filter: var(--glass-wb-popconfirm-blur);
  border-radius: var(--glass-wb-popconfirm-radius);
  box-shadow: var(--glass-wb-popconfirm-shadow);
  border: none;
  padding: 0;
}

/* 内 padding 交给 TD：.t-popconfirm__content = 16px（--td-comp-paddingTB/LR-l） */
.glass-popconfirm .t-popconfirm__content {
  color: var(--glass-text-secondary);
  font-size: 13px;
  line-height: 1.55;
  background: transparent;
  box-shadow: none;
}

.glass-popconfirm .t-popconfirm__inner {
  background: transparent;
  box-shadow: none;
  border: none;
}

/* 脚钮区：真 GlassButton；Inline Confirm 保留紧凑 Pill 密度，
   横向节奏与 Dialog / FormPane 共用 --glass-wb-dialog-footer-gap。 */
.glass-popconfirm .t-popconfirm__buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--glass-wb-dialog-footer-gap);
  text-align: right;
}

.glass-popconfirm--danger .t-popconfirm__icon--danger {
  color: var(--glass-wb-confirm-danger);
}
</style>
