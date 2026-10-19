<script setup lang="ts">
/**
 * GlassNotification — Compound Wrapper 盖 t-notification（Soft Notice / 角区浮层通知卡）
 *
 * 边界（见 .agents/tmp-glass-notification-plan.md）：
 * - GlassAlert = 页内 Inline Banner（常驻 / 可关）
 * - GlassMessage = 顶中 Soft Toast（短句，命令式主消费路径走 GlassMessagePlugin）
 * - GlassNotification = 角区 Soft Notice（title + content + 可选 footer，命令式走 GlassNotificationPlugin）
 * - GlassDialog = Confirm Sheet
 *
 * 材质由 theme.css 全局 `.t-notification` / `.t-icon.t-is-*`（Track A）负责；本文件只做
 * 语义壳 + 结构薄兜底，不写魔法色。锚 class：`glass-notification` + `--{theme}`。
 * 根节点首帧携带 live region：非错误级 status/polite，错误级 alert/assertive。
 * 依赖 token：--glass-wb-notification-{radius,blur,shadow,padding-y,padding-x,width,*-fill,*-icon}。
 */
import { computed, onMounted } from 'vue'
import type { NotificationProps, NotificationThemeList } from 'tdesign-vue-next'

import { ensureFeedbackA11y, getFeedbackLiveRegionAttrs } from './feedbackA11y'

type GlassNotificationTheme = NotificationThemeList

type NotificationCloseBtnContext = {
  e: MouseEvent
}

const props = withDefaults(
  defineProps<{
    theme?: GlassNotificationTheme
    title?: NotificationProps['title']
    content?: NotificationProps['content']
    closeBtn?: NotificationProps['closeBtn']
    icon?: NotificationProps['icon']
    /** 0 = 常驻不自动消失（声明式 Lab 矩阵传 0；默认走底层 3000ms） */
    duration?: number
    footer?: NotificationProps['footer']
  }>(),
  {
    theme: 'info',
    title: undefined,
    content: undefined,
    closeBtn: undefined,
    icon: undefined,
    duration: undefined,
    footer: undefined,
  },
)

const liveRegionAttrs = computed(() => getFeedbackLiveRegionAttrs(props.theme))

const emit = defineEmits<{
  close: []
  'close-btn-click': [context: NotificationCloseBtnContext]
  'duration-end': []
}>()

// t-notification 不 emit 事件，而是走 onClose / onCloseBtnClick / onDurationEnd props；
// wrapper 统一收敛为声明式 close / close-btn-click / duration-end 事件。
function handleClose() {
  emit('close')
}

function handleCloseBtnClick(context: NotificationCloseBtnContext) {
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
  <t-notification
    v-bind="liveRegionAttrs"
    class="glass-notification"
    :class="`glass-notification--${theme}`"
    :theme="theme"
    :title="title"
    :content="content"
    :close-btn="closeBtn"
    :icon="icon"
    :duration="duration"
    :footer="footer"
    :on-close="handleClose"
    :on-close-btn-click="handleCloseBtnClick"
    :on-duration-end="handleDurationEnd"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.content || $slots.default" #default>
      <slot name="content">
        <slot />
      </slot>
    </template>
    <!--
      TD renderTNode('footer') 不包 .t-notification__detail，裸按钮会成为
      __main 列子项被 stretch 拉满竖排。可发布面在此统一包行动条，theme 右下角布局才生效。
    -->
    <template v-if="$slots.footer" #footer>
      <div class="t-notification__detail glass-notification__footer">
        <slot name="footer" />
      </div>
    </template>
    <template v-if="$slots.closeBtn" #closeBtn>
      <slot name="closeBtn" />
    </template>
  </t-notification>
</template>

<style scoped>
/*
 * Material 全部由 theme.css 全局 `.t-notification` / `.t-icon.t-is-*`（Track A）提供；
 * 此处只做结构薄兜底，不写魔法色。
 */
.glass-notification {
  display: block;
}
</style>
