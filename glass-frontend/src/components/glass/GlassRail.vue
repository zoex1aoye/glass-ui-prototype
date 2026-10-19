<script setup lang="ts">
/**
 * GlassRail — Frost Rail 外壳（Container Catalog · Material Stack z2）
 * html 选择器：`.rail`
 * 磨砂冰蓝冷侧栏：width / wash / blur。外轮廓圆角 = flush token（左上 / 左下），
 * 与 Surface __body 同源；右侧贴缝边保持 0。Surface 仍兜底裁切，与 Stage gap=0，禁止 gutter。
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
/* Frost Glass Rail —— Surface 内 Rail 分区：z2 磨砂冰蓝冷侧栏。
   外轮廓左上 / 左下吃 flush token；右侧贴缝边为 0，与 Stage gap=0。
   overflow: hidden 辅助裁切 backdrop-filter，避免 blur 穿出圆角。 */
.glass-rail {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--glass-wb-rail-wash);
  -webkit-backdrop-filter: var(--glass-wb-rail-blur);
  backdrop-filter: var(--glass-wb-rail-blur);
  border-radius: var(--glass-wb-stack-flush-radius) 0 0 var(--glass-wb-stack-flush-radius);
  overflow: hidden;
  min-height: 0;
}
</style>
