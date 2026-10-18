<script setup lang="ts">
/**
 * GlassPosterWash — L0 整装权威橱窗底（Poster Wash / Hero Air + Petals）
 * html 锚点：「整装工作台 · 真实组件」区 `.hero-air`（含 ::before/::after）+ `.hero-petals i.a–c`
 *   + `body` 灰白长渐变底垫；`pageAir` 可选叠页级 `.poster-air span.a–d`（非主权威）。
 * 层序（下→上）：wash 底垫 → [pageAir] → scene（air+伪元 → petals×3）→ default slot。
 * 自适应：宿主 `container-type: size`，scene 按 1280×720 画布等比 cover（含安全过冲）；
 *   花瓣禁止非等比拉伸。装饰层 `pointer-events: none`，slot 可点。
 * 材质只读 `--glass-poster-*`；禁止魔法色。权威顺序见本仓玻璃语言 skill（`AGENTS.md` 路由表）。
 */
withDefaults(
  defineProps<{
    /** 场景适配：仅 cover = 等比盖满 × 安全过冲；禁止 contain */
    fit?: 'cover'
    /** 是否叠页级 poster-air bokeh（html .poster-air；非橱窗主权威，默认关） */
    pageAir?: boolean
  }>(),
  {
    fit: 'cover',
    pageAir: false,
  },
)
</script>

<template>
  <div class="glass-poster-wash" :data-fit="fit" data-layer="l0">
    <!-- 可选页级 bokeh（html .poster-air）：不随 scene 缩放，盖在 wash 上、air 下 -->
    <div v-if="pageAir" class="glass-poster-wash__page-air" aria-hidden="true">
      <span class="a" />
      <span class="b" />
      <span class="c" />
      <span class="d" />
    </div>

    <!-- 设计画布 scene：等比 scale；内含 hero-air + hero-petals -->
    <div class="glass-poster-wash__scene" aria-hidden="true">
      <!-- hero-air：四径向 + 一线性；::before 横条带 / ::after 左下有机形 -->
      <div class="glass-poster-wash__air" />
      <!-- hero-petals：有机圆角 × multiply，叠在 air 上 -->
      <div class="glass-poster-wash__petals">
        <i class="a" />
        <i class="b" />
        <i class="c" />
      </div>
    </div>

    <!-- 内容槽：z 高于装饰，可交互 -->
    <div class="glass-poster-wash__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* 宿主：露边吃 wash；size 容器供 cqw/cqh 计算 scene scale。
   父级须给出确定高度（height:100% / min-height），否则 container 尺寸退化。 */
.glass-poster-wash {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  container-type: size;
  background: var(--glass-poster-wash);
  /* 隔离 multiply：花瓣只在本场内叠色，不污染外部 */
  isolation: isolate;
}

/* ── scene 等比 scale（tan(atan2) 得无量纲比，cover×安全过冲）─────────
   画布 --glass-poster-board-w/h；禁止非等比拉伸花瓣。 */
.glass-poster-wash {
  --poster-sx: tan(atan2(100cqw, var(--glass-poster-board-w)));
  --poster-sy: tan(atan2(100cqh, var(--glass-poster-board-h)));
  --poster-scale-cover: max(var(--poster-sx), var(--poster-sy));
  --poster-scale: calc(var(--poster-scale-cover) * var(--glass-poster-safe-boost));
}

/* data-fit="cover" 作文档锚点；默认 scale 即 cover × 安全过冲 */
.glass-poster-wash[data-fit='cover'] {
  --poster-scale: calc(var(--poster-scale-cover) * var(--glass-poster-safe-boost));
}

.glass-poster-wash__scene {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--glass-poster-board-w);
  height: var(--glass-poster-board-h);
  translate: -50% -50%;
  scale: var(--poster-scale);
  z-index: 0;
  pointer-events: none;
}

/* 无 tan(atan2) 时的退化：画布居中不缩放，wash 露边；
   不做非等比拉伸兜底。 */
@supports not (scale: tan(atan2(1px, 1px))) {
  .glass-poster-wash__scene {
    scale: 1;
  }
}

/* ── hero-air（html .hero-air）────────────────────────────────────────── */
.glass-poster-wash__air {
  position: absolute;
  inset: var(--glass-poster-air-inset);
  pointer-events: none;
  background: var(--glass-poster-air-bg);
  filter: var(--glass-poster-air-blur);
}

/* ::before 横向条带二次 bloom */
.glass-poster-wash__air::before {
  content: '';
  position: absolute;
  left: var(--glass-poster-air-before-left);
  top: var(--glass-poster-air-before-top);
  width: var(--glass-poster-air-before-w);
  height: var(--glass-poster-air-before-h);
  border-radius: var(--glass-poster-air-before-radius);
  background: var(--glass-poster-air-before-bg);
  filter: var(--glass-poster-air-before-blur);
  opacity: var(--glass-poster-air-before-opacity);
  transform: rotate(var(--glass-poster-air-before-rotate));
  pointer-events: none;
}

/* ::after 左下有机形二次 bloom */
.glass-poster-wash__air::after {
  content: '';
  position: absolute;
  left: var(--glass-poster-air-after-left);
  bottom: var(--glass-poster-air-after-bottom);
  width: var(--glass-poster-air-after-w);
  height: var(--glass-poster-air-after-h);
  border-radius: var(--glass-poster-air-after-radius);
  background: var(--glass-poster-air-after-bg);
  filter: var(--glass-poster-air-after-blur);
  opacity: var(--glass-poster-air-after-opacity);
  transform: rotate(var(--glass-poster-air-after-rotate));
  pointer-events: none;
}

/* ── hero-petals（html .hero-petals i.a–c）───────────────────────────── */
.glass-poster-wash__petals {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.glass-poster-wash__petals i {
  position: absolute;
  display: block;
  border-radius: var(--glass-poster-petal-radius);
  mix-blend-mode: var(--glass-poster-petal-blend);
  pointer-events: none;
}

.glass-poster-wash__petals .a {
  left: var(--glass-poster-petal-a-left);
  top: var(--glass-poster-petal-a-top);
  width: var(--glass-poster-petal-a-w);
  height: var(--glass-poster-petal-a-h);
  background: var(--glass-poster-petal-a-bg);
  filter: var(--glass-poster-petal-a-blur);
  opacity: var(--glass-poster-petal-a-opacity);
  transform: rotate(var(--glass-poster-petal-a-rotate));
}

.glass-poster-wash__petals .b {
  right: var(--glass-poster-petal-b-right);
  top: var(--glass-poster-petal-b-top);
  width: var(--glass-poster-petal-b-w);
  height: var(--glass-poster-petal-b-h);
  background: var(--glass-poster-petal-b-bg);
  filter: var(--glass-poster-petal-b-blur);
  opacity: var(--glass-poster-petal-b-opacity);
  transform: rotate(var(--glass-poster-petal-b-rotate));
}

.glass-poster-wash__petals .c {
  left: var(--glass-poster-petal-c-left);
  bottom: var(--glass-poster-petal-c-bottom);
  width: var(--glass-poster-petal-c-w);
  height: var(--glass-poster-petal-c-h);
  background: var(--glass-poster-petal-c-bg);
  filter: var(--glass-poster-petal-c-blur);
  opacity: var(--glass-poster-petal-c-opacity);
  transform: rotate(var(--glass-poster-petal-c-rotate));
}

/* ── pageAir 可选页级 bokeh（html .poster-air span.a–d）──────────────── */
.glass-poster-wash__page-air {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.glass-poster-wash__page-air span {
  position: absolute;
  border-radius: var(--glass-poster-page-air-radius);
  filter: blur(48px);
  opacity: 0.45;
  pointer-events: none;
}

.glass-poster-wash__page-air .a {
  top: var(--glass-poster-page-air-a-top);
  left: var(--glass-poster-page-air-a-left);
  width: var(--glass-poster-page-air-a-w);
  height: var(--glass-poster-page-air-a-h);
  background: var(--glass-poster-page-air-a-bg);
  transform: rotate(var(--glass-poster-page-air-a-rotate));
}

.glass-poster-wash__page-air .b {
  top: var(--glass-poster-page-air-b-top);
  right: var(--glass-poster-page-air-b-right);
  width: var(--glass-poster-page-air-b-w);
  height: var(--glass-poster-page-air-b-h);
  background: var(--glass-poster-page-air-b-bg);
}

.glass-poster-wash__page-air .c {
  bottom: var(--glass-poster-page-air-c-bottom);
  left: var(--glass-poster-page-air-c-left);
  width: var(--glass-poster-page-air-c-w);
  height: var(--glass-poster-page-air-c-h);
  background: var(--glass-poster-page-air-c-bg);
  filter: var(--glass-poster-page-air-c-blur);
  opacity: var(--glass-poster-page-air-c-opacity);
}

.glass-poster-wash__page-air .d {
  bottom: var(--glass-poster-page-air-d-bottom);
  right: var(--glass-poster-page-air-d-right);
  width: var(--glass-poster-page-air-d-w);
  height: var(--glass-poster-page-air-d-h);
  background: var(--glass-poster-page-air-d-bg);
  filter: var(--glass-poster-page-air-d-blur);
  opacity: var(--glass-poster-page-air-d-opacity);
}

/* ── 内容槽：叠在装饰之上；flex 列承接 Lab gap（宿主上的 display:flex 不穿透） */
.glass-poster-wash__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: inherit;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  pointer-events: auto;
}
</style>
