<script setup lang="ts">
/**
 * GlassRail — Frost Rail 外壳（Container Catalog · Material Stack z2）
 * html 选择器：`.rail`
 * 磨砂冰蓝冷侧栏：width / wash / blur。外轮廓由 Surface overflow 裁切；Flush 左半。
 * 几何红线：禁止大圆角 / 重阴影 / 描边；内部控件由消费方放 t-*。
 */
withDefaults(
  defineProps<{
    /** Rail 宽度，默认取 --glass-rail-width */
    width?: string
  }>(),
  {
    width: 'var(--glass-rail-width)',
  },
)
</script>

<template>
  <aside class="glass-rail" :style="{ width }">
    <slot />
  </aside>
</template>

<style scoped>
/* Frost Glass Rail —— Surface 内 Rail 分区：z2 磨砂冰蓝冷侧栏 */
.glass-rail {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--glass-wb-rail-wash);
  -webkit-backdrop-filter: var(--glass-wb-rail-blur);
  backdrop-filter: var(--glass-wb-rail-blur);
  min-height: 0;
}
</style>
