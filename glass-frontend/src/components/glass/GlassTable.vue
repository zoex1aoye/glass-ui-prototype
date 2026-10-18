<script setup lang="ts">
/**
 * GlassTable — Data Grid / Glass Table（Compound Wrapper 盖 t-table Primary）
 * Container Catalog：html 选择器 tray=`.big` 语义复用；inset=Stage 内嵌（禁双托盘）。
 *
 * UI/UX 术语：
 * - Data Grid / Glass Table：内容区表格，坐在 Stage / Surface 内，禁止另造「实白 Excel 卡」
 * - Quiet Grid：细水平分割线、低对比表头；默认无粗外框、无强斑马
 * - t1 Host Tray：外壳微透近白托盘 + backdrop blur + 柔影（html .big）
 * - Header Band / Workbench Left Nav / Frost Rail：标题行一体条带（html .hero-ico 磨砂冰蓝平铺）
 * - Stage Nested Chrome / Inset Plate：Stage 内嵌扁板（近白微 wash、blur/shadow none）
 * - t3 Quiet Ribbon：水平细分割 + pagination Quiet Chrome（无竖线）
 * - t4 Near-White：行体近白透明吃外壳；空态 muted（html .bchat）
 * - Row Density：行高对齐 Capsule / Form 垂直节奏（偏紧凑；t-table size="small"）
 * - Hover Whisper / Selected Whisper：行悬停轻提亮 / 选中极淡紫，对齐会话 list（软、不砸）
 * - Compound Wrapper：外壳材质由本 wrapper 承担，t-table 仅作内芯
 *
 * variant（外壳语义，Lab / 业务页按宿主选择）：
 * - "tray"（默认）：t1 Host Tray — html `.big` 语义复用 · Lab 独立橱窗 / 无 Stage 宿主
 * - "inset"：Stage Nested Chrome — html Stage 内嵌 · 吃 Stage blur、无 lift 影 · 禁托盘套托盘
 *
 * 默认 props 与理由（Quiet Grid 设计决策）：
 * - size="small"          // Row Density：紧凑，对齐 Capsule 33 / Field 38
 * - bordered={false}      // Quiet Grid：无粗框无竖线
 * - stripe={false}        // 默认无强斑马；jpg 未要求
 * - hover={true}          // Hover Whisper
 * - showHeader={true}     // Header Band 需要表头
 * - verticalAlign="middle"
 * 何时覆盖：stripe=true（极长只读清单且调用方明确需要轻微斑马）；
 * bordered=true（禁止默认；仅必须与外部实线网格对齐时）；
 * size="medium"（宽松 dashboard，本库默认不用）。
 *
 * TDesign（vue-next Enhanced Table = Primary Table 超集）：
 * selectedRowKeys / rowSelectionType / selectOnRowClick；
 * pagination 走 pagination prop（内嵌 t-pagination）。
 * 列配置：columnController / columnControllerVisible / displayColumns 原样透传；
 * display-columns-change / column-change / column-controller-visible-change 回传 TD 官方类型。
 * Table 事件：sort-change / filter-change / change / row-edit / row-validate 使用 TD 官方类型原样透传。
 * 可编辑列：columns[].edit 原样交给 t-table；editableCellState / editableRowKeys 控制可编辑范围。
 * 展开行：expandedRowKeys / defaultExpandedRowKeys / expandIcon / expandOnRowClick /
 * expandedRow；expand-change 回传 TD 官方 ExpandOptions。
 * 树形：tree / treeExpandAndFoldIcon / expandedTreeNodes / defaultExpandedTreeNodes；
 * expanded-tree-nodes-change / tree-expand-change 回传 TD 官方类型。
 * 拖拽排序：dragSort / dragSortOptions 原样透传；树形模式额外透传 beforeDragSort；
 * drag-sort 回传 TD 官方 DragSortContext（行 / 列均可用），abnormal-drag-sort
 * 回传树形拖拽失败原因。排序数据由调用方消费 newData 后回写。
 * 展开行与树形图标由 Glass 统一收成 Quiet Grid 触发区，调用方仍可用 prop / slot 覆盖。
 */
import { computed, ref, useAttrs, useSlots } from 'vue'
import { EnhancedTable, PrimaryTable } from 'tdesign-vue-next'
import { ChevronRightIcon } from 'tdesign-icons-vue-next'

import type {
  CheckboxGroupValue,
  ClassName,
  DragSortContext,
  EditableCellType,
  ExpandOptions,
  FilterValue,
  PageInfo,
  PaginationProps,
  PrimaryTableCellEventContext,
  PrimaryTableRowEditContext,
  PrimaryTableRowValidateContext,
  PrimaryTableCol,
  PrimaryTableColumnChange,
  RowEventContext,
  SelectOptions,
  SortOptions,
  TableChangeContext,
  TableChangeData,
  TableAbnormalDragSortContext,
  TableColumnController,
  TableFilterChangeContext,
  TableRowData,
  TableSort,
  TableTreeConfig,
  TableTreeExpandChangeContext,
  TableTreeNodeExpandOptions,
  TdEnhancedTableProps,
  TdPrimaryTableProps,
} from 'tdesign-vue-next'

type GlassTableRow = TableRowData

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    data: GlassTableRow[]
    columns: PrimaryTableCol<GlassTableRow>[]
    rowKey: string
    /** Row Density */
    size?: 'small' | 'medium' | 'large'
    /** 外壳语义：tray=t1 Host Tray（默认）；inset=Stage Nested Chrome 嵌板 */
    variant?: 'tray' | 'inset'
    /** Quiet Grid：默认无粗框无竖线 */
    bordered?: boolean
    /** 默认无强斑马 */
    stripe?: boolean
    /** Hover Whisper */
    hover?: boolean
    showHeader?: boolean
    loading?: boolean
    empty?: string
    cellEmptyContent?: string
    pagination?: PaginationProps
    selectedRowKeys?: Array<string | number>
    defaultSelectedRowKeys?: Array<string | number>
    rowSelectionType?: 'single' | 'multiple'
    selectOnRowClick?: boolean
    rowClassName?: ClassName | ((params: { row: GlassTableRow; rowIndex: number }) => ClassName)
    maxHeight?: string | number
    tableLayout?: 'auto' | 'fixed'
    verticalAlign?: 'top' | 'middle' | 'bottom'
    editableCellState?: EditableCellType<GlassTableRow>
    editableRowKeys?: Array<string | number>
    /** 列配置：TDesign Primary Table 官方 columnController */
    columnController?: TableColumnController
    /** 受控显隐；undefined 时交给 TD 内部 DialogPlugin 自管 */
    columnControllerVisible?: boolean
    defaultColumnControllerVisible?: boolean
    /** 受控显示列；undefined 时由 TD 默认全列 */
    displayColumns?: CheckboxGroupValue
    defaultDisplayColumns?: CheckboxGroupValue
    /** 展开行：受控 / 非受控展开键 */
    expandedRowKeys?: Array<string | number>
    defaultExpandedRowKeys?: Array<string | number>
    /** 展开图标：false 隐藏；TNode 可完全替换（Glass 默认 Quiet 箭头） */
    expandIcon?: TdPrimaryTableProps<GlassTableRow>['expandIcon']
    /** 整行点击切换展开 */
    expandOnRowClick?: boolean
    /** 展开行内容；也可用 #expandedRow 插槽 */
    expandedRow?: TdPrimaryTableProps<GlassTableRow>['expandedRow']
    /** 树形表配置：childrenKey / treeNodeColumnIndex / indent / defaultExpandAll … */
    tree?: TableTreeConfig
    /** 树形展开/收起图标；也可用 #treeExpandAndFoldIcon 插槽 */
    treeExpandAndFoldIcon?: TdEnhancedTableProps<GlassTableRow>['treeExpandAndFoldIcon']
    /** 树形受控 / 非受控展开节点 */
    expandedTreeNodes?: Array<string | number>
    defaultExpandedTreeNodes?: Array<string | number>
    /** 拖拽排序：row / row-handler / col / row-handler-col / drag-col */
    dragSort?: TdPrimaryTableProps<GlassTableRow>['dragSort']
    /** SortableJS 官方选项，原样交给 t-table */
    dragSortOptions?: TdPrimaryTableProps<GlassTableRow>['dragSortOptions']
    /** 树形拖拽前置校验；返回 false 时 TD 放弃本次排序 */
    beforeDragSort?: TdEnhancedTableProps<GlassTableRow>['beforeDragSort']
  }>(),
  {
    size: 'small',
    variant: 'tray',
    bordered: false,
    stripe: false,
    hover: true,
    showHeader: true,
    loading: false,
    empty: '暂无数据',
    cellEmptyContent: undefined,
    pagination: undefined,
    selectedRowKeys: undefined,
    defaultSelectedRowKeys: undefined,
    rowSelectionType: undefined,
    selectOnRowClick: undefined,
    rowClassName: undefined,
    maxHeight: undefined,
    tableLayout: 'fixed',
    verticalAlign: 'middle',
    editableCellState: undefined,
    editableRowKeys: undefined,
    columnController: undefined,
    columnControllerVisible: undefined,
    defaultColumnControllerVisible: undefined,
    displayColumns: undefined,
    defaultDisplayColumns: undefined,
    expandedRowKeys: undefined,
    defaultExpandedRowKeys: undefined,
    expandIcon: undefined,
    expandOnRowClick: undefined,
    expandedRow: undefined,
    tree: undefined,
    treeExpandAndFoldIcon: undefined,
    expandedTreeNodes: undefined,
    defaultExpandedTreeNodes: undefined,
    dragSort: undefined,
    dragSortOptions: undefined,
    beforeDragSort: undefined,
  },
)

const emit = defineEmits<{
  'select-change': [selectedRowKeys: Array<string | number>, options: SelectOptions<GlassTableRow>]
  'row-click': [context: RowEventContext<GlassTableRow>]
  'page-change': [pageInfo: PageInfo, newDataSource: Array<GlassTableRow>]
  'cell-click': [context: PrimaryTableCellEventContext<GlassTableRow>]
  'sort-change': [sort: TableSort, options: SortOptions<GlassTableRow>]
  'filter-change': [filterValue: FilterValue, context: TableFilterChangeContext<GlassTableRow>]
  'row-edit': [context: PrimaryTableRowEditContext<GlassTableRow>]
  'row-validate': [context: PrimaryTableRowValidateContext<GlassTableRow>]
  'column-controller-visible-change': [
    visible: boolean,
    context: { trigger: 'cancel' | 'confirm' | 'open' },
  ]
  'display-columns-change': [value: CheckboxGroupValue]
  'column-change': [context: PrimaryTableColumnChange<GlassTableRow>]
  'update:columnControllerVisible': [visible: boolean]
  'expand-change': [expandedRowKeys: Array<string | number>, options: ExpandOptions<GlassTableRow>]
  'expanded-tree-nodes-change': [
    expandedTreeNodes: Array<string | number>,
    options: TableTreeNodeExpandOptions<GlassTableRow>,
  ]
  'tree-expand-change': [context: TableTreeExpandChangeContext<GlassTableRow>]
  'drag-sort': [context: DragSortContext<GlassTableRow>]
  'abnormal-drag-sort': [context: TableAbnormalDragSortContext<GlassTableRow>]
  change: [data: TableChangeData, context: TableChangeContext<GlassTableRow>]
}>()

const attrs = useAttrs()
const slots = useSlots()

/**
 * TD EnhancedTable 的行拖拽会经树形 swapData 处理；无 tree 时 treeDataMap
 * 没有行状态，会抛 `level` 错误。因此非树表走 PrimaryTable，树表才走 EnhancedTable。
 */
const hasTree = computed(() => Boolean(props.tree && Object.keys(props.tree).length))
const tableComponent = computed(() => (hasTree.value ? EnhancedTable : PrimaryTable))

const expandIconSlotName = computed(() =>
  slots.expandIcon ? 'expandIcon' : slots['expand-icon'] ? 'expand-icon' : 'expandIcon',
)
const hasExpandIconSlot = computed(() =>
  Boolean(slots.expandIcon || slots['expand-icon']),
)
const treeIconSlotName = computed(() =>
  slots.treeExpandAndFoldIcon
    ? 'treeExpandAndFoldIcon'
    : slots['tree-expand-and-fold-icon']
      ? 'tree-expand-and-fold-icon'
      : 'treeExpandAndFoldIcon',
)
const hasTreeIconSlot = computed(() =>
  Boolean(slots.treeExpandAndFoldIcon || slots['tree-expand-and-fold-icon']),
)

/** 非受控展开行的本地镜像：仅用于默认图标的 aria-expanded，不反向控制 TD */
const innerExpandedRowKeys = ref<Array<string | number>>([
  ...(props.defaultExpandedRowKeys ?? []),
])

const effectiveExpandedRowKeys = computed(() =>
  props.expandedRowKeys === undefined ? innerExpandedRowKeys.value : props.expandedRowKeys,
)

const forwardedSlotNames = computed(() =>
  Object.keys(slots).filter(
    (name) =>
      ![
        'expandIcon',
        'expand-icon',
        'treeExpandAndFoldIcon',
        'tree-expand-and-fold-icon',
      ].includes(name),
  ),
)

function isExpandedRow(row: GlassTableRow): boolean {
  return effectiveExpandedRowKeys.value.includes(row[props.rowKey])
}

/** TDesign 无分页时仍会挂空 pagination-wrap；仅在显式传入时绑定分页 prop */
const paginationBind = computed<Record<string, unknown>>(() =>
  props.pagination === undefined ? {} : { pagination: props.pagination },
)

/**
 * TD 列配置面板由 DialogPlugin teleport 到 body。这里统一注入稳定类名，
 * 让 GlassTable 自带的 Quiet Chrome 能命中面板，同时保留调用方 dialogClassName。
 */
const columnControllerBind = computed<Record<string, unknown>>(() => {
  const controller = props.columnController
  if (!controller) return {}

  return {
    columnController: {
      ...controller,
      dialogProps: {
        ...controller.dialogProps,
        dialogClassName: [
          'glass-table-column-controller',
          controller.dialogProps?.dialogClassName,
        ]
          .filter(Boolean)
          .join(' '),
      },
    },
  }
})

/**
 * TDesign useDefaultValue 以 vnode.props 是否出现该键判断受控。
 * 显式绑定 undefined 会被误判为受控，defaultExpandedRowKeys / defaultExpandedTreeNodes
 * 因而失效（展开图标读取 undefined.includes）。仅在调用方真正传值时绑定。
 */
const expandBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.expandedRowKeys !== undefined) bind.expandedRowKeys = props.expandedRowKeys
  if (props.defaultExpandedRowKeys !== undefined) {
    bind.defaultExpandedRowKeys = props.defaultExpandedRowKeys
  }
  if (props.expandIcon !== undefined) bind.expandIcon = props.expandIcon
  if (props.expandOnRowClick !== undefined) bind.expandOnRowClick = props.expandOnRowClick
  if (props.expandedRow !== undefined) bind.expandedRow = props.expandedRow
  return bind
})

const treeBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (!hasTree.value) return bind
  if (props.tree !== undefined) bind.tree = props.tree
  if (props.treeExpandAndFoldIcon !== undefined) {
    bind.treeExpandAndFoldIcon = props.treeExpandAndFoldIcon
  }
  if (props.expandedTreeNodes !== undefined) bind.expandedTreeNodes = props.expandedTreeNodes
  if (props.defaultExpandedTreeNodes !== undefined) {
    bind.defaultExpandedTreeNodes = props.defaultExpandedTreeNodes
  }
  bind.onExpandedTreeNodesChange = onExpandedTreeNodesChange
  bind.onTreeExpandChange = onTreeExpandChange
  bind.onAbnormalDragSort = onAbnormalDragSort
  return bind
})

const dragBind = computed<Record<string, unknown>>(() => {
  const bind: Record<string, unknown> = {}
  if (props.dragSort !== undefined) bind.dragSort = props.dragSort
  if (props.dragSortOptions !== undefined) bind.dragSortOptions = props.dragSortOptions
  /* beforeDragSort 由 EnhancedTable 在树形同级校验前调用；PrimaryTable 无此入口。 */
  if (props.beforeDragSort !== undefined && hasTree.value) {
    bind.beforeDragSort = props.beforeDragSort
  }
  return bind
})

const optionalTableBind = computed<Record<string, unknown>>(() => ({
  ...paginationBind.value,
  ...columnControllerBind.value,
  ...expandBind.value,
  ...treeBind.value,
  ...dragBind.value,
}))

function onSelectChange(selectedRowKeys: Array<string | number>, options: SelectOptions<GlassTableRow>) {
  emit('select-change', selectedRowKeys, options)
}

function onRowClick(context: RowEventContext<GlassTableRow>) {
  emit('row-click', context)
}

function onPageChange(pageInfo: PageInfo, newDataSource: Array<GlassTableRow>) {
  emit('page-change', pageInfo, newDataSource)
}

function onCellClick(context: PrimaryTableCellEventContext<GlassTableRow>) {
  emit('cell-click', context)
}

function onSortChange(sort: TableSort, options: SortOptions<GlassTableRow>) {
  emit('sort-change', sort, options)
}

function onFilterChange(
  filterValue: FilterValue,
  context: TableFilterChangeContext<GlassTableRow>,
) {
  emit('filter-change', filterValue, context)
}

function onRowEdit(context: PrimaryTableRowEditContext<GlassTableRow>) {
  emit('row-edit', context)
}

function onRowValidate(context: PrimaryTableRowValidateContext<GlassTableRow>) {
  emit('row-validate', context)
}

function onColumnControllerVisibleChange(
  visible: boolean,
  context: { trigger: 'cancel' | 'confirm' | 'open' },
) {
  emit('column-controller-visible-change', visible, context)
}

function onDisplayColumnsChange(value: CheckboxGroupValue) {
  emit('display-columns-change', value)
}

function onColumnChange(context: PrimaryTableColumnChange<GlassTableRow>) {
  emit('column-change', context)
}

function onUpdateColumnControllerVisible(visible: boolean) {
  emit('update:columnControllerVisible', visible)
}

function onExpandChange(
  expandedRowKeys: Array<string | number>,
  options: ExpandOptions<GlassTableRow>,
) {
  if (props.expandedRowKeys === undefined) innerExpandedRowKeys.value = expandedRowKeys
  emit('expand-change', expandedRowKeys, options)
}

function onExpandedTreeNodesChange(
  expandedTreeNodes: Array<string | number>,
  options: TableTreeNodeExpandOptions<GlassTableRow>,
) {
  emit('expanded-tree-nodes-change', expandedTreeNodes, options)
}

function onTreeExpandChange(context: TableTreeExpandChangeContext<GlassTableRow>) {
  emit('tree-expand-change', context)
}

function onDragSort(context: DragSortContext<GlassTableRow>) {
  emit('drag-sort', context)
}

function onAbnormalDragSort(context: TableAbnormalDragSortContext<GlassTableRow>) {
  emit('abnormal-drag-sort', context)
}

function onTableChange(data: TableChangeData, context: TableChangeContext<GlassTableRow>) {
  emit('change', data, context)
}
</script>

<template>
  <div
    class="glass-table"
    :class="`glass-table--${variant}`"
    :data-variant="variant"
    v-bind="attrs"
  >
    <component
      :is="tableComponent"
      class="glass-table__core"
      :data="data"
      :columns="columns"
      :row-key="rowKey"
      :size="size"
      :bordered="bordered"
      :stripe="stripe"
      :hover="hover"
      :show-header="showHeader"
      :loading="loading"
      :empty="empty"
      :cell-empty-content="cellEmptyContent"
      v-bind="optionalTableBind"
      :selected-row-keys="selectedRowKeys"
      :default-selected-row-keys="defaultSelectedRowKeys"
      :row-selection-type="rowSelectionType"
      :select-on-row-click="selectOnRowClick"
      :row-class-name="rowClassName"
      :max-height="maxHeight"
      :table-layout="tableLayout"
      :vertical-align="verticalAlign"
      :editable-cell-state="editableCellState"
      :editable-row-keys="editableRowKeys"
      :column-controller-visible="columnControllerVisible"
      :default-column-controller-visible="defaultColumnControllerVisible"
      :display-columns="displayColumns"
      :default-display-columns="defaultDisplayColumns"
      @select-change="onSelectChange"
      @row-click="onRowClick"
      @page-change="onPageChange"
      @cell-click="onCellClick"
      @sort-change="onSortChange"
      @filter-change="onFilterChange"
      @row-edit="onRowEdit"
      @row-validate="onRowValidate"
      @column-controller-visible-change="onColumnControllerVisibleChange"
      @display-columns-change="onDisplayColumnsChange"
      @column-change="onColumnChange"
      @update:column-controller-visible="onUpdateColumnControllerVisible"
      @expand-change="onExpandChange"
      @drag-sort="onDragSort"
      @change="onTableChange"
    >
      <template v-for="name in forwardedSlotNames" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
      <template v-if="hasExpandIconSlot" #expandIcon="slotData">
        <slot :name="expandIconSlotName" v-bind="slotData ?? {}" />
      </template>
      <template v-else #expandIcon="{ row }">
        <button
          type="button"
          class="glass-table__expand-trigger"
          :aria-label="isExpandedRow(row) ? '收起行' : '展开行'"
          :aria-expanded="isExpandedRow(row)"
        >
          <ChevronRightIcon aria-hidden="true" />
        </button>
      </template>
      <template v-if="hasTreeIconSlot" #treeExpandAndFoldIcon="slotData">
        <slot :name="treeIconSlotName" v-bind="slotData ?? {}" />
      </template>
      <template v-else #treeExpandAndFoldIcon="{ type }">
        <button
          type="button"
          class="glass-table__tree-trigger"
          :class="{ 'is-expanded': type === 'fold' }"
          :aria-label="type === 'fold' ? '收起子级' : '展开子级'"
          :aria-expanded="type === 'fold'"
        >
          <ChevronRightIcon aria-hidden="true" />
        </button>
      </template>
    </component>
  </div>
</template>

<style scoped>
/* Compound Wrapper 外壳 token 槽：tray / inset 只换 local，内层圆角等只认 --table-shell-* */
.glass-table {
  --table-shell-fill: var(--glass-wb-table-fill);
  --table-shell-blur: var(--glass-wb-table-blur);
  --table-shell-hairline: var(--glass-wb-table-hairline);
  --table-shell-shadow: var(--glass-wb-table-shadow);
  --table-shell-radius: var(--glass-wb-table-radius);
  --table-expand-transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;

  /* t1 Host Tray / Quiet Grid：近白微透托盘 + backdrop blur + 柔影
     禁实白 Excel 卡、重阴影、脏方框（1px 硬描边） */
  background: var(--table-shell-fill);
  -webkit-backdrop-filter: var(--table-shell-blur);
  backdrop-filter: var(--table-shell-blur);
  border-radius: var(--table-shell-radius);
  /* 圆角仍由外壳裁切；横向溢出交给滚动，禁止把右侧列 hidden 掉 */
  overflow-x: auto;
  overflow-y: hidden;
  min-width: 0;
  max-width: 100%;
  overscroll-behavior-x: contain;
  /* Quiet 轮廓：inset hairline，非实线 border */
  box-shadow: var(--table-shell-hairline), var(--table-shell-shadow);
}

/* Stage Nested Chrome / Inset Plate（variant="inset"）
   Stage 已是玻璃焦点面：更扁嵌板，禁托盘套托盘（二次 blur / lift 影）
   --glass-wb-table-inset-shadow 为 none，不能进 shadow 列表，故 inset 只挂 hairline */
.glass-table--inset {
  --table-shell-fill: var(--glass-wb-table-inset-fill);
  --table-shell-blur: var(--glass-wb-table-inset-blur);
  --table-shell-hairline: var(--glass-wb-table-inset-hairline);
  --table-shell-shadow: var(--glass-wb-table-inset-shadow);
  --table-shell-radius: var(--glass-wb-table-inset-radius);
  box-shadow: var(--table-shell-hairline);
}

.glass-table__core {
  background: transparent;
}

/* 列配置触发钮 · Quiet Pill：与 Quiet Grid 同层，不抢表头 */
.glass-table__core :deep(.t-table__top-content:has(.t-table__column-controller-trigger)) {
  padding: 8px 10px 0;
}

.glass-table__core :deep(.t-table__column-controller-trigger) {
  padding: 0;
}

.glass-table__core :deep(.t-table__column-controller-trigger .t-button) {
  height: 30px;
  padding: 0 12px;
  border: none;
  border-radius: var(--glass-wb-pill-radius);
  background: var(--glass-wb-pill-quiet-bg);
  color: var(--glass-wb-pill-quiet-color);
  box-shadow: var(--glass-wb-tonal-hairline);
  transition: var(--glass-wb-control-transition);
}

.glass-table__core :deep(.t-table__column-controller-trigger .t-button:hover) {
  background: var(--glass-wb-pill-quiet-hover-bg);
  color: var(--glass-wb-pill-quiet-color);
  box-shadow: var(--glass-wb-tonal-hairline-hover);
}

.glass-table__core :deep(.t-table__column-controller-trigger .t-button:active) {
  transform: scale(var(--glass-wb-control-active-scale));
  box-shadow: var(--glass-wb-tonal-hairline-active);
}

.glass-table__core :deep(.t-table__column-controller-trigger .t-button:focus-visible) {
  box-shadow: var(--glass-wb-control-focus-ring);
}

/* Quiet Grid：去掉竖边框；tbody td 仅水平 soft 分割 */
.glass-table__core :deep(.t-table) {
  background: transparent;
}

/* Header Band / Workbench Left Nav / Frost Rail：整条标题行只画一次磨砂冰蓝平铺（html .hero-ico）
   fill 只挂 thead（TDesign 即 .t-table__header）整行层；tr / th 透明，
   禁止 per-th 径向/独立 fill（会碎成霜面瓷砖），禁止 thead+tr 叠画半透明 fill。
   blur 照搬 .hero-ico；禁止全量 --shadow-soft / --shadow-lift（嵌 tray/inset 会二次抬层）。 */
.glass-table__core :deep(thead.t-table__header) {
  background: var(--glass-wb-table-header-fill);
  -webkit-backdrop-filter: blur(26px) saturate(1.2);
  backdrop-filter: blur(26px) saturate(1.2);
  /* 带两端圆角（外壳 overflow:hidden 亦会裁切顶角） */
  border-radius: var(--table-shell-radius) var(--table-shell-radius) 0 0;
}

/* TDesign tr 默认实色盖住 thead 渐变；fixed-header th 亦有 secondarycontainer 底 — 一并透明 */
.glass-table__core :deep(.t-table__header tr),
.glass-table__core :deep(.t-table__header th),
.glass-table__core :deep(.t-table__header thead th),
.glass-table__core :deep(.t-table__header--fixed:not(.t-table__header--multiple) > tr > th) {
  background: transparent;
}

/* th 字色/字重/底边 soft Quiet Ribbon；无列间竖线 */
.glass-table__core :deep(.t-table__header th),
.glass-table__core :deep(.t-table__header thead th) {
  color: var(--glass-text-secondary);
  font-weight: 600;
  font-size: 12px;
  /* t3 Quiet Ribbon：水平细分割（带与行体的台阶线） */
  border-bottom: 1px solid var(--glass-border-soft);
  border-right: none;
  border-left: none;
  padding-top: 8px;
  padding-bottom: 8px;
}

/* 圆角只在带两端：首 th 左上、末 th 右上；中间格直角 */
.glass-table__core :deep(.t-table__header th:first-child) {
  border-top-left-radius: var(--table-shell-radius);
}

.glass-table__core :deep(.t-table__header th:last-child) {
  border-top-right-radius: var(--table-shell-radius);
}

/* TDesign 列 resize / 冻结分割竖线弱化，避免切开 ribbon */
.glass-table__core :deep(.t-table__header .t-table__header-th--bordered),
.glass-table__core :deep(.t-table__header .t-table__cell--fixed-left-last),
.glass-table__core :deep(.t-table__header .t-table__cell--fixed-right-first),
.glass-table__core :deep(.t-table__body .t-table__cell--fixed-left-last),
.glass-table__core :deep(.t-table__body .t-table__cell--fixed-right-first) {
  border-right: none;
  border-left: none;
}

.glass-table__core
  :deep(.t-table--column-resizable:not(.t-table--bordered) thead.t-table__header:hover th:not(:last-child)) {
  border-right: none;
}

.glass-table__core :deep(.t-table__handle-draggable),
.glass-table__core :deep(.t-table__resize-line) {
  background: transparent;
  border-left-color: transparent;
}

/* 固定列分隔：TD 默认在 pseudo 上画 2px（bordered 为 4px）灰硬边；
   Glass 收成 1px 蓝灰线 + 低对比侧影，仅在横向可滚动时由 TD 类名触发。 */
.glass-table
  :deep(
    .glass-table__core.t-table__content--scrollable-to-left
      .t-table__cell--fixed-left-last::after
  ) {
  width: 1px;
  border-right: 1px solid var(--glass-wb-table-fixed-shadow-line);
  box-shadow: var(--glass-wb-table-fixed-shadow-left);
}

.glass-table
  :deep(
    .glass-table__core.t-table__content--scrollable-to-right
      .t-table__cell--fixed-right-first::after
  ) {
  width: 1px;
  border-left: 1px solid var(--glass-wb-table-fixed-shadow-line);
  box-shadow: var(--glass-wb-table-fixed-shadow-right);
}

.glass-table
  :deep(
    .glass-table__core.t-table--bordered.t-table__content--scrollable-to-left
      .t-table__cell--fixed-left-last::after
  ) {
  border-right-width: 1px;
}

.glass-table
  :deep(
    .glass-table__core.t-table--bordered.t-table__content--scrollable-to-right
      .t-table__cell--fixed-right-first::after
  ) {
  border-left-width: 1px;
}

/* 行拖拽只给被抓起的行轻微近白 wash，保留 TD 的 Sortable 动画与落点语义。 */
.glass-table__core :deep(.t-table__ele--draggable-chosen) {
  background: var(--glass-wb-table-drag-chosen-fill);
  box-shadow: var(--glass-wb-table-drag-chosen-shadow);
}

.glass-table__core :deep(.t-table__ele--draggable-ghost) {
  background: var(--glass-wb-table-drag-ghost-fill);
}

/* t4 Near-White：行体透明吃外壳 fill，禁 Excel 实白 */
.glass-table__core :deep(.t-table__body td),
.glass-table__core :deep(.t-table__body th) {
  background: transparent;
  /* t3 Quiet Ribbon：仅水平 soft，无竖线 */
  border-bottom: 1px solid var(--glass-border-soft);
  border-right: none;
  color: var(--glass-text-primary);
  font-size: 13px;
  padding-top: 9px;
  padding-bottom: 9px;
}

/* Row Density：行高贴近 Capsule 33 / Field 38 */
.glass-table__core :deep(.t-table__body tr) {
  background: transparent;
}

/* Hover Whisper */
.glass-table__core :deep(.t-table__body tr:hover > td) {
  background: var(--glass-wb-table-row-hover);
}

/* 固定列是 sticky 覆盖层：必须有不透明到可遮字的近白 fill，否则横滚后
   底层列文字会透出。header / body / hover / selected 各走对应 token。 */
.glass-table
  :deep(.glass-table__core.t-table--column-fixed .t-table__header .t-table__cell--fixed-left),
.glass-table
  :deep(.glass-table__core.t-table--column-fixed .t-table__header .t-table__cell--fixed-right) {
  background: var(--glass-wb-table-fixed-header-fill);
}

.glass-table
  :deep(.glass-table__core.t-table--column-fixed .t-table__body .t-table__cell--fixed-left),
.glass-table
  :deep(.glass-table__core.t-table--column-fixed .t-table__body .t-table__cell--fixed-right) {
  background: var(--glass-wb-table-fixed-cell-fill);
}

.glass-table
  :deep(.glass-table__core.t-table--column-fixed .t-table__body tr:hover > .t-table__cell--fixed-left),
.glass-table
  :deep(.glass-table__core.t-table--column-fixed .t-table__body tr:hover > .t-table__cell--fixed-right) {
  background: var(--glass-wb-table-fixed-cell-hover-fill);
}

.glass-table
  :deep(
    .glass-table__core.t-table--column-fixed
      .t-table__body
      .t-table__row--selected
      > .t-table__cell--fixed-left
  ),
.glass-table
  :deep(
    .glass-table__core.t-table--column-fixed
      .t-table__body
      .t-table__row--selected
      > .t-table__cell--fixed-right
  ) {
  background: var(--glass-wb-table-fixed-cell-selected-fill);
}

/* 展开行：沿用 Quiet Grid 的水平 Ribbon，内容区只做浅 wash，不另起卡片 */
.glass-table__core :deep(.t-table__expanded-row > td) {
  padding: 0;
  background: var(--glass-wb-table-expanded-fill);
  border-bottom: 1px solid var(--glass-border-soft);
}

/* 展开行是被展开的内容岛，不参与行 Hover Whisper 的提亮 */
.glass-table__core :deep(.t-table__expanded-row:hover > td) {
  background: var(--glass-wb-table-expanded-fill);
}

.glass-table__core :deep(.t-table__expanded-row-inner) {
  padding: 9px 16px;
  color: var(--glass-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

/* 展开 / 树形触发区：24px Quiet 热区，与 Quiet Grid 行高垂直居中。
   td 前缀用于压过通用 body td 的上下 9px，否则 24 + 18 会比行体高 4px。 */
.glass-table__core :deep(td.t-table__expandable-icon-cell) {
  height: auto;
  /* 7 + 24 + 7 = 38，与 Quiet Grid 行高（9 + 20 + 9）对齐 */
  padding: 7px 4px;
  vertical-align: middle;
}

.glass-table__core :deep(.t-table__expand-box) {
  width: 24px;
  height: 24px;
  margin: 0 auto;
  border-radius: var(--glass-wb-text-cta-radius);
  color: var(--glass-text-muted);
  transition: var(--table-expand-transition);
}

.glass-table__core :deep(.t-table__expand-box:hover) {
  background: var(--glass-wb-icon-hover-bg);
  color: var(--glass-wb-btn-blue);
}

.glass-table__expand-trigger,
.glass-table__tree-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: var(--glass-wb-text-cta-radius);
  background: transparent;
  color: var(--glass-text-muted);
  cursor: pointer;
  transition: var(--glass-wb-control-transition);
}

.glass-table__expand-trigger .t-icon,
.glass-table__tree-trigger .t-icon {
  font-size: 14px;
  transition: transform 0.15s ease;
}

.glass-table__tree-trigger.is-expanded .t-icon {
  transform: rotate(90deg);
}

.glass-table__expand-trigger:hover,
.glass-table__tree-trigger:hover {
  background: var(--glass-wb-icon-hover-bg);
  color: var(--glass-wb-btn-blue);
}

.glass-table__expand-trigger:active,
.glass-table__tree-trigger:active {
  transform: scale(var(--glass-wb-control-active-scale));
}

.glass-table__expand-trigger:focus-visible,
.glass-table__tree-trigger:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

.glass-table__core :deep(.t-table__tree-op-icon) {
  margin-right: 6px;
  color: var(--glass-text-muted);
  vertical-align: middle;
}

.glass-table__core :deep(.t-table__tree-op-icon:hover) {
  color: var(--glass-wb-btn-blue);
}

.glass-table__core :deep(.t-table__tree-col) {
  min-height: 22px;
}

/* Editable Cell / Quiet Field：编辑入口低对比，编辑态复用 Field hairline + focus ring。
   高度略收以维持 Row Density；颜色 / 圆角 / 焦点环全部走既有 token。 */
.glass-table__core :deep(.t-table__cell--editable) {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
}

.glass-table__core :deep(.t-table__cell--editable .t-icon) {
  flex-shrink: 0;
  margin-left: 4px;
  color: var(--glass-text-muted);
  font-size: 14px;
  transition: color 0.15s ease;
}

.glass-table__core :deep(.t-table__cell--editable:hover .t-icon) {
  color: var(--glass-wb-btn-blue);
}

.glass-table__core :deep(.t-table__cell-wrap) {
  width: 100%;
  min-width: 0;
}

/* 编辑态不抬行高：Field 30px + 上下 5px = 原 Quiet Grid 行密度 */
.glass-table__core :deep(.t-table__body td:has(.t-table__cell-wrap)) {
  padding-top: 5px;
  padding-bottom: 5px;
}

.glass-table__core :deep(.t-table__cell-wrap .t-input) {
  height: 30px;
  border-color: transparent;
  border-radius: var(--glass-wb-field-radius);
  background: var(--glass-wb-white);
  box-shadow: var(--glass-wb-field-hairline);
  transition: box-shadow 0.15s ease;
}

.glass-table__core :deep(.t-table__cell-wrap .t-input:hover) {
  border-color: transparent;
  box-shadow: var(--glass-wb-field-hairline-hover);
}

.glass-table__core :deep(.t-table__cell-wrap .t-input.t-is-focused),
.glass-table__core :deep(.t-table__cell-wrap .t-input:focus-within) {
  border-color: transparent;
  box-shadow: var(--glass-wb-field-focus-ring);
}

/* Selected Whisper：近白 / 极淡紫 wash，禁止高饱和块色 */
.glass-table__core :deep(.t-table__row--selected > td) {
  background: var(--glass-wb-table-row-selected);
}

.glass-table__core :deep(.t-table__row--selected:hover > td) {
  background: var(--glass-wb-table-row-selected);
}

/* t4 Near-White 空态：muted 字色，保持玻璃透明底 */
.glass-table__core :deep(.t-table__empty) {
  background: transparent;
  color: var(--glass-text-muted);
  font-size: 13px;
  padding: 24px 16px;
}

/* t4 轻 loading mask，不盖死玻璃 */
.glass-table__core :deep(.t-loading__overlay),
.glass-table__core :deep(.t-table__loading) {
  background: var(--glass-wb-table-loading-mask);
}

.glass-table__core :deep(.t-loading__text),
.glass-table__core :deep(.t-loading__spinner) {
  color: var(--glass-text-muted);
}

/* TDesign 即使未传 pagination 也会挂空 pagination-wrap；空节点不占位、不画线 */
.glass-table__core :deep(.t-table__pagination-wrap:not(:has(.t-pagination))) {
  display: none;
  padding: 0;
  border: 0;
}

/* t3 Quiet Ribbon · 分页 Quiet Chrome：仅真实分页条透明底、字色 muted、当前页 Quiet 蓝 */
.glass-table__core :deep(.t-table__pagination-wrap:has(.t-pagination)) {
  background: transparent;
  border-top: 1px solid var(--glass-border-soft);
  padding: 10px 12px;
}

.glass-table__core :deep(.t-pagination) {
  background: transparent;
}

.glass-table__core :deep(.t-pagination__number),
.glass-table__core :deep(.t-pagination__btn) {
  color: var(--glass-text-muted);
}

.glass-table__core :deep(.t-pagination__number--current) {
  color: var(--glass-wb-btn-blue);
  background: transparent;
  font-weight: 600;
}
</style>

<style>
/* 列配置面板由 TD DialogPlugin teleport 到 body，故材质锚在
   .glass-table-column-controller，不污染全局；色值全部走 token。 */
.glass-table-column-controller.t-dialog {
  background: var(--glass-wb-dialog-fill);
  -webkit-backdrop-filter: var(--glass-wb-dialog-blur);
  backdrop-filter: var(--glass-wb-dialog-blur);
  border: none;
  border-radius: var(--glass-wb-dialog-radius);
  box-shadow: var(--glass-wb-dialog-shadow);
}

.t-dialog__ctx:has(.glass-table-column-controller) > .t-dialog__mask {
  background: var(--glass-wb-dialog-scrim);
}

.glass-table-column-controller .t-dialog__header {
  padding-bottom: 12px;
  color: var(--glass-text-primary);
  font-weight: 600;
}

.glass-table-column-controller .t-dialog__body {
  color: var(--glass-text-secondary);
}

.glass-table-column-controller .t-dialog__close {
  border-radius: var(--glass-wb-text-cta-radius);
  color: var(--glass-text-muted);
}

.glass-table-column-controller .t-dialog__close:hover {
  background: var(--glass-wb-icon-hover-bg);
  color: var(--glass-text-secondary);
}

/* 面板内分区：用 hairline + 纯间距，不叠 TD 实线方框 */
.glass-table-column-controller .t-table__column-controller-desc {
  margin-bottom: 14px;
  color: var(--glass-text-muted);
  font-size: 12px;
}

.glass-table-column-controller .t-table__column-controller-block,
.glass-table-column-controller .t-table__column-controller-block + .t-table__column-controller-block {
  padding: 10px 14px;
  border: none;
  border-radius: var(--glass-wb-field-radius);
  background: transparent;
  box-shadow: var(--glass-wb-tonal-hairline);
}

.glass-table-column-controller .t-table__column-controller-block + .t-table__column-controller-block {
  margin-top: 8px;
}

.glass-table-column-controller .t-checkbox {
  color: var(--glass-text-secondary);
}

.glass-table-column-controller .t-checkbox__label {
  color: inherit;
  font-size: 13px;
}

/* 列配置 footer = Overlay footer 同套：
   行几何复用共享 footer token；TDesign 原生 cancel / confirm 映射到
   GlassButton quiet / primary 的 Pill 38 + 同源影子 / 按压 / 焦点态。 */
.glass-table-column-controller .t-dialog__footer {
  padding-top: var(--glass-wb-dialog-footer-padding-top);
}

.glass-table-column-controller .t-dialog__footer > div:first-child {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--glass-wb-dialog-footer-gap);
}

.glass-table-column-controller .t-dialog__footer .t-button + .t-button {
  margin-left: 0;
}

.glass-table-column-controller .t-dialog__footer .t-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--glass-wb-pill-height);
  padding: 0 var(--glass-wb-pill-pad-x);
  border: none;
  border-radius: var(--glass-wb-pill-radius);
  font-size: var(--glass-wb-pill-font-size);
  font-weight: var(--glass-wb-pill-font-weight);
  transition: var(--glass-wb-control-transition);
}

/* Cancel = Quiet CTA：Shadow-only Chrome，无 inset hairline */
.glass-table-column-controller .t-dialog__footer .t-dialog__cancel {
  background: var(--glass-wb-pill-quiet-bg);
  color: var(--glass-wb-pill-quiet-color);
  -webkit-backdrop-filter: var(--glass-wb-pill-quiet-blur);
  backdrop-filter: var(--glass-wb-pill-quiet-blur);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
}

.glass-table-column-controller .t-dialog__footer .t-dialog__cancel:hover {
  background: var(--glass-wb-pill-quiet-hover-bg);
  color: var(--glass-wb-pill-quiet-color);
  box-shadow: var(--glass-wb-pill-quiet-hover-shadow);
}

.glass-table-column-controller .t-dialog__footer .t-dialog__cancel:active {
  background: var(--glass-wb-pill-quiet-active-bg);
  color: var(--glass-wb-pill-quiet-active-color);
  box-shadow: var(--glass-wb-pill-quiet-active-shadow);
  filter: none;
  transform: translateY(var(--glass-wb-control-press-y))
    scale(var(--glass-wb-control-active-scale));
}

.glass-table-column-controller .t-dialog__footer .t-dialog__cancel:focus-visible {
  outline: none;
  box-shadow:
    var(--glass-wb-pill-quiet-shadow),
    var(--glass-wb-control-focus-ring);
}

/* Confirm = Primary Pill：与 GlassButton shape=round 同高同影 */
.glass-table-column-controller .t-dialog__footer .t-dialog__confirm {
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  box-shadow: var(--glass-wb-pill-pri-shadow);
}

.glass-table-column-controller .t-dialog__footer .t-dialog__confirm:hover {
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  filter: var(--glass-wb-control-hover-bright);
  box-shadow: var(--glass-wb-pill-pri-hover-shadow);
}

.glass-table-column-controller .t-dialog__footer .t-dialog__confirm:active {
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  box-shadow: var(--glass-wb-control-active-shadow-tight);
  filter: none;
  transform: translateY(var(--glass-wb-control-press-y))
    scale(var(--glass-wb-control-active-scale));
}

.glass-table-column-controller .t-dialog__footer .t-dialog__confirm:focus-visible {
  outline: none;
  box-shadow:
    var(--glass-wb-pill-pri-shadow),
    var(--glass-wb-control-focus-ring);
}

.glass-table-column-controller .t-dialog__footer .t-button.t-is-disabled {
  cursor: not-allowed;
  opacity: var(--glass-wb-control-disabled-opacity);
  box-shadow: none;
  transform: none;
}

.glass-table-column-controller .t-dialog__footer .t-button.t-is-disabled:hover,
.glass-table-column-controller .t-dialog__footer .t-button.t-is-disabled:active {
  filter: none;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .glass-table {
    --table-expand-transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .glass-table__expand-trigger,
  .glass-table__tree-trigger,
  .glass-table__expand-trigger .t-icon,
  .glass-table__tree-trigger .t-icon {
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .glass-table__expand-trigger:active,
  .glass-table__tree-trigger:active {
    transform: none;
  }

  .glass-table .t-table__column-controller-trigger .t-button,
  .glass-table-column-controller .t-dialog__footer .t-button {
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .glass-table .t-table__column-controller-trigger .t-button:active,
  .glass-table-column-controller .t-dialog__footer .t-button:active {
    transform: none;
  }
}
</style>
