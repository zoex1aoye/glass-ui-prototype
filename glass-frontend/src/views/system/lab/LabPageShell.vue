<script setup lang="ts">
/**
 * LabPageShell — 组件实验室统一 Demo 页壳
 * 页头 + section-label（术语英文名 + 底层 t-*）风格对齐原 showcase。
 * “最近交互”是礼貌 live region：前缀走 i18n；状态更新由读屏自行播报。
 */
import { useGlassScheme } from '@/scheme/useGlassScheme'

defineProps<{
  title: string
  desc: string
  live?: string
}>()

const { tt } = useGlassScheme()
</script>

<template>
  <div class="lab-page">
    <header class="lab-head">
      <h1 class="lab-title">{{ title }}</h1>
      <p class="lab-desc">{{ desc }}</p>
      <p
        v-if="live"
        class="lab-live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ tt('lab.live.prefix') }}{{ live }}
      </p>
    </header>
    <slot />
  </div>
</template>
