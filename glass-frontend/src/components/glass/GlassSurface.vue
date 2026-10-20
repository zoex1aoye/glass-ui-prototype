<script setup lang="ts">
/**
 * GlassSurface — Mica / Base（四层栈 L1 · Glass Container 4layer plan）
 * L0 GlassPosterWash = 系统底；L1 Surface = Mica/Base；PageHeader / Panel / 卡 = Content Layer。
 * 相对页底露边的整块基底：Inset Reveal（padding 四周露边，露出 L0 PosterWash）。
 * material 默认 mica：高遮罩中性 tint、无 blur / air / 像素光栈；frost：强透展示，轻 blur、无 air。
 * raster 为 deprecated 兼容别名，按 mica 渲染。
 * slot 直接挂在 Surface 下：Rail|Stage 同为首层子项时 Flush Stitch（gap=0）；
 * Surface 自身 padding 负责四周露边，不另设内衬板；Rail / Stage 各自吃 flush-radius。
 * 材质优先消费 `--glass-layer-l1-*`（:root workbench 默认回填现网 --glass-wb-surface-*）。
 * 几何红线：inset pad 不得为 0；禁止用 t-card 当托盘；禁双托盘（Surface 外不再包 Host Tray）。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 语义层：Mica/Base 固定 l1；其它值忽略并回落 l1 */
    layer?: 'l1'
    /** mica = Mica/Base（默认）；frost = 强透展示；raster = deprecated alias，回落 mica */
    material?: 'mica' | 'frost' | 'raster'
  }>(),
  {
    layer: 'l1',
    material: 'mica',
  },
)

const canonicalMaterial = computed<'mica' | 'frost'>(() =>
  props.material === 'frost' ? 'frost' : 'mica',
)
</script>

<template>
  <div
    class="glass-surface"
    :class="`glass-surface--${canonicalMaterial}`"
    :data-material="canonicalMaterial"
    data-layer="l1"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Mica / Base —— 一整块系统基底（mica 默认 / frost 可选）。
   「被看见」= 相对 L0 PosterWash 外边距 + 整框 inset（padding）四周露基座；
   不是靠 Rail–Stage 中间缝，也不是只靠外轮廓圆角+阴影。 */
.glass-surface {
  --glass-layer-l1-fill: var(--glass-layer-l1-fill-mica);
  --glass-layer-l1-blur: var(--glass-layer-l1-blur-mica);

  position: relative;
  flex: 1;
  width: 100%;
  min-height: 0;
  display: flex;
  gap: 0;
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

.glass-surface--mica,
.glass-surface--raster {
  --glass-layer-l1-fill: var(--glass-layer-l1-fill-mica);
  --glass-layer-l1-blur: var(--glass-layer-l1-blur-mica);
}

.glass-surface--frost {
  --glass-layer-l1-fill: var(--glass-layer-l1-fill-frost);
  --glass-layer-l1-blur: var(--glass-layer-l1-blur-frost);
}

/* slot 根节点承接原内层容器的 flex / z 序职责；不新建视觉或几何包裹层。 */
.glass-surface > :slotted(*) {
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
}
</style>
