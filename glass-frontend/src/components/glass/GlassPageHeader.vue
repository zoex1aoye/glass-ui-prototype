<script setup lang="ts">
/**
 * GlassPageHeader — WinUI Region Layer / PageHeader（四层栈 L2）
 * html 锚点：`.ph` / `.t1 .bph`
 * 坐在 L1 Surface 内的分区条 / 页头条；可多条同层并列。
 * 单档 Region Layer：唯一 fill 含轻 alipay whisper；四周 1px contour + 极轻 rest，无 blur / lift。
 * 材质只吃 `--glass-layer-l2-*`；薄原生壳，禁止包 t-card、禁止白核实色核、禁止第二 Host Tray。
 * slots: leading / default（标题区补充）/ actions
 * leading 图标徽标默认圆形：消费方加 class="glass-page-header__mark"
 */
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <header class="glass-page-header">
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
/* 单档 L2 Region Layer：唯一 fill + contour / 极轻 rest；无 blur / lift */
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
  box-shadow: var(--glass-layer-l2-shadow);
  transform: translateY(var(--glass-layer-l2-lift, 0));
}

/* reduced-motion：关掉抬升位移，保留 fill / 影 */
@media (prefers-reduced-motion: reduce) {
  .glass-page-header {
    transform: none;
  }
}

.glass-page-header__leading {
  flex: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Leading icon mark · 默认圆形（消费方：class="glass-page-header__mark"；:slotted 才能吃到 slot） */
:slotted(.glass-page-header__mark) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  color: var(--glass-wb-white);
  background: var(--glass-wb-btn-blue);
  box-shadow: var(--glass-wb-tag-shadow);
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
