<script setup lang="ts">
/**
 * 实验室·海报技法 — Living Demo / 小物件↔大容器 / 换算表。
 * 七色·深度、过渡、微透·悬浮摘录见 Overview。
 * 保留 PosterWash 整装舞台（html「整装工作台 · 真实组件」全局底）。只消费 glass/* 已导出。
 * 禁双托盘；禁 t-card 冒充 Tray；不改 AppShell 全站背景（Track I）。
 * 页面内 min-height 舞台，避免实白 content-panel 盖死 PosterWash。
 * Track J：fit 固定 cover（含安全过冲），无三档切换。
 */
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { ArrowUpIcon } from 'tdesign-icons-vue-next'

import {
  GlassBadge,
  GlassButton,
  GlassPageHeader,
  GlassPanel,
  GlassPosterWash,
  GlassProgress,
  GlassRail,
  GlassStage,
  GlassStickyTool,
  GlassSurface,
} from '@/components/glass'

import { useDocsProps } from '@/layouts/useDocsProps'
import type { DocsDemoBlock } from '@/layouts/useDocsProps'

import { useGlassScheme } from '@/scheme/useGlassScheme'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const { tt } = useGlassScheme()

const docsProps = useDocsProps()

const demoBlocks: DocsDemoBlock[] = [
  {
    id: 'panel-variant',
    label: 'Focus Panel',
    description: 'GlassPanel · variant / title',
    props: [
      {
        key: 'variant',
        label: 'variant',
        type: 'select',
        defaultValue: 'standalone',
        options: [
          { label: 'inset', value: 'inset' },
          { label: 'standalone', value: 'standalone' },
        ],
      },
      { key: 'title', label: 'title', type: 'text', defaultValue: '焦点面 · 叠 wash' },
    ],
  },
  {
    id: 'page-header',
    label: 'Page Header',
    description: 'GlassPageHeader · 单档 Region Layer',
    props: [],
  },
]

onMounted(() => {
  for (const block of demoBlocks) docsProps.registerDemo(block)
})

onBeforeUnmount(() => {
  for (const block of demoBlocks) docsProps.unregisterDemo(block.id)
})

function isDemoSelected(id: string): boolean {
  return docsProps.state.activeDemoId === id
}

function selectDemo(id: string): void {
  docsProps.selectDemo(id)
}

const panelDemo = computed(() => {
  const v = docsProps.state.values['panel-variant'] ?? {}
  return {
    variant: (v.variant as 'inset' | 'standalone') ?? 'standalone',
    title: String(v.title ?? '焦点面 · 叠 wash'),
  }
})

</script>

<template>
  <LabPageShell
    :title="tt('poster.page.title')"
    :desc="tt('poster.page.desc')"
  >
    <!-- 0. Live Props Demo -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('lab.section.liveProps') }}</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 variant / title；Page Header 为单档 Region Layer。
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Focus Panel · variant / title</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('panel-variant') }"
              role="button"
              tabindex="0"
              @click="selectDemo('panel-variant')"
              @keydown.enter="selectDemo('panel-variant')"
              @keydown.space.prevent="selectDemo('panel-variant')"
            >
              <GlassPanel :variant="panelDemo.variant" :title="panelDemo.title">
                <p class="lab-panel-copy">右栏改 variant / title 即时反映。</p>
              </GlassPanel>
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Page Header · Region Layer</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('page-header') }"
              role="button"
              tabindex="0"
              @click="selectDemo('page-header')"
              @keydown.enter="selectDemo('page-header')"
              @keydown.space.prevent="selectDemo('page-header')"
            >
              <GlassPageHeader
                title="页头条示意"
                subtitle="单档 Region Layer · 统一 fill / shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主舞台：PosterWash 全幅底 + 单组件橱窗 + Living -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('poster.section.stage') }}</span>
        <span class="lab-section-meta">
          GlassPosterWash 固定 cover（含安全过冲）作根底 · 单组件橱窗 + Living 叠层 · 页内 min-height 保证 wash 可见
        </span>
      </div>
      <GlassPosterWash class="lab-poster-stage" fit="cover">
        <!-- 1a. 单组件橱窗：Surface / PageHeader(actions) / Panel 各独立一块 -->
        <div class="lab-poster-block">
          <div class="lab-cat-strip lab-cat-strip--stack">
            <span class="lab-cat-name">单组件橱窗 · 叠 PosterWash</span>
            <span class="lab-cat-impl">Surface · PageHeader（Region Layer） · Panel</span>
            <code class="lab-cat-html">.hero-air + .hero-petals 之上</code>
            <span class="lab-cat-rule">
              Do：单档 Region Layer 吃 wash 色场 · 有 actions 仍保持同一材质 · Don’t：t-card 冒充 Tray / 双托盘
            </span>
          </div>
          <div class="lab-poster-showcase">
            <GlassSurface class="lab-poster-solo">
              <div class="lab-poster-solo-body">
                <span class="lab-stub-tag">Host Tray · L1 · 橱窗孤立态</span>
              </div>
            </GlassSurface>
            <GlassPageHeader
              title="页头条 · 叠 wash"
              subtitle="L2 · 带 actions · 单档 Region Layer · 坐 PosterWash 底"
            >
              <template #actions>
                <span class="lab-poster-action">对照</span>
              </template>
            </GlassPageHeader>
            <GlassPanel variant="standalone" title="焦点面 · 叠 wash">
              <p class="lab-panel-copy">L3 standalone 轻影 · 玻璃微透可见 wash 色场。</p>
            </GlassPanel>
          </div>
        </div>

        <!-- 1b. Living：唯一 Host Tray · Surface → Header → Rail|Stage Flush -->
        <div class="lab-poster-block">
          <div class="lab-cat-strip lab-cat-strip--stack">
            <span class="lab-cat-name">Living · 唯一 Host Tray</span>
            <span class="lab-cat-impl">Surface → PageHeader（Region Layer） → Rail | Stage Flush</span>
            <code class="lab-cat-html">.surface → .bph → .rail | .bchat（gap=0）</code>
            <span class="lab-cat-rule">
              Do：整树唯一 L1 · Rail|Stage 贴缝 Flush · Living 页头为单档 Region Layer ·
              Don’t：双托盘 / 中缝 gutter 冒充 Inset Reveal
            </span>
          </div>
          <GlassSurface class="lab-poster-living">
            <div class="lab-poster-living-stack">
              <GlassPageHeader
                title="设置与分区"
                subtitle="L2 · 坐 Host Tray 内 · 单档 Region Layer"
              >
                <template #actions>
                  <span class="lab-poster-action">对照方案</span>
                </template>
              </GlassPageHeader>
              <div class="lab-poster-flush">
                <GlassRail class="lab-poster-rail">
                  <div class="lab-stub-tag">Frost Rail · Flush</div>
                </GlassRail>
                <GlassStage>
                  <template #header>
                    <div class="lab-poster-stage-title">Near-White Stage · Flush</div>
                  </template>
                  <div class="lab-flush-note">
                    Living 四层栈精简：L0 PosterWash → L1 Surface（唯一 Host Tray）→ L2 PageHeader →
                    Rail | Stage Flush（gap=0）。玻璃 backdrop 吃 wash 色场才见微透。
                  </div>
                </GlassStage>
              </div>
            </div>
          </GlassSurface>
        </div>
      </GlassPosterWash>
      <div class="lab-control-note">
        验收：能看见 PosterWash 底（非被实白盖死）；Surface 四周 Inset Reveal 露边；Living 内仅一个 L1；
        Rail|Stage 贴缝 gap=0；backdrop 微透可读。
      </div>
    </section>

    <!-- 2. 小物件 ↔ 大容器 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('poster.section.scale') }}</span>
        <span class="lab-section-meta">
          左列贴海报浓度；右列把同一色相拉长、降对比、改微透。对照 t1 花瓣扇形过渡语义。
        </span>
      </div>
      <GlassPosterWash class="poster-pair-wash" fit="cover">
        <div class="poster-pair-grid">
          <GlassPanel variant="standalone" title="小物件 · 可贴海报浓度" class="poster-object-panel">
            <div class="poster-object-content">
              <p class="poster-object-copy">
                发送钮、主行动、徽章、FAB 与进度条填充共享满浓语义；没有白色高光核。
              </p>
              <div class="poster-object-row">
                <GlassButton variant="send" aria-label="发送">
                  <ArrowUpIcon size="16" />
                </GlassButton>
                <GlassButton variant="primary" shape="round">新会话</GlassButton>
                <GlassBadge variant="count" :count="5">
                  <GlassButton variant="soft">提醒</GlassButton>
                </GlassBadge>
              </div>
              <div class="poster-object-row poster-object-row--split">
                <div class="poster-fab-slot">
                  <div class="poster-fab-host">
                    <GlassStickyTool :offset="10" aria-label="快捷操作" />
                  </div>
                  <span class="poster-object-caption">FAB 52</span>
                </div>
                <div class="poster-progress-slot">
                  <GlassProgress :percentage="68" label="海报浓度 68%" />
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassSurface class="poster-big-surface">
            <div class="poster-big-stack">
              <GlassPageHeader
                title="大容器 · 同相改写"
                subtitle="Surface / PageHeader / Stage · 大面蓝染 5–15%"
              >
                <template #actions>
                  <GlassButton variant="quiet">行动点</GlassButton>
                </template>
              </GlassPageHeader>
              <GlassStage class="poster-big-stage">
                <template #header>
                  <span class="poster-big-stage-title">Near-White Stage</span>
                </template>
                <div class="poster-big-stage-body">
                  <span class="poster-big-ratio">5–15%</span>
                  <p class="poster-big-copy">
                    大面保留近白微透，蓝从 PosterWash 的虚化花瓣透出；层次依靠明度差与柔影，
                    不把满浓渐变涂满容器。
                  </p>
                </div>
              </GlassStage>
            </div>
          </GlassSurface>
        </div>
      </GlassPosterWash>
    </section>

    <!-- 3. 换算表 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('poster.section.table') }}</span>
        <span class="lab-section-meta">
          同一技法在小物件与大容器上的不同落法；色深行是优先裁决。
        </span>
      </div>
      <div class="poster-table-wrap">
        <table class="poster-table">
          <thead>
            <tr>
              <th scope="col">海报技法</th>
              <th scope="col">小物件（可满浓）</th>
              <th scope="col">大容器（必须改写）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">过渡</th>
              <td>芯部饱和、边缘近透；短程高对比可，长程无白色高光核。</td>
              <td>同色相拉长、降对比；页头从冰白到冰蓝再到极淡蓝。</td>
            </tr>
            <tr>
              <th scope="row">微透</th>
              <td>半透叠层看得见背后形，交叠处自然加深。</td>
              <td>近白微透 + backdrop blur；颜色放在背后虚化场，不涂面板。</td>
            </tr>
            <tr>
              <th scope="row">悬浮</th>
              <td>柔影 + 虚化陪衬盘，让行动点从底上浮起。</td>
              <td>极柔大范围投影；顶栏、Surface、Rail、Stage 分层漂浮。</td>
            </tr>
            <tr>
              <th scope="row">色深</th>
              <td>支付宝蓝 / 知乎蓝满饱和，只服务气泡、发送、FAB、徽章、进度与新会话。</td>
              <td>大面蓝染约 5–15% 视觉权重；满饱和只留给小物件。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </LabPageShell>
</template>

<style scoped>
/* Catalog 条：语义名 · Glass* · html 选择器 · Do/Don't（对齐 containers） */
.lab-cat-strip {
  display: grid;
  grid-template-columns: minmax(140px, 1.1fr) minmax(160px, 1.2fr) minmax(180px, 1.4fr);
  gap: 8px 14px;
  padding: 12px 14px;
  border-radius: var(--glass-wb-card-radius);
  border: 1px solid var(--glass-border-soft);
  background: var(--glass-panel-bg);
  font-size: 12px;
  line-height: 1.55;
}

.lab-cat-strip--stack {
  grid-template-columns: 1fr;
}

.lab-cat-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.lab-cat-impl {
  color: var(--glass-text-secondary);
  font-weight: 600;
}

.lab-cat-html {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--glass-text-muted);
  word-break: break-all;
}

.lab-cat-rule {
  color: var(--glass-text-secondary);
}

/* 主舞台：页内 min-height，保证 PosterWash 不被 content-panel 盖死 */
.lab-poster-stage {
  --lab-poster-gap: 20px;
  min-height: 640px;
  gap: var(--lab-poster-gap);
  padding: 20px;
  border-radius: var(--glass-wb-card-radius);
  border: 1px solid var(--glass-border-soft);
  box-sizing: border-box;
}

/* 内容槽吃宿主 gap（GlassPosterWash__content 为 flex + gap:inherit） */
.lab-poster-stage :deep(.glass-poster-wash__content) {
  gap: var(--lab-poster-gap);
  padding: 0;
}

.lab-poster-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lab-poster-showcase {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
}

@media (max-width: 1100px) {
  .lab-poster-showcase {
    grid-template-columns: 1fr;
  }
}

.lab-poster-solo {
  min-height: 140px;
}

.lab-poster-solo-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  background: var(--glass-wb-stage-fill);
  -webkit-backdrop-filter: var(--glass-wb-stage-blur);
  backdrop-filter: var(--glass-wb-stage-blur);
}

.lab-poster-action {
  font-size: 11px;
  font-weight: 600;
  color: var(--glass-chroma-zhihu);
}

/* Living：唯一 Host Tray · Surface → Header → Rail|Stage Flush */
.lab-poster-living {
  min-height: 320px;
}

.lab-poster-living-stack {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  min-height: 0;
  min-width: 0;
  background: transparent;
}

.lab-poster-flush {
  flex: 1;
  display: flex;
  gap: 0;
  min-height: 220px;
  border-radius: var(--glass-wb-card-radius);
  overflow: hidden;
}

.lab-poster-rail {
  width: 30%;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.lab-poster-stage-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.lab-panel-copy {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--glass-text-secondary);
}

.lab-flush-note {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--glass-text-secondary);
  line-height: 1.65;
  padding: 8px 4px 12px;
}

.poster-object-copy,
.poster-big-copy {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: var(--glass-text-secondary);
}

/* ── 2. 小物件 ↔ 大容器 ────────────────────────────────────────────── */
.poster-pair-wash {
  min-height: 520px;
  padding: 20px;
  border-radius: var(--glass-wb-card-radius);
  border: 1px solid var(--glass-border-soft);
  box-sizing: border-box;
}

.poster-pair-wash :deep(.glass-poster-wash__content) {
  gap: 0;
  padding: 0;
}

.poster-pair-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
  gap: 16px;
  width: 100%;
  min-height: 0;
}

.poster-object-panel {
  min-width: 0;
  min-height: 440px;
}

.poster-object-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.poster-object-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.poster-object-row--split {
  align-items: stretch;
}

.poster-fab-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.poster-fab-host {
  position: relative;
  width: 74px;
  height: 74px;
  border-radius: 18px;
  background: var(--glass-chroma-frost);
}

.poster-object-caption {
  font-size: 10.5px;
  color: var(--glass-text-muted);
}

.poster-progress-slot {
  display: flex;
  flex: 1;
  min-width: 180px;
  flex-direction: column;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--glass-wb-pill-quiet-bg);
}

.poster-big-surface {
  min-height: 440px;
  min-width: 0;
}

.poster-big-stack {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  min-height: 0;
  padding: 12px;
  background: transparent;
}

.poster-big-stage {
  min-height: 280px;
}

.poster-big-stage-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.poster-big-stage-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  padding: 8px 4px 12px;
}

.poster-big-ratio {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: var(--glass-wb-pill-quiet-color);
}

/* ── 3. 换算表 ─────────────────────────────────────────────────────── */
.poster-table-wrap {
  overflow-x: auto;
  border-radius: 14px;
  background: var(--glass-wb-pill-quiet-bg);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
}

.poster-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-size: 12px;
  line-height: 1.55;
  color: var(--glass-text-secondary);
}

.poster-table th,
.poster-table td {
  padding: 12px 14px;
  text-align: left;
  vertical-align: top;
}

.poster-table thead th {
  background: var(--glass-chroma-frost);
  font-size: 11px;
  font-weight: 700;
  color: var(--glass-text-primary);
}

.poster-table thead th:first-child,
.poster-table tbody th {
  width: 92px;
}

.poster-table tbody th {
  font-weight: 600;
  color: var(--glass-text-primary);
}

.poster-table tbody tr:nth-child(even) {
  background: var(--glass-wb-soft-bg);
}

@media (max-width: 980px) {
  .poster-pair-grid {
    grid-template-columns: 1fr;
  }

  .poster-object-panel,
  .poster-big-surface {
    min-height: 0;
  }
}

@media (max-width: 640px) {
  .poster-pair-wash {
    padding: 12px;
  }

  .poster-object-row--split {
    flex-direction: column;
  }
}
</style>
