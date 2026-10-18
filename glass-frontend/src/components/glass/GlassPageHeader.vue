<script setup lang="ts">
/**
 * GlassPageHeader — Region / PageHeader（四层栈 L2 · Glass Container 4layer plan）
 * html 锚点：`.ph` / `.t1 .bph`（扇形软过渡页头 · 左微透 + 冰蓝中段 · shadow-lift）
 * 坐在 L1 Surface 内的分区条 / 页头条；可多条同层并列。
 * 边界靠扇形材质差 + lift 影，无描边 / 无 rim。
 * `--weighted`：默认有 `#actions` 时自动开启（右端更实 + 非对称影偏右）；
 *   也可显式 `weighted` 开关（true/false 覆盖 auto，便于 Lab Living 对齐橱窗气质）。
 * 材质只吃 `--glass-layer-l2-*`；薄原生壳，禁止包 t-card、禁止白核实色核、禁止第二 Host Tray。
 * slots: leading / default（标题区补充）/ actions
 */
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** 默认 true：微透条；false 走更实 fill（仍走 token，不写死色） */
    glass?: boolean
    /**
     * 重物压感。undefined = 有 `#actions` 时自动；
     * true/false 显式覆盖（Lab Living 可 false 对齐橱窗 default fan）。
     */
    weighted?: boolean
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    glass: true,
    weighted: undefined,
  },
)

const slots = useSlots()
const isWeighted = computed(() => props.weighted ?? Boolean(slots.actions))
</script>

<template>
  <header
    class="glass-page-header"
    :class="[
      glass ? undefined : 'glass-page-header--solid',
      isWeighted ? 'glass-page-header--weighted' : undefined,
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
/* L2 分区壳：扇形软过渡 + 左微透 + 冰蓝中段；边界 = 材质差 + lift 影（无描边 / 无 rim） */
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

/* 有 actions：重物压感 —— 右端更实 + 非对称影偏右 */
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
