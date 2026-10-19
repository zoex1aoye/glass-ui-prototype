<script setup lang="ts">
/**
 * GlassStage — Stage 外壳（Container Catalog · Material Stack z4）
 * - html `.chat` 会话画布：近白微透焦点面，单一材质吃 --glass-wb-stage-*。
 * - Stage 只承担会话画布；密 KV / 表详情不进 Stage，推荐 GlassPanel variant="standalone"。
 * 几何红线：抬升影交给整板（Floating Plate），Stage 自身不得成第二张浮卡；
 * 外轮廓圆角 = flush token（右上 / 右下），与 Surface __body 同源；左侧贴缝边保持 0。
 * 不加外轮廓 hairline；Surface 仍兜底裁切，与 Rail gap=0，禁止 gutter。
 * Stage Nested Chrome：内嵌表用 GlassTable variant="inset"（禁双托盘）；通用嵌板 P1。
 * slots: header（可选）/ default
 */
</script>

<template>
  <section class="glass-stage">
    <header v-if="$slots.header" class="glass-stage__header">
      <slot name="header" />
    </header>
    <div class="glass-stage__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
/* z3b Stage：几何壳体 + 单一会话画布材质。抬升影在整板，自身不叠重影。
   外轮廓右上 / 右下吃 flush token；左侧贴缝边为 0，与 Rail gap=0。
   外层裁切 backdrop-filter；滚动仍由 __body 的 overflow: auto 承担。 */
.glass-stage {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--glass-wb-stage-fill);
  -webkit-backdrop-filter: var(--glass-wb-stage-blur);
  backdrop-filter: var(--glass-wb-stage-blur);
  box-shadow: var(--glass-wb-stage-shadow);
  border-radius: 0 var(--glass-wb-stack-flush-radius) var(--glass-wb-stack-flush-radius) 0;
  overflow: hidden;
}

.glass-stage__header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 32px 10px;
}

.glass-stage__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 8px 28px 28px;
  overflow: auto;
}
</style>
