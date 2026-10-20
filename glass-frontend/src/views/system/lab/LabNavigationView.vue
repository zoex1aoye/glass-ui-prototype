<script setup lang="ts">
/**
 * 实验室·导航与步骤 — GlassTabs + GlassSteps Compound Wrapper State Matrix
 * line=Quiet Ink Track · soft=Soft Segment Track · capsule=Soft Segment Track（pill）
 * · card=Soft Card Track。
 * 视觉统一收口在 styles/theme.css；本页只演示变体 / 交互 / placement / 透传，
 * 不写组件内魔法色，不改一级业务导航。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import {
  GlassStepItem,
  GlassSteps,
  GlassTabPanel,
  GlassTabs,
} from '@/components/glass'

import { useDocsProps } from '@/layouts/useDocsProps'
import type { DocsDemoBlock } from '@/layouts/useDocsProps'

import { useGlassScheme } from '@/scheme/useGlassScheme'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const { tt } = useGlassScheme()

const lastAction = ref('（尚未交互）')
const docsProps = useDocsProps()

const tabsDemoValue = ref('overview')
const demoStepsValue = ref(1)

const demoBlocks: DocsDemoBlock[] = [
  {
    id: 'steps-variant',
    label: 'GlassSteps',
    description: 'GlassSteps · variant（default / dot）',
    props: [
      {
        key: 'variant',
        label: 'variant',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'default', value: 'default' },
          { label: 'dot', value: 'dot' },
        ],
      },
    ],
  },
  {
    id: 'tabs-variant',
    label: 'GlassTabs',
    description: 'GlassTabs · variant / disabled',
    props: [
      {
        key: 'variant',
        label: 'variant',
        type: 'select',
        defaultValue: 'line',
        options: [
          { label: 'line', value: 'line' },
          { label: 'soft', value: 'soft' },
          { label: 'capsule', value: 'capsule' },
          { label: 'card', value: 'card' },
        ],
      },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
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

const tabsDemo = computed(() => {
  const v = docsProps.state.values['tabs-variant'] ?? {}
  return {
    variant: (v.variant as 'line' | 'soft' | 'card' | 'capsule') ?? 'line',
    disabled: Boolean(v.disabled ?? false),
  }
})

const stepsDemo = computed(() => {
  const v = docsProps.state.values['steps-variant'] ?? {}
  return {
    variant: (v.variant as 'default' | 'dot') ?? 'default',
  }
})

const stepsDefault = ref(1)
const stepsDot = ref(1)
const stepsStatus = ref(1)
const stepsVertical = ref(1)
const stepsReadonly = ref(1)

const lineValue = ref('overview')
const softValue = ref('overview')
const capsuleValue = ref('overview')
const cardValue = ref('overview')
const disabledValue = ref('overview')
const leftValue = ref('overview')
const rawValue = ref('overview')

function onChange(variant: string, value: string | number) {
  lastAction.value = `tabs change → ${variant} · ${String(value)}`
}

function onStepsChange(variant: string, current: string | number) {
  lastAction.value = `steps change → ${variant} · ${String(current)}`
}
</script>

<template>
  <LabPageShell
    :title="tt('navigation.page.title')"
    :desc="tt('navigation.page.desc')"
    :live="lastAction"
  >
    <!-- 0. Live Props Demo -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('lab.section.liveProps') }}</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 GlassTabs / GlassSteps 的 variant 与 disabled；画布即时反映。
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">GlassSteps · variant（default / dot）</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('steps-variant') }"
              role="button"
              tabindex="0"
              @click="selectDemo('steps-variant')"
              @keydown.enter="selectDemo('steps-variant')"
              @keydown.space.prevent="selectDemo('steps-variant')"
            >
              <GlassSteps
                v-model="demoStepsValue"
                :variant="stepsDemo.variant"
                @change="onStepsChange('live', $event)"
              >
                <GlassStepItem title="填写信息" content="基础资料" />
                <GlassStepItem title="提交" content="待处理" />
                <GlassStepItem title="完成" content="归档" />
              </GlassSteps>
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">GlassTabs · variant / disabled</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('tabs-variant') }"
              role="button"
              tabindex="0"
              @click="selectDemo('tabs-variant')"
              @keydown.enter="selectDemo('tabs-variant')"
              @keydown.space.prevent="selectDemo('tabs-variant')"
            >
              <GlassTabs
                v-model="tabsDemoValue"
                :variant="tabsDemo.variant"
                :disabled="tabsDemo.disabled"
                @change="onChange('live', $event)"
              >
                <GlassTabPanel value="overview" label="概览">概览面板内容</GlassTabPanel>
                <GlassTabPanel value="detail" label="明细">明细面板内容</GlassTabPanel>
                <GlassTabPanel value="settings" label="设置">设置面板内容</GlassTabPanel>
                <GlassTabPanel value="note" label="备注">备注面板内容</GlassTabPanel>
              </GlassTabs>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 1. Variants matrix -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('navigation.section.tabs') }}</span>
        <span class="lab-section-meta">
          line（默认）· soft · capsule · card；各 4 面板（概览 / 明细 / 设置 / 备注）· 底层 t-tabs ·
          视觉仅 class 钩子 + theme.css
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">line · Quiet Ink Track（默认）</span>
          <GlassTabs v-model="lineValue" variant="line" @change="onChange('line', $event)">
            <GlassTabPanel value="overview" label="概览">概览面板内容</GlassTabPanel>
            <GlassTabPanel value="detail" label="明细">明细面板内容</GlassTabPanel>
            <GlassTabPanel value="settings" label="设置">设置面板内容</GlassTabPanel>
            <GlassTabPanel value="note" label="备注">备注面板内容</GlassTabPanel>
          </GlassTabs>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">soft · Soft Segment Track</span>
          <GlassTabs v-model="softValue" variant="soft" @change="onChange('soft', $event)">
            <GlassTabPanel value="overview" label="概览">概览面板内容</GlassTabPanel>
            <GlassTabPanel value="detail" label="明细">明细面板内容</GlassTabPanel>
            <GlassTabPanel value="settings" label="设置">设置面板内容</GlassTabPanel>
            <GlassTabPanel value="note" label="备注">备注面板内容</GlassTabPanel>
          </GlassTabs>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">capsule · Soft Segment Track（pill）</span>
          <GlassTabs v-model="capsuleValue" variant="capsule" @change="onChange('capsule', $event)">
            <GlassTabPanel value="overview" label="概览">概览面板内容</GlassTabPanel>
            <GlassTabPanel value="detail" label="明细">明细面板内容</GlassTabPanel>
            <GlassTabPanel value="settings" label="设置">设置面板内容</GlassTabPanel>
            <GlassTabPanel value="note" label="备注">备注面板内容</GlassTabPanel>
          </GlassTabs>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">card · Soft Card Track</span>
          <GlassTabs v-model="cardValue" variant="card" @change="onChange('card', $event)">
            <GlassTabPanel value="overview" label="概览">概览面板内容</GlassTabPanel>
            <GlassTabPanel value="detail" label="明细">明细面板内容</GlassTabPanel>
            <GlassTabPanel value="settings" label="设置">设置面板内容</GlassTabPanel>
            <GlassTabPanel value="note" label="备注">备注面板内容</GlassTabPanel>
          </GlassTabs>
        </div>
      </div>
    </section>

    <!-- 2. Interaction -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('navigation.section.interaction') }}</span>
        <span class="lab-section-meta">
          Hover Whisper（未选中冷洗）· Tabs：Tab 进入 tablist，←/→ 移动焦点（left 放置用 ↑/↓），
          Home/End 跳首尾，Enter/Space 激活 · disabled 面板不可切换 · reduced-motion 下无缩放
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">line · 含禁用面板</span>
          <GlassTabs v-model="disabledValue" variant="line" @change="onChange('line-disabled', $event)">
            <GlassTabPanel value="overview" label="概览">概览面板内容</GlassTabPanel>
            <GlassTabPanel value="detail" label="明细" disabled>禁用面板（不可切换）</GlassTabPanel>
            <GlassTabPanel value="settings" label="设置">设置面板内容</GlassTabPanel>
          </GlassTabs>
          <span class="lab-control-note">
            悬停「明细」无抬升；Tab 聚焦可见 ring；当前值：{{ disabledValue }}；
            方向键移动焦点，Enter / Space 激活选中
          </span>
        </div>
      </div>
    </section>

    <!-- 3. Placement -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('navigation.section.placement') }}</span>
        <span class="lab-section-meta">top 为视觉主形态；left 仅透传轻示（不设为一等公民）</span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">line · placement=left</span>
          <GlassTabs v-model="leftValue" variant="line" placement="left" @change="onChange('left', $event)">
            <GlassTabPanel value="overview" label="概览">概览面板内容</GlassTabPanel>
            <GlassTabPanel value="detail" label="明细">明细面板内容</GlassTabPanel>
            <GlassTabPanel value="settings" label="设置">设置面板内容</GlassTabPanel>
          </GlassTabs>
        </div>
      </div>
    </section>

    <!-- 4. Raw contrast -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('navigation.section.bareTabs') }}</span>
        <span class="lab-section-meta">仅用于对照，不进入 components/glass 导出；演示 v-model 透传一致</span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">t-tabs 默认主题</span>
          <t-tabs v-model="rawValue" @change="onChange('raw', $event)">
            <t-tab-panel value="overview" label="概览">概览面板内容</t-tab-panel>
            <t-tab-panel value="detail" label="明细">明细面板内容</t-tab-panel>
            <t-tab-panel value="settings" label="设置">设置面板内容</t-tab-panel>
          </t-tabs>
        </div>
      </div>
    </section>

    <!-- Steps Variants -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('navigation.section.steps') }}</span>
        <span class="lab-section-meta">
          default（默认）· dot；底层 t-steps · 视觉仅 class 钩子 + theme.css ·
          可点步（非 readonly）Tab 可达，Enter / Space 切换；当前步 aria-current="step" ·
          current / modelValue 透传
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">default · Quiet Number Path（默认）</span>
          <GlassSteps v-model="stepsDefault" @change="onStepsChange('default', $event)">
            <GlassStepItem title="填写信息" content="基础资料" />
            <GlassStepItem title="提交" content="待处理" />
            <GlassStepItem title="完成" content="归档" />
          </GlassSteps>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">dot · Soft Dot Path</span>
          <GlassSteps v-model="stepsDot" variant="dot" @change="onStepsChange('dot', $event)">
            <GlassStepItem title="步骤 1" content="已完成" />
            <GlassStepItem title="步骤 2" content="进行中" />
            <GlassStepItem title="步骤 3" content="未开始" />
            <GlassStepItem title="步骤 4" content="未开始" />
          </GlassSteps>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">default · layout=vertical 轻示</span>
          <GlassSteps
            v-model="stepsVertical"
            layout="vertical"
            @change="onStepsChange('vertical', $event)"
          >
            <GlassStepItem title="填写信息" content="基础资料" />
            <GlassStepItem title="提交" content="待处理" />
            <GlassStepItem title="完成" content="归档" />
          </GlassSteps>
        </div>
      </div>
    </section>

    <!-- Steps Status -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('navigation.section.status') }}</span>
        <span class="lab-section-meta">
          process / finish / error / default · readonly 禁点（降强调无 hover）·
          process 步 focus-visible 可见环 · reduced-motion 下无缩放
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">default · 混合状态（process / finish / error / default）</span>
          <GlassSteps v-model="stepsStatus" @change="onStepsChange('status', $event)">
            <GlassStepItem title="已完成" content="提交表单" status="finish" />
            <GlassStepItem title="进行中" content="处理中" />
            <GlassStepItem title="校验失败" content="需修复" status="error" />
            <GlassStepItem title="待开始" content="未启动" />
          </GlassSteps>
          <span class="lab-control-note">当前步：{{ stepsStatus }} · aria-current="step"</span>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">default · readonly（不可点，仅展示）</span>
          <GlassSteps v-model="stepsReadonly" readonly>
            <GlassStepItem title="已完成" content="提交表单" status="finish" />
            <GlassStepItem title="进行中" content="处理中" />
            <GlassStepItem title="待开始" content="未启动" />
          </GlassSteps>
          <span class="lab-control-note">readonly 态：悬停 / 点击均不切换，无 hover 抬升。</span>
        </div>
      </div>
    </section>
  </LabPageShell>
</template>
