<script setup lang="ts">
/**
 * GlassRail — Content-on-Mica 导航带（Container Catalog · Material Stack z2）
 * html 选择器：`.rail`
 * 明度差分界：width / tone / wash / blur。默认 ice 为极淡冷 tint；lilac 仅换低 alpha 紫 tint，
 * 并在轨内 remap Quiet List hover；active 为低透 wash + 标题蓝字（圆角 Whisper，无指示条），由 theme.css 收口。
 * 外轮廓圆角 = flush token（左上 / 左下），
 * 作为 Surface 直接子项时与 Stage gap=0；右侧贴缝边保持 0。Surface padding 露边并兜底裁切。
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
/* Content-on-Mica Rail —— Surface 内导航带分区：透底、与 Stage 靠明度差分界。
   外轮廓左上 / 左下吃 flush token；右侧贴缝边为 0，与 Stage gap=0。
   backdrop-filter 仍吃 token；当前 token 为 none，不产生磨砂模糊。 */
.glass-rail {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-radius: var(--glass-wb-stack-flush-radius) 0 0 var(--glass-wb-stack-flush-radius);
  overflow: hidden;
  min-height: 0;
  box-shadow: var(--glass-wb-rail-shadow);
}

/* 默认冰蓝轨：wash / blur；轨内 List 使用 alipay@10% hover 与 alipay@12% active Whisper。
   必须在此 remap —— 否则会吃到 Quiet List 的通用雾洗。 */
.glass-rail--ice {
  background: var(--glass-wb-rail-wash);
  -webkit-backdrop-filter: var(--glass-wb-rail-blur);
  backdrop-filter: var(--glass-wb-rail-blur);
  --glass-wb-list-item-hover-bg: var(--glass-wb-rail-list-item-hover-bg-ice);
}

/* lilac 轨：紫只做 wash；轨内 hover / active 保持低透紫洗，圆角 Whisper。 */
.glass-rail--lilac {
  background: var(--glass-wb-rail-wash-lilac);
  -webkit-backdrop-filter: var(--glass-wb-rail-blur-lilac);
  backdrop-filter: var(--glass-wb-rail-blur-lilac);
  --glass-wb-list-item-hover-bg: var(--glass-wb-rail-list-item-hover-bg);
}
</style>
