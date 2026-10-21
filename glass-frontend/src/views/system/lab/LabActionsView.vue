<script setup lang="ts">
/**
 * 实验室·按钮与行动 — Button variants + Action Pair + Dropdown 触发钮 + Affordant Orb + Status Themes + State Matrix
 * Tone：Quiet Chrome vs Primary Pill vs Status Semantic Filled；小物件满浓。
 * Interaction：Liquid Lift Press — Hover Lift / Active Press / Shadow Bloom 对照标注。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronDownIcon, StarIcon } from 'tdesign-icons-vue-next'
import type { DropdownOption } from 'tdesign-vue-next'

import {
  GlassButton,
  GlassDropdown,
  GlassStickyTool,
  GlassToolbarActions,
} from '@/components/glass'

import { useDocsProps } from '@/layouts/useDocsProps'
import type { DocsDemoBlock } from '@/layouts/useDocsProps'

import { useGlassScheme } from '@/scheme/useGlassScheme'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const { tt } = useGlassScheme()

const lastAction = ref('（尚未交互）')
const pillLoading = ref(false)

type GlassVariant =
  | 'primary'
  | 'quiet'
  | 'icon'
  | 'ghost'
  | 'send'
  | 'soft'
  | 'text'
  | 'outline'
  | 'dashed'
  | 'danger'
  | 'warning'
  | 'success'
type GlassShape = 'square' | 'round' | 'circle'
type DropdownTriggerVariant = 'soft' | 'quiet' | 'primary'

const docsProps = useDocsProps()

/** Live Props Demo 区块：Lab 多页已扩面；全局选中机制仍未做 */
const demoBlocks: DocsDemoBlock[] = [
  {
    id: 'primary-action',
    label: 'Primary Action',
    description: 'GlassButton · variant / shape / disabled / loading',
    props: [
      {
        key: 'variant',
        label: 'variant',
        type: 'select',
        defaultValue: 'primary',
        options: [
          { label: 'primary', value: 'primary' },
          { label: 'quiet', value: 'quiet' },
          { label: 'icon', value: 'icon' },
          { label: 'ghost', value: 'ghost' },
          { label: 'outline', value: 'outline' },
          { label: 'dashed', value: 'dashed' },
          { label: 'soft', value: 'soft' },
          { label: 'text', value: 'text' },
          { label: 'send', value: 'send' },
          { label: 'danger', value: 'danger' },
          { label: 'warning', value: 'warning' },
          { label: 'success', value: 'success' },
        ],
      },
      {
        key: 'shape',
        label: 'shape',
        type: 'select',
        defaultValue: '',
        options: [
          { label: 'auto（块级）', value: '' },
          { label: 'round（Pill）', value: 'round' },
          { label: 'circle', value: 'circle' },
          { label: 'square', value: 'square' },
        ],
      },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
      { key: 'loading', label: 'loading', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'action-pair',
    label: 'Action Pair',
    description: 'GlassToolbarActions · shareText / createText / disabled',
    props: [
      { key: 'shareText', label: 'shareText', type: 'text', defaultValue: '分享' },
      { key: 'createText', label: 'createText', type: 'text', defaultValue: '新会话' },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'dropdown-trigger',
    label: 'Dropdown Trigger',
    description: 'GlassDropdown · triggerVariant / disabled',
    props: [
      {
        key: 'triggerVariant',
        label: 'triggerVariant',
        type: 'select',
        defaultValue: 'soft',
        options: [
          { label: 'soft', value: 'soft' },
          { label: 'quiet', value: 'quiet' },
          { label: 'primary', value: 'primary' },
        ],
      },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'affordant-orb',
    label: 'Affordant Orb (FAB)',
    description: 'GlassStickyTool · disabled / loading',
    props: [
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
      { key: 'loading', label: 'loading', type: 'boolean', defaultValue: false },
    ],
  },
]

onMounted(() => {
  for (const block of demoBlocks) {
    docsProps.registerDemo(block)
  }
})

onBeforeUnmount(() => {
  for (const block of demoBlocks) {
    docsProps.unregisterDemo(block.id)
  }
})

function isDemoSelected(id: string): boolean {
  return docsProps.state.activeDemoId === id
}

function selectDemo(id: string): void {
  docsProps.selectDemo(id)
}

const primaryAction = computed(() => {
  const values = docsProps.state.values['primary-action'] ?? {}
  return {
    variant: (values.variant as GlassVariant) ?? 'primary',
    shape: ((values.shape === '' ? undefined : values.shape) as GlassShape | undefined),
    disabled: Boolean(values.disabled),
    loading: Boolean(values.loading),
  }
})

const actionPair = computed(() => {
  const values = docsProps.state.values['action-pair'] ?? {}
  return {
    shareText: String(values.shareText ?? '分享'),
    createText: String(values.createText ?? '新会话'),
    disabled: Boolean(values.disabled),
  }
})

const dropdownTrigger = computed(() => {
  const values = docsProps.state.values['dropdown-trigger'] ?? {}
  return {
    triggerVariant: (values.triggerVariant as DropdownTriggerVariant) ?? 'soft',
    disabled: Boolean(values.disabled),
  }
})

const affordantOrb = computed(() => {
  const values = docsProps.state.values['affordant-orb'] ?? {}
  return {
    disabled: Boolean(values.disabled),
    loading: Boolean(values.loading),
  }
})

const dropdownDemoOptions: DropdownOption[] = [
  { content: '角色 A', value: '角色 A' },
  { content: '角色 B', value: '角色 B' },
  { content: '角色 C', value: '角色 C' },
  { content: '禁用项', value: 'disabled', disabled: true },
]

function onDropdownClick(option: DropdownOption) {
  lastAction.value = `dropdown → ${String(option.value)}`
}

function onToolbarShare() {
  lastAction.value = 'toolbar → share'
}

function onToolbarCreate() {
  lastAction.value = 'toolbar → create'
}

function onFabClick() {
  lastAction.value = 'fab → +'
}

function togglePillLoading() {
  pillLoading.value = !pillLoading.value
  lastAction.value = pillLoading.value ? 'primary pill → loading on' : 'primary pill → loading off'
}
</script>

<template>
  <LabPageShell
    :title="tt('actions.page.title')"
    :desc="tt('actions.page.desc')"
    :live="lastAction"
  >
    <!-- Live Props Demo（Lab 多页已扩面；全局选中机制仍未做） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('lab.section.liveProps') }}</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 variant / shape / disabled / loading / 文案 / triggerVariant；画布控件即时反映。
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Primary Action · 点选后右栏调属性</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('primary-action') }"
              role="button"
              tabindex="0"
              @click="selectDemo('primary-action')"
              @keydown.enter="selectDemo('primary-action')"
              @keydown.space.prevent="selectDemo('primary-action')"
            >
              <GlassButton
                :variant="primaryAction.variant"
                :shape="primaryAction.shape"
                :disabled="primaryAction.disabled"
                :loading="primaryAction.loading"
              >
                {{ primaryAction.loading ? '加载中…' : 'Primary Action' }}
              </GlassButton>
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Action Pair · shareText / createText / disabled</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('action-pair') }"
              role="button"
              tabindex="0"
              @click="selectDemo('action-pair')"
              @keydown.enter="selectDemo('action-pair')"
              @keydown.space.prevent="selectDemo('action-pair')"
            >
              <GlassToolbarActions
                :share-text="actionPair.shareText"
                :create-text="actionPair.createText"
                :disabled="actionPair.disabled"
                @share="lastAction = 'live props → share'"
                @create="lastAction = 'live props → create'"
              />
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Dropdown Trigger · triggerVariant / disabled</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('dropdown-trigger') }"
              role="button"
              tabindex="0"
              @click="selectDemo('dropdown-trigger')"
              @keydown.enter="selectDemo('dropdown-trigger')"
              @keydown.space.prevent="selectDemo('dropdown-trigger')"
            >
              <GlassDropdown
                :options="dropdownDemoOptions"
                :trigger-variant="dropdownTrigger.triggerVariant"
                :disabled="dropdownTrigger.disabled"
                label="Dropdown"
                @click="onDropdownClick"
              />
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Affordant Orb (FAB) · disabled / loading</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block docs-demo-block--fab"
              :class="{ 'is-selected': isDemoSelected('affordant-orb') }"
              role="button"
              tabindex="0"
              @click="selectDemo('affordant-orb')"
              @keydown.enter="selectDemo('affordant-orb')"
              @keydown.space.prevent="selectDemo('affordant-orb')"
            >
              <GlassStickyTool
                :disabled="affordantOrb.disabled"
                :loading="affordantOrb.loading"
                aria-label="新建会话（Live Props）"
                @click="onFabClick"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Button variants -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('actions.section.variants') }}</span>
        <span class="lab-section-meta">
          primary（块级 42 / radius 12）· primary-round（Pill 38 / radius 999）· quiet · icon（TD icon-only 预设）·
          ghost（TD 镂空带文案）· outline · dashed（三者 hover 共用：透底无板 · 外影 none）· text · soft（32）· send ·
          底层 t-button · 每变体 Hover Lift + Active Press（Quiet &lt; Primary）
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">GlassButton</span>
          <div class="lab-control-row-items">
            <GlassButton variant="primary">主按钮 primary</GlassButton>
            <GlassButton variant="primary" shape="round">Primary pill</GlassButton>
            <GlassButton variant="quiet">Quiet pill</GlassButton>
            <GlassButton variant="icon" aria-label="附件（icon-only 预设）">
              <StarIcon size="16" />
            </GlassButton>
            <GlassButton variant="ghost">镂空 ghost</GlassButton>
            <GlassButton variant="outline">描边 outline</GlassButton>
            <GlassButton variant="dashed">虚框 dashed</GlassButton>
            <GlassButton variant="text">文字 text</GlassButton>
            <GlassButton variant="soft">软胶囊 soft</GlassButton>
            <GlassButton variant="send" aria-label="发送">
              <StarIcon size="16" />
            </GlassButton>
            <GlassButton variant="send" disabled aria-label="发送（禁用）">
              <StarIcon size="16" />
            </GlassButton>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">Interaction 术语（悬停 / 按住观察下沉 / 键盘 Tab）</span>
          <div class="lab-control-row-items">
            <span class="lab-control-note">
              Hover Lift = translateY 抬升（quiet -1px / primary -2px / FAB -3px）+ Shadow Bloom；Filled 不做内部色散 ·
              Active Press = 位移回落 + 微下沉 + scale(0.98/0.96) + 颜色反馈 · Focus Ring = :focus-visible ·
              disabled / loading 无抬升 · reduced-motion 只留颜色 ·
              色态分轨（Separate Tracks）：Tonal（quiet/soft/icon/ghost/outline/dashed/text）= Quiet Active Wash 略深同色 + 深字可读，**不反转字**；Filled（primary/send/FAB）= 满浓 Press，按压不削弱 ·
              Tonal ripple = 品牌冷色 whisper（quiet ≥ soft ≥ icon；盖掉 TDesign 灰 #a6a6a6）·
              Tonal Quiet Chrome：soft/icon inset hairline；hover Fade。ghost/outline/dashed 走 Quiet Outline 实线描边 token，不套 inset hairline ·
              Press Invert（字色反转）已评估否决（见 .agents/tmp-quiet-active-invert-eval.md）
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Action Pair -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('actions.section.pair') }}</span>
        <span class="lab-section-meta">
          GlassToolbarActions · Quiet「分享」+ Primary pill「新会话」· Compound Wrapper 盖 t-button（shape=round）
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Action Pair（可点）</span>
          <div class="lab-control-row-items">
            <GlassToolbarActions @share="onToolbarShare" @create="onToolbarCreate" />
            <GlassToolbarActions
              share-text="导出"
              create-text="新建"
              @share="lastAction = 'toolbar → share(override)'"
              @create="lastAction = 'toolbar → create(override)'"
            />
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">拆解：quiet pill vs primary pill</span>
          <div class="lab-control-row-items">
            <GlassButton variant="quiet" @click="onToolbarShare">分享 quiet</GlassButton>
            <GlassButton variant="primary" shape="round" @click="onToolbarCreate">
              新会话 primary pill
            </GlassButton>
            <span class="lab-control-note">height 38 / radius 999 · 对齐 Capsule Field</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Dropdown 触发钮 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('actions.section.dropdown') }}</span>
        <span class="lab-section-meta">
          GlassDropdown · Compound Wrapper 盖 t-dropdown · 触发钮 = GlassButton 密度（soft 32 / quiet Pill 38 /
          primary 块级 42）· 菜单面板玻璃 Quiet Chrome（近白微透 + 主题蓝 hover/active whisper · 禁脏灰描边）
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">triggerVariant 对照（soft / quiet / primary）</span>
          <div class="lab-control-row-items">
            <GlassDropdown
              :options="dropdownDemoOptions"
              trigger-variant="soft"
              label="软胶囊 soft"
              @click="onDropdownClick"
            />
            <GlassDropdown
              :options="dropdownDemoOptions"
              trigger-variant="quiet"
              label="Quiet pill"
              @click="onDropdownClick"
            />
            <GlassDropdown
              :options="dropdownDemoOptions"
              trigger-variant="primary"
              label="Primary"
              @click="onDropdownClick"
            />
            <span class="lab-control-note">触发钮 = GlassButton 密度 · 菜单条目 hover whisper / active 深字可读</span>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">自定义触发器（#icon / default / #suffix · Composer 角色路径）</span>
          <div class="lab-control-row-items">
            <GlassDropdown :options="dropdownDemoOptions" @click="onDropdownClick">
              <GlassButton variant="soft" aria-label="切换角色">
                <template #icon>
                  <StarIcon size="13" />
                </template>
                <span>角色 A</span>
                <template #suffix>
                  <ChevronDownIcon size="13" />
                </template>
              </GlassButton>
            </GlassDropdown>
            <span class="lab-control-note">图标走 #icon / #suffix，文案 default · triggerVariant 仅约束默认触发钮</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FAB -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('actions.section.fab') }}</span>
        <span class="lab-section-meta">
          GlassStickyTool · FAB 52 · 底层 t-button shape=circle · absolute within Surface · Safe Offset 28px ·
          Affordant Orb 最大幅度 Hover Lift -3px → Active Press +1px / scale(--glass-wb-fab-active-scale)
        </span>
      </div>
      <div class="lab-frame lab-frame--fab">
        <div class="lab-fab-host">
          <span class="lab-stub-tag">相对定位容器（absolute within Surface）</span>
          <GlassStickyTool aria-label="新建会话" @click="onFabClick" />
        </div>
      </div>
    </section>

    <!-- Glass State Matrix -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('actions.section.matrix') }}</span>
        <span class="lab-section-meta">
          语义变体 × default / disabled / loading · Hover Lift / Active Press 需实际悬停 / 按住 · Focus Ring 用键盘
          Tab · disabled / loading 无抬升 · reduced-motion 取消位移只留颜色
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">primary · quiet · soft（default | disabled | loading）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="primary">default</GlassButton>
            <GlassButton variant="primary" disabled>disabled</GlassButton>
            <GlassButton variant="primary" loading>loading</GlassButton>

            <GlassButton variant="quiet">default</GlassButton>
            <GlassButton variant="quiet" disabled>disabled</GlassButton>
            <GlassButton variant="quiet" loading>loading</GlassButton>

            <GlassButton variant="soft">default</GlassButton>
            <GlassButton variant="soft" disabled>disabled</GlassButton>
            <GlassButton variant="soft" loading>loading</GlassButton>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">primary-round · icon · send（icon-only 均带 aria-label）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="primary" shape="round">default</GlassButton>
            <GlassButton variant="primary" shape="round" disabled>disabled</GlassButton>
            <GlassButton variant="primary" shape="round" loading>loading</GlassButton>

            <GlassButton variant="icon" aria-label="附件">
              <StarIcon size="16" />
            </GlassButton>
            <GlassButton variant="icon" disabled aria-label="附件（禁用）">
              <StarIcon size="16" />
            </GlassButton>
            <GlassButton variant="icon" loading aria-label="附件（加载）">
              <StarIcon size="16" />
            </GlassButton>

            <GlassButton variant="send" aria-label="发送">
              <StarIcon size="16" />
            </GlassButton>
            <GlassButton variant="send" disabled aria-label="发送（禁用）">
              <StarIcon size="16" />
            </GlassButton>
            <GlassButton variant="send" loading aria-label="发送（加载）">
              <StarIcon size="16" />
            </GlassButton>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">ghost（TD 镂空 · default | disabled | loading）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="ghost">镂空 ghost</GlassButton>
            <GlassButton variant="ghost" disabled>disabled</GlassButton>
            <GlassButton variant="ghost" loading>loading</GlassButton>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">outline（TD 描边 · default | disabled | loading）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="outline">描边 outline</GlassButton>
            <GlassButton variant="outline" disabled>disabled</GlassButton>
            <GlassButton variant="outline" loading>loading</GlassButton>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">Affordant Orb · default | disabled | loading</span>
          <div class="lab-control-row-items lab-fab-row">
            <div class="lab-fab-slot">
              <GlassStickyTool aria-label="新建会话" @click="onFabClick" />
            </div>
            <div class="lab-fab-slot">
              <GlassStickyTool disabled aria-label="新建会话（禁用）" />
            </div>
            <div class="lab-fab-slot">
              <GlassStickyTool loading aria-label="新建会话（加载）" />
            </div>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">loading 开关（Primary Pill 交互锁定）</span>
          <div class="lab-control-row-items">
            <GlassButton
              variant="primary"
              shape="round"
              :loading="pillLoading"
              @click="lastAction = 'primary pill → click'"
            >
              {{ pillLoading ? '加载中…' : '点我或切换 loading' }}
            </GlassButton>
            <GlassButton variant="quiet" @click="togglePillLoading">
              {{ pillLoading ? '结束 loading' : '开始 loading' }}
            </GlassButton>
            <span class="lab-control-note">loading 时透传 t-button，无 Active Press</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Status Themes -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('actions.section.status') }}</span>
        <span class="lab-section-meta">
          danger=京东红同源分档（品牌锚 #E1251B / btn·confirm #D91F18，冻结勿改）·
          warning=中石油宝石花辅色（CNPC / Pantone 137C）锚 #FFA300 / btn #A15C07 ·
          success=酷安绿（favicon 采样）锚 #18B458 / btn #117E3E ·
          白字 + 满浓底 · Tone Ladder（锚亮识别／钮深保对比）·
          交互与 Primary 同族（Hover Lift -2px / Filled Press）· 几何同 primary（42/12）·
          shape=round → Pill 38 · 禁止 Quiet Active Wash
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">danger · warning · success（default | disabled | loading）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="danger">删除</GlassButton>
            <GlassButton variant="danger" disabled>disabled</GlassButton>
            <GlassButton variant="danger" loading>loading</GlassButton>

            <GlassButton variant="warning">谨慎</GlassButton>
            <GlassButton variant="warning" disabled>disabled</GlassButton>
            <GlassButton variant="warning" loading>loading</GlassButton>

            <GlassButton variant="success">通过</GlassButton>
            <GlassButton variant="success" disabled>disabled</GlassButton>
            <GlassButton variant="success" loading>loading</GlassButton>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">Status Pill（shape=round · 几何继承 Primary Pill 38）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="danger" shape="round">删除</GlassButton>
            <GlassButton variant="warning" shape="round">谨慎</GlassButton>
            <GlassButton variant="success" shape="round">通过</GlassButton>
            <span class="lab-control-note">danger=京东红同源分档（冻结） · warning=中石油宝石花辅色（CNPC / Pantone 137C）锚 #FFA300 / btn #A15C07 · success=酷安绿（favicon）锚 #18B458 / btn #117E3E · 交互挂 Primary 轨</span>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">Tone Ladder · warning（锚色块 vs Contrast 钮）</span>
          <div class="lab-control-row-items">
            <span class="lab-tone-swatch lab-tone-swatch--warning-anchor" title="品牌锚 #FFA300"></span>
            <span class="lab-control-note">品牌锚 #FFA300（Pantone 137C）· 识别用 · 禁 Filled 白字</span>
            <GlassButton variant="warning">Contrast 钮 #A15C07</GlassButton>
            <span class="lab-control-note">Filled 白字轨 · rest 4.91 / hover 4.61 · 同相贴锚、更亮更艳（v2）</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TDesign State Matrix（裸 t-button 对照） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('actions.section.tdMatrix') }}</span>
        <span class="lab-section-meta">
          theme / variant / shape / size / ghost / loading / disabled · 仅 Lab 对照，不进入 Glass 导出面
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">theme × variant</span>
          <div class="lab-control-row-items">
            <t-button theme="default" variant="base">default base</t-button>
            <t-button theme="primary" variant="base">primary base</t-button>
            <t-button theme="danger" variant="base">danger base</t-button>
            <t-button theme="warning" variant="base">warning base</t-button>
            <t-button theme="success" variant="base">success base</t-button>
          </div>
          <div class="lab-control-row-items">
            <t-button theme="default" variant="outline">outline</t-button>
            <t-button theme="primary" variant="outline">primary outline</t-button>
            <t-button theme="primary" variant="dashed">dashed</t-button>
            <t-button theme="primary" variant="text">text</t-button>
            <t-button theme="danger" variant="text">danger text</t-button>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">shape · size</span>
          <div class="lab-control-row-items">
            <t-button theme="primary" shape="square">square</t-button>
            <t-button theme="primary" shape="round">round</t-button>
            <t-button theme="primary" shape="circle">circle</t-button>
          </div>
          <div class="lab-control-row-items">
            <t-button theme="primary" size="extra-small">extra-small</t-button>
            <t-button theme="primary" size="small">small</t-button>
            <t-button theme="primary" size="medium">medium</t-button>
            <t-button theme="primary" size="large">large</t-button>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">ghost · loading · disabled</span>
          <div class="lab-control-row-items">
            <t-button theme="primary" ghost>ghost</t-button>
            <t-button theme="danger" ghost variant="outline">danger ghost outline</t-button>
            <t-button theme="primary" loading>loading</t-button>
            <t-button theme="primary" loading variant="outline">loading outline</t-button>
            <t-button theme="primary" disabled>disabled</t-button>
            <t-button theme="primary" disabled variant="outline">disabled outline</t-button>
            <t-button theme="primary" disabled ghost>disabled ghost</t-button>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">block</span>
          <div class="lab-control-row-items" style="width: 100%">
            <t-button theme="primary" block>block primary</t-button>
          </div>
        </div>
      </div>
    </section>
  </LabPageShell>
</template>

<style scoped>
/* Live Props Demo 选中区块：透明边 → hover 描边 → 选中 focus-ring */
.docs-demo-block {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.docs-demo-block:hover {
  border-color: var(--glass-wb-btn-blue);
}

.docs-demo-block:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

.docs-demo-block.is-selected {
  border-color: var(--glass-wb-btn-blue);
  box-shadow: var(--glass-wb-control-focus-ring);
}

.docs-demo-block--fab {
  position: relative;
  width: 96px;
  height: 96px;
  padding: 0;
  overflow: hidden;
  background: var(--glass-wb-stage-fill);
  -webkit-backdrop-filter: var(--glass-wb-stage-blur);
  backdrop-filter: var(--glass-wb-stage-blur);
}

.docs-demo-block--fab :deep(.glass-sticky-tool) {
  right: 22px;
  bottom: 22px;
}

@media (prefers-reduced-motion: reduce) {
  .docs-demo-block {
    transition: none;
  }
}

.lab-fab-row {
  align-items: stretch;
  gap: 20px;
}

/* Tone Ladder 锚色块（Lab 教学：品牌锚可见；非组件 token） */
.lab-tone-swatch {
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(15, 40, 80, 0.12);
  box-shadow: 0 2px 8px rgba(15, 40, 80, 0.1);
  flex-shrink: 0;
}

.lab-tone-swatch--warning-anchor {
  background: #ffa300;
}

.lab-fab-slot {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: var(--glass-wb-card-radius);
  background: var(--glass-wb-stage-fill);
  -webkit-backdrop-filter: var(--glass-wb-stage-blur);
  backdrop-filter: var(--glass-wb-stage-blur);
  overflow: hidden;
}

/* FAB Safe Offset 在 slot 内改为居中示意，定位语义仍由组件 absolute 承担 */
.lab-fab-slot :deep(.glass-sticky-tool) {
  right: 22px;
  bottom: 22px;
}
</style>
