<script setup lang="ts">
/**
 * GlassRadio — Compound Wrapper 盖 t-radio（纯透传层）
 *
 * class / style 落在 t-radio 根（label）上，其余 attrs（value / checked / modelValue /
 * disabled / allowUncheck / name / label / onChange / onClick）透传 t-radio。
 * 视觉一律由 styles/theme.css 的 .glass-radio* 选择器收口；组件内禁止魔法 hex/rgba。
 *
 * 用法：放进 GlassRadioGroup（variant=default）的 default slot 自定义选项，
 * 或作为受控/非受控单选项独立使用。
 */
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const radioAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
</script>

<template>
  <t-radio
    class="glass-radio"
    :class="shellClass"
    :style="shellStyle"
    v-bind="radioAttrs"
  >
    <slot />
  </t-radio>
</template>
