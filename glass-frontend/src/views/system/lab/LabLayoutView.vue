<script setup lang="ts">
/**
 * 实验室·布局 — Layout Catalog · 四层栈 L0–L3（workbench 单方案）
 * 布局宿主橱窗 · 四层 Living · Flush 贴缝。
 * 只消费 @/components/glass 已导出；禁双托盘；禁 t-card 冒充 Host Tray。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { ChartIcon, FileIcon, SettingIcon, TaskIcon } from 'tdesign-icons-vue-next'

import {
  GlassList,
  GlassListItem,
  GlassListItemMeta,
  GlassPageHeader,
  GlassPanel,
  GlassPosterWash,
  GlassRail,
  GlassStage,
  GlassSurface,
} from '@/components/glass'

import { useDocsProps } from '@/layouts/useDocsProps'
import type { DocsDemoBlock } from '@/layouts/useDocsProps'

import { useGlassScheme } from '@/scheme/useGlassScheme'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const { tt } = useGlassScheme()

const lastAction = ref('（尚未交互）')

const docsProps = useDocsProps()

const demoBlocks: DocsDemoBlock[] = [
  {
    id: 'focus-panel',
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
      { key: 'title', label: 'title', type: 'text', defaultValue: '焦点面示意' },
    ],
  },
  {
    id: 'page-header',
    label: 'Page Header',
    description: 'GlassPageHeader · weighted / glass',
    props: [
      { key: 'weighted', label: 'weighted', type: 'boolean', defaultValue: true },
      { key: 'glass', label: 'glass', type: 'boolean', defaultValue: true },
    ],
  },
  {
    id: 'surface-material',
    label: 'Surface',
    description: 'GlassSurface · material',
    props: [
      {
        key: 'material',
        label: 'material',
        type: 'select',
        defaultValue: 'raster',
        options: [
          { label: 'raster · A 合成光栅', value: 'raster' },
          { label: 'frost · 近白微透', value: 'frost' },
        ],
      },
    ],
  },
  {
    id: 'rail-tone',
    label: 'Rail',
    description: 'GlassRail · tone',
    props: [
      {
        key: 'tone',
        label: 'tone',
        type: 'select',
        defaultValue: 'ice',
        options: [
          { label: 'ice · 冰蓝（默认）', value: 'ice' },
          { label: 'lilac · 淡紫 wash', value: 'lilac' },
        ],
      },
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

const focusPanel = computed(() => {
  const v = docsProps.state.values['focus-panel'] ?? {}
  return {
    variant: (v.variant as 'inset' | 'standalone') ?? 'standalone',
    title: String(v.title ?? '焦点面示意'),
  }
})

const pageHeader = computed(() => {
  const v = docsProps.state.values['page-header'] ?? {}
  return {
    weighted: Boolean(v.weighted ?? true),
    glass: Boolean(v.glass ?? true),
  }
})

const surfaceMaterial = computed<'raster' | 'frost'>(() => {
  const v = docsProps.state.values['surface-material'] ?? {}
  return v.material === 'frost' ? 'frost' : 'raster'
})

const railTone = computed<'ice' | 'lilac'>(() => {
  const v = docsProps.state.values['rail-tone'] ?? {}
  return v.tone === 'lilac' ? 'lilac' : 'ice'
})

/** Rail 内嵌 Quiet List 对照：1 行 active，验证「字深色 / 选中近白」 */
const railListRows = [
  { id: 'inbox', title: '收件箱', desc: '2 条待确认', active: false },
  { id: 'today', title: '今日工作台', desc: '3 项进行中', active: true },
  { id: 'reports', title: '周报归档', desc: '最近 8 月第 3 周', active: false },
  { id: 'settings', title: '规则设置', desc: '助手与通知', active: false },
] as const

/** Material Stack 图例：对照 L0–L3 + 旧 z 档 */
const stackLegend = [
  { z: 'L0', name: 'Poster Wash', swatch: 'wash', selector: '--glass-layer-l0 / .poster-air' },
  { z: 'L1', name: 'Host Tray / Surface', swatch: 'surface', selector: 'GlassSurface · raster | frost' },
  { z: 'L2', name: 'Region / PageHeader', swatch: 'header', selector: 'GlassPageHeader · .bph' },
  { z: 'L3', name: 'Focus Panel', swatch: 'stage', selector: 'GlassPanel · .bchat' },
  { z: 'z2', name: 'Frost Rail（Flush）', swatch: 'rail', selector: 'GlassRail · .rail' },
] as const

/** 对照 mock：仅静态示意，不进入 glass/index.ts 可发布导出面 */
const gapCards = [
  {
    kind: 'ice',
    name: 'Ice Crystal Shell',
    impl: 'Lab mock · 不导出',
    selector: '.hero · .hero-air / .hero-petals',
    rule: 'Do：静态对照 air / petals · Don’t：加入 glass 导出面',
  },
  {
    kind: 'rail',
    name: 'Icon Cold Rail',
    impl: 'Lab mock · 不导出',
    selector: '.hero-ico',
    rule: 'Do：静态对照冷蓝竖条 · Don’t：当作当前 jpg 工作台结构',
  },
] as const
</script>

<template>
  <LabPageShell
    :title="tt('layout.page.title')"
    :desc="tt('layout.page.desc')"
    :live="lastAction"
  >
    <!-- 0. Live Props Demo -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('lab.section.liveProps') }}</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 variant / title / weighted / glass / material；画布控件即时反映。
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Surface · material</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('surface-material') }"
              role="button"
              tabindex="0"
              @click="selectDemo('surface-material')"
              @keydown.enter="selectDemo('surface-material')"
              @keydown.space.prevent="selectDemo('surface-material')"
            >
              <GlassSurface class="lab-material-demo" :material="surfaceMaterial">
                <div class="lab-material-demo__body">
                  <span>{{ surfaceMaterial }}</span>
                </div>
              </GlassSurface>
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Rail · tone</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('rail-tone') }"
              role="button"
              tabindex="0"
              @click="selectDemo('rail-tone')"
              @keydown.enter="selectDemo('rail-tone')"
              @keydown.space.prevent="selectDemo('rail-tone')"
            >
              <GlassSurface class="lab-rail-tone-swatch" material="frost">
                <GlassRail :tone="railTone" class="lab-rail-tone-swatch__rail">
                  <div class="lab-rail-tone-swatch__head">
                    <span class="lab-rail-tone-swatch__title">会话</span>
                    <span class="lab-rail-tone-swatch__tone">{{ railTone }}</span>
                  </div>
                  <GlassList size="small" class="lab-rail-tone-swatch__list">
                    <GlassListItem
                      v-for="row in railListRows.slice(0, 3)"
                      :key="`swatch-${row.id}`"
                      :class="{ 'is-active': row.active }"
                    >
                      <GlassListItemMeta :title="row.title" :description="row.desc" />
                    </GlassListItem>
                  </GlassList>
                </GlassRail>
                <GlassStage class="lab-rail-tone-swatch__stage">
                  <template #header>
                    <div class="lab-rail-tone-swatch__stage-title">主舞台</div>
                  </template>
                  <p class="lab-rail-tone-swatch__stage-copy">Flush · gap=0</p>
                </GlassStage>
              </GlassSurface>
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Focus Panel · variant / title</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('focus-panel') }"
              role="button"
              tabindex="0"
              @click="selectDemo('focus-panel')"
              @keydown.enter="selectDemo('focus-panel')"
              @keydown.space.prevent="selectDemo('focus-panel')"
            >
              <GlassPanel :variant="focusPanel.variant" :title="focusPanel.title">
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
              :class="{ 'is-selected': isDemoSelected('page-header') }"
              role="button"
              tabindex="0"
              @click="selectDemo('page-header')"
              @keydown.enter="selectDemo('page-header')"
              @keydown.space.prevent="selectDemo('page-header')"
            >
              <GlassPageHeader
                title="页头条示意"
                subtitle="weighted / glass 即时反映"
                :weighted="pageHeader.weighted"
                :glass="pageHeader.glass"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 1. 单组件橱窗 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('layout.section.showcase') }}</span>
        <span class="lab-section-meta">
          Surface / PageHeader / standalone Focus Panel 各独立一块 ·
          标注「橱窗孤立态」· 非整装工作台
        </span>
      </div>
    <div class="lab-showcase-grid">
        <div class="lab-showcase-card">
          <div class="lab-cat-strip lab-cat-strip--stack">
            <span class="lab-cat-name">Host Tray / Behind Surface</span>
            <span class="lab-cat-impl">L1 · GlassSurface</span>
            <code class="lab-cat-html">.surface · .big(+.air+.pane)</code>
            <span class="lab-cat-rule">
              Do：默认 raster 光栅，frost 显式切换 · Don’t：t-card 当托盘 / 双托盘 / raster 叠 air
            </span>
          </div>
          <div class="lab-frame lab-frame--showcase">
            <GlassSurface class="lab-surface lab-surface--solo">
              <div class="lab-solo-body">
                <span class="lab-stub-tag">橱窗孤立态 · L1 Surface</span>
              </div>
            </GlassSurface>
          </div>
        </div>

        <div class="lab-showcase-card">
          <div class="lab-cat-strip lab-cat-strip--stack">
            <span class="lab-cat-name">Region / PageHeader</span>
            <span class="lab-cat-impl">L2 · GlassPageHeader</span>
            <code class="lab-cat-html">.hero-top · .bph</code>
            <span class="lab-cat-rule">
              Do：坐 L1 内的分区条 · Don’t：包 t-card / 抬成第二 Host Tray
            </span>
          </div>
          <div class="lab-frame lab-frame--showcase lab-frame--l0">
            <GlassPageHeader
              title="页头条示意"
              subtitle="橱窗孤立态 · L2 · 坐在 L0 海报底上"
            />
          </div>
        </div>

        <div class="lab-showcase-card">
          <div class="lab-cat-strip lab-cat-strip--stack">
            <span class="lab-cat-name">Focus Panel</span>
            <span class="lab-cat-impl">L3 · GlassPanel · standalone</span>
            <code class="lab-cat-html">.bsurf / soft card</code>
            <span class="lab-cat-rule">
              Do：standalone 橱窗轻影 · Don’t：Panel 内再放 Surface
            </span>
          </div>
          <div class="lab-frame lab-frame--showcase lab-frame--l0">
            <GlassPanel variant="standalone" title="焦点面示意">
              <p class="lab-panel-copy">橱窗孤立态 · variant=standalone · 轻影弱于 L1。</p>
            </GlassPanel>
          </div>
        </div>

      </div>
    </section>

    <!-- 2. 四层栈 Living -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('layout.section.stack') }}</span>
        <span class="lab-section-meta">
          L0 海报底 → L1 Surface → L2 PageHeader → ≥2× L3 Panel（gap&gt;0，非 Flush）· 禁双托盘
        </span>
      </div>
      <div class="lab-cat-strip">
        <span class="lab-cat-name">L0 → L1 → L2 → L3*</span>
        <span class="lab-cat-impl">Page · Surface · PageHeader · Panel×n</span>
        <code class="lab-cat-html">--glass-layer-l0…l3 · :root workbench</code>
        <span class="lab-cat-rule">
          Do：唯一 L1；同层 Panel 用明度差 + 小 gap · Don’t：双托盘 / 用中缝 gutter 冒充 Inset Reveal
        </span>
      </div>
      <div class="lab-living-l0" aria-label="L0 Poster Wash">
        <span class="lab-layer-badge" title="简化 page-level L0 · 完整整装底见「实验室·整装背景」"
          >L0 Poster Wash · 简化</span
        >
        <GlassSurface class="lab-living-surface" :material="surfaceMaterial">
          <div class="lab-living-stack">
            <GlassPageHeader
              title="设置与分区"
              subtitle="L2 · 坐 Host Tray 内 · weighted=false 对齐橱窗 fan"
              :weighted="false"
            >
              <template #actions>
                <span class="lab-living-action">对照方案</span>
              </template>
            </GlassPageHeader>
            <div class="lab-living-panels">
              <GlassPanel title="Panel A · 表单区">
                <p class="lab-panel-copy">
                  L3 inset · Fan Tip 过渡 + frosted 微透 + 悬浮影；仍无外轮廓 hairline。露边只来自 L1 四周 pad，不是 Panel 间隙。
                </p>
              </GlassPanel>
              <GlassPanel title="Panel B · 列表区">
                <p class="lab-panel-copy">
                  同层并列 gap&gt;0 · 非 Rail|Stage Flush；Fan Tip 与 frosted 同源。禁止再套 Surface。
                </p>
              </GlassPanel>
              <GlassPanel title="Panel C · 说明">
                <p class="lab-panel-copy">Fan Tip 过渡 + frosted 微透 + 悬浮影（lift 1px）· 多容器可纵排 / 栅格，仍单托盘。</p>
              </GlassPanel>
            </div>
          </div>
        </GlassSurface>
      </div>
      <div class="lab-control-note">
        验收：托盘=GlassSurface · L1 / Lab frame=20 · Region=16 · Flush 外角=8（PageHeader / Panel 同档 Region）· Surface
        <code>__body</code> 外轮廓=flush(L1-pad)=16px；贴缝无 gutter。能指出玻璃底板在 Surface 四周露边；
        Panel 间隙不是露边；整树只有一个 L1；须能指出
        PageHeader 读成定稿 A 半透扇形 + lift 0 + 轻软影（无白 rim）；Panel 读成 Fan Tip 过渡 + frosted
        微透 + 悬浮影（lift 1px），维持 L3 自身轻软档且无外轮廓 hairline。L0 为简化 page-level
        小样；完整整装底见「实验室·整装背景」。
      </div>
    </section>

    <!-- 3. Material Stack 图例 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('layout.section.legend') }}</span>
        <span class="lab-section-meta">
          层语义 + Flush Rail 对照 · 视觉权威 glass token · 此处为简化 page-level L0；完整整装底见「Poster 技法」
        </span>
      </div>
      <div class="lab-stack-legend">
        <div v-for="item in stackLegend" :key="item.z" class="lab-stack-chip">
          <span class="lab-stack-swatch" :class="`lab-stack-swatch--${item.swatch}`" aria-hidden="true" />
          <span class="lab-stack-z">{{ item.z }}</span>
          <span class="lab-stack-name">{{ item.name }}</span>
          <code class="lab-stack-html">{{ item.selector }}</code>
        </div>
      </div>
    </section>

    <!-- 4. Host Tray（既有） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('layout.section.hostTray') }}</span>
        <span class="lab-section-meta">既有 · 单独托盘 + stub Rail|Stage · 标注 Inset Reveal 露边</span>
      </div>
      <div class="lab-cat-strip">
        <span class="lab-cat-name">Host Tray / Behind Surface</span>
        <span class="lab-cat-impl">GlassSurface</span>
        <code class="lab-cat-html">.surface · .big(+.air+.pane) · .t1 .big</code>
        <span class="lab-cat-rule">
          Do：默认 raster 光栅；frost 才显示 surface-air bloom · Don't：用 t-card 当托盘 /
          Surface 外再套 Host Tray / raster 叠 air
        </span>
      </div>
      <div class="lab-frame lab-frame--surface">
        <GlassSurface class="lab-surface">
          <div class="lab-stub lab-stub--rail">
            <span class="lab-stub-tag">Rail 区（Frost · stub）</span>
          </div>
          <div class="lab-stub lab-stub--stage">
            <span class="lab-stub-tag">Stage 区（L3 Flush · stub）</span>
          </div>
        </GlassSurface>
      </div>
      <div class="lab-control-note">
        托盘=GlassSurface · 阶梯 L1 / Lab frame=16 · Region=16 · Flush 外角=8。
        Floating Plate：抬升影在 Surface <code>__body</code> 整板 · Stage 自身不再叠重影 · 露边是四周
        inset pad，不是 Rail–Stage 中缝。
      </div>
    </section>

    <!-- 5. Frost Rail | Near-White Stage -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('layout.section.flush') }}</span>
        <span class="lab-section-meta">既有 · gap=0 贴缝对照 · 明度差分界 · 禁中间 gutter 当露边</span>
      </div>
      <div class="lab-cat-strip">
        <span class="lab-cat-name">Frost Rail | Near-White Stage</span>
        <span class="lab-cat-impl">GlassRail + GlassStage</span>
        <code class="lab-cat-html">.rail | .chat · .bchat（.surface 内 .work gap=0）</code>
        <span class="lab-cat-rule">
          Do：Flush Stitch（gap=0）由 Surface <code>__body</code> 保证 · Nested Chrome 外轮廓由 Surface
          overflow 裁切 · Don't：把 Rail–Stage 中间 gutter 当 Inset Reveal 露边 / Stage 抬成第二浮卡
        </span>
      </div>
      <div class="lab-frame lab-frame--surface">
        <GlassSurface class="lab-surface">
          <GlassRail class="lab-rail lab-rail--mini">
            <div class="lab-stub-tag">Frost Rail · Flush L3</div>
          </GlassRail>
          <GlassStage>
            <template #header>
              <div class="lab-stage-title">Near-White Stage · Flush L3</div>
            </template>
            <div class="lab-flush-note">
              几何：托盘=GlassSurface · L1 / Lab frame=16 · Region=16 · Flush 外角=8（贴缝边 0）。
              Surface <code>__body</code> 外轮廓=flush(L1-pad)=16px。
              Flush Stitch：Rail | Stage 贴缝 gap=0、无 gutter，靠磨砂冰蓝 vs 近白的明度差分界。
              Rail 左角 / Stage 右角吃 flush-radius；backdrop 不得漏方角。露边只来自 Host Tray
              四周 Inset Reveal；禁止在中缝加 gutter 伪造露边。
            </div>
          </GlassStage>
        </GlassSurface>
      </div>

      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('layout.section.railTone') }}</span>
        <span class="lab-section-meta">
          Live Props：Rail · tone（ice 默认 / lilac）· 轨内嵌 GlassList 4 行，1 行 is-active
        </span>
      </div>
      <div class="lab-cat-strip">
        <span class="lab-cat-name">Lilac Rail | Quiet List</span>
        <span class="lab-cat-impl">GlassRail · tone=lilac + GlassList</span>
        <code class="lab-cat-html">--glass-wb-rail-wash-lilac · .glass-list-item.is-active</code>
        <span class="lab-cat-rule">
          Do：紫只做 wash；字深色；active 近白微透（Quiet 圆角，无 tip）·
          Don't：满浓紫板 / 选中反白 / 左侧紫 tip
        </span>
      </div>
      <div
        class="docs-demo-block lab-rail-tone-demo"
        :class="{ 'is-selected': isDemoSelected('rail-tone') }"
        role="button"
        tabindex="0"
        @click="selectDemo('rail-tone')"
        @keydown.enter="selectDemo('rail-tone')"
        @keydown.space.prevent="selectDemo('rail-tone')"
      >
        <GlassSurface class="lab-surface lab-rail-tone-surface">
          <GlassRail :tone="railTone" class="lab-rail lab-rail--tone">
            <div class="lab-rail-tone-head">
              <span class="lab-rail-tone-name">Quiet Rail</span>
              <span class="lab-rail-tone-pill">{{ railTone }}</span>
            </div>
            <GlassList size="small" class="lab-rail-quiet-list">
              <GlassListItem
                v-for="row in railListRows"
                :key="row.id"
                :class="{ 'is-active': row.active }"
                :aria-current="row.active ? 'page' : undefined"
              >
                <GlassListItemMeta :title="row.title" :description="row.desc" />
              </GlassListItem>
            </GlassList>
          </GlassRail>
          <GlassStage>
            <template #header>
              <div class="lab-stage-title">Near-White Stage · {{ railTone }}</div>
            </template>
            <div class="lab-flush-note">
              紫只做 wash；字深色；选中近白。Ice 默认仍走原
              <code>--glass-wb-rail-wash</code> / <code>--glass-wb-rail-blur</code>；
              lilac 只换低 alpha 紫 wash 与轨内列表 hover，active 用近白微透（无 tip），
              不铺满浓紫板、不反白。
            </div>
          </GlassStage>
        </GlassSurface>
      </div>
      <div class="lab-control-note">
        验收：紫只做 wash；字深色；选中近白。ice 默认未回归；lilac 轨内 4 行 Quiet List
        可读，1 行 active 近白微透（Quiet 圆角，无 tip）；悬停为淡紫洗。
        点选本演示块后，右栏 Rail · tone 可切 ice / lilac。
      </div>
    </section>

    <!-- 6. 对照 mock（非导出面） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('layout.section.mock') }}</span>
        <span class="lab-section-meta">
          Ice Crystal Shell / Icon Cold Rail 仅作 Lab 静态示意 ·
          不加入 glass/index.ts（Lab-only 静态对照）
        </span>
      </div>
      <div class="lab-gap-grid">
        <div v-for="gap in gapCards" :key="gap.name" class="lab-gap-card">
          <div class="lab-cat-strip lab-cat-strip--stack">
            <span class="lab-cat-name">{{ gap.name }}</span>
            <span class="lab-cat-impl lab-cat-impl--gap">{{ gap.impl }}</span>
            <code class="lab-cat-html">{{ gap.selector }}</code>
            <span class="lab-cat-rule">{{ gap.rule }}</span>
          </div>
          <div v-if="gap.kind === 'ice'" class="lab-gap-mock lab-gap-mock--ice">
            <GlassPosterWash />
            <span class="lab-gap-mock__tag" aria-hidden="true">air · petals</span>
          </div>
          <div v-else class="lab-gap-mock lab-gap-mock--rail" aria-hidden="true">
            <div class="lab-cold-rail">
              <span class="lab-cold-rail__item is-on"><ChartIcon /></span>
              <span class="lab-cold-rail__item"><TaskIcon /></span>
              <span class="lab-cold-rail__item"><FileIcon /></span>
              <span class="lab-cold-rail__item lab-cold-rail__item--config"><SettingIcon /></span>
            </div>
            <span class="lab-gap-mock__tag">.hero-ico</span>
          </div>
        </div>
      </div>
      <div class="lab-control-note">
        Card / Bubble / Progress / Comment 等数据展示橱窗已归入
        <RouterLink to="/data">Data</RouterLink>；
        Composer 宿主对照见 <RouterLink to="/inputs">Inputs</RouterLink>；
        Table tray / inset 对照见 <RouterLink to="/data">Data</RouterLink>；
        Widgets Stage（<code>.widgets</code>）仍仅列名，不在本轮导出面。
      </div>
    </section>
  </LabPageShell>
</template>

<style scoped>
/* Catalog Living 对照卡四元组：英文语义名 · Glass*|Lab mock · html 选择器 · Do/Don't */
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

.lab-cat-impl--gap {
  color: var(--glass-text-muted);
  font-weight: 500;
}

.lab-cat-html {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--glass-text-muted);
  word-break: break-all;
}

.lab-cat-rule {
  grid-column: 1 / -1;
  color: var(--glass-text-secondary);
}

.lab-cat-strip--stack .lab-cat-rule {
  grid-column: auto;
}

/* 单组件橱窗 */
.lab-showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 1100px) {
  .lab-showcase-grid {
    grid-template-columns: 1fr;
  }
}

.lab-showcase-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.lab-frame--showcase {
  min-height: 160px;
  flex-direction: column;
}

.lab-frame--l0 {
  background:
    var(--glass-layer-l0-air),
    var(--glass-layer-l0-wash);
}

.lab-surface--solo {
  min-height: 140px;
}

.lab-material-demo {
  width: 260px;
  min-height: 92px;
}

.lab-material-demo__body {
  flex: 1;
  display: grid;
  place-items: center;
  min-height: 60px;
  background: var(--glass-wb-stage-fill);
  color: var(--glass-text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Rail tone · Live Props mini：约 1:3 轨:舞台，字号再缩一档 */
.lab-rail-tone-swatch {
  width: 320px;
  height: 148px;
  min-height: 148px;
}

.lab-rail-tone-swatch__rail {
  width: 88px; /* ≈ 260/940 工作区比例 */
  flex: none;
  padding: 8px 6px;
  gap: 4px;
  min-height: 0;
}

.lab-rail-tone-swatch__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
  padding: 0 2px 2px;
  flex: none;
}

.lab-rail-tone-swatch__title {
  font-size: 9px;
  font-weight: 650;
  color: var(--glass-text-primary);
}

.lab-rail-tone-swatch__tone {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--glass-text-muted);
}

.lab-rail-tone-swatch__list {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.lab-rail-tone-swatch__list :deep(.glass-list-item-meta .t-list-item__meta-description) {
  display: none;
}

.lab-rail-tone-swatch__list :deep(.glass-list-item-meta .t-list-item__meta-title) {
  font-size: 9px;
  line-height: 1.25;
}

.lab-rail-tone-swatch__list :deep(.glass-list-item.t-list-item) {
  padding: 4px 6px;
}

.lab-rail-tone-swatch__stage {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.lab-rail-tone-swatch__stage-title {
  font-size: 10px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.lab-rail-tone-swatch__stage-copy {
  margin: 0;
  font-size: 9px;
  color: var(--glass-text-secondary);
}

/* Rail tone · lilac + Quiet List 对照 */
.lab-rail-tone-demo {
  width: 100%;
  border-radius: var(--glass-wb-surface-radius);
}

.lab-rail-tone-surface {
  flex: 1;
  min-height: 280px;
}

.lab-rail--tone {
  width: 238px;
  padding: 14px 12px;
  gap: 8px;
}

.lab-rail-tone-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 4px 4px;
}

.lab-rail-tone-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.lab-rail-tone-pill {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--glass-wb-pill-quiet-bg);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
  color: var(--glass-text-secondary);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.lab-rail-quiet-list {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.lab-solo-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  background: var(--glass-wb-stage-fill);
  -webkit-backdrop-filter: var(--glass-wb-stage-blur);
  backdrop-filter: var(--glass-wb-stage-blur);
}

/* 四层 Living */
.lab-living-l0 {
  position: relative;
  padding: 20px 18px 18px;
  border-radius: var(--glass-wb-card-radius);
  background:
    var(--glass-layer-l0-air),
    var(--glass-layer-l0-wash);
  border: 1px solid var(--glass-border-soft);
  min-height: 320px;
}

.lab-layer-badge {
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--glass-text-muted);
}

.lab-living-surface {
  min-height: 280px;
  margin-top: 8px;
}

/* Surface __body 默认横向 Flush；Living 用单列子树纵排多容器 */
.lab-living-stack {
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

.lab-living-panels {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  min-height: 140px;
}

@media (max-width: 960px) {
  .lab-living-panels {
    grid-template-columns: 1fr;
  }
}

.lab-living-action {
  font-size: 11px;
  font-weight: 600;
  color: var(--glass-chroma-zhihu);
}

.lab-panel-copy {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--glass-text-secondary);
}

/* Material Stack 图例 */
.lab-stack-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.lab-stack-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--glass-wb-card-radius);
  border: 1px solid var(--glass-border-soft);
  background: var(--glass-panel-bg);
  min-width: 200px;
}

.lab-stack-swatch {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--glass-border-soft);
  flex-shrink: 0;
}

.lab-stack-swatch--wash {
  background: var(--glass-layer-l0-fill);
}

.lab-stack-swatch--header {
  background: var(--glass-layer-l2-fill);
  -webkit-backdrop-filter: var(--glass-layer-l2-blur);
  backdrop-filter: var(--glass-layer-l2-blur);
}

.lab-stack-swatch--rail {
  background: var(--glass-wb-rail-wash);
  -webkit-backdrop-filter: var(--glass-wb-rail-blur);
  backdrop-filter: var(--glass-wb-rail-blur);
}

.lab-stack-swatch--surface {
  background: var(--glass-layer-l1-fill);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -webkit-backdrop-filter: var(--glass-layer-l1-blur);
  backdrop-filter: var(--glass-layer-l1-blur);
}

.lab-stack-swatch--stage {
  background: var(--glass-layer-l3-fill);
  -webkit-backdrop-filter: var(--glass-layer-l3-blur);
  backdrop-filter: var(--glass-layer-l3-blur);
}

.lab-stack-z {
  font-size: 11px;
  font-weight: 600;
  color: var(--glass-text-muted);
  min-width: 20px;
}

.lab-stack-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.lab-stack-html {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  color: var(--glass-text-muted);
}

/* Flush 宿主 */
.lab-flush-note {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--glass-text-secondary);
  line-height: 1.65;
  padding: 8px 4px 12px;
}

/* 对照 mock（非导出面） */
.lab-gap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.lab-gap-card {
  display: flex;
  flex-direction: column;
  border: 1px dashed var(--glass-border-soft);
  border-radius: var(--glass-wb-card-radius);
  background: var(--glass-page-bg-accent);
  padding: 0;
  overflow: hidden;
}

.lab-gap-card .lab-cat-strip {
  border: none;
  border-radius: 0;
  background: transparent;
}

.lab-gap-mock {
  position: relative;
  height: 112px;
  border-top: 1px solid var(--glass-border-soft);
  overflow: hidden;
}

.lab-gap-mock--ice {
  background: var(--glass-poster-wash);
}

.lab-gap-mock--rail {
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    var(--glass-layer-l0-air),
    var(--glass-layer-l0-wash);
}

.lab-cold-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 52px;
  height: 92px;
  padding: 8px 0;
  border-radius: 14px;
  background: var(--glass-wb-rail-wash);
  -webkit-backdrop-filter: var(--glass-wb-rail-blur);
  backdrop-filter: var(--glass-wb-rail-blur);
  box-shadow: var(--glass-wb-table-hairline);
}

.lab-cold-rail__item {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  font-size: 15px;
  color: var(--glass-wb-icon-color);
  background: var(--glass-wb-pill-quiet-bg);
}

.lab-cold-rail__item.is-on {
  color: var(--glass-wb-white);
  background: var(--glass-wb-btn-blue);
  box-shadow: var(--glass-wb-btn-blue-shadow);
}

.lab-cold-rail__item--config {
  margin-top: auto;
}

.lab-gap-mock__tag {
  position: absolute;
  right: 10px;
  bottom: 8px;
  z-index: 2;
  padding: 3px 7px;
  border-radius: 999px;
  font-size: 9.5px;
  line-height: 1.3;
  color: var(--glass-text-secondary);
  background: var(--glass-wb-pill-quiet-bg);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
}
</style>
