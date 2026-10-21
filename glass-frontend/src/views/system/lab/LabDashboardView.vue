<script setup lang="ts">
/**
 * 实验室 · Dashboard 试页
 * 组件健康度演示：单一 GlassSurface 内组合 PageHeader / Rail | Stage；
 * Stage 承载 KPI / Tabs + Table / Alert + Progress / Soft Cite / Steps。
 * L0 PosterWash 根底：Dashboard 坐在色场上，Surface 保留四周 Inset Reveal。
 * 仅消费已导出 Glass* 与既有 token。
 */
import { computed, onBeforeUnmount, ref } from 'vue'
import {
  CheckCircleIcon,
  DownloadIcon,
  PlayCircleIcon,
  RefreshIcon,
} from 'tdesign-icons-vue-next'
import type {
  MenuValue,
  PrimaryTableCol,
  TabValue,
  TableRowData,
} from 'tdesign-vue-next'

import {
  GlassAlert,
  GlassAvatar,
  GlassAvatarGroup,
  GlassBadge,
  GlassButton,
  GlassCard,
  GlassMenu,
  GlassMenuItem,
  GlassPageHeader,
  GlassPanel,
  GlassPosterWash,
  GlassProgress,
  GlassRail,
  GlassSearchCapsule,
  GlassStage,
  GlassStatistic,
  GlassStepItem,
  GlassSteps,
  GlassSurface,
  GlassTable,
  GlassTabs,
} from '@/components/glass'
import { useGlassScheme } from '@/scheme/useGlassScheme'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

type DashboardTab = 'inventory' | 'coverage' | 'deviations'
type RailTone = 'ice' | 'lilac'

type DashboardRow = TableRowData & {
  id: string
  item: string
  detail: string
  statusKey: string
  owner: string
  updated: string
}

const { tt } = useGlassScheme()

const railSections = [
  {
    id: 'dashboard-kpi-section',
    titleKey: 'dashboard.rail.kpi',
    descKey: 'dashboard.rail.kpi.desc',
    liveKey: 'dashboard.live.section.kpi',
  },
  {
    id: 'dashboard-audit-section',
    titleKey: 'dashboard.rail.audit',
    descKey: 'dashboard.rail.audit.desc',
    liveKey: 'dashboard.live.section.audit',
  },
  {
    id: 'dashboard-quality-section',
    titleKey: 'dashboard.rail.quality',
    descKey: 'dashboard.rail.quality.desc',
    liveKey: 'dashboard.live.section.quality',
  },
  {
    id: 'dashboard-delivery-section',
    titleKey: 'dashboard.rail.delivery',
    descKey: 'dashboard.rail.delivery.desc',
    liveKey: 'dashboard.live.section.delivery',
  },
] as const

type DashboardSectionId = (typeof railSections)[number]['id']

const query = ref('')
const activeTab = ref<DashboardTab>('inventory')
const auditLoading = ref(false)
const lastActionKey = ref('dashboard.live.ready')
const activeSection = ref<DashboardSectionId>('dashboard-kpi-section')
const railTone = ref<RailTone>('ice')
let auditTimer: ReturnType<typeof setTimeout> | undefined

const rowsByTab: Record<DashboardTab, DashboardRow[]> = {
  inventory: [
    {
      id: 'surface',
      item: 'GlassSurface',
      detail: 'L1 Host Tray · Inset Reveal',
      statusKey: 'dashboard.status.stable',
      owner: 'Layout',
      updated: '10:24',
    },
    {
      id: 'panel',
      item: 'GlassPanel',
      detail: 'L3 Focus Panel · No double tray',
      statusKey: 'dashboard.status.stable',
      owner: 'Layout',
      updated: '10:18',
    },
    {
      id: 'statistic',
      item: 'GlassStatistic',
      detail: 'Quiet number · Tone / trend',
      statusKey: 'dashboard.status.stable',
      owner: 'Data',
      updated: '09:52',
    },
    {
      id: 'table',
      item: 'GlassTable',
      detail: 'Inset Quiet Grid · Dense rows',
      statusKey: 'dashboard.status.watch',
      owner: 'Data',
      updated: '09:41',
    },
    {
      id: 'tabs',
      item: 'GlassTabs',
      detail: 'Capsule track · Keyboard ready',
      statusKey: 'dashboard.status.stable',
      owner: 'Navigation',
      updated: '09:12',
    },
  ],
  coverage: [
    {
      id: 'tokens',
      item: 'Tokens',
      detail: 'Palette / surface / interaction',
      statusKey: 'dashboard.status.stable',
      owner: 'Theme',
      updated: '10:30',
    },
    {
      id: 'interaction',
      item: 'Interaction',
      detail: 'Hover / active / focus / disabled',
      statusKey: 'dashboard.status.watch',
      owner: 'Controls',
      updated: '10:12',
    },
    {
      id: 'a11y',
      item: 'A11y',
      detail: 'Names / roles / contrast / motion',
      statusKey: 'dashboard.status.watch',
      owner: 'Quality',
      updated: '09:58',
    },
    {
      id: 'motion',
      item: 'Motion',
      detail: 'Reduced-motion fallback',
      statusKey: 'dashboard.status.stable',
      owner: 'Controls',
      updated: '09:35',
    },
    {
      id: 'responsive',
      item: 'Responsive',
      detail: 'Stage / props / sidebar transitions',
      statusKey: 'dashboard.status.fix',
      owner: 'Layout',
      updated: '09:20',
    },
  ],
  deviations: [
    {
      id: 'alert-motion',
      item: 'GlassAlert',
      detail: 'Reduced-motion audit pending',
      statusKey: 'dashboard.status.new',
      owner: 'Feedback',
      updated: '10:28',
    },
    {
      id: 'table-density',
      item: 'GlassTable',
      detail: 'Compact width below 720px',
      statusKey: 'dashboard.status.fix',
      owner: 'Data',
      updated: '10:06',
    },
    {
      id: 'snapshot',
      item: 'Dashboard',
      detail: 'Screenshot baseline pending',
      statusKey: 'dashboard.status.watch',
      owner: 'QA',
      updated: '09:48',
    },
    {
      id: 'steps',
      item: 'GlassSteps',
      detail: 'Long locale wrapping',
      statusKey: 'dashboard.status.new',
      owner: 'Navigation',
      updated: '09:33',
    },
    {
      id: 'avatar',
      item: 'GlassAvatarGroup',
      detail: 'Overflow +N benchmark',
      statusKey: 'dashboard.status.watch',
      owner: 'Data',
      updated: '09:15',
    },
  ],
}

const tabs = computed(() => [
  { label: tt('dashboard.tab.inventory'), value: 'inventory' },
  { label: tt('dashboard.tab.coverage'), value: 'coverage' },
  { label: tt('dashboard.tab.deviations'), value: 'deviations' },
])

const tableColumns = computed<PrimaryTableCol[]>(() => [
  { colKey: 'item', title: tt('dashboard.table.item'), width: 132 },
  { colKey: 'detail', title: tt('dashboard.table.detail'), minWidth: 210 },
  { colKey: 'status', title: tt('dashboard.table.status'), width: 92 },
  { colKey: 'owner', title: tt('dashboard.table.owner'), width: 96 },
  { colKey: 'updated', title: tt('dashboard.table.updated'), width: 78 },
])

const auditRows = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return rowsByTab[activeTab.value]
    .map((row) => ({
      ...row,
      status: tt(row.statusKey),
    }))
    .filter((row) => {
      if (!keyword) return true
      return [row.item, row.detail, row.status, row.owner, row.updated].some((value) =>
        value.toLowerCase().includes(keyword),
      )
    })
})

const live = computed(() => tt(lastActionKey.value))

const coverageMetrics = computed(() => [
  { labelKey: 'dashboard.metric.tokens', percentage: 98 },
  { labelKey: 'dashboard.metric.interaction', percentage: 92 },
  { labelKey: 'dashboard.metric.a11y', percentage: 87 },
])

function onTabChange(value: TabValue) {
  if (value !== 'inventory' && value !== 'coverage' && value !== 'deviations') return
  activeTab.value = value
  lastActionKey.value = `dashboard.live.${value}`
}

function onSearchEnter() {
  lastActionKey.value = 'dashboard.live.search'
}

function runAudit() {
  if (auditLoading.value) return
  auditLoading.value = true
  lastActionKey.value = 'dashboard.live.running'
  if (auditTimer) clearTimeout(auditTimer)
  auditTimer = setTimeout(() => {
    auditLoading.value = false
    lastActionKey.value = 'dashboard.live.done'
    auditTimer = undefined
  }, 650)
}

function exportSnapshot() {
  lastActionKey.value = 'dashboard.live.export'
}

function approveHandoff() {
  lastActionKey.value = 'dashboard.live.publish'
}

function focusSection(section: (typeof railSections)[number]) {
  activeSection.value = section.id
  lastActionKey.value = section.liveKey
  document.getElementById(section.id)?.scrollIntoView({
    block: 'start',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  })
}

function onRailChange(value: MenuValue) {
  const section = railSections.find((item) => item.id === value)
  if (section) focusSection(section)
}

function toggleRailTone() {
  railTone.value = railTone.value === 'ice' ? 'lilac' : 'ice'
  lastActionKey.value =
    railTone.value === 'ice' ? 'dashboard.live.tone.ice' : 'dashboard.live.tone.lilac'
}

onBeforeUnmount(() => {
  if (auditTimer) clearTimeout(auditTimer)
})
</script>

<template>
  <LabPageShell
    :title="tt('dashboard.page.title')"
    :desc="tt('dashboard.page.desc')"
    :live="live"
  >
    <GlassPosterWash class="dashboard-poster-stage" fit="cover">
      <GlassSurface class="dashboard-surface">
        <div class="dashboard-suite">
          <GlassPageHeader
            :title="tt('dashboard.header.title')"
            :subtitle="tt('dashboard.header.subtitle')"
            class="dashboard-page-header"
          >
            <template #leading>
              <span class="glass-page-header__mark" aria-hidden="true">
                <RefreshIcon size="16" />
              </span>
            </template>
            <template #actions>
              <GlassSearchCapsule
                v-model="query"
                :placeholder="tt('dashboard.action.search')"
                :disabled="auditLoading"
                @enter="onSearchEnter"
              />
              <GlassButton
                :loading="auditLoading"
                :disabled="auditLoading"
                @click="runAudit"
              >
                <template #icon>
                  <PlayCircleIcon />
                </template>
                {{ tt('dashboard.action.audit') }}
              </GlassButton>
            </template>
          </GlassPageHeader>

          <div class="dashboard-flush-row">
            <GlassRail
              :tone="railTone"
              width="clamp(176px, 20vw, 220px)"
              class="dashboard-rail"
            >
              <div class="dashboard-rail-head">
                <span class="dashboard-rail-eyebrow">
                  {{ tt('dashboard.rail.eyebrow') }}
                </span>
                <GlassButton
                  variant="text"
                  class="dashboard-rail-tone"
                  :aria-label="tt('dashboard.rail.tone.switch')"
                  :aria-pressed="railTone === 'lilac'"
                  @click="toggleRailTone"
                >
                  {{
                    tt(
                      railTone === 'ice'
                        ? 'dashboard.rail.tone.ice'
                        : 'dashboard.rail.tone.lilac',
                    )
                  }}
                </GlassButton>
              </div>
              <nav class="dashboard-rail-nav" :aria-label="tt('dashboard.rail.aria')">
                <GlassMenu
                  class="dashboard-rail-menu"
                  variant="rail"
                  :tone="railTone"
                  :value="activeSection"
                  width="100%"
                  @change="onRailChange"
                >
                  <GlassMenuItem
                    v-for="section in railSections"
                    :key="section.id"
                    :value="section.id"
                    :aria-current="activeSection === section.id ? 'location' : undefined"
                  >
                    <span class="dashboard-rail-item">
                      <span class="dashboard-rail-item-title">{{ tt(section.titleKey) }}</span>
                      <span class="dashboard-rail-item-desc">{{ tt(section.descKey) }}</span>
                    </span>
                  </GlassMenuItem>
                </GlassMenu>
              </nav>
            </GlassRail>

            <GlassStage class="dashboard-stage">
              <div class="dashboard-stage-content">
                <section
                  id="dashboard-kpi-section"
                  class="dashboard-section"
                  aria-labelledby="dashboard-kpi-title"
                >
                  <div class="dashboard-section-head">
                    <h2 id="dashboard-kpi-title" class="dashboard-section-title">
                      {{ tt('dashboard.section.kpi') }}
                    </h2>
                  </div>
                  <div class="dashboard-kpi-grid">
                    <GlassPanel
                      variant="standalone"
                      class="dashboard-kpi-card"
                    >
                      <GlassStatistic
                        :title="tt('dashboard.kpi.entries.title')"
                        :value="42"
                        :unit="tt('dashboard.kpi.entries.unit')"
                        :extra="tt('dashboard.kpi.entries.extra')"
                        trend="increase"
                        tone="brand"
                      />
                    </GlassPanel>
                    <GlassPanel
                      variant="standalone"
                      class="dashboard-kpi-card"
                    >
                      <GlassStatistic
                        :title="tt('dashboard.kpi.coverage.title')"
                        :value="94.6"
                        :unit="tt('dashboard.kpi.coverage.unit')"
                        :extra="tt('dashboard.kpi.coverage.extra')"
                        :decimal-places="1"
                        trend="increase"
                        tone="success"
                      />
                    </GlassPanel>
                    <GlassPanel
                      variant="standalone"
                      class="dashboard-kpi-card"
                    >
                      <GlassStatistic
                        :title="tt('dashboard.kpi.tokens.title')"
                        :value="98.2"
                        :unit="tt('dashboard.kpi.tokens.unit')"
                        :extra="tt('dashboard.kpi.tokens.extra')"
                        :decimal-places="1"
                        trend="increase"
                        tone="brand"
                      />
                    </GlassPanel>
                    <GlassPanel
                      variant="standalone"
                      class="dashboard-kpi-card"
                    >
                      <GlassStatistic
                        :title="tt('dashboard.kpi.open.title')"
                        :value="6"
                        :unit="tt('dashboard.kpi.open.unit')"
                        :extra="tt('dashboard.kpi.open.extra')"
                        trend="decrease"
                        tone="warning"
                      />
                    </GlassPanel>
                  </div>
                </section>

                <div class="dashboard-main-grid">
                  <GlassPanel
                    id="dashboard-audit-section"
                    variant="inset"
                    :title="tt('dashboard.table.title')"
                    class="dashboard-workbench"
                  >
                    <GlassTabs
                      :value="activeTab"
                      :list="tabs"
                      :disabled="auditLoading"
                      variant="capsule"
                      @change="onTabChange"
                    />
                    <GlassTable
                      variant="inset"
                      :data="auditRows"
                      :columns="tableColumns"
                      row-key="id"
                      :loading="auditLoading"
                      :empty="tt('dashboard.table.empty')"
                      :aria-label="tt('dashboard.table.aria')"
                    />
                  </GlassPanel>

                  <div id="dashboard-quality-section" class="dashboard-aside">
                    <GlassPanel
                      variant="inset"
                      :title="tt('dashboard.aside.title')"
                      class="dashboard-signal-panel"
                    >
                      <GlassAlert
                        theme="success"
                        :title="tt('dashboard.alert.title')"
                        :message="tt('dashboard.alert.message')"
                        :close-btn="false"
                      />
                      <div class="dashboard-progress-list">
                        <div
                          v-for="metric in coverageMetrics"
                          :key="metric.labelKey"
                          class="dashboard-progress-item"
                        >
                          <div class="dashboard-progress-head">
                            <span>{{ tt(metric.labelKey) }}</span>
                            <span>{{ metric.percentage }}%</span>
                          </div>
                          <GlassProgress :percentage="metric.percentage" />
                        </div>
                      </div>
                      <div class="dashboard-people">
                        <div class="dashboard-people-copy">
                          <span class="dashboard-people-title">
                            {{ tt('dashboard.contributors.title') }}
                          </span>
                          <GlassBadge
                            variant="status"
                            :text="tt('dashboard.badge.ready')"
                          />
                        </div>
                        <GlassAvatarGroup
                          :max="3"
                          :aria-label="tt('dashboard.contributors.aria')"
                        >
                          <GlassAvatar size="small" shape="round" aria-hidden="true">SS</GlassAvatar>
                          <GlassAvatar size="small" shape="round" aria-hidden="true">XA</GlassAvatar>
                          <GlassAvatar size="small" shape="round" aria-hidden="true">QA</GlassAvatar>
                          <GlassAvatar size="small" shape="round" aria-hidden="true">UI</GlassAvatar>
                        </GlassAvatarGroup>
                      </div>
                    </GlassPanel>

                    <GlassCard class="dashboard-cite">
                      <span class="dashboard-cite-kicker">{{ tt('dashboard.cite.kicker') }}</span>
                      <p class="dashboard-cite-copy">
                        <b>{{ tt('dashboard.cite.lead') }}</b>
                        {{ tt('dashboard.cite.copy') }}
                      </p>
                    </GlassCard>
                  </div>
                </div>

                <GlassPanel
                  id="dashboard-delivery-section"
                  variant="inset"
                  :title="tt('dashboard.steps.title')"
                  class="dashboard-steps-panel"
                >
                  <GlassSteps variant="dot" :current="2" readonly>
                    <GlassStepItem
                      :title="tt('dashboard.step.tokens.title')"
                      :content="tt('dashboard.step.tokens.content')"
                      status="finish"
                    />
                    <GlassStepItem
                      :title="tt('dashboard.step.structure.title')"
                      :content="tt('dashboard.step.structure.content')"
                      status="finish"
                    />
                    <GlassStepItem
                      :title="tt('dashboard.step.screens.title')"
                      :content="tt('dashboard.step.screens.content')"
                    />
                    <GlassStepItem
                      :title="tt('dashboard.step.release.title')"
                      :content="tt('dashboard.step.release.content')"
                    />
                  </GlassSteps>
                </GlassPanel>

                <div class="dashboard-actions">
                  <p>{{ tt('dashboard.actions.note') }}</p>
                  <div class="dashboard-action-buttons">
                    <GlassButton variant="ghost" @click="exportSnapshot">
                      <template #icon>
                        <DownloadIcon />
                      </template>
                      {{ tt('dashboard.action.export') }}
                    </GlassButton>
                    <GlassButton @click="approveHandoff">
                      <template #icon>
                        <CheckCircleIcon />
                      </template>
                      {{ tt('dashboard.action.publish') }}
                    </GlassButton>
                  </div>
                </div>
              </div>
            </GlassStage>
          </div>
        </div>
      </GlassSurface>
    </GlassPosterWash>
  </LabPageShell>
</template>

<style scoped>
.dashboard-poster-stage {
  --dashboard-poster-gap: 20px;
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-poster-gap);
  min-height: 730px;
  padding: 20px;
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--glass-wb-card-radius);
  box-sizing: border-box;
}

.dashboard-poster-stage :deep(.glass-poster-wash__content) {
  gap: var(--dashboard-poster-gap);
  padding: 0;
}

.dashboard-surface {
  min-height: 690px;
}

.dashboard-suite {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  min-height: 0;
}

.dashboard-flush-row {
  display: flex;
  flex: 1;
  gap: 0;
  min-width: 0;
  min-height: 0;
}

.dashboard-rail {
  padding: 18px 12px;
  gap: 12px;
}

.dashboard-rail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 4px 2px;
}

.dashboard-rail-eyebrow {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--glass-text-secondary);
}

.dashboard-rail-tone {
  flex: none;
}

.dashboard-rail-nav {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.dashboard-rail-menu :deep(.t-default-menu__inner .t-menu) {
  padding: 0;
  overflow: visible;
}

.dashboard-rail-menu :deep(.t-menu__item) {
  height: auto;
  min-height: 44px;
  padding: 7px 10px;
  line-height: 1.25;
  text-align: left;
  white-space: normal;
}

.dashboard-rail-menu :deep(.t-menu__content) {
  width: 100%;
  overflow: visible;
  white-space: normal;
}

.dashboard-rail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.dashboard-rail-item-title {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
}

.dashboard-rail-item-desc {
  overflow: hidden;
  color: var(--glass-text-muted);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-stage {
  min-width: 0;
}

.dashboard-stage-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

#dashboard-kpi-section,
#dashboard-audit-section,
#dashboard-quality-section,
#dashboard-delivery-section {
  scroll-margin-top: 8px;
}

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-section-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.dashboard-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.dashboard-kpi-card {
  min-width: 0;
}

.dashboard-kpi-card :deep(.glass-panel__body) {
  justify-content: center;
  min-height: 92px;
}

.dashboard-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(250px, 0.8fr);
  gap: 14px;
  align-items: stretch;
}

.dashboard-workbench :deep(.glass-panel__body) {
  gap: 10px;
}

.dashboard-workbench :deep(.glass-tabs) {
  padding: 0 1px 2px;
}

.dashboard-aside {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.dashboard-signal-panel {
  flex: 1;
}

.dashboard-signal-panel :deep(.glass-panel__body) {
  gap: 14px;
}

.dashboard-progress-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-progress-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dashboard-progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--glass-text-secondary);
}

.dashboard-people {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  box-shadow: 0 -1px 0 var(--glass-border-soft);
}

.dashboard-people-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dashboard-people-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.dashboard-cite {
  max-width: none;
}

.dashboard-cite-kicker {
  display: block;
  margin-bottom: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--glass-chroma-ai);
}

.dashboard-cite-copy {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--glass-text-secondary);
}

.dashboard-steps-panel :deep(.glass-panel__body) {
  padding-top: 4px;
}

.dashboard-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 2px;
}

.dashboard-actions p {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--glass-text-muted);
}

.dashboard-action-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 1180px) {
  .dashboard-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .dashboard-main-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard-aside {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.8fr);
  }
}

@media (max-width: 720px) {
  .dashboard-kpi-grid,
  .dashboard-aside {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard-action-buttons {
    justify-content: flex-start;
  }
}
</style>
