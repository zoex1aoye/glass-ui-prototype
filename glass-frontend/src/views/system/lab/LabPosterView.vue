<script setup lang="ts">
/**
 * 实验室·海报技法 — 七色分工 / 海报三技法 / 小物件↔大容器 / 换算表
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

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const docsProps = useDocsProps()

const paletteSwatches = [
  { key: 'alipay', name: '支付宝蓝', role: '用户气泡 / 发送钮 / 徽标' },
  { key: 'zhihu', name: '知乎蓝', role: '行动点 / FAB / 主按钮' },
  { key: 'cyan', name: '冰青芯', role: '进度亮端 / 花瓣芯' },
  { key: 'poster', name: '海报灰白底', role: 'z0 页面基座' },
  { key: 'ice', name: '冰晶白', role: 'z1 hero 外壳' },
  { key: 'frost', name: '磨砂冰蓝', role: 'z2 图标栏 / Rail / 舞台' },
  { key: 'paper', name: '暖纸白', role: 'z3 Surface / 页头 / 卡片' },
  { key: 'ai', name: 'AI 紫', role: '选中态 / 引用卡 / 徽章点缀' },
] as const

const depthSwatches = [
  { key: 'z0', name: 'z0', role: '海报灰白底' },
  { key: 'z1', name: 'z1', role: '冰晶白外壳' },
  { key: 'z2', name: 'z2', role: '磨砂冰蓝侧栏' },
  { key: 'z3', name: 'z3', role: '暖纸白卡片' },
  { key: 'z4', name: 'z4', role: '近白会话窗' },
] as const

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
    id: 'page-header-weighted',
    label: 'Page Header',
    description: 'GlassPageHeader · weighted / glass',
    props: [
      { key: 'weighted', label: 'weighted', type: 'boolean', defaultValue: true },
      { key: 'glass', label: 'glass', type: 'boolean', defaultValue: true },
    ],
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

const pageHeaderDemo = computed(() => {
  const v = docsProps.state.values['page-header-weighted'] ?? {}
  return {
    weighted: Boolean(v.weighted ?? true),
    glass: Boolean(v.glass ?? true),
  }
})
</script>

<template>
  <LabPageShell
    title="实验室·海报技法"
    desc="Design System Lab · 七色分工、海报三技法、小物件↔大容器与换算表；保留 PosterWash 整装舞台，只消费已导出 Glass* 与 --glass-* token。"
  >
    <!-- 0. Live Props Demo -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">0. Live Props Demo</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 variant / title / weighted / glass；画布控件即时反映。
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
          <span class="lab-control-label">Page Header · weighted / glass</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('page-header-weighted') }"
              role="button"
              tabindex="0"
              @click="selectDemo('page-header-weighted')"
              @keydown.enter="selectDemo('page-header-weighted')"
              @keydown.space.prevent="selectDemo('page-header-weighted')"
            >
              <GlassPageHeader
                title="页头条示意"
                subtitle="weighted / glass 即时反映"
                :weighted="pageHeaderDemo.weighted"
                :glass="pageHeaderDemo.glass"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主舞台：PosterWash 全幅底 + 单组件橱窗 + Living -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">1. 整装背景舞台</span>
        <span class="lab-section-meta">
          GlassPosterWash 固定 cover（含安全过冲）作根底 · 单组件橱窗 + Living 叠层 · 页内 min-height 保证 wash 可见
        </span>
      </div>
      <GlassPosterWash class="lab-poster-stage" fit="cover">
        <!-- 1a. 单组件橱窗：Surface / PageHeader(actions) / Panel 各独立一块 -->
        <div class="lab-poster-block">
          <div class="lab-cat-strip lab-cat-strip--stack">
            <span class="lab-cat-name">单组件橱窗 · 叠 PosterWash</span>
            <span class="lab-cat-impl">Surface · PageHeader(weighted=false) · Panel</span>
            <code class="lab-cat-html">.hero-air + .hero-petals 之上</code>
            <span class="lab-cat-rule">
              Do：玻璃微透吃 wash 色场 · 有 actions 仍关 weighted 用 default fan · Don’t：t-card 冒充 Tray / 双托盘
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
              subtitle="L2 · 带 actions · weighted=false · 坐 PosterWash 底"
              :weighted="false"
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
            <span class="lab-cat-impl">Surface → PageHeader(weighted=false) → Rail | Stage Flush</span>
            <code class="lab-cat-html">.surface → .bph → .rail | .bchat（gap=0）</code>
            <span class="lab-cat-rule">
              Do：整树唯一 L1 · Rail|Stage 贴缝 Flush · Living 页头对齐橱窗 default fan（可关 weighted）·
              Don’t：双托盘 / 中缝 gutter 冒充 Inset Reveal
            </span>
          </div>
          <GlassSurface class="lab-poster-living">
            <div class="lab-poster-living-stack">
              <GlassPageHeader
                title="设置与分区"
                subtitle="L2 · 坐 Host Tray 内 · weighted=false 对齐橱窗 fan"
                :weighted="false"
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

    <!-- 2. 七色分工 · 深度五档 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">2. 七色分工 · 深度五档</span>
        <span class="lab-section-meta">
          七色各守其位、同色不相连；z0 → z4 靠明度差、冷暖差与影差逐层叠拼悬浮。
        </span>
      </div>
      <GlassPanel variant="standalone" class="poster-palette-panel">
        <div class="poster-palette-content">
          <p class="poster-lead">
            <b>小物件满浓，大容器改写。</b>
            双蓝分工只落在行动与品牌锚；冰青芯只做亮端；AI 紫只做点缀。容器从海报灰白底逐层提亮到近白，
            不靠粉笔白实色大卡或硬描边。
          </p>
          <ul class="poster-swatch-list" aria-label="七色分工">
            <li v-for="swatch in paletteSwatches" :key="swatch.key" class="poster-swatch">
              <span
                class="poster-swatch-dot"
                :class="`poster-swatch-dot--${swatch.key}`"
                aria-hidden="true"
              />
              <span class="poster-swatch-copy">
                <b>{{ swatch.name }}</b>
                <span>{{ swatch.role }}</span>
              </span>
            </li>
          </ul>
          <div class="poster-depth-block">
            <span class="poster-depth-title">深度五档 · 容器逐层提亮</span>
            <ol class="poster-depth-list" aria-label="深度五档">
              <li v-for="depth in depthSwatches" :key="depth.key" class="poster-depth-item">
                <span
                  class="poster-depth-tile"
                  :class="`poster-depth-tile--${depth.key}`"
                  aria-hidden="true"
                />
                <span class="poster-depth-name">{{ depth.name }}</span>
                <span class="poster-depth-role">{{ depth.role }}</span>
              </li>
            </ol>
          </div>
        </div>
      </GlassPanel>
    </section>

    <!-- 3. 海报三技法 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">3. 海报三技法</span>
        <span class="lab-section-meta">
          过渡 · 微透 · 悬浮：先理解小物件的海报浓度，再换算到大容器。
        </span>
      </div>
      <div class="poster-tech-grid">
        <GlassPanel variant="standalone" title="过渡 · 花瓣" class="poster-tech-card">
          <div class="poster-tech-content">
            <div class="poster-tech-visual poster-tech-visual--transition" aria-hidden="true">
              <span class="poster-petal-orb" />
            </div>
            <p class="poster-tech-copy">
              饱和蓝只在芯部，薄边稀释到近透冰蓝；大面把同色相渐变拉长、降对比。
            </p>
          </div>
        </GlassPanel>

        <GlassPanel variant="standalone" title="微透 · 叠压染色" class="poster-tech-card">
          <div class="poster-tech-content">
            <div class="poster-tech-visual poster-tech-visual--see" aria-hidden="true">
              <span class="poster-vitreous-layer poster-vitreous-layer--a" />
              <span class="poster-vitreous-layer poster-vitreous-layer--b" />
              <span class="poster-vitreous-cover" />
            </div>
            <p class="poster-tech-copy">
              近白半透 + backdrop blur 罩住背后形体；交叠处自然加深，深度来自层叠。
            </p>
          </div>
        </GlassPanel>

        <GlassPanel variant="standalone" title="悬浮 · 层间漂浮" class="poster-tech-card">
          <div class="poster-tech-content">
            <div class="poster-tech-visual poster-tech-visual--float" aria-hidden="true">
              <span class="poster-float-disc poster-float-disc--far" />
              <span class="poster-float-disc poster-float-disc--mid" />
              <span class="poster-float-disc poster-float-disc--near" />
            </div>
            <p class="poster-tech-copy">
              多层半透漂在灰白底上；远层更虚更淡，极柔大范围影承担景深。
            </p>
          </div>
        </GlassPanel>
      </div>
      <div class="poster-rule-note">
        <b>换算铁律：</b>
        小物件可满浓——冰白→青→支付宝蓝→知乎蓝长程过渡，禁止白色高光核；
        大容器必须同色相拉长、降对比、改微透，大面蓝染控制在 <b>5–15%</b>，蓝从背后虚化场透出。
      </div>
    </section>

    <!-- 4. 小物件 ↔ 大容器 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">4. 小物件 ↔ 大容器</span>
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
                :weighted="false"
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

    <!-- 5. 换算表 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">5. 海报 → 大容器换算表</span>
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

/* ── 2. 七色分工 · 深度五档 ─────────────────────────────────────────── */
.poster-palette-panel {
  min-width: 0;
}

.poster-palette-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.poster-lead,
.poster-tech-copy,
.poster-object-copy,
.poster-big-copy {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: var(--glass-text-secondary);
}

.poster-lead b,
.poster-rule-note b {
  color: var(--glass-text-primary);
}

.poster-swatch-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.poster-swatch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 6px 11px 6px 7px;
  border-radius: 999px;
  background: var(--glass-wb-pill-quiet-bg);
  -webkit-backdrop-filter: var(--glass-wb-pill-quiet-blur);
  backdrop-filter: var(--glass-wb-pill-quiet-blur);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
}

.poster-swatch-dot {
  width: 15px;
  height: 15px;
  flex: none;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--glass-border-soft);
}

.poster-swatch-dot--alipay {
  background: var(--glass-chroma-alipay);
}

.poster-swatch-dot--zhihu {
  background: var(--glass-chroma-zhihu);
}

.poster-swatch-dot--cyan {
  background: var(--glass-chroma-cyan);
}

.poster-swatch-dot--poster {
  background: var(--glass-chroma-poster);
}

.poster-swatch-dot--ice {
  background: var(--glass-chroma-ice);
}

.poster-swatch-dot--frost {
  background: var(--glass-chroma-frost);
}

.poster-swatch-dot--paper {
  background: var(--glass-chroma-paper);
}

.poster-swatch-dot--ai {
  background: var(--glass-chroma-ai);
}

.poster-swatch-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  font-size: 11px;
  line-height: 1.35;
  color: var(--glass-text-secondary);
}

.poster-swatch-copy b {
  font-size: 12px;
  color: var(--glass-text-primary);
}

.poster-depth-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 14px;
  box-shadow: 0 -1px 0 var(--glass-border-soft);
}

.poster-depth-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.poster-depth-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.poster-depth-item {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.poster-depth-tile {
  height: 38px;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px var(--glass-border-soft);
}

.poster-depth-tile--z0 {
  background: var(--glass-chroma-poster);
}

.poster-depth-tile--z1 {
  background: var(--glass-chroma-ice);
}

.poster-depth-tile--z2 {
  background: var(--glass-chroma-frost);
}

.poster-depth-tile--z3 {
  background: var(--glass-chroma-paper);
}

.poster-depth-tile--z4 {
  background: var(--glass-wb-stage-fill);
}

.poster-depth-name {
  font-size: 11px;
  font-weight: 700;
  color: var(--glass-text-primary);
}

.poster-depth-role {
  overflow: hidden;
  font-size: 10.5px;
  line-height: 1.4;
  color: var(--glass-text-muted);
  text-overflow: ellipsis;
}

/* ── 3. 海报三技法 ─────────────────────────────────────────────────── */
.poster-tech-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.poster-tech-card {
  min-width: 0;
}

.poster-tech-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.poster-tech-visual {
  position: relative;
  min-height: 132px;
  overflow: hidden;
  border-radius: 14px;
  background: var(--glass-chroma-frost);
}

.poster-petal-orb {
  position: absolute;
  top: 14%;
  left: 14%;
  width: 116px;
  height: 96px;
  border-radius: 58% 42% 48% 52% / 42% 58% 42% 58%;
  background: linear-gradient(
    150deg,
    color-mix(in srgb, var(--glass-chroma-ice) 18%, transparent),
    color-mix(in srgb, var(--glass-chroma-cyan) 38%, transparent) 34%,
    color-mix(in srgb, var(--glass-chroma-alipay) 48%, transparent) 68%,
    color-mix(in srgb, var(--glass-chroma-zhihu) 18%, transparent)
  );
  box-shadow: var(--glass-wb-pill-quiet-shadow);
  filter: blur(0.4px);
  opacity: 0.9;
  transform: rotate(-24deg);
}

.poster-petal-orb::after {
  position: absolute;
  inset: 18% -10% -10% 28%;
  border-radius: inherit;
  background: linear-gradient(
    155deg,
    color-mix(in srgb, var(--glass-chroma-cyan) 22%, transparent),
    color-mix(in srgb, var(--glass-chroma-zhihu) 30%, transparent) 58%,
    transparent
  );
  content: '';
  filter: blur(1px);
  opacity: 0.78;
  transform: rotate(18deg);
}

.poster-tech-visual--see {
  -webkit-backdrop-filter: var(--glass-wb-surface-blur);
  backdrop-filter: var(--glass-wb-surface-blur);
}

.poster-vitreous-layer,
.poster-vitreous-cover {
  position: absolute;
  border-radius: 16px;
}

.poster-vitreous-layer--a {
  top: 18%;
  left: 11%;
  width: 58%;
  height: 64%;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--glass-chroma-cyan) 38%, transparent),
    color-mix(in srgb, var(--glass-chroma-alipay) 22%, transparent)
  );
  filter: blur(7px);
  opacity: 0.72;
  transform: rotate(-10deg);
}

.poster-vitreous-layer--b {
  right: 10%;
  bottom: 12%;
  width: 48%;
  height: 55%;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--glass-chroma-zhihu) 30%, transparent),
    color-mix(in srgb, var(--glass-chroma-ice) 46%, transparent)
  );
  filter: blur(9px);
  opacity: 0.66;
  transform: rotate(8deg);
}

.poster-vitreous-cover {
  inset: 24% 16%;
  background: var(--glass-wb-surface-fill);
  -webkit-backdrop-filter: var(--glass-wb-surface-blur);
  backdrop-filter: var(--glass-wb-surface-blur);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
}

.poster-tech-visual--float {
  background:
    radial-gradient(
      60% 55% at 30% 28%,
      color-mix(in srgb, var(--glass-chroma-ice) 42%, transparent),
      transparent
    ),
    var(--glass-chroma-frost);
}

.poster-float-disc {
  position: absolute;
  border-radius: 50%;
  background: var(--glass-chroma-paper);
  -webkit-backdrop-filter: var(--glass-wb-surface-blur);
  backdrop-filter: var(--glass-wb-surface-blur);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
}

.poster-float-disc--far {
  top: 12%;
  right: 10%;
  width: 54px;
  height: 54px;
  opacity: 0.42;
  filter: blur(2px);
}

.poster-float-disc--mid {
  top: 28%;
  left: 16%;
  width: 68px;
  height: 68px;
  opacity: 0.66;
  filter: blur(1px);
}

.poster-float-disc--near {
  right: 22%;
  bottom: 10%;
  width: 78px;
  height: 78px;
  background: var(--glass-chroma-ice);
}

.poster-rule-note {
  padding: 12px 15px;
  border-radius: 14px;
  background: var(--glass-chroma-frost);
  -webkit-backdrop-filter: var(--glass-wb-pill-quiet-blur);
  backdrop-filter: var(--glass-wb-pill-quiet-blur);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
  font-size: 12px;
  line-height: 1.65;
  color: var(--glass-text-secondary);
}

/* ── 4. 小物件 ↔ 大容器 ────────────────────────────────────────────── */
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

/* ── 5. 换算表 ─────────────────────────────────────────────────────── */
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
  .poster-tech-grid,
  .poster-pair-grid {
    grid-template-columns: 1fr;
  }

  .poster-depth-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

  .poster-depth-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .poster-object-row--split {
    flex-direction: column;
  }
}
</style>
