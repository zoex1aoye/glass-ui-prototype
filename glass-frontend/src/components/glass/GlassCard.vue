<script setup lang="ts">
/**
 * GlassCard — Soft Cite Card（html `.card-soft`）
 *
 * 近白微透软引用卡：原生玻璃壳 + 默认 slot，不包 t-card。
 * 对齐 `.card-soft`：max-width ≈ 88% / radius 14 / padding 12×14；
 * 柔影 + AI 紫 inset hairline 与强调字色全部走 --glass-wb-card-soft-* token，
 * 视觉规则由 theme.css `.glass-card` 承载（组件内零魔法色）。
 * 强调文字：slot 内嵌套 <b>（.glass-card b → zhihu-deep 深字）。
 *
 * 定位：会话流内「引用」软卡，非 Host Tray / Surface / Panel，不占 L1–L3 层语义。
 */
</script>

<template>
  <div class="glass-card">
    <slot />
  </div>
</template>
