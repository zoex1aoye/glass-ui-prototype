<script setup lang="ts">
/**
 * GlassDescriptions — Compound Wrapper 盖 t-descriptions（描述列表）
 *
 * UI/UX 术语：
 * - Quiet Label / Content：阅读焦点三档——label 走 secondary（--glass-wb-descriptions-label-color），
 *   content 走 primary（--glass-wb-descriptions-content-color），次级内容走 muted
 *   （--glass-wb-descriptions-content-secondary）；13px 节奏对齐 Form Quiet。
 * - Tone Grid + soft hairline：bordered 以矩阵底 wash
 *   （--glass-wb-descriptions-bordered-fill）、偶数行 content 底色差
 *   （--glass-wb-descriptions-row-stripe）、label 淡染
 *   （--glass-wb-descriptions-label-fill）建立层次，并用柔和 1px 网格线
 *   （--glass-wb-descriptions-hairline）恢复可读的 bordered 外框与格线。
 *   content 格透明吃宿主（--glass-wb-descriptions-content-fill）；
 *   禁止粉笔白实色格与硬白网格。
 * - Hairline 边界：soft hairline 只属于 Descriptions bordered 组件网格；
 *   DetailPlate / Surface 等容器外轮廓仍不加 hairline。
 * - Host-first：自身不自带实心底卡；外轮廓圆角走 --glass-wb-descriptions-radius。
 * - 推荐宿主：GlassDetailPlate（html `.bub-a` 密信息内容岛；页内 / 浮层内通用）。
 *   Descriptions 透明吃宿主，不再自造托盘。
 * - Don't：挂进 GlassStage——Stage 是 html `.chat` 会话画布，不扛密 KV；
 *   GlassCard 是会话流 Soft Cite 引用软卡，FormPane 是填表会话窗，均不作只读详情宿主。
 * - 透传最小集：bordered / colon / column / contentStyle / itemLayout / items /
 *   labelStyle / layout / size / tableLayout / title；slot default → GlassDescriptionsItem。
 *
 * 注意：TD Descriptions 靠 slot 子节点 type.name 以 "TDescriptionsItem" 结尾识别条目，
 * 薄 SFC 包装会破坏该识别，故 GlassDescriptionsItem 为 DescriptionsItem 的干净再导出
 * （与 GlassTabPanel / GlassStepItem 同纪律），本组件不做第二层 item 包装。
 */
import { computed, useAttrs } from 'vue'

import type {
  SizeEnum,
  Styles,
  TdDescriptionsItemProps,
  TdDescriptionsProps,
} from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    bordered?: boolean
    colon?: boolean
    column?: number
    contentStyle?: Styles
    itemLayout?: TdDescriptionsProps['itemLayout']
    items?: TdDescriptionsItemProps[]
    labelStyle?: Styles
    layout?: TdDescriptionsProps['layout']
    size?: SizeEnum
    tableLayout?: TdDescriptionsProps['tableLayout']
    title?: TdDescriptionsProps['title']
  }>(),
  {
    bordered: undefined,
    colon: undefined,
    column: undefined,
    contentStyle: undefined,
    itemLayout: undefined,
    items: undefined,
    labelStyle: undefined,
    layout: undefined,
    size: undefined,
    tableLayout: undefined,
    title: undefined,
  },
)

const attrs = useAttrs()

/** class / style 落在外壳；其余 attrs 透传 t-descriptions */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const descriptionsAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const optionalBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.bordered !== undefined) bind.bordered = props.bordered
  if (props.colon !== undefined) bind.colon = props.colon
  if (props.column !== undefined) bind.column = props.column
  if (props.contentStyle !== undefined) bind.contentStyle = props.contentStyle
  if (props.itemLayout !== undefined) bind.itemLayout = props.itemLayout
  if (props.items !== undefined) bind.items = props.items
  if (props.labelStyle !== undefined) bind.labelStyle = props.labelStyle
  if (props.layout !== undefined) bind.layout = props.layout
  if (props.size !== undefined) bind.size = props.size
  if (props.tableLayout !== undefined) bind.tableLayout = props.tableLayout
  if (props.title !== undefined) bind.title = props.title
  return bind
})

/** 合并到单一 v-bind（Vue 单元素不允许同名 v-bind 指令重复出现） */
const descriptionsBind = computed<Record<string, unknown>>(() => ({
  ...optionalBind.value,
  ...descriptionsAttrs.value,
}))
</script>

<template>
  <div
    class="glass-descriptions"
    :class="shellClass"
    :style="shellStyle"
  >
    <t-descriptions
      class="glass-descriptions__core"
      v-bind="descriptionsBind"
    >
      <template v-if="$slots.title" #title>
        <slot name="title" />
      </template>
      <slot />
    </t-descriptions>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留空结构钩子，零视觉 CSS。
   视觉一律由 theme.css 的 .glass-descriptions* 选择器收口。 */
.glass-descriptions__core {
  display: block;
}
</style>
