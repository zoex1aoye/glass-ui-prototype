<script setup lang="ts">
/**
 * LabPageShell — 组件实验室统一 Demo 页壳
 * 页头 + section-label（术语英文名 + 底层 t-*）风格对齐原 showcase。
 */
defineProps<{
  title: string
  desc: string
  live?: string
}>()
</script>

<template>
  <div class="lab-page">
    <header class="lab-head">
      <h1 class="lab-title">{{ title }}</h1>
      <p class="lab-desc">{{ desc }}</p>
      <p v-if="live" class="lab-live">最近交互：{{ live }}</p>
    </header>
    <slot />
  </div>
</template>
