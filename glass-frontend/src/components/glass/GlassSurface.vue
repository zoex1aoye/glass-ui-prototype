<script setup lang="ts">
/**
 * GlassSurface — Host Tray / Behind Surface（四层栈 L1 · Glass Container 4layer plan）
 * html 选择器：`.surface` · `.big`(+`.air`+`.pane`) · `.t1 .big`
 * 相对页底露边的整块玻璃托盘：Inset Reveal（padding 四周露材质）+ surface-air bloom。
 * material 默认 raster：直接铺 A 合成光栅，air bloom 关闭；frost：近白半透 + blur + air。
 * 默认 slot 放 Rail|Stage（Flush Stitch，gap=0 由 body 保证；Floating Plate 影在 __body）。
 * 材质优先消费 `--glass-layer-l1-*`（:root workbench 默认回填现网 --glass-wb-surface-*）。
 * 几何红线：inset pad 不得为 0；禁止用 t-card 当托盘；禁双托盘（Surface 外不再包 Host Tray）。
 */
const props = withDefaults(
  defineProps<{
    /** 语义层：Host Tray 固定 l1；其它值忽略并回落 l1 */
    layer?: 'l1'
    /** raster = A 合成光栅（默认）；frost = 近白微透 + blur */
    material?: 'raster' | 'frost'
  }>(),
  {
    layer: 'l1',
    material: 'raster',
  },
)
</script>

<template>
  <div
    class="glass-surface"
    :class="`glass-surface--${props.material}`"
    :data-material="props.material"
    data-layer="l1"
  >
    <!-- air 只服务 frost 微透；raster 已含 A 合成观感，叠 air 会脏。 -->
    <div v-if="props.material === 'frost'" class="glass-surface__air" aria-hidden="true" />
    <!-- z3 Rail | Stage 贴缝整板：Floating Plate，gap 必须为 0 -->
    <div class="glass-surface__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Host Tray / Behind Surface —— 一整块玻璃浮层（raster 默认 / frost 可选）。
   「被看见」= 相对页底外边距 + 整框 inset（padding）四周露玻璃材质；
   不是靠 Rail–Stage 中间缝，也不是只靠外轮廓圆角+阴影。 */
.glass-surface {
  --glass-layer-l1-fill: var(--glass-layer-l1-fill-raster);
  --glass-layer-l1-blur: var(--glass-layer-l1-blur-raster);

  position: relative;
  flex: 1;
  width: 100%;
  min-height: 0;
  display: flex;
  padding: var(--glass-layer-l1-pad);
  border-radius: var(--glass-layer-l1-radius);
  background: var(--glass-layer-l1-fill);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -webkit-backdrop-filter: var(--glass-layer-l1-blur);
  backdrop-filter: var(--glass-layer-l1-blur);
  box-shadow: var(--glass-layer-l1-rim), var(--glass-layer-l1-shadow);
  overflow: hidden;
}

.glass-surface--raster {
  --glass-layer-l1-fill: var(--glass-layer-l1-fill-raster);
  --glass-layer-l1-blur: var(--glass-layer-l1-blur-raster);
}

.glass-surface--frost {
  --glass-layer-l1-fill: var(--glass-layer-l1-fill-frost);
  --glass-layer-l1-blur: var(--glass-layer-l1-blur-frost);
}

/* surface-air bloom（html .big > .air + .t1 .air）：两团低 alpha 径向 bloom，无实底，blur 揉成雾状 */
.glass-surface__air {
  position: absolute;
  inset: -8%;
  z-index: 0;
  pointer-events: none;
  filter: var(--glass-layer-l1-air-blur);
  background: var(--glass-layer-l1-air);
}

/* Flush Stitch + Floating Plate：一体柔影，外轮廓吃 flush token，中间 gap 必须为 0 */
.glass-surface__body {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 0;
  border-radius: var(--glass-wb-stack-flush-radius);
  overflow: hidden;
  box-shadow: var(--glass-wb-body-shadow);
}
</style>
