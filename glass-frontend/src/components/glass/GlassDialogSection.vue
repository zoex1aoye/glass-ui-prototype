<script setup lang="ts">
/**
 * GlassDialogSection — Dialog 内分段原语（纯布局 · 禁双托盘）
 *
 * 只负责 title / subtitle 字排、default slot 与可选顶部分段留白；
 * 无 fill / blur / 额外 shadow / border。FormPane 内亦可用（内部分段共用）；
 * divider 仅提供 12px 纯间距，无 hairline。Dialog body 内不得以本原语再套
 * GlassPanel / GlassSurface。
 */
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** 第一段默认关；后续分段显式开启顶部间距 */
    divider?: boolean
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    divider: false,
  },
)
</script>

<template>
  <section
    class="glass-dialog-section"
    :class="{ 'glass-dialog-section--divider': divider }"
    data-dialog-section
  >
    <header v-if="title || subtitle" class="glass-dialog-section__header">
      <h3 v-if="title" class="glass-dialog-section__title">{{ title }}</h3>
      <p v-if="subtitle" class="glass-dialog-section__subtitle">{{ subtitle }}</p>
    </header>
    <div class="glass-dialog-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
/* 仅布局与字排：不承载任何玻璃材质 */
.glass-dialog-section {
  display: flex;
  flex-direction: column;
  gap: var(--glass-wb-dialog-section-gap, 18px);
  min-width: 0;
}

.glass-dialog-section__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.glass-dialog-section__title {
  margin: 0;
  font-size: var(--glass-wb-dialog-section-title-size, 12.5px);
  font-weight: 600;
  line-height: 1.4;
  color: var(--glass-text-primary);
}

.glass-dialog-section__subtitle {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--glass-text-muted);
}

.glass-dialog-section__body {
  min-width: 0;
}

.glass-dialog-section--divider {
  padding-top: 12px;
}
</style>
