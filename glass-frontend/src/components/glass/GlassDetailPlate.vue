<script setup lang="ts">
/**
 * GlassDetailPlate — 密信息只读详情板（html `.bub-a` 内容岛）
 *
 * 用途：页内 / 浮层内承载 Descriptions、元数据 KV、只读规格等高密度阅读内容。
 * 材质：冷近白微透 + 轻柔影，固定一档；比 Stage 略实、略冷，作为阅读底板。
 * 定位：不是 Stage 会话画布，不是 Soft Cite 引用卡，不是 Host Tray，
 *       也不是二次 Surface；不提供 inset / standalone 双轨。
 * 边界：容器自身不加外轮廓 hairline；层次由明度 / 冷暖与字色三档建立。
 * slots: header? / default / footer?
 * 色值与材质一律走 `--glass-wb-detail-plate-*`，组件内禁止魔法色。
 */
withDefaults(
  defineProps<{
    /** 可选标题；需要自定义标题结构时改用 #header slot */
    title?: string
  }>(),
  {
    title: undefined,
  },
)
</script>

<template>
  <section class="glass-detail-plate" data-container="detail-plate">
    <header v-if="title || $slots.header" class="glass-detail-plate__header">
      <slot name="header">
        <h3 v-if="title" class="glass-detail-plate__title">{{ title }}</h3>
      </slot>
    </header>

    <div class="glass-detail-plate__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="glass-detail-plate__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
/* 密信息内容岛：单一材质，无 variant；外影来自 `.bub-a`，不使用 hairline 补层次。 */
.glass-detail-plate {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: var(--glass-wb-detail-plate-radius);
  background: var(--glass-wb-detail-plate-fill);
  -webkit-backdrop-filter: var(--glass-wb-detail-plate-blur);
  backdrop-filter: var(--glass-wb-detail-plate-blur);
  box-shadow: var(--glass-wb-detail-plate-shadow);
}

.glass-detail-plate__header {
  flex: none;
  padding: var(--glass-wb-detail-plate-pad);
  padding-bottom: 0;
}

.glass-detail-plate__title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--glass-text-primary);
}

.glass-detail-plate__body {
  flex: 1;
  min-height: 0;
  padding: var(--glass-wb-detail-plate-pad);
}

.glass-detail-plate__footer {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: var(--glass-wb-detail-plate-pad);
  padding-top: 0;
  font-size: 12px;
  color: var(--glass-text-muted);
}
</style>
