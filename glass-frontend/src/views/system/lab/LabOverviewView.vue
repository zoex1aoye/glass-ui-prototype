<script setup lang="ts">
/**
 * 组件实验室总览 · Lab Hub
 * 宪章 + 七色 / 深度 + 海报主技法（过渡 / 微透 / 悬浮）+ Living Demo hub。
 * 可见文案走 scheme messages（overview.*）；中文槽位与迁移前一致。
 */
import { useRouter } from 'vue-router'

import { GlassPanel } from '@/components/glass'
import { useGlassScheme } from '@/scheme/useGlassScheme'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const router = useRouter()
const { tt } = useGlassScheme()

const paletteSwatchKeys = [
  'alipay',
  'zhihu',
  'cyan',
  'poster',
  'ice',
  'frost',
  'paper',
  'ai',
] as const

const depthSwatchKeys = ['z0', 'z1', 'z2', 'z3', 'z4'] as const

const hubCards = [
  {
    path: '/',
    titleKey: 'overview.hub.overview.title',
    descKey: 'overview.hub.overview.desc',
  },
  {
    path: '/dashboard',
    titleKey: 'overview.hub.dashboard.title',
    descKey: 'overview.hub.dashboard.desc',
  },
  {
    path: '/layout',
    titleKey: 'overview.hub.layout.title',
    descKey: 'overview.hub.layout.desc',
  },
  {
    path: '/poster',
    titleKey: 'overview.hub.poster.title',
    descKey: 'overview.hub.poster.desc',
  },
  {
    path: '/actions',
    titleKey: 'overview.hub.actions.title',
    descKey: 'overview.hub.actions.desc',
  },
  {
    path: '/inputs',
    titleKey: 'overview.hub.inputs.title',
    descKey: 'overview.hub.inputs.desc',
  },
  {
    path: '/forms',
    titleKey: 'overview.hub.forms.title',
    descKey: 'overview.hub.forms.desc',
  },
  {
    path: '/overlay',
    titleKey: 'overview.hub.overlay.title',
    descKey: 'overview.hub.overlay.desc',
  },
  {
    path: '/feedback',
    titleKey: 'overview.hub.feedback.title',
    descKey: 'overview.hub.feedback.desc',
  },
  {
    path: '/data',
    titleKey: 'overview.hub.data.title',
    descKey: 'overview.hub.data.desc',
  },
  {
    path: '/navigation',
    titleKey: 'overview.hub.navigation.title',
    descKey: 'overview.hub.navigation.desc',
  },
] as const

function go(path: string) {
  void router.push(path)
}
</script>

<template>
  <LabPageShell :title="tt('overview.page.title')" :desc="tt('overview.page.desc')">
    <!-- 宪章三行摘要 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('overview.charter.name') }}</span>
        <span class="lab-section-meta">{{ tt('overview.charter.meta') }}</span>
      </div>
      <div class="lab-charter">
        <div class="lab-charter-row">
          <span class="lab-charter-term">Material</span>
          <span>{{ tt('overview.charter.material') }}</span>
        </div>
        <div class="lab-charter-row">
          <span class="lab-charter-term">Density</span>
          <span>{{ tt('overview.charter.density') }}</span>
        </div>
        <div class="lab-charter-row">
          <span class="lab-charter-term">Tone</span>
          <span>{{ tt('overview.charter.tone') }}</span>
        </div>
      </div>
    </section>

    <!-- 七色分工 · 深度五档（自 Poster §2 迁入） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('overview.hues.name') }}</span>
        <span class="lab-section-meta">{{ tt('overview.hues.meta') }}</span>
      </div>
      <GlassPanel variant="standalone" class="lab-palette-panel">
        <div class="lab-palette-content">
          <p class="lab-palette-lead">
            <b>{{ tt('overview.hues.lead.bold') }}</b>
            {{ tt('overview.hues.lead.copy') }}
          </p>
          <ul class="lab-swatch-list" :aria-label="tt('overview.hues.swatchAria')">
            <li v-for="key in paletteSwatchKeys" :key="key" class="lab-swatch">
              <span
                class="lab-swatch-dot"
                :class="`lab-swatch-dot--${key}`"
                aria-hidden="true"
              />
              <span class="lab-swatch-copy">
                <b>{{ tt(`overview.hues.swatch.${key}.name`) }}</b>
                <span>{{ tt(`overview.hues.swatch.${key}.role`) }}</span>
              </span>
            </li>
          </ul>
          <div class="lab-depth-block">
            <span class="lab-depth-title">{{ tt('overview.hues.depthTitle') }}</span>
            <ol class="lab-depth-list" :aria-label="tt('overview.hues.depthAria')">
              <li v-for="key in depthSwatchKeys" :key="key" class="lab-depth-item">
                <span
                  class="lab-depth-tile"
                  :class="`lab-depth-tile--${key}`"
                  aria-hidden="true"
                />
                <span class="lab-depth-name">{{ tt(`overview.hues.depth.${key}.name`) }}</span>
                <span class="lab-depth-role">{{ tt(`overview.hues.depth.${key}.role`) }}</span>
              </li>
            </ol>
          </div>
        </div>
      </GlassPanel>
    </section>

    <!-- 海报主技法 · 过渡 / 微透 / 悬浮（合并橱窗） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('overview.tech.name') }}</span>
        <span class="lab-section-meta">{{ tt('overview.tech.meta') }}</span>
      </div>
      <div class="lab-tech-grid lab-tech-grid--trio">
        <GlassPanel
          variant="standalone"
          :title="tt('overview.transition.title')"
          class="lab-tech-card"
        >
          <div class="lab-tech-content">
            <div class="lab-tech-visual lab-tech-visual--transition" aria-hidden="true">
              <span class="lab-petal-orb" />
            </div>
            <p class="lab-tech-copy">{{ tt('overview.transition.copy') }}</p>
          </div>
        </GlassPanel>

        <GlassPanel
          variant="standalone"
          :title="tt('overview.tech.vitreous.title')"
          class="lab-tech-card"
        >
          <div class="lab-tech-content">
            <div class="lab-tech-visual lab-tech-visual--see" aria-hidden="true">
              <span class="lab-tech-vitreous-layer lab-tech-vitreous-layer--a" />
              <span class="lab-tech-vitreous-layer lab-tech-vitreous-layer--b" />
              <span class="lab-tech-vitreous-cover" />
            </div>
            <p class="lab-tech-copy">{{ tt('overview.tech.vitreous.copy') }}</p>
          </div>
        </GlassPanel>

        <GlassPanel
          variant="standalone"
          :title="tt('overview.tech.float.title')"
          class="lab-tech-card"
        >
          <div class="lab-tech-content">
            <div class="lab-tech-visual lab-tech-visual--float" aria-hidden="true">
              <span class="lab-tech-float-disc lab-tech-float-disc--far" />
              <span class="lab-tech-float-disc lab-tech-float-disc--mid" />
              <span class="lab-tech-float-disc lab-tech-float-disc--near" />
            </div>
            <p class="lab-tech-copy">{{ tt('overview.tech.float.copy') }}</p>
          </div>
        </GlassPanel>
      </div>
      <div class="lab-rule-note">
        <b>{{ tt('overview.transition.rule.lead') }}</b>
        {{ tt('overview.transition.rule.copy') }}<b>{{
          tt('overview.transition.rule.emphasis')
        }}</b>{{ tt('overview.transition.rule.tail') }}
      </div>
    </section>

    <!-- Living Demo 卡片链 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('overview.hub.name') }}</span>
        <span class="lab-section-meta">{{ tt('overview.hub.meta') }}</span>
      </div>
      <div class="lab-hub-grid">
        <button
          v-for="card in hubCards"
          :key="card.path"
          type="button"
          class="lab-hub-card"
          @click="go(card.path)"
          @keydown.enter="go(card.path)"
        >
          <span class="lab-hub-card-title">{{ tt(card.titleKey) }}</span>
          <span class="lab-hub-card-desc">{{ tt(card.descKey) }}</span>
        </button>
      </div>
    </section>

    <!-- Live Props 试用指引 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('overview.live.name') }}</span>
        <span class="lab-section-meta">{{ tt('overview.live.meta') }}</span>
      </div>
      <p class="lab-control-note">{{ tt('overview.live.note') }}</p>
    </section>
  </LabPageShell>
</template>
