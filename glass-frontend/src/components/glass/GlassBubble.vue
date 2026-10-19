<script setup lang="ts">
/**
 * GlassBubble — 会话气泡（html `.bub-a` / `.bub-u`）
 *
 * 用途：Stage / Chat 会话流里的用户与 AI 消息气泡，默认 slot 承载正文。
 * - assistant：左齐、冷近白微透、左下尖角、blur + 柔影（html `.bub-a`）
 * - user：右齐、满浓蓝、右下尖角、白字 + 蓝影（html `.bub-u`）
 *
 * 分工：GlassPanel variant="standalone" 承担只读密信息阅读面；
 * 本组件只负责会话气泡，不互相替代或改坏材质。
 * 色值 / 圆角 / 影全部走 `--glass-wb-bubble-*`，组件内零魔法色。
 */
withDefaults(
  defineProps<{
    /** 会话角色：user=用户消息；assistant=AI 消息 */
    role?: 'user' | 'assistant'
  }>(),
  {
    role: 'assistant',
  },
)
</script>

<template>
  <div
    class="glass-bubble"
    :class="role === 'user' ? 'glass-bubble--user' : 'glass-bubble--ai'"
    :data-role="role"
  >
    <slot />
  </div>
</template>
