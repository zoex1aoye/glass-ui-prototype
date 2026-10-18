<script setup lang="ts">
/**
 * GlassProgress — Quiet Progress Whisper（html `.bar` / `.bar-cap`）
 *
 * Compound Wrapper 盖 `t-progress`：主题固定 line，保留 TDesign 的进度语义与
 * `percentage` / `status` 行为；视觉对齐 html 6px 圆角轨 + 冰青→知乎蓝渐变。
 * `status="active"` 语义保留但无 shimmer（Quiet 静气质）。
 * 可选 label：true 显示 `${percentage}%`，字符串则作为 `.bar-cap` 文案槽。
 * 色值 / 高度 / 圆角 / 字级全部走 `--glass-wb-progress-*`，组件内零魔法色。
 */
import { computed } from 'vue'

import type { ProgressStatus } from 'tdesign-vue-next'

const props = withDefaults(
  defineProps<{
    percentage: number
    /** true → 自动显示百分比；string → 自定义 `.bar-cap` 文案 */
    label?: boolean | string
    /** 透传 TDesign ProgressStatus；默认视觉为 Quiet 冰蓝渐变 */
    status?: ProgressStatus
  }>(),
  {
    label: false,
    status: undefined,
  },
)

const labelText = computed(() => {
  if (typeof props.label === 'string') return props.label
  return props.label ? `${props.percentage}%` : ''
})
</script>

<template>
  <div class="glass-progress" :data-status="status ?? 'default'">
    <t-progress
      class="glass-progress__core"
      theme="line"
      :percentage="percentage"
      :status="status"
      :label="false"
    />
    <span v-if="labelText" class="glass-progress__label">{{ labelText }}</span>
  </div>
</template>
