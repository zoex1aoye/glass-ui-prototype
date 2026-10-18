<script setup lang="ts">
/**
 * GlassPanel — Focus Panel（四层栈 L3 · Glass Container 4layer plan）
 * html 锚点：`.chat` / `.bchat` / `.bsurf` / soft card 语义对齐
 * 坐在 L1 或 L2 内的焦点面；可多块同层并列。Nested Chrome：
 * - variant="inset"（默认）：嵌在 Surface / Stage 内，Nested Chrome 扁板；
 *   冷蓝 wash 相对 L1 更冷略深，吃宿主 blur，无 lift / 外影 / 外轮廓 hairline
 * - variant="standalone"：Lab 橱窗孤立态，允许轻影（仍弱于 L1）
 * 材质只吃 `--glass-layer-l3-*`。禁止内嵌再放 Surface（禁双托盘）。
 * slots: header? / default / footer?
 */
withDefaults(
  defineProps<{
    /** 语义层：Focus Panel 固定 l3；其它值忽略并回落 l3 */
    layer?: 'l3'
    /** inset：嵌套无 lift；standalone：橱窗轻影 */
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
/* L3 焦点面：几何壳体；材质按 variant 分开，inset 不吃 standalone 轻影 */
.glass-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border-radius: var(--glass-layer-l3-radius);
  overflow: hidden;
}

/* inset 阅读岛：相对 L1 更冷略深的冷蓝 wash；二次 blur / lift 影均为 none。
   分层靠明度冷暖与内容字色，inset 无轮廓线；容器层叠材质另轨。 */
.glass-panel--inset {
  background: var(--glass-layer-l3-inset-fill);
  -webkit-backdrop-filter: var(--glass-layer-l3-inset-blur);
  backdrop-filter: var(--glass-layer-l3-inset-blur);
  box-shadow: none;
}

/* standalone 橱窗孤立态：轻影供 Lab / 无宿主场景；仍弱于 L1 Host Tray */
.glass-panel--standalone {
  background: var(--glass-layer-l3-standalone-fill);
  -webkit-backdrop-filter: var(--glass-layer-l3-standalone-blur);
  backdrop-filter: var(--glass-layer-l3-standalone-blur);
  box-shadow: var(--glass-layer-l3-hairline), var(--glass-layer-l3-standalone-shadow);
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
