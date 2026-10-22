<script setup lang="ts">
import washRaster from '@/assets/glass/poster-wash-air-petals.webp'

/**
 * GlassPosterWash — L0 air · petals 光栅垫底
 * 层序（下→上）：center cover 光栅 → 均匀微透 veil → content slot。
 * air / petals 已烘焙进单一光栅，默认不再渲染 live scene，避免拼接横向割裂。
 * `pageAir` 保留为显式 legacy 开关（默认关），正常路径不叠页级 bloom。
 * 光栅尺寸为 2560×1440；`fit="cover"` 语义落在 object-fit: cover。
 * 材质只读 `--glass-poster-*`；禁止魔法色。权威顺序见 `AGENTS.md` 路由表。
 */
withDefaults(
  defineProps<{
    /** 光栅适配：当前仅支持等比盖满。 */
    fit?: 'cover'
    /** legacy 页级 bokeh 开关；默认关，不参与 Dashboard / Poster 默认路径。 */
    pageAir?: boolean
  }>(),
  {
    fit: 'cover',
    pageAir: false,
  },
)
</script>

<template>
  <div class="glass-poster-wash" :data-fit="fit" data-layer="l0">
    <!-- 1. 主用光栅：air · petals 已烘焙，center cover 连续铺满 -->
    <img
      class="glass-poster-wash__raster"
      :src="washRaster"
      alt=""
      aria-hidden="true"
      draggable="false"
    />

    <!-- 2. 均匀/极缓微透 tint：只柔化光栅，不做强径向 bloom -->
    <div class="glass-poster-wash__veil" aria-hidden="true" />

    <!-- legacy 显式开关：默认关闭，不进入 PosterWash 主路径 -->
    <div v-if="pageAir" class="glass-poster-wash__page-air" aria-hidden="true">
      <span class="a" />
      <span class="b" />
      <span class="c" />
      <span class="d" />
    </div>

    <!-- 3. 内容槽：z 高于光栅与 veil，可交互 -->
    <div class="glass-poster-wash__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.glass-poster-wash {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  isolation: isolate;
  background-color: var(--glass-poster-wash-fallback);
}

.glass-poster-wash__raster {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: var(--glass-poster-wash-raster-filter);
  pointer-events: none;
  user-select: none;
}

.glass-poster-wash__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--glass-poster-wash-veil);
  pointer-events: none;
}

/* legacy live stack：仅供显式 pageAir=true 的历史对照，默认路径不渲染。 */
.glass-poster-wash__page-air {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
}

.glass-poster-wash__page-air span {
  position: absolute;
  border-radius: var(--glass-poster-page-air-radius);
  filter: blur(48px);
  opacity: 0.45;
  pointer-events: none;
}

.glass-poster-wash__page-air .a {
  top: var(--glass-poster-page-air-a-top);
  left: var(--glass-poster-page-air-a-left);
  width: var(--glass-poster-page-air-a-w);
  height: var(--glass-poster-page-air-a-h);
  background: var(--glass-poster-page-air-a-bg);
  transform: rotate(var(--glass-poster-page-air-a-rotate));
}

.glass-poster-wash__page-air .b {
  top: var(--glass-poster-page-air-b-top);
  right: var(--glass-poster-page-air-b-right);
  width: var(--glass-poster-page-air-b-w);
  height: var(--glass-poster-page-air-b-h);
  background: var(--glass-poster-page-air-b-bg);
}

.glass-poster-wash__page-air .c {
  bottom: var(--glass-poster-page-air-c-bottom);
  left: var(--glass-poster-page-air-c-left);
  width: var(--glass-poster-page-air-c-w);
  height: var(--glass-poster-page-air-c-h);
  background: var(--glass-poster-page-air-c-bg);
  filter: var(--glass-poster-page-air-c-blur);
  opacity: var(--glass-poster-page-air-c-opacity);
}

.glass-poster-wash__page-air .d {
  bottom: var(--glass-poster-page-air-d-bottom);
  right: var(--glass-poster-page-air-d-right);
  width: var(--glass-poster-page-air-d-w);
  height: var(--glass-poster-page-air-d-h);
  background: var(--glass-poster-page-air-d-bg);
  filter: var(--glass-poster-page-air-d-blur);
  opacity: var(--glass-poster-page-air-d-opacity);
}

.glass-poster-wash__content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: inherit;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  pointer-events: auto;
}
</style>
