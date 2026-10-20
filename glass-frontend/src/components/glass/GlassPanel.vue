<script setup lang="ts">
/**
 * GlassPanel — Card / LayerFill 分区面（四层栈 L3）
 * html 锚点：`.chat` / `.bchat` / `.bsurf` / soft card 语义对齐
 * 坐在 Surface / Stage 内的 Card 分区面；可多块同层并列。
 * - variant="inset"（默认）：高遮罩单色 LayerFill，靠明度差分区；
 *   无 blur、无 lift、无多停渐变光，也不叠悬浮影
 * - variant="standalone"：Lab 橱窗孤立态；LayerFill + contour + 单档静影，
 *   仍弱于 L1 Surface 影
 * 材质只吃 `--glass-layer-l3-*`。禁止内嵌再放 Surface（禁双托盘）。
 * slots: header? / default / footer?
 */
withDefaults(
  defineProps<{
    /** 语义层：Panel / Card 固定 l3；其它值忽略并回落 l3 */
    layer?: 'l3'
    /** inset：Card / LayerFill；standalone：LayerFill + contour + 单档静影 */
    variant?: 'inset' | 'standalone'
    title?: string
  }>(),
  {
    layer: 'l3',
    variant: 'inset',
    title: undefined,
  },
)
</script>

<template>
  <section
    class="glass-panel"
    :class="`glass-panel--${variant}`"
    data-layer="l3"
  >
    <header v-if="title || $slots.header" class="glass-panel__header">
      <slot name="header">
        <h3 v-if="title" class="glass-panel__title">{{ title }}</h3>
      </slot>
    </header>

    <div class="glass-panel__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="glass-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
/* L3 Card：几何壳体；材质按 variant 分为嵌入分区面与橱窗卡 */
.glass-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border-radius: var(--glass-layer-l3-radius);
  overflow: hidden;
}

/* inset Card：LayerFill + 弱 contour + 极轻 rest 影；无 blur / lift / 双层光柱。 */
.glass-panel--inset {
  background: var(--glass-layer-l3-inset-fill);
  -webkit-backdrop-filter: var(--glass-layer-l3-inset-blur);
  backdrop-filter: var(--glass-layer-l3-inset-blur);
  box-shadow: var(--glass-layer-l3-inset-shadow);
}

/* standalone 橱窗孤立态：同族 contour + 单档静影；仍弱于 L1 Surface */
.glass-panel--standalone {
  background: var(--glass-layer-l3-standalone-fill);
  -webkit-backdrop-filter: var(--glass-layer-l3-standalone-blur);
  backdrop-filter: var(--glass-layer-l3-standalone-blur);
  box-shadow: var(--glass-wb-contour), var(--glass-layer-l3-standalone-shadow);
}

@media (prefers-reduced-motion: reduce) {
  .glass-panel--inset {
    transform: none;
  }
}

.glass-panel__header {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px 8px;
}

.glass-panel__title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--glass-text-primary);
}

.glass-panel__body {
  flex: 1;
  min-height: 0;
  padding: 8px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.glass-panel__footer {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 8px 14px 12px;
}
</style>
