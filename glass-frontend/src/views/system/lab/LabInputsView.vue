<script setup lang="ts">
/**
 * 实验室·输入与胶囊 — Capsule Search / Capsule Field / Suggest Chip / Composer 输入态
 * Density：Capsule Search 33 · Field 38 / radius 12。
 * Focus：Focus Ring Follows Radius + Kill Inner Rect（外层柔环，内芯无 TDesign 矩形框）。
 * Input Quiet Chrome：rest inset hairline · hover Fade · focus ring only。
 * Suggest Chip Lift · Quiet Active Wash · Icon Leading。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { ChartIcon, FileIcon, TaskIcon } from 'tdesign-icons-vue-next'

import {
  GlassCalendar,
  GlassComposer,
  GlassDatePicker,
  GlassDateRangePicker,
  GlassForm,
  GlassInput,
  GlassSearchCapsule,
  GlassStage,
  GlassSurface,
  GlassSuggestChip,
  GlassTimePicker,
  GlassTimeRangePicker,
} from '@/components/glass'

import { useDocsProps } from '@/layouts/useDocsProps'
import type { DocsDemoBlock } from '@/layouts/useDocsProps'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const demoSuggestions = ['生成演示摘要', '查看示例进度', '整理演示备注'] as const

const iconSuggestions = [
  { text: '生成演示摘要', icon: ChartIcon },
  { text: '查看示例进度', icon: TaskIcon },
  { text: '整理演示备注', icon: FileIcon },
] as const

const searchKeyword = ref('')
const fieldText = ref('')
const bareText = ref('')
const formName = ref('')
const composerText = ref('')
const roleName = ref('角色 A')
const composerRoleOptions = ['角色 A', '角色 B', '角色 C']
const lastAction = ref('（尚未交互）')

const docsProps = useDocsProps()

const demoSearchValue = ref('')
const demoFieldValue = ref('')
const demoCalendarValue = ref('2026-10-18')

const demoBlocks: DocsDemoBlock[] = [
  {
    id: 'capsule-search',
    label: 'Capsule Search',
    description: 'GlassSearchCapsule · clearable / disabled',
    props: [
      { key: 'clearable', label: 'clearable', type: 'boolean', defaultValue: true },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'field-input',
    label: 'Field · GlassInput',
    description: 'GlassInput · search / clearable / disabled',
    props: [
      { key: 'search', label: 'search', type: 'boolean', defaultValue: false },
      { key: 'clearable', label: 'clearable', type: 'boolean', defaultValue: false },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'suggest-chip',
    label: 'Suggest Chip',
    description: 'GlassSuggestChip · text / disabled',
    props: [
      { key: 'text', label: 'text', type: 'text', defaultValue: '生成演示摘要' },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'calendar-theme',
    label: 'GlassCalendar',
    description: 'GlassCalendar · theme（full / card）',
    props: [
      {
        key: 'theme',
        label: 'theme',
        type: 'select',
        defaultValue: 'full',
        options: [
          { label: 'full', value: 'full' },
          { label: 'card', value: 'card' },
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

const capsuleSearch = computed(() => {
  const v = docsProps.state.values['capsule-search'] ?? {}
  return {
    clearable: Boolean(v.clearable ?? true),
    disabled: Boolean(v.disabled ?? false),
  }
})

const fieldInput = computed(() => {
  const v = docsProps.state.values['field-input'] ?? {}
  return {
    search: Boolean(v.search ?? false),
    clearable: Boolean(v.clearable ?? false),
    disabled: Boolean(v.disabled ?? false),
  }
})

const suggestChip = computed(() => {
  const v = docsProps.state.values['suggest-chip'] ?? {}
  return {
    text: String(v.text ?? '生成演示摘要'),
    disabled: Boolean(v.disabled ?? false),
  }
})

const calendarDemo = computed(() => {
  const v = docsProps.state.values['calendar-theme'] ?? {}
  return {
    theme: (v.theme as 'full' | 'card') ?? 'full',
  }
})

function onSuggest(text: string) {
  lastAction.value = `suggest → ${text}`
}

function onSend(text: string) {
  lastAction.value = `send → ${text}`
}

function onRoleChange(role: string) {
  roleName.value = role
  lastAction.value = `role → ${role}`
}

const dateValue = ref('2026-10-18')
const dateClearable = ref('2026-10-18')
const dateDisabled = ref('2026-10-18')
const monthValue = ref('2026-10')
const dateWithTime = ref('2026-10-18 09:30:00')

const timeValue = ref('09:30')
const timeSteps = ref('09:30')
const timeDisabled = ref('09:30')

const dateRangeValue = ref(['2026-10-01', '2026-10-18'])
const dateRangeClearable = ref(['2026-10-01', '2026-10-18'])
const dateRangeDisabled = ref(['2026-10-01', '2026-10-18'])
const dateRangeWithTime = ref(['2026-10-18 09:00:00', '2026-10-18 18:00:00'])

const timeRangeValue = ref(['09:00', '18:00'])
const timeRangeClearable = ref(['09:00', '18:00'])
const timeRangeDisabled = ref(['09:00', '18:00'])

const calendarFullValue = ref('2026-10-18')
const calendarCardValue = ref('2026-10-18')
const calendarCardRangeValue = ref('2026-10-18')
const calendarMultipleValue = ref(['2026-10-10', '2026-10-12'])

function onDateChange(variant: string, value: unknown) {
  lastAction.value = `date change → ${variant} · ${String(value ?? '')}`
}

function onDateRangeChange(variant: string, value: unknown) {
  lastAction.value = `date range change → ${variant} · ${Array.isArray(value) ? value.join(' ~ ') : String(value ?? '')}`
}

function onTimeChange(variant: string, value: string) {
  lastAction.value = `time change → ${variant} · ${value ?? ''}`
}

function onTimeRangeChange(variant: string, value: unknown) {
  lastAction.value = `time range change → ${variant} · ${Array.isArray(value) ? value.join(' ~ ') : String(value ?? '')}`
}

function onPickerState(variant: string, state: string) {
  lastAction.value = `${variant} → ${state}`
}

function onCalendarCellClick(
  variant: string,
  options: { cell: { formattedDate?: string }; e: MouseEvent },
) {
  const date = options.cell.formattedDate
  if (variant === 'multiple' && date !== undefined) {
    const next = calendarMultipleValue.value.includes(date)
      ? calendarMultipleValue.value.filter((d) => d !== date)
      : [...calendarMultipleValue.value, date]
    calendarMultipleValue.value = next
  }
  lastAction.value = `calendar cell-click → ${variant} · ${date ?? '（无日期）'}`
}

function onCalendarControllerChange(
  variant: string,
  options: { mode: string; isShowWeekend: boolean },
) {
  lastAction.value = `calendar controller-change → ${variant} · mode=${options.mode}`
}

function onCalendarMonthChange(
  variant: string,
  options: { month: string; year: string },
) {
  lastAction.value = `calendar month-change → ${variant} · ${options.year}-${options.month}`
}
</script>

<template>
  <LabPageShell
    title="实验室·输入与胶囊"
    desc="Capsule Field Pill 999 · Field 38 / radius 12 · Input Quiet Chrome（hairline Fade / ring only）· Date / Time / Range Picker · Calendar。Focus Ring Follows Radius · Kill Inner Rect · Suggest Chip Lift / Quiet Active Wash / Icon Leading。"
    :live="lastAction"
  >
    <!-- 0. Live Props Demo -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">0. Live Props Demo</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 clearable / disabled / search / text / theme；画布控件即时反映。
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Capsule Search · clearable / disabled</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('capsule-search') }"
              role="button"
              tabindex="0"
              @click="selectDemo('capsule-search')"
              @keydown.enter="selectDemo('capsule-search')"
              @keydown.space.prevent="selectDemo('capsule-search')"
            >
              <GlassSearchCapsule
                v-model="demoSearchValue"
                :clearable="capsuleSearch.clearable"
                :disabled="capsuleSearch.disabled"
                class="lab-input lab-capsule"
              />
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Field · GlassInput · search / clearable / disabled</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('field-input') }"
              role="button"
              tabindex="0"
              @click="selectDemo('field-input')"
              @keydown.enter="selectDemo('field-input')"
              @keydown.space.prevent="selectDemo('field-input')"
            >
              <GlassInput
                v-model="demoFieldValue"
                :search="fieldInput.search"
                :clearable="fieldInput.clearable"
                :disabled="fieldInput.disabled"
                placeholder="Field 38 / radius 12"
                aria-label="字段示例"
                class="lab-input"
              />
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Suggest Chip · text / disabled</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('suggest-chip') }"
              role="button"
              tabindex="0"
              @click="selectDemo('suggest-chip')"
              @keydown.enter="selectDemo('suggest-chip')"
              @keydown.space.prevent="selectDemo('suggest-chip')"
            >
              <GlassSuggestChip
                :text="suggestChip.text"
                :disabled="suggestChip.disabled"
                @select="onSuggest"
              />
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">GlassCalendar · theme（full / card）</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('calendar-theme') }"
              role="button"
              tabindex="0"
              @click="selectDemo('calendar-theme')"
              @keydown.enter="selectDemo('calendar-theme')"
              @keydown.space.prevent="selectDemo('calendar-theme')"
            >
              <GlassCalendar
                v-model="demoCalendarValue"
                :theme="calendarDemo.theme"
                @cell-click="onCalendarCellClick('live', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Capsule Field -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">1. Capsule Field / Capsule Search</span>
        <span class="lab-section-meta">
          GlassSearchCapsule · Pill 999 / Quiet Chrome · t-input（borderless / prefixIcon / size /
          clearable）· 外层 :focus-within 柔环贴胶囊圆角 · 内芯 Kill Inner Rect
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Living Showcase（可交互 · clearable）</span>
          <div class="lab-control-row-items">
            <GlassSearchCapsule
              v-model="searchKeyword"
              class="lab-input lab-capsule"
              @enter="lastAction = `search enter → ${searchKeyword}`"
              @clear="lastAction = 'search clear'"
              @focus="lastAction = 'search focus'"
              @blur="lastAction = 'search blur'"
            />
            <span class="lab-capsule-value">modelValue = {{ searchKeyword || '（空）' }}</span>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">State · default / hover / focus / disabled</span>
          <div class="lab-control-row-items">
            <GlassSearchCapsule v-model="searchKeyword" class="lab-input lab-capsule" />
            <GlassSearchCapsule v-model="searchKeyword" class="lab-input lab-capsule" />
            <GlassSearchCapsule v-model="searchKeyword" class="lab-input lab-capsule" />
            <GlassSearchCapsule v-model="searchKeyword" disabled class="lab-input lab-capsule" />
          </div>
          <span class="lab-control-note">
            Input Quiet Chrome：rest = inset hairline（--glass-wb-field-hairline）· hover = hairline
            Fade（非 focus，无 lift）· focus = ring only（--glass-wb-field-focus-ring 贴 999 圆角，Focus Ring
            Follows Radius）· disabled = rest hairline + 降强调无环。
            Tab 聚焦观察：内芯不应露出 TDesign 矩形框（Kill Inner Rect）；focus 无亮实线/脏边。
          </span>
        </div>
      </div>
    </section>

    <!-- Field GlassInput -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">2. Field · GlassInput</span>
        <span class="lab-section-meta">
          Field 38 / radius 12（--glass-wb-field-radius）· search 变体仍 Field 圆角 · 同样 Kill Inner Rect +
          外层 focus-within · disabled 降强调无环
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">State · default / hover / focus / disabled</span>
          <div class="lab-control-row-items">
            <GlassInput v-model="fieldText" placeholder="default" aria-label="默认输入" class="lab-input" />
            <GlassInput v-model="fieldText" placeholder="hover 我" aria-label="悬停示例输入" class="lab-input" />
            <GlassInput v-model="fieldText" placeholder="focus 我（Tab）" aria-label="聚焦示例输入" class="lab-input" />
            <GlassInput v-model="fieldText" placeholder="disabled" aria-label="禁用示例输入" disabled class="lab-input" />
          </div>
          <span class="lab-control-note">
            Input Quiet Chrome：rest = inset hairline · hover = hairline Fade（停止
            field-hover-border 实线）· focus = ring only 贴 12 圆角（停止 field-focus-border 亮边）·
            disabled = 降强调无环。内芯无矩形 border / box-shadow。
          </span>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">search 变体（仍 Field 圆角，非 Pill）</span>
          <div class="lab-control-row-items">
            <GlassInput v-model="fieldText" search placeholder="搜索" aria-label="搜索" class="lab-input" />
            <GlassInput v-model="fieldText" search clearable placeholder="搜索 clearable" aria-label="搜索（可清空）" class="lab-input" />
          </div>
        </div>
      </div>
    </section>

    <!-- 裸 t-input 对照 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">3. 裸 t-input 对照（非回归目标）</span>
        <span class="lab-section-meta">
          保留 TDesign 默认矩形 focus（.t-input--focused 的 border + box-shadow 贴 --td-radius-default）·
          用来显 Kill Inner Rect 差异
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">裸 t-input vs GlassInput（同 placeholder 看 focus）</span>
          <div class="lab-control-row-items">
            <t-input v-model="bareText" placeholder="裸 t-input（矩形 focus）" class="lab-input" />
            <GlassInput
              v-model="bareText"
              placeholder="Glass（柔环 + 无内芯框）"
              aria-label="Glass 输入对照"
              class="lab-input"
            />
            <t-input
              v-model="bareText"
              placeholder="裸 t-input borderless"
              borderless
              class="lab-input"
            />
          </div>
          <span class="lab-control-note">
            对照结论：Glass 外层 focus-within 画柔环（Follows Radius）；裸 t-input 在内芯画矩形 ring——差异即 Kill
            Inner Rect 目标。
          </span>
        </div>
      </div>
    </section>

    <!-- Form 内嵌 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">4. Form 内嵌（无双环）</span>
        <span class="lab-section-meta">
          GlassForm + GlassInput · 组件自带 Kill 与 Form 兜底对齐 · 校验仍正确 · focus 只出现一层柔环
        </span>
      </div>
      <div class="lab-form-panel">
        <GlassForm :data="{ name: formName }" label-align="top" :colon="false">
          <t-form-item label="会话名称" name="name">
            <GlassInput
              v-model="formName"
              placeholder="聚焦看：只有一层外环"
              clearable
              class="lab-input"
            />
          </t-form-item>
        </GlassForm>
        <span class="lab-control-note">formName = {{ formName || '（空）' }}</span>
      </div>
    </section>

    <!-- Suggest Chip -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">5. Suggest Chip</span>
        <span class="lab-section-meta">
          GlassSuggestChip · 底层 t-button · 欢迎态建议入口 · Suggest Chip Lift · Quiet Active Wash ·
          Icon Leading（#icon 14–16px）
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Icon Leading + 纯文案对照（可点）</span>
          <div class="lab-control-row-items">
            <GlassSuggestChip
              v-for="item in iconSuggestions"
              :key="`icon-${item.text}`"
              :text="item.text"
              @select="onSuggest"
            >
              <template #icon>
                <component :is="item.icon" size="15" />
              </template>
            </GlassSuggestChip>
            <GlassSuggestChip
              v-for="text in demoSuggestions"
              :key="text"
              :text="text"
              @select="onSuggest"
            />
          </div>
          <span class="lab-control-note">
            前 3 枚挂 Icon Leading（#icon slot，左侧 15px）；后 3 枚纯文案对照（WelcomePanel
            可保持纯文案对齐 jpg）。rest = inset hairline（tonal-hairline）· hover = Suggest Chip Lift
            (-1px) + Color Shift（pill-hover-bg）+ hairline Fade · active = Quiet Active Wash
            （pill-quiet-active-bg / color，深字不反转）+ scale 0.98 · focus-visible = control-focus-ring。
            禁止 pill-hover-border 实线加深 / Primary 幅度 / Press Invert。
          </span>
        </div>
      </div>
    </section>

    <!-- Composer -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">6. Composer Bar</span>
        <span class="lab-section-meta">
          GlassComposer · 底层 t-textarea / GlassDropdown / GlassButton · 角色下拉 + 发送 ·
          Surface → Stage → Composer 单层宿主 · 触发钮 = GlassButton 密度
        </span>
      </div>
      <div class="lab-cat-strip lab-cat-strip--stack lab-composer-catalog">
        <span class="lab-cat-name">Composer Host</span>
        <span class="lab-cat-impl">GlassComposer · Stage nested</span>
        <code class="lab-cat-html">.inrow / .input · .bin · Stage .chat / .bchat</code>
        <span class="lab-cat-rule">
          Do：大容器微透输入条坐在 Stage 内，发送钮属小物件可满浓 ·
          Don't：Composer 外再包一层 Host Tray / 把输入条抬成独立浮卡
        </span>
      </div>
      <div class="lab-frame lab-frame--surface">
        <GlassSurface class="lab-surface">
          <GlassStage>
            <div class="lab-hint">Composer 输入态 · 角色 = {{ roleName }}</div>
            <GlassComposer
              v-model="composerText"
              :role-name="roleName"
              :role-options="composerRoleOptions"
              @send="onSend"
              @update:role="onRoleChange"
            />
          </GlassStage>
        </GlassSurface>
      </div>
    </section>

    <!-- DatePicker -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">7. GlassDatePicker</span>
        <span class="lab-section-meta">
          单日 · clearable · disabled · mode=month 轻示 · 触发器 Quiet Field Chrome ·
          打开面板 = Floating Plate + 选中格 Action Blue（btn-blue）实心蓝底白字
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">default · 单日</span>
          <div class="lab-control-row-items">
            <GlassDatePicker
              v-model="dateValue"
              class="lab-input"
              @change="onDateChange('date', $event)"
              @focus="onPickerState('date', 'focus')"
              @blur="onPickerState('date', 'blur')"
            />
            <span class="lab-control-note">modelValue = {{ dateValue || '（空）' }}</span>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">clearable / disabled / mode=month</span>
          <div class="lab-control-row-items">
            <GlassDatePicker
              v-model="dateClearable"
              clearable
              placeholder="clearable"
              class="lab-input"
              @change="onDateChange('clearable', $event)"
            />
            <GlassDatePicker
              v-model="dateDisabled"
              disabled
              class="lab-input"
              @change="onDateChange('disabled', $event)"
            />
            <GlassDatePicker
              v-model="monthValue"
              mode="month"
              placeholder="月份轻示"
              class="lab-input"
              @change="onDateChange('month', $event)"
            />
          </div>
          <span class="lab-control-note">
            disabled 无 hover 抬升且不可开面板；mode=month 仅透传轻示。
          </span>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">enableTimePicker · 日期 + 时间同窗</span>
          <div class="lab-control-row-items">
            <GlassDatePicker
              v-model="dateWithTime"
              enable-time-picker
              class="lab-input"
              @change="onDateChange('with-time', $event)"
            />
            <span class="lab-control-note">modelValue = {{ dateWithTime || '（空）' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- DateRange / TimeRange -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">8. GlassDateRangePicker / GlassTimeRangePicker</span>
        <span class="lab-section-meta">
          盖 t-date-range-picker / t-time-range-picker · Quiet Field Chrome + Kill Inner Rect ·
          clearable / disabled 轻示 · 端点实心蓝 + 中间带 wash
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">DateRange · default / clearable / disabled</span>
          <div class="lab-control-row-items">
            <GlassDateRangePicker
              v-model="dateRangeValue"
              class="lab-input lab-input--range"
              @change="onDateRangeChange('date-range', $event)"
            />
            <GlassDateRangePicker
              v-model="dateRangeClearable"
              clearable
              class="lab-input lab-input--range"
              @change="onDateRangeChange('date-range-clearable', $event)"
            />
            <GlassDateRangePicker
              v-model="dateRangeDisabled"
              disabled
              class="lab-input lab-input--range"
            />
          </div>
          <span class="lab-control-note">modelValue = {{ dateRangeValue?.join(' ~ ') || '（空）' }}</span>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">DateRange · enableTimePicker（日期 + 时间同窗）</span>
          <div class="lab-control-row-items">
            <GlassDateRangePicker
              v-model="dateRangeWithTime"
              enable-time-picker
              class="lab-input lab-input--range"
              @change="onDateRangeChange('date-range-with-time', $event)"
            />
            <span class="lab-control-note">modelValue = {{ dateRangeWithTime?.join(' ~ ') || '（空）' }}</span>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">TimeRange · default / clearable / disabled</span>
          <div class="lab-control-row-items">
            <GlassTimeRangePicker
              v-model="timeRangeValue"
              class="lab-input lab-input--range"
              @change="onTimeRangeChange('time-range', $event)"
            />
            <GlassTimeRangePicker
              v-model="timeRangeClearable"
              clearable
              class="lab-input lab-input--range"
              @change="onTimeRangeChange('time-range-clearable', $event)"
            />
            <GlassTimeRangePicker
              v-model="timeRangeDisabled"
              disabled
              class="lab-input lab-input--range"
            />
          </div>
          <span class="lab-control-note">modelValue = {{ timeRangeValue?.join(' ~ ') || '（空）' }}</span>
        </div>
      </div>
    </section>

    <!-- TimePicker -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">9. GlassTimePicker</span>
        <span class="lab-section-meta">
          默认 format · steps 粒度 · disabled · 时间列高亮与面板视觉在 theme.css
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">default / steps / disabled</span>
          <div class="lab-control-row-items">
            <GlassTimePicker
              v-model="timeValue"
              class="lab-input"
              @change="onTimeChange('default', $event)"
              @open="onPickerState('time', 'open')"
              @close="onPickerState('time', 'close')"
            />
            <GlassTimePicker
              v-model="timeSteps"
              :steps="[1, 15, 1]"
              class="lab-input"
              @change="onTimeChange('steps', $event)"
            />
            <GlassTimePicker
              v-model="timeDisabled"
              disabled
              class="lab-input"
              @change="onTimeChange('disabled', $event)"
            />
          </div>
          <span class="lab-control-note">
            steps=[1, 15, 1] 演示分钟步长 15；disabled 无 hover 抬升且不可开面板。
          </span>
        </div>
      </div>
    </section>

    <!-- Calendar -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">10. GlassCalendar</span>
        <span class="lab-section-meta">
          盖 t-calendar · theme=full（透明整幅）+ theme=card（玻璃卡片）· 选中日实心 Action Blue 白字 ·
          控制器 Quiet · multiple 经 cell-click 自行维护
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">full · 单日（v-model + month-change / controller-change）</span>
          <div class="lab-control-row-items">
            <GlassCalendar
              v-model="calendarFullValue"
              theme="full"
              @cell-click="onCalendarCellClick('full', $event)"
              @month-change="onCalendarMonthChange('full', $event)"
              @controller-change="onCalendarControllerChange('full', $event)"
            />
          </div>
          <span class="lab-control-note">modelValue = {{ calendarFullValue || '（空）' }}</span>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">card · 单日 / range 限定</span>
          <div class="lab-control-row-items">
            <GlassCalendar
              v-model="calendarCardValue"
              theme="card"
              @cell-click="onCalendarCellClick('card', $event)"
            />
            <GlassCalendar
              v-model="calendarCardRangeValue"
              theme="card"
              :range="['2026-10-01', '2026-10-18']"
              @cell-click="onCalendarCellClick('card-range', $event)"
            />
          </div>
          <span class="lab-control-note">
            card = {{ calendarCardValue || '（空）' }} · card-range = {{ calendarCardRangeValue || '（空）' }}
          </span>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">card · multiple（受控 value + cell-click 维护列表）</span>
          <div class="lab-control-row-items">
            <GlassCalendar
              :value="calendarMultipleValue"
              multiple
              theme="card"
              @cell-click="onCalendarCellClick('multiple', $event)"
            />
          </div>
          <span class="lab-control-note">value = {{ calendarMultipleValue.join('、') || '（空）' }}</span>
        </div>
      </div>
    </section>

    <!-- Popup Living -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">11. Popup Living（面板微透吃底）</span>
        <span class="lab-section-meta">
          宿主 GlassSurface：触发器 Quiet Field Chrome；打开面板 = Floating Plate，
          选中格 Action Blue 实心蓝底白字
        </span>
      </div>
      <div class="lab-frame lab-frame--surface">
        <GlassSurface class="lab-surface">
          <div class="lab-soft-stage" style="flex: 1">
            <span class="lab-table-caption">打开日期 / 时间面板观察浮动板材质</span>
            <div class="lab-control-row-items">
              <GlassDatePicker
                v-model="dateValue"
                class="lab-input"
                @change="onDateChange('living-date', $event)"
              />
              <GlassTimePicker
                v-model="timeValue"
                class="lab-input"
                @change="onTimeChange('living-time', $event)"
              />
            </div>
            <div class="lab-control-row-items">
              <GlassDateRangePicker
                v-model="dateRangeValue"
                class="lab-input lab-input--range"
                @change="onDateRangeChange('living-range', $event)"
              />
              <GlassDatePicker
                v-model="dateWithTime"
                enable-time-picker
                class="lab-input"
                @change="onDateChange('living-with-time', $event)"
              />
            </div>
          </div>
        </GlassSurface>
      </div>
    </section>

    <!-- Raw contrast -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">12. 对照 · 裸 t-date-picker / t-time-picker（非导出面）</span>
        <span class="lab-section-meta">仅用于对照，不进入 components/glass 导出；演示 v-model 透传一致</span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">t-date-picker / t-time-picker 默认外观</span>
          <div class="lab-control-row-items">
            <t-date-picker v-model="dateValue" class="lab-input" />
            <t-time-picker v-model="timeValue" class="lab-input" />
          </div>
        </div>
      </div>
    </section>
  </LabPageShell>
</template>

<style scoped>
/* Composer 宿主对照：短 catalog 行，只承载 Do / Don't 与选择器语义 */
.lab-cat-strip {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  padding: 12px 14px;
  border-radius: var(--glass-wb-card-radius);
  border: 1px solid var(--glass-border-soft);
  background: var(--glass-panel-bg);
  font-size: 12px;
  line-height: 1.55;
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
</style>
