<script setup lang="ts">
/**
 * GlassPageHeader — Region / PageHeader（四层栈 L2 · Glass Container 4layer plan）
 * html 锚点：`.ph` / `.t1 .bph`
 * 坐在 L1 Surface 内的分区条 / 页头条；可多条同层并列。
 * 定稿 A · 2026-10-20：112° 半透扇形 + blur + lift 0 + 轻软影；无白 rim。
 * `--weighted`：默认 true（同扇形 tip 略提）；可显式 false 关闭。
 * 材质只吃 `--glass-layer-l2-*`；薄原生壳，禁止包 t-card、禁止白核实色核、禁止第二 Host Tray。
 * slots: leading / default（标题区补充）/ actions
 */
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** 默认 true：微透条；false 走更实 fill（仍走 token，不写死色） */
    glass?: boolean
    /** 重物压感。默认 true；false 回落 default 扇形。 */
    weighted?: boolean
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    glass: true,
    weighted: true,
  },
)
</script>

<template>
  <header
    class="glass-page-header"
    :class="[
      glass ? undefined : 'glass-page-header--solid',
      weighted ? 'glass-page-header--weighted' : undefined,
    ]"
  >
    <div v-if="$slots.leading" class="glass-page-header__leading">
      <slot name="leading" />
    </div>

    <div class="glass-page-header__text">
      <strong v-if="title" class="glass-page-header__title">{{ title }}</strong>
      <span v-if="subtitle" class="glass-page-header__subtitle">{{ subtitle }}</span>
      <div v-if="$slots.default" class="glass-page-header__desc">
        <slot />
      </div>
    </div>

    <div class="glass-page-header__spacer" />

    <div v-if="$slots.actions" class="glass-page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
/* L2 分区壳 · 定稿 A：112° 半透扇形 + blur + lift 0 + 轻软影；无白 rim */
.glass-page-header {
  flex: none;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: var(--glass-layer-l2-height);
  padding: 10px 18px;
  border-radius: var(--glass-layer-l2-radius);
  background: var(--glass-layer-l2-fill);
  -webkit-backdrop-filter: var(--glass-layer-l2-blur);
  backdrop-filter: var(--glass-layer-l2-blur);
  box-shadow: var(--glass-layer-l2-rim), var(--glass-layer-l2-shadow);
  transform: translateY(var(--glass-layer-l2-lift, 0));
}

/* reduced-motion：关掉抬升位移，保留 fill / 影 */
@media (prefers-reduced-motion: reduce) {
  .glass-page-header {
    transform: none;
  }
}

/* 有 actions：同扇形 tip 略提；影与 default 同档 */
.glass-page-header--weighted {
  background: var(--glass-layer-l2-fill-weighted);
  box-shadow: var(--glass-layer-l2-shadow-weighted);
}

/* glass=false：更实一档，仍走 L2 token（压过 weighted 渐变底，影仍可 weighted） */
.glass-page-header--solid {
  background: var(--glass-layer-l2-fill-solid);
}

.glass-page-header__leading {
  flex: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.glass-page-header__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.glass-page-header__title {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--glass-text-primary);
}

.glass-page-header__subtitle {
  font-size: 11px;
  line-height: 1.35;
  color: var(--glass-text-secondary);
}

.glass-page-header__desc {
  font-size: 12px;
  line-height: 1.45;
  color: var(--glass-text-secondary);
}

.glass-page-header__spacer {
  flex: 1;
  min-width: 0;
}

.glass-page-header__actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
