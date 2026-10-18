<script setup lang="ts">
/**
 * GlassComment — Compound Wrapper 盖 t-comment（Glass 评论 / 引用槽）
 *
 * 会话流内评论与「引用」槽：透传 author / avatar / content / datetime /
 * quote / reply / actions 及其对应 slots；class 钩子 `glass-comment`
 * 挂在 t-comment 根上，Quiet 排版（头像 40 · 无硬描边 · 引用槽嵌 GlassCard
 * 自带 hairline）全部由 styles/theme.css 的 `--glass-wb-comment-*` token 承载，
 * 组件内零魔法 hex/rgba。
 *
 * 定位：评论 / 引用叙事位，非 Host Tray / Surface / Panel，不占 L1–L3 层语义；
 * quote 区嵌 GlassCard 时不重复左描边（卡自带 hairline 即唯一边框）。
 */
import { computed, useAttrs } from 'vue'

import type { TdCommentProps } from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    author?: TdCommentProps['author']
    avatar?: TdCommentProps['avatar']
    content?: TdCommentProps['content']
    datetime?: TdCommentProps['datetime']
    quote?: TdCommentProps['quote']
    reply?: TdCommentProps['reply']
    actions?: TdCommentProps['actions']
  }>(),
  {
    author: undefined,
    avatar: undefined,
    content: undefined,
    datetime: undefined,
    quote: undefined,
    reply: undefined,
    actions: undefined,
  },
)

const attrs = useAttrs()

/** class / style 落在 t-comment 根；其余 attrs 透传 t-comment */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const commentAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const commentBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.author !== undefined) bind.author = props.author
  if (props.avatar !== undefined) bind.avatar = props.avatar
  if (props.content !== undefined) bind.content = props.content
  if (props.datetime !== undefined) bind.datetime = props.datetime
  if (props.quote !== undefined) bind.quote = props.quote
  if (props.reply !== undefined) bind.reply = props.reply
  if (props.actions !== undefined) bind.actions = props.actions
  return { ...bind, ...commentAttrs.value }
})
</script>

<template>
  <t-comment
    class="glass-comment"
    :class="shellClass"
    :style="shellStyle"
    v-bind="commentBind"
  >
    <template v-if="$slots.avatar" #avatar>
      <slot name="avatar" />
    </template>
    <template v-if="$slots.author" #author>
      <slot name="author" />
    </template>
    <template v-if="$slots.datetime" #datetime>
      <slot name="datetime" />
    </template>
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
    <template v-if="$slots.quote" #quote>
      <slot name="quote" />
    </template>
    <template v-if="$slots.reply" #reply>
      <slot name="reply" />
    </template>
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
  </t-comment>
</template>
