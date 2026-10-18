<script setup lang="ts">
/**
 * GlassCollapsePanel — Compound Wrapper 盖 t-collapse-panel（玻璃折叠面板）
 *
 * 只透传契约 + 挂 class 钩子；视觉数值全部在 styles/theme.css 收口
 * （.glass-collapse-panel* 选择器）。组件内禁止魔法 hex/rgba。
 *
 * 透传最小集：value、header、content、disabled、destroyOnCollapse、expandIcon、
 * headerRightContent；slot：default（内容）、header、expandIcon、headerRightContent。
 */
import { computed, useAttrs } from 'vue'

import type { CollapsePanelValue, TdCollapsePanelProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    value?: CollapsePanelValue
    header?: TdCollapsePanelProps['header']
    content?: TdCollapsePanelProps['content']
    disabled?: boolean
    destroyOnCollapse?: boolean
    expandIcon?: TdCollapsePanelProps['expandIcon']
    headerRightContent?: TdCollapsePanelProps['headerRightContent']
  }>(),
  {
    value: undefined,
    header: undefined,
    content: undefined,
    disabled: undefined,
    destroyOnCollapse: undefined,
    expandIcon: undefined,
    headerRightContent: undefined,
  },
)

const attrs = useAttrs()

/** class / style 落在外壳；其余 attrs 透传 t-collapse-panel */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const panelAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const panelBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.value !== undefined) bind.value = props.value
  if (props.header !== undefined) bind.header = props.header
  if (props.content !== undefined) bind.content = props.content
  if (props.disabled !== undefined) bind.disabled = props.disabled
  if (props.destroyOnCollapse !== undefined) bind.destroyOnCollapse = props.destroyOnCollapse
  if (props.expandIcon !== undefined) bind.expandIcon = props.expandIcon
  if (props.headerRightContent !== undefined) {
    bind.headerRightContent = props.headerRightContent
  }
  return { ...bind, ...panelAttrs.value }
})
</script>

<template>
  <div
    class="glass-collapse-panel"
    :class="shellClass"
    :style="shellStyle"
  >
    <t-collapse-panel
      class="glass-collapse-panel__core"
      v-bind="panelBind"
    >
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>
      <template v-if="$slots.headerRightContent" #headerRightContent>
        <slot name="headerRightContent" />
      </template>
      <template v-if="$slots.expandIcon" #expandIcon>
        <slot name="expandIcon" />
      </template>
      <slot />
    </t-collapse-panel>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留空结构钩子，零视觉 CSS。
   视觉一律由 theme.css 的 .glass-collapse-panel* 选择器收口。 */
.glass-collapse-panel__core {
  display: block;
}
</style>
