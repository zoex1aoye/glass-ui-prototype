<script setup lang="ts">
/**
 * GlassRail — Frost Rail 外壳（Container Catalog · Material Stack z2）
 * html 选择器：`.rail`
 * 磨砂侧栏：width / tone / wash / blur。默认 ice；lilac 仅换低 alpha 紫 wash，
 * 并在轨内 remap Quiet List hover；active 近白微透（沿用 List 圆角，无 tip），由 theme.css 收口。
 * 外轮廓圆角 = flush token（左上 / 左下），
 * 与 Surface __body 同源；右侧贴缝边保持 0。Surface 仍兜底裁切，与 Stage gap=0，禁止 gutter。
 * 几何红线：禁止大圆角 / 重阴影 / 描边；内部控件由消费方放 t-*。
 */
withDefaults(
  defineProps<{
    /** Rail 宽度，默认取 --glass-rail-width */
    width?: string
    /** Rail 材质 tone：ice=既有冰蓝；lilac=AI 紫低 alpha wash */
    tone?: 'ice' | 'lilac'
  }>(),
  {
    width: 'var(--glass-rail-width)',
    tone: 'ice',
  },
)
</script>

<template>
  <aside class="glass-rail" :class="`glass-rail--${tone}`" :style="{ width }">
    <slot />
  </aside>
</template>

<style scoped>
/* Frost Glass Rail —— Surface 内 Rail 分区：z2 磨砂侧栏。
   外轮廓左上 / 左下吃 flush token；右侧贴缝边为 0，与 Stage gap=0。
   overflow: hidden 辅助裁切 backdrop-filter，避免 blur 穿出圆角。 */
.glass-rail {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-radius: var(--glass-wb-stack-flush-radius) 0 0 var(--glass-wb-stack-flush-radius);
  overflow: hidden;
  min-height: 0;
}

/* 默认冰蓝轨：wash / blur；轨内 List hover 近白微洗（与 active 近白板同族）。
   必须在此 remap —— 否则会吃到 Quiet List 的 text-cta 冷雾，轨上像「没生效」。 */
.glass-rail--ice {
  background: var(--glass-wb-rail-wash);
  -webkit-backdrop-filter: var(--glass-wb-rail-blur);
  backdrop-filter: var(--glass-wb-rail-blur);
  --glass-wb-list-item-hover-bg: var(--glass-wb-session-hover-bg);
}

/* lilac 轨：紫只做 wash；轨内 hover=淡紫洗 token；active 近白微透由 theme.css 收口。 */
.glass-rail--lilac {
  background: var(--glass-wb-rail-wash-lilac);
  -webkit-backdrop-filter: var(--glass-wb-rail-blur-lilac);
  backdrop-filter: var(--glass-wb-rail-blur-lilac);
  --glass-wb-list-item-hover-bg: var(--glass-wb-rail-list-item-hover-bg);
}
</style>
