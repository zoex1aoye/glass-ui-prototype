<script setup lang="ts">
/**
 * GlassCalendar — Compound Wrapper 盖 t-calendar
 *
 * UX 术语（源自 Glass Calendar Track T1）：
 * - full = 整幅日历：透明外壳（由宿主 Surface / Stage 承载材质），Quiet 分割线，
 *   选中日实心 Action Blue（--glass-wb-btn-blue）白字；
 * - card = 独立玻璃卡片：Floating Plate 近白微透 + soft shadow + hairline（禁 Host Tray / 双托盘）。
 *
 * 映射：
 *   theme=full / card → 透传 TD theme + 外壳挂 glass-calendar--{full|card}
 *
 * 本组件只负责挂 class 钩子与透传契约；视觉数值全部在 styles/theme.css 收口。
 * 组件内禁止魔法 hex/rgba。
 *
 * 透传最小集：theme / mode / value（受控）/ modelValue（v-model）/ defaultValue（非受控）
 * / controllerConfig / firstDayOfWeek / isShowWeekendDefault / fillWithZero / range /
 * multiple / year / month / format / week；其余 attrs（head / cell / cellAppend /
 * preventCellContextmenu 等）与 slot（head / week / cell / cellAppend）原样透传。
 * 事件：cell-click / cell-double-click / cell-right-click / controller-change /
 * month-change（与 TD 同名）；update:modelValue 仅单日（非 multiple）且 modelValue 态。
 *
 * 注意：TD Calendar 无 update:value 原生事件，点选仅改内部态；本 wrapper 在单日
 * 模式下以 cell-click 的 cell.formattedDate 回写 update:modelValue，实现 v-model。
 * multiple 模式无法从 TD 取得完整列表，v-model 不承诺回写（以 cell-click 自行处理）。
 */
import { computed, useAttrs } from 'vue'

import type {
  CalendarCell,
  CalendarValue,
  ControllerOptions,
  TdCalendarProps,
} from 'tdesign-vue-next'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** full | card（缺省由 TD 取 full） */
    theme?: TdCalendarProps['theme']
    mode?: TdCalendarProps['mode']
    /** 受控 value（与 modelValue 互斥，优先级高于 modelValue） */
    value?: TdCalendarProps['value']
    /** v-model 双向绑定 */
    modelValue?: TdCalendarProps['value']
    /** 非受控初始值 */
    defaultValue?: TdCalendarProps['value']
    controllerConfig?: TdCalendarProps['controllerConfig']
    firstDayOfWeek?: TdCalendarProps['firstDayOfWeek']
    isShowWeekendDefault?: TdCalendarProps['isShowWeekendDefault']
    fillWithZero?: TdCalendarProps['fillWithZero']
    range?: TdCalendarProps['range']
    multiple?: TdCalendarProps['multiple']
    year?: TdCalendarProps['year']
    month?: TdCalendarProps['month']
    format?: TdCalendarProps['format']
    week?: TdCalendarProps['week']
  }>(),
  {
    theme: undefined,
    mode: undefined,
    value: undefined,
    modelValue: undefined,
    defaultValue: undefined,
    controllerConfig: undefined,
    firstDayOfWeek: undefined,
    isShowWeekendDefault: undefined,
    fillWithZero: undefined,
    range: undefined,
    multiple: undefined,
    year: undefined,
    month: undefined,
    format: undefined,
    week: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: CalendarValue]
  'cell-click': [options: { cell: CalendarCell; e: MouseEvent }]
  'cell-double-click': [options: { cell: CalendarCell; e: MouseEvent }]
  'cell-right-click': [options: { cell: CalendarCell; e: MouseEvent }]
  'controller-change': [options: ControllerOptions]
  'month-change': [options: { month: string; year: string }]
}>()

const attrs = useAttrs()

/** class / style 落在外壳；其余 attrs（含未声明 props / listeners）透传 t-calendar */
const shellClass = computed(() => attrs.class)
const shellStyle = computed(() => attrs.style)
const calendarAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const resolvedTheme = computed<TdCalendarProps['theme']>(() => props.theme ?? 'full')
const themeClass = computed(() => `glass-calendar--${resolvedTheme.value}`)

/** 受控 value > v-model（modelValue）> defaultValue；只绑一种。
 *  TD Calendar 仅暴露 value（无 defaultValue / modelValue），故三者统一映射到 value。 */
const valueBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.value !== undefined) {
    bind.value = props.value
  } else if (props.modelValue !== undefined) {
    bind.value = props.modelValue
  } else if (props.defaultValue !== undefined) {
    bind.value = props.defaultValue
  }
  return bind
})

/** 可选 props 仅显式传入时绑定，避免 undefined 冲掉 TDesign 默认值 */
const optionalBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.theme !== undefined) bind.theme = props.theme
  if (props.mode !== undefined) bind.mode = props.mode
  if (props.controllerConfig !== undefined) bind.controllerConfig = props.controllerConfig
  if (props.firstDayOfWeek !== undefined) bind.firstDayOfWeek = props.firstDayOfWeek
  if (props.isShowWeekendDefault !== undefined) bind.isShowWeekendDefault = props.isShowWeekendDefault
  if (props.fillWithZero !== undefined) bind.fillWithZero = props.fillWithZero
  if (props.range !== undefined) bind.range = props.range
  if (props.multiple !== undefined) bind.multiple = props.multiple
  if (props.year !== undefined) bind.year = props.year
  if (props.month !== undefined) bind.month = props.month
  if (props.format !== undefined) bind.format = props.format
  if (props.week !== undefined) bind.week = props.week
  return bind
})

/** 合并到单一 v-bind（Vue 单元素不允许同名 v-bind 指令重复出现） */
const calendarBind = computed<Record<string, unknown>>(() => ({
  ...valueBind.value,
  ...optionalBind.value,
  ...calendarAttrs.value,
}))

function onCellClick(options: { cell: CalendarCell; e: MouseEvent }) {
  // 单日（非 multiple）且 v-model 态：以点选日 formattedDate 回写，支撑 v-model。
  if (props.value === undefined && props.modelValue !== undefined && !props.multiple) {
    const next = options.cell.formattedDate
    if (next !== undefined) emit('update:modelValue', next)
  }
  emit('cell-click', options)
}

function onCellDoubleClick(options: { cell: CalendarCell; e: MouseEvent }) {
  emit('cell-double-click', options)
}

function onCellRightClick(options: { cell: CalendarCell; e: MouseEvent }) {
  emit('cell-right-click', options)
}

function onControllerChange(options: ControllerOptions) {
  emit('controller-change', options)
}

function onMonthChange(options: { month: string; year: string }) {
  emit('month-change', options)
}
</script>

<template>
  <div
    class="glass-calendar"
    :class="[themeClass, shellClass]"
    :style="shellStyle"
  >
    <t-calendar
      class="glass-calendar__core"
      v-bind="calendarBind"
      @cell-click="onCellClick"
      @cell-double-click="onCellDoubleClick"
      @cell-right-click="onCellRightClick"
      @controller-change="onControllerChange"
      @month-change="onMonthChange"
    >
      <!-- 原样转发 head / week / cell / cellAppend 等具名/作用域 slot -->
      <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
        <slot :name="name" v-bind="scope ?? {}" />
      </template>
    </t-calendar>
  </div>
</template>

<style scoped>
/* Compound Wrapper：只保留结构钩子，零视觉 CSS。
   视觉一律由 theme.css 的 .glass-calendar* 选择器收口（Track T1）。 */
.glass-calendar__core {
  display: block;
}
</style>
