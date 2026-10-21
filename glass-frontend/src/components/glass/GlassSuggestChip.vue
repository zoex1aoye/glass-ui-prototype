<script setup lang="ts">
/**
 * GlassSuggestChip — 建议入口胶囊（Compound Wrapper 盖 t-button shape=round）
 * 欢迎态建议入口；点击把文案回传给消费方。
 *
 * 本质 Quiet/soft pill（Tonal 轨 + Quiet 幅度），非 Primary。
 * Interaction：
 * - Suggest Chip Lift：hover translateY(lift-quiet) + hairline Fade；保持 rest 底，无 Color Shift（对齐 WinUI Subtle）
 * - Quiet Active Wash：active 略深同色 + 深字，禁止 Press Invert
 * - Icon Leading：可选 #icon 左侧 14–16px；text / default 文案 slot 保留
 * - 轮廓 inset hairline（tonal-hairline*）；禁实线 pill-border / pill-hover-border
 * reduced-motion：取消位移与 scale，保留 Quiet Active Wash / hairline / ring。
 * 色值一律走 --glass-wb-*，禁止魔法色。
 */
withDefaults(
  defineProps<{
    text: string
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  select: [text: string]
}>()
</script>

<template>
  <t-button
    class="glass-suggest-chip"
    shape="round"
    :disabled="disabled"
    @click="emit('select', text)"
  >
    <span class="glass-suggest-chip__body">
      <!-- Icon Leading：左侧小图标槽（14–16px），无图标时纯文案 -->
      <span v-if="$slots.icon" class="glass-suggest-chip__icon">
        <slot name="icon" />
      </span>
      <slot>{{ text }}</slot>
    </span>
  </t-button>
</template>

<style scoped>
/* Quiet/soft pill：inset hairline + 浅底蓝字；对齐 soft 的 Quiet 幅度，非 Primary */
.glass-suggest-chip {
  height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  border: none;
  background: var(--glass-wb-pill-bg);
  color: var(--glass-wb-pill-text);
  font-size: 13px;
  font-weight: 400;
  /* rest：仅 hairline，不加 quiet 外影，避免欢迎区过浮 */
  box-shadow: var(--glass-wb-tonal-hairline);
  transition: var(--glass-wb-control-transition);
}

.glass-suggest-chip__body {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

/* Icon Leading：14–16px，与文案垂直居中 */
.glass-suggest-chip__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  font-size: 15px;
  flex-shrink: 0;
  color: currentColor;
}

/* Suggest Chip Lift（WinUI Subtle）：抬 1px + hairline Fade；保持 rest 底，无 Color Shift */
.glass-suggest-chip:not(:disabled):hover {
  border: none;
  background: var(--glass-wb-pill-bg);
  color: var(--glass-wb-pill-text);
  filter: none;
  box-shadow: var(--glass-wb-tonal-hairline-hover);
  transform: translateY(var(--glass-wb-control-lift-quiet));
}

/* Quiet Active Wash：略深同色 + 深字，不反转 */
.glass-suggest-chip:not(:disabled):active {
  border: none;
  background: var(--glass-wb-pill-quiet-active-bg);
  color: var(--glass-wb-pill-quiet-active-color);
  filter: none;
  box-shadow: var(--glass-wb-tonal-hairline-active);
  transform: translateY(var(--glass-wb-control-press-y)) scale(var(--glass-wb-control-active-scale));
}

/* Focus Ring：无位移，rest hairline + control ring */
.glass-suggest-chip:focus-visible {
  outline: none;
  box-shadow:
    var(--glass-wb-tonal-hairline),
    var(--glass-wb-control-focus-ring);
}

.glass-suggest-chip:disabled {
  opacity: var(--glass-wb-control-disabled-opacity);
  box-shadow: var(--glass-wb-tonal-hairline);
  transform: none;
}

/* reduced-motion：取消位移与 scale，保留 wash / hairline / ring */
@media (prefers-reduced-motion: reduce) {
  .glass-suggest-chip {
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .glass-suggest-chip:not(:disabled):hover,
  .glass-suggest-chip:not(:disabled):active {
    transform: none;
  }
}
</style>
