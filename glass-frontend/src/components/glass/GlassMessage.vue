<script setup lang="ts">
/**
 * GlassMessage — Compound Wrapper 盖 t-message（Soft Toast / 顶部浮层轻提示）
 *
 * 边界（见 .agents/tmp-glass-message-plan.md）：
 * - GlassAlert = 页内 Inline Banner（常驻 / 可关）
 * - GlassMessage = 浮层轻提示（自动消失；命令式主消费路径走 GlassMessagePlugin）
 * - GlassDialog = Confirm Sheet；Notification 本轮不做
 *
 * 材质由 theme.css 全局 `.t-message` / `.t-is-*`（Track A）负责；本文件只做
 * 语义壳 + 结构薄兜底，不写魔法色。锚 class：`glass-message` + `--{theme}`。
 * 根节点首帧携带 live region：非错误级 status/polite，错误级 alert/assertive。
 * 依赖 token：--glass-wb-message-{radius,blur,shadow,padding-y,padding-x,*-fill,*-icon}。
 */
import { computed, onMounted } from 'vue'
import type { MessageProps } from 'tdesign-vue-next'

import { ensureFeedbackA11y, getFeedbackLiveRegionAttrs } from './feedbackA11y'

type GlassMessageTheme = MessageProps['theme']

type MessageCloseContext = {
  trigger: 'close-click' | 'duration-end'
  e?: MouseEvent
}

type MessageCloseBtnContext = {
  e: MouseEvent
}

const props = withDefaults(
  defineProps<{
    theme?: GlassMessageTheme
    content?: MessageProps['content']
    closeBtn?: MessageProps['closeBtn']
    icon?: MessageProps['icon']
    /** 0 = 常驻不自动消失（声明式 Lab 矩阵传 0；默认走底层 3000ms） */
    duration?: number
  }>(),
  {
    theme: 'info',
    content: undefined,
    closeBtn: false,
    icon: undefined,
    duration: undefined,
  },
)

const liveRegionAttrs = computed(() => getFeedbackLiveRegionAttrs(props.theme))

const emit = defineEmits<{
  close: [context: MessageCloseContext]
  'close-btn-click': [context: MessageCloseBtnContext]
  'duration-end': []
}>()

// t-message 不 emit 事件，而是走 onClose / onCloseBtnClick / onDurationEnd props；
// wrapper 统一收敛为声明式 close / close-btn-click / duration-end 事件。
function handleClose(context: MessageCloseContext) {
  emit('close', context)
}

function handleCloseBtnClick(context: MessageCloseBtnContext) {
  emit('close-btn-click', context)
}

function handleDurationEnd() {
  emit('duration-end')
}

onMounted(() => {
  ensureFeedbackA11y()
})
</script>

<template>
  <t-message
    v-bind="liveRegionAttrs"
    class="glass-message"
    :class="`glass-message--${theme}`"
    :theme="theme"
    :content="content"
    :close-btn="closeBtn"
    :icon="icon"
    :duration="duration"
    :on-close="handleClose"
    :on-close-btn-click="handleCloseBtnClick"
    :on-duration-end="handleDurationEnd"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
    <template v-if="$slots.closeBtn" #closeBtn>
      <slot name="closeBtn" />
    </template>
    <slot />
  </t-message>
</template>

<style scoped>
/*
 * Material 全部由 theme.css 全局 `.t-message` / `.t-is-*`（Track A）提供；
 * 此处只做结构薄兜底，不写魔法色。
 */
.glass-message {
  max-width: 100%;
}
</style>
