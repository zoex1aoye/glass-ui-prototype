<script setup lang="ts">
/**
 * GlassStickyTool — 单钮 FAB「+」Affordant Orb
 * Compound Wrapper：外层 absolute 定位壳 + 内嵌 t-button shape=circle。
 * 定位策略：absolute within Surface / Stage 相对定位祖先（非 fixed）。
 * Interaction：Liquid Lift Press — Affordant Orb 最大幅度（Quiet < Primary < FAB）；
 * hover = Hover Lift + Shadow Bloom + brightness-fab；active = Active Press + Shadow Settle。
 * 选型红线：无 FloatButton、不用 t-sticky-tool；禁止复用 GlassButton 变体。
 */
import { computed } from 'vue'

import { AddIcon } from 'tdesign-icons-vue-next'

const props = withDefaults(
  defineProps<{
    /** 无障碍名称 */
    ariaLabel?: string
    /** Safe Offset（px）；不传则用 --glass-wb-fab-offset */
    offset?: number
    disabled?: boolean
    /** 透传 t-button loading；交互锁定 */
    loading?: boolean
  }>(),
  {
    ariaLabel: '快捷操作',
    offset: undefined,
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const offsetStyle = computed(() => {
  if (props.offset == null) return undefined
  const value = `${props.offset}px`
  return { right: value, bottom: value }
})

const isLocked = computed(() => props.disabled || props.loading)

function onClick(e: MouseEvent) {
  if (isLocked.value) return
  emit('click', e)
}
</script>

<template>
  <div class="glass-sticky-tool" :style="offsetStyle">
    <t-button
      class="glass-sticky-tool__orb"
      :class="{ 'glass-sticky-tool__orb--locked': isLocked }"
      shape="circle"
      :disabled="disabled"
      :loading="loading"
      :aria-label="ariaLabel"
      @click="onClick"
    >
      <slot>
        <AddIcon size="22" />
      </slot>
    </t-button>
  </div>
</template>

<style scoped>
/* 定位壳：absolute within Surface / Stage 相对定位祖先；Safe Offset 走 token */
.glass-sticky-tool {
  position: absolute;
  right: var(--glass-wb-fab-offset);
  bottom: var(--glass-wb-fab-offset);
  width: var(--glass-wb-fab-size);
  height: var(--glass-wb-fab-size);
  z-index: var(--glass-wb-fab-z);
}

/* Affordant Orb：满浓小物件，非 frost 大容器；底层 t-button shape=circle */
.glass-sticky-tool__orb {
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--glass-wb-fab-bg);
  -webkit-backdrop-filter: var(--glass-wb-fab-blur);
  backdrop-filter: var(--glass-wb-fab-blur);
  box-shadow: var(--glass-wb-fab-shadow);
  color: var(--glass-wb-white);
  font-size: 22px;
  font-weight: 700;
  transition: var(--glass-wb-control-transition);
}

/* Hover Lift + Shadow Bloom + Color Shift（FAB 最大幅度） */
.glass-sticky-tool__orb:not(.glass-sticky-tool__orb--locked):hover {
  transform: translateY(var(--glass-wb-control-lift-fab));
  filter: var(--glass-wb-control-hover-bright-fab);
  background: var(--glass-wb-fab-bg);
  color: var(--glass-wb-white);
  box-shadow: var(--glass-wb-fab-hover-shadow);
}

/* Active Press：微下沉 + 挤压 scale + Shadow Settle；不改宽高，无布局抖动 */
.glass-sticky-tool__orb:not(.glass-sticky-tool__orb--locked):active {
  transform: translateY(var(--glass-wb-control-press-y)) scale(var(--glass-wb-fab-active-scale));
  filter: none;
  box-shadow: var(--glass-wb-fab-active-shadow);
}

/* Focus Ring：键盘可达 */
.glass-sticky-tool__orb:focus-visible {
  outline: none;
  box-shadow:
    var(--glass-wb-fab-shadow),
    var(--glass-wb-control-focus-ring);
}

.glass-sticky-tool__orb--locked {
  cursor: not-allowed;
  filter: none;
  transform: none;
}

.glass-sticky-tool__orb:disabled {
  opacity: var(--glass-wb-control-disabled-opacity);
  box-shadow: none;
}

/* reduced-motion：取消位移与 scale，只保留颜色（+ 影态） */
@media (prefers-reduced-motion: reduce) {
  .glass-sticky-tool__orb {
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease,
      filter 0.15s ease;
  }

  .glass-sticky-tool__orb:not(.glass-sticky-tool__orb--locked):hover,
  .glass-sticky-tool__orb:not(.glass-sticky-tool__orb--locked):active {
    transform: none;
  }
}
</style>
