<script setup lang="ts">
/**
 * GlassStage — Stage 外壳（Container Catalog · Material Stack z4）
 * - html `.chat` 会话画布：Content Layer / LayerFill，单一材质吃 --glass-wb-stage-*。
 * - 与 Rail：明度差 + 左缘 1px seam contour（--glass-wb-stage-seam）；Stage 不发光、不成第二张浮卡。
 * - Stage 只承担会话画布；密 KV / 表详情不进 Stage，推荐 GlassPanel variant="standalone"。
 * 几何红线：抬升影交给整板；外轮廓圆角 = flush token（右上 / 右下）；与 Rail gap=0；
 * 分界只用贴缝单侧 contour，禁止 gutter 露边、禁止 Rail+Stage 双线。
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
/* Stage：Content Layer / LayerFill。右上/右下 flush；与 Rail gap=0；
   左缘 seam contour 吃 --glass-wb-stage-shadow（现别名 stage-seam）。 */
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
