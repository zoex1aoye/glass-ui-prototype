<script setup lang="ts">
/**
 * GlassToolbarActions — Action Pair / Header Actions
 * 页头成对次要+主要行动点：Quiet CTA「分享」（左）+ Primary CTA「新会话」（右）。
 * Pill Control：两端 height 对齐 Capsule Field（38px / radius 999）。
 * Compound Wrapper：内嵌 GlassButton（底层 t-button shape=round）。
 */
import GlassButton from './GlassButton.vue'

const props = withDefaults(
  defineProps<{
    /** Quiet CTA 文案 override */
    shareText?: string
    /** Primary CTA 文案 override */
    createText?: string
    disabled?: boolean
  }>(),
  {
    shareText: '分享',
    createText: '新会话',
    disabled: false,
  },
)

const emit = defineEmits<{
  /** Quiet CTA（分享） */
  share: []
  /** Primary CTA（新会话） */
  create: []
}>()
</script>

<template>
  <div class="glass-toolbar-actions" role="group" aria-label="Header Actions">
    <GlassButton
      variant="quiet"
      :disabled="props.disabled"
      class="glass-toolbar-actions__share"
      @click="emit('share')"
    >
      {{ props.shareText }}
    </GlassButton>
    <GlassButton
      variant="primary"
      shape="round"
      :disabled="props.disabled"
      class="glass-toolbar-actions__create"
      @click="emit('create')"
    >
      {{ props.createText }}
    </GlassButton>
  </div>
</template>

<style scoped>
/* Action Pair：flex 成对，分享在左、新会话在右 */
.glass-toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--glass-wb-toolbar-gap);
  flex-shrink: 0;
}
</style>
