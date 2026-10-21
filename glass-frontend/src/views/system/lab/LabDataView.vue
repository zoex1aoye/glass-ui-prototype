<script setup lang="ts">
/**
 * 实验室·数据表格 — Quiet Grid Living Showcase（Sample Matrix S1–S12）
 * Density：Table size=small · Header Band / Unified Frost Ribbon · Hover·Selected Whisper · Pagination Quiet Chrome。
 * 对照 TDesign Table：columns / selectedRowKeys / empty·loading / pagination / sorter / filter /
 * sort-change·filter-change·change / fixed·maxHeight / editableCellState·row-edit /
 * columnController·displayColumns·column-change·display-columns-change /
 * expandedRowKeys·expandIcon·expand-change / tree·expandedTreeNodes·tree-expand-change /
 * dragSort·drag-sort / rowMove·row-move（本地数组 reorder）。
 * 数据面：消费 GlassTable（--glass-wb-table-*）与 GlassDescriptions（--glass-wb-descriptions-*）；
 * Descriptions / Card / Bubble / Progress / Comment / Collapse / Badge / Avatar 与
 * Empty / List / Skeleton / Statistic 统一走
 * GlassSurface → GlassPanel variant="standalone" → GlassXxx 的真实宿主路径，组件本体仍保持透明底。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { UserIcon } from 'tdesign-icons-vue-next'
import { Input } from 'tdesign-vue-next'

import type {
  CheckboxGroupValue,
  CollapseValue,
  DragSortContext,
  ExpandOptions,
  FilterValue,
  PageInfo,
  PaginationProps,
  PrimaryTableCellParams,
  PrimaryTableCol,
  PrimaryTableColumnChange,
  PrimaryTableRowEditContext,
  SortOptions,
  TableChangeContext,
  TableChangeData,
  TableColumnController,
  TableFilterChangeContext,
  TableRowData,
  TableSort,
  TableTreeConfig,
  TableTreeExpandChangeContext,
  TableTreeNodeExpandOptions,
} from 'tdesign-vue-next'

import {
  GlassAvatar,
  GlassAvatarGroup,
  GlassBadge,
  GlassButton,
  GlassBubble,
  GlassCard,
  GlassCollapse,
  GlassCollapsePanel,
  GlassComment,
  GlassDescriptions,
  GlassDescriptionsItem,
  GlassEmpty,
  GlassList,
  GlassListItem,
  GlassListItemMeta,
  GlassPanel,
  GlassProgress,
  GlassSkeleton,
  GlassStatistic,
  GlassStage,
  GlassSurface,
  GlassTable,
} from '@/components/glass'
import type { GlassTableRowMoveContext } from '@/components/glass'

import { useDocsProps } from '@/layouts/useDocsProps'
import type { DocsDemoBlock } from '@/layouts/useDocsProps'

import { useGlassScheme } from '@/scheme/useGlassScheme'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const { tt } = useGlassScheme()

type SessionRow = TableRowData & {
  id: string
  title: string
  role: string
  owner: string
  status: string
  priority: string
  org: string
  scene: string
  updatedAt: string
  updatedRank: number
  note: string
}

const lastAction = ref('（尚未交互）')
const docsProps = useDocsProps()

const demoBlocks: DocsDemoBlock[] = [
  {
    id: 'statistic-tone',
    label: 'Statistic Tone',
    description: 'GlassStatistic · tone',
    props: [
      {
        key: 'tone',
        label: 'tone',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'default', value: 'default' },
          { label: 'brand', value: 'brand' },
          { label: 'success', value: 'success' },
          { label: 'warning', value: 'warning' },
          { label: 'danger', value: 'danger' },
        ],
      },
    ],
  },
  {
    id: 'avatar-props',
    label: 'Avatar',
    description: 'GlassAvatar · shape / size / content',
    props: [
      {
        key: 'shape',
        label: 'shape',
        type: 'select',
        defaultValue: 'circle',
        options: [
          { label: 'circle', value: 'circle' },
          { label: 'round', value: 'round' },
        ],
      },
      {
        key: 'size',
        label: 'size',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { label: 'small', value: 'small' },
          { label: 'medium', value: 'medium' },
          { label: 'large', value: 'large' },
        ],
      },
      {
        key: 'content',
        label: 'content',
        type: 'select',
        defaultValue: 'character',
        options: [
          { label: 'image（图片）', value: 'image' },
          { label: '字符', value: 'character' },
        ],
      },
    ],
  },
  {
    id: 'count-badge',
    label: 'Count Badge',
    description: 'GlassBadge · shape / size / dot',
    props: [
      {
        key: 'shape',
        label: 'shape',
        type: 'select',
        defaultValue: 'circle',
        options: [
          { label: 'circle', value: 'circle' },
          { label: 'round', value: 'round' },
        ],
      },
      {
        key: 'size',
        label: 'size',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { label: 'small', value: 'small' },
          { label: 'medium', value: 'medium' },
        ],
      },
      { key: 'dot', label: 'dot', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'table-variant',
    label: 'Table Shell',
    description: 'GlassTable · variant（tray / inset）',
    props: [
      {
        key: 'variant',
        label: 'variant',
        type: 'select',
        defaultValue: 'tray',
        options: [
          { label: 'tray', value: 'tray' },
          { label: 'inset', value: 'inset' },
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

const statisticDemo = computed(() => {
  const v = docsProps.state.values['statistic-tone'] ?? {}
  return {
    tone: (v.tone as 'default' | 'brand' | 'success' | 'warning' | 'danger') ?? 'default',
  }
})

const avatarDemo = computed(() => {
  const v = docsProps.state.values['avatar-props'] ?? {}
  return {
    shape: (v.shape as 'circle' | 'round') ?? 'circle',
    size: (v.size as 'small' | 'medium' | 'large') ?? 'medium',
    content: (v.content as 'image' | 'character') ?? 'character',
  }
})

const tableDemo = computed(() => {
  const v = docsProps.state.values['table-variant'] ?? {}
  return {
    variant: (v.variant as 'tray' | 'inset') ?? 'tray',
  }
})

const countBadge = computed(() => {
  const v = docsProps.state.values['count-badge'] ?? {}
  return {
    shape: (v.shape as 'circle' | 'round') ?? 'circle',
    size: (v.size as 'small' | 'medium') ?? 'medium',
    dot: Boolean(v.dot ?? false),
  }
})

type AvatarSourceKind = 'image' | 'character' | 'icon'

type AvatarSource = {
  kind: AvatarSourceKind
  label: string
  note: string
}

/** TDesign 官方示例头像资源；加载失败时仍回落到组件的冷蓝 error 面。 */
const avatarImage = 'https://tdesign.gtimg.com/site/avatar.jpg'
const avatarShapes = ['circle', 'round'] as const
const avatarSizes = ['small', 'medium', 'large'] as const
const avatarSources: AvatarSource[] = [
  { kind: 'image', label: 'image', note: '图片面 · alt 演示头像' },
  { kind: 'character', label: '字符', note: '默认槽 · 单个中文字符' },
  { kind: 'icon', label: 'icon', note: '#icon · tdesign-icons UserIcon' },
]
const avatarGroupMembers = ['王', '陈', '刘', '赵', '孙', '周'] as const

function avatarAriaLabel(kind: AvatarSourceKind): string {
  if (kind === 'image') return '演示图片头像'
  if (kind === 'icon') return '用户头像'
  return '王'
}

const progressSamples = [0, 68, 100] as const

/** expandMutex 样例：受控折叠值（互斥，同时仅一项展开） */
const mutexCollapseValue = ref<CollapseValue>(['mx-01'])

function onCollapseChange(value: CollapseValue) {
  lastAction.value = `collapse change → ${JSON.stringify(value)}`
}

/** 会话清单 mock：id 稳定、updatedRank 供排序、字段覆盖筛选/固定列 */
const sessionRows: SessionRow[] = [
  {
    id: 's-01',
    title: '演示条目 01',
    role: '角色 A',
    owner: '王倩',
    status: '进行中',
    priority: 'P1',
    org: '分组 A',
    scene: '场景 1',
    updatedAt: '今天 16:46',
    updatedRank: 10646,
    note: '演示备注 1',
  },
  {
    id: 's-02',
    title: '演示条目 02',
    role: '角色 B',
    owner: '陈浩',
    status: '待处理',
    priority: 'P0',
    org: '分组 B',
    scene: '场景 2',
    updatedAt: '今天 15:20',
    updatedRank: 10520,
    note: '演示备注 2',
  },
  {
    id: 's-03',
    title: '演示条目 03',
    role: '角色 C',
    owner: '刘洋',
    status: '进行中',
    priority: 'P1',
    org: '分组 C',
    scene: '场景 3',
    updatedAt: '昨天 18:02',
    updatedRank: 9802,
    note: '演示备注 3',
  },
  {
    id: 's-04',
    title: '演示条目 04',
    role: '角色 D',
    owner: '赵敏',
    status: '待处理',
    priority: 'P0',
    org: '分组 D',
    scene: '场景 4',
    updatedAt: '昨天 11:35',
    updatedRank: 9135,
    note: '演示备注 4',
  },
  {
    id: 's-05',
    title: '演示条目 05',
    role: '角色 A',
    owner: '王倩',
    status: '已归档',
    priority: 'P2',
    org: '分组 E',
    scene: '场景 5',
    updatedAt: '周三 09:18',
    updatedRank: 8018,
    note: '演示备注 5',
  },
  {
    id: 's-06',
    title: '演示条目 06',
    role: '角色 B',
    owner: '陈浩',
    status: '进行中',
    priority: 'P1',
    org: '分组 F',
    scene: '场景 6',
    updatedAt: '周三 14:40',
    updatedRank: 8440,
    note: '演示备注 6',
  },
  {
    id: 's-07',
    title: '演示条目 07',
    role: '角色 C',
    owner: '刘洋',
    status: '待处理',
    priority: 'P1',
    org: '分组 C',
    scene: '场景 7',
    updatedAt: '周二 16:05',
    updatedRank: 7605,
    note: '演示备注 7',
  },
  {
    id: 's-08',
    title: '演示条目 08',
    role: '角色 D',
    owner: '赵敏',
    status: '进行中',
    priority: 'P2',
    org: '分组 H',
    scene: '场景 8',
    updatedAt: '周二 10:22',
    updatedRank: 7022,
    note: '演示备注 8',
  },
  {
    id: 's-09',
    title: '演示条目 09',
    role: '角色 A',
    owner: '孙磊',
    status: '已归档',
    priority: 'P2',
    org: '分组 A',
    scene: '场景 9',
    updatedAt: '周一 17:50',
    updatedRank: 6750,
    note: '演示备注 9',
  },
  {
    id: 's-10',
    title: '演示条目 10',
    role: '角色 C',
    owner: '刘洋',
    status: '待处理',
    priority: 'P1',
    org: '分组 C',
    scene: '场景 10',
    updatedAt: '周一 09:12',
    updatedRank: 6012,
    note: '演示备注 10',
  },
  {
    id: 's-11',
    title: '演示条目 11',
    role: '角色 A',
    owner: '王倩',
    status: '进行中',
    priority: 'P1',
    org: '分组 B',
    scene: '场景 11',
    updatedAt: '上周五 15:33',
    updatedRank: 5333,
    note: '演示备注 11',
  },
  {
    id: 's-12',
    title: '演示条目 12',
    role: '角色 B',
    owner: '陈浩',
    status: '已归档',
    priority: 'P2',
    org: '分组 G',
    scene: '场景 12',
    updatedAt: '上周五 10:08',
    updatedRank: 5008,
    note: '演示备注 12',
  },
]

/* ---------- S11 · 树形 · 父子「演示条目」 ----------
 * 仅用 Lab 文案白名单（演示条目 / 演示分组），不引入业务模块名。 */
type TreeDemoRow = TableRowData & {
  id: string
  title: string
  role: string
  owner: string
  status: string
  updatedAt: string
  children?: TreeDemoRow[]
}

const treeRows: TreeDemoRow[] = [
  {
    id: 'tree-01',
    title: '演示条目 01',
    role: '演示分组',
    owner: '王倩',
    status: '进行中',
    updatedAt: '今天 16:46',
    children: [
      {
        id: 'tree-01-1',
        title: '演示条目 01-1',
        role: '角色 A',
        owner: '陈浩',
        status: '待处理',
        updatedAt: '今天 15:20',
      },
      {
        id: 'tree-01-2',
        title: '演示条目 01-2',
        role: '角色 B',
        owner: '刘洋',
        status: '已归档',
        updatedAt: '昨天 18:02',
      },
    ],
  },
  {
    id: 'tree-02',
    title: '演示条目 02',
    role: '演示分组',
    owner: '赵敏',
    status: '待处理',
    updatedAt: '昨天 11:35',
    children: [
      {
        id: 'tree-02-1',
        title: '演示条目 02-1',
        role: '角色 C',
        owner: '孙磊',
        status: '进行中',
        updatedAt: '周三 09:18',
      },
      {
        id: 'tree-02-2',
        title: '演示条目 02-2',
        role: '角色 D',
        owner: '王倩',
        status: '已归档',
        updatedAt: '周二 16:05',
      },
    ],
  },
  {
    id: 'tree-03',
    title: '演示条目 03',
    role: '演示分组',
    owner: '陈浩',
    status: '进行中',
    updatedAt: '周一 17:50',
    children: [
      {
        id: 'tree-03-1',
        title: '演示条目 03-1',
        role: '角色 A',
        owner: '刘洋',
        status: '待处理',
        updatedAt: '周一 09:12',
      },
    ],
  },
]

/* ---------- 共享列（S1–S3） ---------- */
const baseColumns: PrimaryTableCol[] = [
  { colKey: 'title', title: '会话标题', width: 180 },
  { colKey: 'role', title: '角色', width: 120 },
  { colKey: 'owner', title: '负责人', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'updatedAt', title: '更新时间', width: 120 },
]

/** tray | inset 并排对照：半栏用短列，避免重复巨型矩阵 */
const trayInsetColumns: PrimaryTableCol[] = [
  { colKey: 'title', title: '会话标题', width: 168 },
  { colKey: 'status', title: '状态', width: 88 },
]

/* ---------- S1 · 基础列 · Hover Whisper ---------- */
function onRowClick(context: { row: Record<string, unknown> }) {
  lastAction.value = `table row-click → ${String(context.row.id ?? '')}`
}

/* ---------- S2 · 行选中 · Selected Whisper ---------- */
const singleSelectedKeys = ref<Array<string | number>>(['s-01'])
const multiSelectedKeys = ref<Array<string | number>>(['s-01', 's-03'])

function onSingleSelectChange(keys: Array<string | number>) {
  singleSelectedKeys.value = keys
  lastAction.value = `select-change(single) → [${keys.join(', ') || '空'}]`
}

function onMultiSelectChange(keys: Array<string | number>) {
  multiSelectedKeys.value = keys
  lastAction.value = `select-change(multiple) → [${keys.join(', ') || '空'}]`
}

/* ---------- S3 · Empty / Loading ---------- */
const tableLoading = ref(false)

function toggleTableLoading() {
  tableLoading.value = !tableLoading.value
  lastAction.value = `table loading → ${tableLoading.value}`
}

/* ---------- S4 · Pagination Quiet Chrome ---------- */
const pageState = ref({ current: 1, pageSize: 5, total: sessionRows.length })

const pagePagination = computed<PaginationProps>(() => ({
  current: pageState.value.current,
  pageSize: pageState.value.pageSize,
  total: pageState.value.total,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [5, 8, 12],
  size: 'small',
}))

function onPageChange(pageInfo: PageInfo) {
  pageState.value = {
    current: pageInfo.current,
    pageSize: pageInfo.pageSize,
    total: pageState.value.total,
  }
  lastAction.value = `page-change → current=${pageInfo.current}, pageSize=${pageInfo.pageSize}`
}

/* ---------- Table 事件 · sort-change / filter-change / change ----------
 * GlassTable 已透传 TDesign Primary Table 的这三类事件，Lab 直接回写 live。 */
function formatSort(sort: TableSort): string {
  const items = Array.isArray(sort) ? sort : [sort]
  return (
    items
      .map((item) => `${item.sortBy} ${item.descending ? '降序' : '升序'}`)
      .join(' / ') || '（清除排序）'
  )
}

function formatFilterValue(value: unknown): string {
  if (Array.isArray(value)) return value.length ? value.join(' / ') : '（空）'
  if (value === undefined || value === null || value === '') return '（空）'
  return String(value)
}

function formatFilterMap(filter: FilterValue): string {
  const entries = Object.entries(filter).filter(([, value]) => {
    if (value === undefined || value === null || value === '') return false
    return !Array.isArray(value) || value.length > 0
  })
  if (!entries.length) return '（无筛选）'
  return entries.map(([key, value]) => `${key}: ${formatFilterValue(value)}`).join(' / ')
}

function onSortChange(sort: TableSort, options: SortOptions<TableRowData>) {
  lastAction.value = `sort-change → ${String(options.col.colKey)} · ${formatSort(sort)}`
}

function onFilterChange(
  filterValue: FilterValue,
  context: TableFilterChangeContext<TableRowData>,
) {
  const col = String(context.col?.title ?? context.col?.colKey ?? '—')
  lastAction.value = `filter-change(${context.trigger}) → ${col} · ${formatFilterMap(filterValue)}`
}

function onTableChange(data: TableChangeData, context: TableChangeContext<TableRowData>) {
  const details: string[] = []
  if (data.sorter) details.push(`sorter=${formatSort(data.sorter)}`)
  if (data.filter) details.push(`filter=${formatFilterMap(data.filter)}`)
  if (data.pagination) {
    details.push(
      `pagination=${String(data.pagination.current ?? '—')}/${String(data.pagination.pageSize ?? '—')}`,
    )
  }
  lastAction.value = `change → ${context.trigger}${details.length ? ` · ${details.join(' · ')}` : ''}`
}

const sortColumns: PrimaryTableCol[] = [
  {
    colKey: 'title',
    title: '会话标题',
    width: 180,
    sorter: (a, b) =>
      String(a.title ?? '').localeCompare(String(b.title ?? ''), 'zh'),
  },
  {
    colKey: 'role',
    title: '角色',
    width: 120,
    sorter: (a, b) =>
      String(a.role ?? '').localeCompare(String(b.role ?? ''), 'zh'),
  },
  {
    colKey: 'owner',
    title: '负责人',
    width: 100,
    sorter: (a, b) =>
      String(a.owner ?? '').localeCompare(String(b.owner ?? ''), 'zh'),
  },
  {
    colKey: 'updatedAt',
    title: '更新时间',
    width: 120,
    sorter: (a, b) => Number(a.updatedRank ?? 0) - Number(b.updatedRank ?? 0),
  },
]

/* ---------- S6 · 筛选 · columns filter ----------
 * filter 菜单由 t-table 承担；filter-change 已由 GlassTable 透传并回写 live。
 */
const filterColumns: PrimaryTableCol[] = [
  { colKey: 'title', title: '会话标题', width: 180 },
  {
    colKey: 'role',
    title: '角色',
    width: 140,
    filter: {
      type: 'single',
      list: [
        { label: '角色 A', value: '角色 A' },
        { label: '角色 B', value: '角色 B' },
        { label: '角色 C', value: '角色 C' },
        { label: '角色 D', value: '角色 D' },
      ],
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'status',
    title: '状态',
    width: 140,
    filter: {
      type: 'multiple',
      list: [
        { label: '进行中', value: '进行中' },
        { label: '待处理', value: '待处理' },
        { label: '已归档', value: '已归档' },
      ],
      showConfirmAndReset: true,
    },
  },
  { colKey: 'updatedAt', title: '更新时间', width: 120 },
]

/* ---------- S7 · 固定表头 / 固定列 ---------- */
const fixedColumns: PrimaryTableCol[] = [
  { colKey: 'title', title: '会话标题', width: 160, fixed: 'left' },
  { colKey: 'role', title: '角色', width: 110 },
  { colKey: 'owner', title: '负责人', width: 100 },
  { colKey: 'org', title: '所属组织', width: 140 },
  { colKey: 'scene', title: '业务场景', width: 130 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'priority', title: '优先级', width: 100 },
  { colKey: 'updatedAt', title: '更新时间', width: 120 },
  { colKey: 'note', title: '备注', width: 200 },
]

/* ---------- S8 · 可编辑列 · Quiet Field ----------
 * columns[].edit 使用 TD 官方 Input；row-edit 回写本地 ref，editableCellState
 * 让既有「已归档」行保持只读（不新增业务字段 / 模块名）。 */
const editableRows = ref<SessionRow[]>(
  sessionRows.slice(0, 5).map((row) => ({ ...row })),
)

const editableColumns: PrimaryTableCol[] = [
  { colKey: 'title', title: '会话标题', width: 180 },
  { colKey: 'owner', title: '负责人', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  {
    colKey: 'note',
    title: '备注',
    width: 220,
    edit: {
      component: Input,
      showEditIcon: true,
      props: {
        placeholder: '演示备注',
        maxlength: 30,
        size: 'small',
        autofocus: true,
      },
    },
  },
]

const lastEditedNote = ref('（尚未编辑）')

function editableCellState({ row }: PrimaryTableCellParams<TableRowData>): boolean {
  return row.status !== '已归档'
}

function onEditableRowEdit(context: PrimaryTableRowEditContext<TableRowData>) {
  const id = String(context.row.id ?? '')
  const note = String(context.value ?? '')
  editableRows.value = editableRows.value.map((row) =>
    row.id === id ? { ...row, note } : row,
  )
  lastEditedNote.value = `${id} · ${note || '（空）'}`
  lastAction.value = `row-edit → ${id} · 备注「${note || '（空）'}」已写回本地 data`
}

/* ---------- S9 · 列配置 · columnController ----------
 * displayColumns 受控回写，确认后立即隐藏 / 显示列；
 * 面板走 TD DialogPlugin，GlassTable 已用 token 做 Quiet Chrome 覆盖。 */
const columnConfigColumns: PrimaryTableCol[] = [
  { colKey: 'title', title: '会话标题', width: 180 },
  { colKey: 'role', title: '角色', width: 120 },
  { colKey: 'owner', title: '负责人', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'priority', title: '优先级', width: 90 },
  { colKey: 'updatedAt', title: '更新时间', width: 120 },
]

const columnConfigDisplay = ref<CheckboxGroupValue>(
  columnConfigColumns.map((column) => String(column.colKey)),
)

const columnConfigController: TableColumnController = {
  placement: 'top-right',
  dialogProps: {
    width: 440,
  },
}

function onColumnConfigDisplayChange(value: CheckboxGroupValue) {
  columnConfigDisplay.value = value
  lastAction.value = `display-columns-change → [${value.join(', ') || '空'}]`
}

function onColumnConfigChange(context: PrimaryTableColumnChange<TableRowData>) {
  const column = context.currentColumn
  const title =
    typeof column?.title === 'string' ? column.title : String(column?.colKey ?? '未知列')
  lastAction.value = `column-change → ${context.type === 'uncheck' ? '待隐藏' : '待显示'}「${title}」· 确认后生效`
}

function resetColumnConfig() {
  columnConfigDisplay.value = columnConfigColumns.map((column) => String(column.colKey))
  lastAction.value = 'columnController → 已恢复全部演示列'
}

/* ---------- S10 · 展开行 · expandedRowKeys / expand-change ----------
 * 展开内容只用简短演示备注，不引入业务模块；图标 / 行高由 GlassTable 的
 * Quiet Grid 触发区收口。 */
const expandedRowKeys = ref<Array<string | number>>(['s-01'])

const expandedColumns: PrimaryTableCol[] = [
  { colKey: 'title', title: '演示条目', width: 180 },
  { colKey: 'role', title: '角色', width: 120 },
  { colKey: 'owner', title: '负责人', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'updatedAt', title: '更新时间', width: 120 },
]

function onExpandChange(
  keys: Array<string | number>,
  options: ExpandOptions<TableRowData>,
) {
  expandedRowKeys.value = keys
  lastAction.value = `expand-change → [${keys.join(', ') || '空'}] · ${String(options.currentRowData.title ?? '')}`
}

/* ---------- S11 · 树形 · tree / expandedTreeNodes ----------
 * 父子层级只使用「演示条目 / 演示分组」文案；默认展开 01 便于观察缩进与图标。 */
const treeExpandedKeys = ref<Array<string | number>>(['tree-01'])

const treeConfig: TableTreeConfig = {
  childrenKey: 'children',
  treeNodeColumnIndex: 0,
  indent: 18,
  expandTreeNodeOnClick: true,
}

const treeColumns: PrimaryTableCol[] = [
  { colKey: 'title', title: '演示条目', width: 240 },
  { colKey: 'role', title: '角色', width: 120 },
  { colKey: 'owner', title: '负责人', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'updatedAt', title: '更新时间', width: 120 },
]

/* ---------- S12 · 排序替代路径 · dragSort / row-move ----------
 * 整行拖拽由 t-table 的 Sortable 接管；rowMove 追加行首上移 / 下移按钮，
 * 键盘可完成同一重排。两条路径都只消费 newData 回写本地数组，
 * 不维护第二套排序状态。 */
const dragRows = ref<SessionRow[]>(
  sessionRows.slice(0, 6).map((row) => ({ ...row })),
)

function getDragRowLabel(row: TableRowData) {
  return String(row.title ?? '')
}

function onDragSort(context: DragSortContext<TableRowData>) {
  dragRows.value = context.newData as SessionRow[]
  lastAction.value = `drag-sort → 「${String(context.current.title ?? '')}」移至第 ${context.targetIndex + 1} 行`
}

function onRowMove(context: GlassTableRowMoveContext<TableRowData>) {
  dragRows.value = context.newData as SessionRow[]
  const action = context.direction === 'up' ? '上移' : '下移'
  lastAction.value = `row-move → 「${String(context.row.title ?? '')}」${action}至第 ${context.targetIndex + 1} 行`
}

function onTreeExpandedNodesChange(
  keys: Array<string | number>,
  options: TableTreeNodeExpandOptions<TableRowData>,
) {
  treeExpandedKeys.value = keys
  lastAction.value = `expanded-tree-nodes-change → [${keys.join(', ') || '空'}] · ${options.type}`
}

function onTreeExpandChange(context: TableTreeExpandChangeContext<TableRowData>) {
  lastAction.value = `tree-expand-change → ${String(context.row.title ?? '')} · ${context.trigger ?? '—'}`
}

/* ---------- List · Quiet List 三件套（基础 / Meta+action / split·stripe / asyncLoading） ---------- */
type ListRow = { id: string; title: string; desc: string; tag: string }

const listRows: ListRow[] = [
  { id: 'l-01', title: '演示条目 A', desc: '陈浩 · 今天 16:46', tag: 'A' },
  { id: 'l-02', title: '演示条目 B', desc: '王倩 · 今天 14:12', tag: 'B' },
  { id: 'l-03', title: '演示条目 C', desc: '陈浩 · 周三 14:40', tag: 'C' },
]

function onListLoadMore() {
  lastAction.value = 'list load-more → 点击「加载更多」'
}

/* ---------- Skeleton · Neutral Soft bone · Contour-free ----------
 * theme 矩阵（text / avatar / paragraph / avatar-text）+ loading 开关切换真实内容；
 * animation 矩阵（gradient 默认 / flashed / none）保留双层呼吸，骨块无冷蓝。
 */
const skeletonLoading = ref(true)

function toggleSkeletonLoading() {
  skeletonLoading.value = !skeletonLoading.value
  lastAction.value = `skeleton loading → ${skeletonLoading.value}`
}

/* ---------- Statistic · Quiet Number · semantic tone · Neutral loading bone（T1） ----------
 * tone 五态 / trend 图标语义色 / prefix·suffix·extra / loading·animation。
 * 数值动画用实例方法 start() 从 valueFrom 重播；loading 走 TD 内建 skeleton。
 */
const statisticAnimationRef = ref<{ start: () => void }>()

function replayStatisticAnimation() {
  statisticAnimationRef.value?.start()
  lastAction.value = 'statistic start() → 从 valueFrom 重播数值动画'
}

</script>

<template>
  <LabPageShell
    :title="tt('data.page.title')"
    :desc="tt('data.page.desc')"
    :live="lastAction"
  >
    <!-- 0. Live Props Demo -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('lab.section.liveProps') }}</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 tone / variant / shape / size / dot / content；画布控件即时反映。
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Statistic · tone</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('statistic-tone') }"
              role="button"
              tabindex="0"
              @click="selectDemo('statistic-tone')"
              @keydown.enter="selectDemo('statistic-tone')"
              @keydown.space.prevent="selectDemo('statistic-tone')"
            >
              <GlassStatistic
                title="本月新增条目"
                :value="128"
                unit="个"
                :tone="statisticDemo.tone"
              />
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Avatar · shape / size / content</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('avatar-props') }"
              role="button"
              tabindex="0"
              @click="selectDemo('avatar-props')"
              @keydown.enter="selectDemo('avatar-props')"
              @keydown.space.prevent="selectDemo('avatar-props')"
            >
              <GlassAvatar
                :shape="avatarDemo.shape"
                :size="avatarDemo.size"
                :image="avatarDemo.content === 'image' ? avatarImage : undefined"
                alt="演示头像"
              >
                <template v-if="avatarDemo.content === 'character'">王</template>
              </GlassAvatar>
              <span class="lab-avatar-live-copy">
                {{ avatarDemo.content === 'image' ? '图片内容' : '字符内容 · 王' }}
              </span>
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Count Badge · shape / size / dot</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('count-badge') }"
              role="button"
              tabindex="0"
              @click="selectDemo('count-badge')"
              @keydown.enter="selectDemo('count-badge')"
              @keydown.space.prevent="selectDemo('count-badge')"
            >
              <GlassBadge
                variant="count"
                :count="5"
                :shape="countBadge.shape"
                :size="countBadge.size"
                :dot="countBadge.dot"
              >
                <GlassButton variant="soft">提醒</GlassButton>
              </GlassBadge>
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">GlassTable · variant（tray / inset）</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('table-variant') }"
              role="button"
              tabindex="0"
              @click="selectDemo('table-variant')"
              @keydown.enter="selectDemo('table-variant')"
              @keydown.space.prevent="selectDemo('table-variant')"
            >
              <GlassTable
                :data="sessionRows.slice(0, 3)"
                :columns="baseColumns"
                row-key="id"
                :variant="tableDemo.variant"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- S1 · 基础列 · Hover Whisper -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s1') }}</span>
        <span class="lab-section-meta">
          TDesign：基础表格 / columns · 玻璃：Quiet Grid 可读 + t4 行体 + Header Band / Workbench Left Nav（`.hero-ico`）·
          Row Density ≈36–40px · 禁止重阴影实白 Excel 卡
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">会话清单（Hover Whisper · row-click）</div>
        <GlassTable
          :data="sessionRows.slice(0, 6)"
          :columns="baseColumns"
          row-key="id"
          @row-click="onRowClick"
        />
        <div class="lab-control-note">
          悬停行为轻 wash（--glass-wb-table-row-hover）；点击行写入 lastAction
        </div>
      </div>
    </section>

    <!-- Table Host · tray | inset 并排对照 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.tray') }}</span>
        <span class="lab-section-meta">
          tray = Host Tray 独立外壳；inset = Stage 内嵌板（吃 Stage blur，无 lift 影）·
          禁双托盘 · 两列仅用短 catalog 行示范宿主差异
        </span>
      </div>
      <div class="lab-table-pair">
        <div class="lab-table-stack">
          <div class="lab-table-title">Table Host Tray · variant="tray"</div>
          <div class="lab-table-caption">独立橱窗 / 无 Stage 宿主时使用 · html <code>.big</code></div>
          <div class="lab-table-panel">
            <GlassTable
              variant="tray"
              :data="sessionRows.slice(0, 3)"
              :columns="trayInsetColumns"
              row-key="id"
            />
          </div>
          <div class="lab-control-note">
            Do：tray 承担 Host Tray 外壳 · Don't：Stage 内再叠 tray（双托盘）
          </div>
        </div>
        <div class="lab-table-stack">
          <div class="lab-table-title">Table Nested Chrome · variant="inset"</div>
          <div class="lab-table-caption">必须包在 GlassStage 内 · Stage Nested Chrome 嵌板</div>
          <div class="lab-tray-inset-stage">
            <GlassStage class="lab-tray-inset-glass-stage">
              <div class="lab-table-title">Stage 内嵌清单（inset）</div>
              <GlassTable
                variant="inset"
                :data="sessionRows.slice(0, 3)"
                :columns="trayInsetColumns"
                row-key="id"
              />
            </GlassStage>
          </div>
          <div class="lab-control-note">
            Do：inset 坐 Stage 内，吃 Stage blur、无 lift 影 ·
            Don't：inset 外再包 Host Tray / 用 tray 顶替嵌板
          </div>
        </div>
      </div>
    </section>

    <!-- S2 · 行选中 · Selected Whisper -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s2') }}</span>
        <span class="lab-section-meta">
          TDesign：selectedRowKeys / rowSelectionType=single·multiple / selectOnRowClick ·
          玻璃：Selected Whisper 极淡紫 wash（禁高饱和块色）
        </span>
      </div>
      <div class="lab-table-pair">
        <div class="lab-table-panel">
          <div class="lab-table-title">single · 点击行选中</div>
          <GlassTable
            :data="sessionRows.slice(0, 5)"
            :columns="baseColumns"
            row-key="id"
            :selected-row-keys="singleSelectedKeys"
            row-selection-type="single"
            select-on-row-click
            @select-change="onSingleSelectChange"
          />
          <div class="lab-control-note">
            selectedRowKeys → {{ singleSelectedKeys.join(', ') || '（空）' }}
          </div>
        </div>
        <div class="lab-table-panel">
          <div class="lab-table-title">multiple · 复选</div>
          <GlassTable
            :data="sessionRows.slice(0, 5)"
            :columns="baseColumns"
            row-key="id"
            :selected-row-keys="multiSelectedKeys"
            row-selection-type="multiple"
            @select-change="onMultiSelectChange"
          />
          <div class="lab-control-note">
            selectedRowKeys → {{ multiSelectedKeys.join(', ') || '（空）' }}
          </div>
        </div>
      </div>
    </section>

    <!-- S3 · Empty / Loading -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s3') }}</span>
        <span class="lab-section-meta">
          TDesign：empty / loading · 玻璃：Empty Glass（muted 字色）+ 轻 mask（勿实白盖板）
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title-row">
          <div class="lab-table-title">空态 / Loading mask</div>
          <GlassButton variant="soft" @click="toggleTableLoading">
            {{ tableLoading ? '关闭 Loading' : '开启 Loading' }}
          </GlassButton>
        </div>
        <div class="lab-table-pair">
          <div class="lab-table-stack">
            <div class="lab-table-caption">Empty Glass · 自定义 empty 文案</div>
            <GlassTable
              :data="[]"
              :columns="baseColumns"
              row-key="id"
              empty="Empty Glass · 暂无会话"
              :loading="tableLoading"
            />
          </div>
          <div class="lab-table-stack">
            <div class="lab-table-caption">Loading mask · 有数据时的轻遮罩</div>
            <GlassTable
              :data="sessionRows.slice(0, 3)"
              :columns="baseColumns"
              row-key="id"
              :loading="tableLoading"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- S4 · Pagination Quiet Chrome -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s4') }}</span>
        <span class="lab-section-meta">
          TDesign：pagination / page-change · 玻璃：t3 Quiet Ribbon 分页条（透明底 + muted 字 + 当前页 Quiet 蓝）·
          勿实白分页条
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">会话分页（total={{ pageState.total }} · 本地分页）</div>
        <GlassTable
          :data="sessionRows"
          :columns="baseColumns"
          row-key="id"
          :pagination="pagePagination"
          @page-change="onPageChange"
          @row-click="onRowClick"
        />
        <div class="lab-control-note">
          current={{ pageState.current }} · pageSize={{ pageState.pageSize }} ·
          翻页 / 改页大小写入 lastAction
        </div>
      </div>
    </section>

    <!-- S5 · 排序 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s5') }}</span>
        <span class="lab-section-meta">
          TDesign：columns.sorter / sortType · 玻璃：Header Band 排序图标不破坏一体缎带 ·
          本地排序；sort-change / change 已由 GlassTable 透传并回写 live
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">标题 / 角色 / 负责人 / 更新时间 · 可排序</div>
        <GlassTable
          :data="sessionRows.slice(0, 8)"
          :columns="sortColumns"
          row-key="id"
          @row-click="onRowClick"
          @sort-change="onSortChange"
          @change="onTableChange"
        />
        <div class="lab-control-note">
          点表头切换排序 · sort-change 与 change 均写入 lastAction · 更新时间用 updatedRank 数值比较
        </div>
      </div>
    </section>

    <!-- S6 · 筛选 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s6') }}</span>
        <span class="lab-section-meta">
          TDesign：filter / list / showConfirmAndReset · 玻璃：筛选浮层不引入脏方框 ·
          filter-change / change 已由 GlassTable 透传并回写 live
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">角色（single）/ 状态（multiple）筛选</div>
        <GlassTable
          :data="sessionRows.slice(0, 8)"
          :columns="filterColumns"
          row-key="id"
          @row-click="onRowClick"
          @filter-change="onFilterChange"
          @change="onTableChange"
        />
        <div class="lab-control-note">
          表头漏斗打开筛选 · 确认 / 重置由 t-table 完成 · filter-change 与 change 写入 lastAction
        </div>
      </div>
    </section>

    <!-- S7 · 固定表头 / 固定列 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s7') }}</span>
        <span class="lab-section-meta">
          TDesign：maxHeight / columns.fixed=left · 玻璃：滚动时 Header Band 仍可读 ·
          左固定列保持 Quiet 分割，无竖线网格
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">宽表滚动（title 左固定 · maxHeight 240）</div>
        <GlassTable
          :data="sessionRows"
          :columns="fixedColumns"
          row-key="id"
          max-height="240"
          @row-click="onRowClick"
        />
        <div class="lab-control-note">
          纵向滚动手表头 · 横向滚动手左固定列
        </div>
      </div>
    </section>

    <!-- S8 · 可编辑列 · Quiet Field -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s8') }}</span>
        <span class="lab-section-meta">
          TDesign：columns.edit / editableCellState / row-edit · 玻璃：编辑入口 Quiet、编辑态复用
          Field hairline + focus ring · row-edit 写回本地 ref · 已归档行只读
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">备注列可编辑（点击单元格进入编辑）</div>
        <GlassTable
          :data="editableRows"
          :columns="editableColumns"
          row-key="id"
          :editable-cell-state="editableCellState"
          @row-edit="onEditableRowEdit"
        />
        <div class="lab-control-note">
          row-edit 已回写本地 data · 最近写回：{{ lastEditedNote }} · 已归档行由 editableCellState 保持只读
        </div>
      </div>
    </section>

    <!-- S9 · 列配置 · columnController -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s9') }}</span>
        <span class="lab-section-meta">
          TDesign：columnController / displayColumns / column-change / display-columns-change ·
          玻璃：触发钮 Quiet Pill + 面板 Floating Plate（token 轻覆盖，禁魔法 hex）·
          勾选后确认即隐藏 / 显示列
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title-row">
          <div class="lab-table-title">列配置演示（右上「列配置」→ 勾选列 → 确认）</div>
          <GlassButton variant="soft" @click="resetColumnConfig">恢复全部列</GlassButton>
        </div>
        <GlassTable
          :data="sessionRows.slice(0, 6)"
          :columns="columnConfigColumns"
          row-key="id"
          :display-columns="columnConfigDisplay"
          :column-controller="columnConfigController"
          @column-change="onColumnConfigChange"
          @display-columns-change="onColumnConfigDisplayChange"
        />
        <div class="lab-control-note">
          当前显示列 → {{ columnConfigDisplay.join(' / ') || '（空）' }} ·
          隐藏后再次打开「列配置」即可勾回
        </div>
      </div>
    </section>

    <!-- S10 · 展开行 · expandedRowKeys / expand-change -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s10') }}</span>
        <span class="lab-section-meta">
          TDesign：expandedRowKeys / defaultExpandedRowKeys / expandIcon / expandOnRowClick / expandedRow ·
          玻璃：展开触发区 24px Quiet 热区，展开行沿 Quiet Ribbon 做浅 wash，不另起卡片 ·
          点击行或左侧箭头切换，expand-change 写入 lastAction
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">演示条目（展开行显示简短演示备注）</div>
        <GlassTable
          :data="sessionRows.slice(0, 5)"
          :columns="expandedColumns"
          row-key="id"
          :expanded-row-keys="expandedRowKeys"
          expand-on-row-click
          @expand-change="onExpandChange"
        >
          <template #expandedRow="{ row }">
            <div class="lab-table-expanded-note">
              演示备注：{{ row.note }} · 展开行内容仅用于组件验收。
            </div>
          </template>
        </GlassTable>
        <div class="lab-control-note">
          当前展开 → {{ expandedRowKeys.join(', ') || '（空）' }} ·
          行体与展开行共享 token 化水平 Ribbon
        </div>
      </div>
    </section>

    <!-- S11 · 树形 · tree / expandedTreeNodes -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s11') }}</span>
        <span class="lab-section-meta">
          TDesign：tree / treeExpandAndFoldIcon / expandedTreeNodes / expanded-tree-nodes-change / tree-expand-change ·
          玻璃：父子「演示条目」层级，树图标 24px Quiet 热区，indent 18 对齐 Quiet Grid 行高 ·
          点击行或树图标展开 / 收起
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">父子演示条目（默认展开 01 组）</div>
        <GlassTable
          :data="treeRows"
          :columns="treeColumns"
          row-key="id"
          :tree="treeConfig"
          :expanded-tree-nodes="treeExpandedKeys"
          @expanded-tree-nodes-change="onTreeExpandedNodesChange"
          @tree-expand-change="onTreeExpandChange"
        />
        <div class="lab-control-note">
          当前展开节点 → {{ treeExpandedKeys.join(', ') || '（空）' }} ·
          父级 / 子级仅使用「演示条目 / 演示分组」文案
        </div>
      </div>
    </section>

    <!-- S12 · 拖拽排序 · dragSort / drag-sort + rowMove / row-move -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.s12') }}</span>
        <span class="lab-section-meta">
          TDesign：dragSort="row" / drag-sort（DragSortContext.newData）·
          玻璃：整行拖拽沿用 Quiet Grid，chosen 轻提、ghost 轻留白，禁重阴影 ·
          行首 ↑ / ↓ 按钮提供键盘等价路径，两条路径共用同一份本地数组
        </span>
      </div>
      <div class="lab-table-panel">
        <div class="lab-table-title">拖拽排序（拖动任意行，或使用行首上移 / 下移按钮）</div>
        <GlassTable
          :data="dragRows"
          :columns="baseColumns"
          row-key="id"
          drag-sort="row"
          row-move
          :move-row-label="getDragRowLabel"
          @drag-sort="onDragSort"
          @row-move="onRowMove"
        />
        <div class="lab-control-note">
          当前顺序 → {{ dragRows.map((row) => row.title).join(' → ') }} ·
          drag-sort / row-move 的 newData 已回写本地数组
        </div>
      </div>
    </section>

    <!-- Badge · Status / Count -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.badge') }}</span>
        <span class="lab-section-meta">
          GlassBadge · variant=status 底层 t-tag（在线值守绿点 · --glass-wb-online-*）·
          variant=count 底层 t-badge（透传 count / dot / maxCount / shape / size / color）
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">variant=status · 在线值守绿点</span>
          <div class="lab-control-row-items">
            <GlassBadge />
            <GlassBadge text="演示在线" />
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">variant=count · count / maxCount / shape / size</span>
          <div class="lab-control-row-items">
            <GlassBadge variant="count" :count="5">
              <GlassButton variant="soft">条目</GlassButton>
            </GlassBadge>
            <GlassBadge variant="count" :count="120" :max-count="99">
              <GlassButton variant="soft">提醒</GlassButton>
            </GlassBadge>
            <GlassBadge variant="count" :count="3" shape="round">
              <GlassButton variant="soft">分类</GlassButton>
            </GlassBadge>
            <GlassBadge variant="count" :count="12" size="small">
              <GlassButton variant="soft">队列</GlassButton>
            </GlassBadge>
          </div>
          <p class="lab-control-note">
            count 默认满浓蓝（--glass-wb-badge-bg）；maxCount 溢出显示 99+；shape=round 圆角数标；size=small 缩小一档。
          </p>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">variant=count · dot / color（token）</span>
          <div class="lab-control-row-items">
            <GlassBadge variant="count" dot>
              <GlassButton variant="soft">提醒</GlassButton>
            </GlassBadge>
            <GlassBadge variant="count" :count="8" color="var(--glass-wb-btn-danger)">
              <GlassButton variant="soft">风险</GlassButton>
            </GlassBadge>
          </div>
          <p class="lab-control-note">
            dot 走同一 token 蓝点；color 显式传入时以 token 覆盖底色，文字仍为白。
          </p>
        </div>
      </div>
    </section>

    <!-- Avatar · GlassAvatar / Group
         宿主：L1 Host Tray（frost，暗色也要露玻璃 inset）→ L3 Focus Panel standalone；
         禁 Stage+inset（那是 Table Nested Chrome）；禁双托盘。 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.avatar') }}</span>
        <span class="lab-section-meta">
          容器：GlassSurface material=frost → GlassPanel standalone → GlassAvatar ·
          字面 / icon / 图片与折叠 +N 走 --glass-wb-avatar-fill 冷蓝 · Don't：Stage 嵌板冒充头像橱窗
        </span>
      </div>
      <GlassSurface material="frost" class="lab-surface-host">
        <div class="lab-plate-grid">
          <GlassPanel variant="standalone"
            v-for="(source, index) in avatarSources"
            :key="source.kind"
            :title="`Av${index + 1} · ${source.label} · circle / round × small / medium / large`"
            class="lab-plate"
          >
            <div class="lab-avatar-matrix">
              <p class="lab-avatar-source-note">{{ source.note }}</p>
              <div
                v-for="shape in avatarShapes"
                :key="`${source.kind}-${shape}`"
                class="lab-avatar-matrix-row"
              >
                <span class="lab-avatar-matrix-shape">{{ shape }}</span>
                <div class="lab-avatar-matrix-cells">
                  <div
                    v-for="size in avatarSizes"
                    :key="`${source.kind}-${shape}-${size}`"
                    class="lab-avatar-matrix-cell"
                  >
                    <GlassAvatar
                      :shape="shape"
                      :size="size"
                      :image="source.kind === 'image' ? avatarImage : undefined"
                      :alt="source.kind === 'image' ? '演示头像' : undefined"
                      :aria-label="avatarAriaLabel(source.kind)"
                    >
                      <template v-if="source.kind === 'icon'" #icon>
                        <UserIcon />
                      </template>
                      <template v-if="source.kind === 'character'">王</template>
                    </GlassAvatar>
                    <span class="lab-avatar-matrix-size">{{ size }}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel variant="standalone"
            title="Av4 · Group Living · cascading / max / 默认 collapse +N"
            class="lab-plate lab-avatar-group-plate"
          >
            <div class="lab-plate-stack">
              <div class="lab-avatar-group-row">
                <div class="lab-avatar-group-item">
                  <span class="lab-avatar-group-caption">cascading=right-up · max=3</span>
                  <GlassAvatarGroup cascading="right-up" :max="3" size="medium">
                    <GlassAvatar
                      v-for="member in avatarGroupMembers"
                      :key="`right-${member}`"
                      shape="circle"
                    >
                      {{ member }}
                    </GlassAvatar>
                  </GlassAvatarGroup>
                </div>
                <div class="lab-avatar-group-item">
                  <span class="lab-avatar-group-caption">cascading=left-up · max=4</span>
                  <GlassAvatarGroup cascading="left-up" :max="4" size="medium">
                    <GlassAvatar
                      v-for="member in avatarGroupMembers"
                      :key="`left-${member}`"
                      shape="circle"
                    >
                      {{ member }}
                    </GlassAvatar>
                  </GlassAvatarGroup>
                </div>
              </div>
              <div class="lab-avatar-raw-row">
                <span class="lab-avatar-group-caption">裸 t-avatar 对照（不进导出面）</span>
                <t-avatar size="medium">王</t-avatar>
                <GlassAvatar size="medium">王</GlassAvatar>
              </div>
            </div>
          </GlassPanel>
        </div>
      </GlassSurface>
    </section>

    <!-- 单组件橱窗 · Card / Bubble / Progress -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.showcase') }}</span>
        <span class="lab-section-meta">
          自 Layout 迁入 Data Display：引用卡、会话气泡与 Quiet Progress 各自独立橱窗；
          只消费 GlassCard / GlassBubble / GlassProgress，不替代 Panel standalone 密信息宿主
        </span>
      </div>
      <div class="lab-data-showcase-grid">
        <div class="lab-data-showcase-card">
          <div class="lab-data-showcase-head">
            <span class="lab-control-label">Soft Cite Card · GlassCard</span>
            <code> .card-soft </code>
          </div>
          <div class="lab-data-showcase-stage">
            <GlassCard>
              <b>引用 · 示例周报 10.13–10.17</b> · 演示条目本周更新 3 次，进入第二轮评估
              <GlassProgress :percentage="68" label="资料引用进度 68%" />
            </GlassCard>
          </div>
          <p class="lab-control-note">
            原生玻璃壳 + 默认 slot；不包 t-card，不当 Host Tray。
          </p>
        </div>

        <div class="lab-data-showcase-card">
          <div class="lab-data-showcase-head">
            <span class="lab-control-label">Conversation Bubble · GlassBubble</span>
            <code> .bub-a / .bub-u </code>
          </div>
          <div class="lab-data-showcase-stage">
            <div class="lab-bubble-host">
              <GlassBubble role="assistant"><b>AI</b> · 会话气泡示意</GlassBubble>
              <GlassBubble role="user">用户消息示意</GlassBubble>
            </div>
          </div>
          <p class="lab-control-note">
            assistant 左齐近白 / user 右齐满浓蓝；不替代 Panel standalone 密信息面。
          </p>
        </div>

        <div class="lab-data-showcase-card">
          <div class="lab-data-showcase-head">
            <span class="lab-control-label">Quiet Progress · GlassProgress</span>
            <code> .bar / .bar-cap </code>
          </div>
          <div class="lab-data-showcase-stage">
            <div class="lab-progress-stack">
              <GlassProgress
                v-for="value in progressSamples"
                :key="value"
                :percentage="value"
                :label="`进度 ${value}%`"
              />
            </div>
          </div>
          <p class="lab-control-note">
            6px 圆角轨 + 冰青→知乎蓝；禁止实白厚轨 / 高饱和块。
          </p>
        </div>
      </div>
    </section>

    <!-- Collapse · Borderless Glass Rail -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.collapse') }}</span>
        <span class="lab-section-meta">
          borderless 玻璃轨 + Quiet Header + 展开内容 Quiet 分隔 · expandMutex 样例 ·
          Action Blue 仅 icon 强调
        </span>
      </div>
      <div class="lab-table-pair">
        <div class="lab-table-stack">
          <div class="lab-control-label">GlassCollapse + GlassCollapsePanel</div>
          <div class="lab-collapse-host">
            <GlassCollapse @change="onCollapseChange">
              <GlassCollapsePanel value="cl-01" header="演示分组 1">
                <p class="lab-panel-copy">
                  展开内容 Quiet 分隔：顶部淡 hairline，正文走次要字色，无 TD 灰底。
                </p>
              </GlassCollapsePanel>
              <GlassCollapsePanel value="cl-02" header="演示分组 2">
                <p class="lab-panel-copy">第二条玻璃微透 header · 默认可同时展开（非互斥）。</p>
              </GlassCollapsePanel>
              <GlassCollapsePanel value="cl-03" header="演示分组 3" disabled>
                <p class="lab-panel-copy">disabled 面板：降强调 + not-allowed，无 hover 抬升。</p>
              </GlassCollapsePanel>
            </GlassCollapse>
          </div>
        </div>
        <div class="lab-table-stack">
          <div class="lab-control-label">expandMutex · v-model + expand-on-row-click</div>
          <div class="lab-collapse-host">
            <GlassCollapse
              v-model="mutexCollapseValue"
              expand-mutex
              expand-on-row-click
              @change="onCollapseChange"
            >
              <GlassCollapsePanel value="mx-01" header="基础信息">
                <p class="lab-panel-copy">互斥展开：同时仅一项展开，整行可点。</p>
              </GlassCollapsePanel>
              <GlassCollapsePanel value="mx-02" header="详细信息">
                <p class="lab-panel-copy">展开该项会收起上一项 · v-model 受控。</p>
              </GlassCollapsePanel>
              <GlassCollapsePanel value="mx-03" header="状态信息">
                <p class="lab-panel-copy">header Quiet 微透 · icon 用 Action Blue 强调。</p>
              </GlassCollapsePanel>
            </GlassCollapse>
          </div>
        </div>
      </div>
      <div class="lab-control-note">
        验收：容器无描边、玻璃轨微透圆角；header 近白微透；展开内容与 header 之间是淡 hairline；
        icon hover/active 用 Action Blue，正文不染蓝；expandMutex 下同时仅一项展开。
      </div>
    </section>

    <!-- Comment · Quiet -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.comment') }}</span>
        <span class="lab-section-meta">
          TDesign：t-comment · 玻璃：Quiet 根 + Soft Inset reply + 引用槽嵌 GlassCard ·
          GlassAvatar / Quiet text actions · 透传完整 slots
        </span>
      </div>
      <div class="lab-comment-host">
        <GlassComment author="王倩" datetime="今天 16:46">
          <template #avatar>
            <GlassAvatar shape="circle" size="medium" aria-hidden="true">王</GlassAvatar>
          </template>
          <template #content>
            <p class="lab-comment-copy">
              演示条目本周更新 3 次，进入第二轮评估，建议周五前同步结论。
            </p>
          </template>
          <template #quote>
            <GlassCard>
              <b>引用 · 示例周报 10.13–10.17</b> · 演示条目本周更新 3 次，进入第二轮评估
            </GlassCard>
          </template>
          <template #actions>
            <GlassButton variant="text">回复</GlassButton>
            <GlassButton variant="text">点赞</GlassButton>
          </template>
          <template #reply>
            <GlassComment author="陈浩" datetime="今天 17:02">
              <template #avatar>
                <GlassAvatar shape="circle" size="medium" aria-hidden="true">陈</GlassAvatar>
              </template>
              <template #content>
                <p class="lab-comment-copy">已同步演示分组，结论今晚回写。</p>
              </template>
            </GlassComment>
          </template>
        </GlassComment>
      </div>
      <div class="lab-control-note">
        验收：根评论 Quiet 透底、无托盘；GlassAvatar 40 / circle；作者名 primary、时间 muted、正文 secondary；
        引用槽仅承 GlassCard hairline；Soft Inset reply 实板 12px、左缩进对齐头像，
        无 blur / 外抬影；Quiet text actions；dark reply 无蓝染。
      </div>
    </section>

    <!-- Soft Stage · Inset Table · Stage Nested Chrome -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.softStage') }}</span>
        <span class="lab-section-meta">
          Soft Stage 近白洗（--glass-wb-stage-fill）内嵌 Inset Table ·
          工作台 Stage 内嵌用 <code>variant="inset"</code>（Stage Nested Chrome 嵌板，吃 Stage blur，禁双托盘）；
          独立橱窗 / 无 Stage 宿主用默认 <code>tray</code>（Host Tray）·
          Quiet Grid + Header Band 语义与 S1–S7 一致
        </span>
      </div>
      <div class="lab-soft-stage">
        <div class="lab-table-title">Soft Stage 内嵌清单（Inset Table 小样本）</div>
        <GlassTable
          variant="inset"
          :data="sessionRows.slice(0, 4)"
          :columns="baseColumns"
          row-key="id"
          @row-click="onRowClick"
        />
        <div class="lab-control-note">
          Inset Table = Stage Nested Chrome 嵌板（更扁：无二次 blur / lift 影）·
          同页 S1 默认 tray = Host Tray 橱窗 · 禁「双托盘」（Stage 内再叠满配托盘）
        </div>
      </div>
    </section>

    <!-- Descriptions · GlassPanel standalone 密信息聚焦面 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.descriptions') }}</span>
        <span class="lab-section-meta">
          TDesign：t-descriptions（bordered / colon / column / itemLayout / layout / size / title / span）·
          玻璃：阅读焦点三档 label（secondary）/ content（primary）/ 注解（muted），13px 节奏对齐 Form Quiet ·
          容器：<code>GlassSurface → GlassPanel variant="standalone" → GlassDescriptions</code>（D1–D4 各一块；Focus Panel L3）·
          Do：<code>Surface → Panel(standalone) → Descriptions</code>（L1 Host Tray 上密信息聚焦面）·
          Do：密信息详情用 Panel standalone · Don't：GlassStage / FormPane / GlassCard 当宿主 ·
          Don't：用容器外轮廓 hairline 补层次；bordered=Neutral Grid + Contour（中性底色差 + label 更深一档 + 组件中性网线）·
          Stage 只承担 html <code>.chat</code> 会话画布，不扛密 KV
        </span>
      </div>

      <GlassSurface class="lab-surface-host">
        <div class="lab-plate-grid">
          <!-- D1 · 无边框 · 水平 · column=3 · title / colon -->
          <GlassPanel variant="standalone" title="D1 · 基础概览" class="lab-plate">
            <div class="lab-descriptions-demo">
              <div class="lab-descriptions-demo-note">
                无边框 · 水平 · column=3 · title / colon · label secondary + content primary
              </div>
              <GlassDescriptions title="示例概览" :column="3" colon>
                <GlassDescriptionsItem label="条目名称">演示条目 01 · 分组 A</GlassDescriptionsItem>
                <GlassDescriptionsItem label="负责人">陈浩</GlassDescriptionsItem>
                <GlassDescriptionsItem label="优先级">P0</GlassDescriptionsItem>
                <GlassDescriptionsItem label="阶段">阶段 1</GlassDescriptionsItem>
                <GlassDescriptionsItem label="预计金额">¥ 1,280,000</GlassDescriptionsItem>
                <GlassDescriptionsItem label="更新时间">今天 16:46</GlassDescriptionsItem>
              </GlassDescriptions>
            </div>
          </GlassPanel>

          <!-- D2 · 边框 · 水平 · column=2 · Neutral Grid + Contour（中性底 wash + 偶数行 content 条纹 + 更深 label + 中性网格） -->
          <GlassPanel variant="standalone" title="D2 · 组织与阶段" class="lab-plate">
            <div class="lab-descriptions-demo">
              <div class="lab-descriptions-demo-note">
                边框 · 水平 · column=2 · size=small · bordered=Neutral Grid + Contour（中性底 wash + 偶数行仅 content 条纹，label 带更深一档，中性网格）
              </div>
              <GlassDescriptions bordered size="small" :column="2">
                <GlassDescriptionsItem label="条目名称">演示条目 01</GlassDescriptionsItem>
                <GlassDescriptionsItem label="所属组织">分组 A · 分组 C</GlassDescriptionsItem>
                <GlassDescriptionsItem label="当前阶段">阶段 1 · 阶段 2</GlassDescriptionsItem>
                <GlassDescriptionsItem label="下次更新">明天 10:00</GlassDescriptionsItem>
              </GlassDescriptions>
            </div>
          </GlassPanel>

          <!-- D3 · 垂直 layout · column=3 · 标签在上 -->
          <GlassPanel variant="standalone" title="D3 · 创建信息" class="lab-plate">
            <div class="lab-descriptions-demo">
              <div class="lab-descriptions-demo-note">
                垂直 layout · column=3 · label 在上（label / content 节奏对齐 Form Quiet）
              </div>
              <GlassDescriptions layout="vertical" :column="3">
                <GlassDescriptionsItem label="来源">演示表单</GlassDescriptionsItem>
                <GlassDescriptionsItem label="示例项">演示工作台</GlassDescriptionsItem>
                <GlassDescriptionsItem label="示例等级">A</GlassDescriptionsItem>
                <GlassDescriptionsItem label="创建人">王倩</GlassDescriptionsItem>
                <GlassDescriptionsItem label="创建时间">今天 14:12</GlassDescriptionsItem>
                <GlassDescriptionsItem label="标签">演示标签 / 示例标签</GlassDescriptionsItem>
              </GlassDescriptions>
            </div>
          </GlassPanel>

          <!-- D4 · content secondary / span / title slot / footer slot -->
          <GlassPanel variant="standalone" title="D4 · 跨列与次级内容" class="lab-plate">
            <div class="lab-descriptions-demo">
              <div class="lab-descriptions-demo-note">
                column=2 · span 跨列 + content secondary（#title 槽）· footer 槽只放只读注记
              </div>
              <GlassDescriptions :column="2">
                <template #title>
                  示例概览（title slot）
                </template>
                <GlassDescriptionsItem label="条目名称" :span="2">演示条目 01（span=2 跨列）</GlassDescriptionsItem>
                <GlassDescriptionsItem label="示例场景">场景 1</GlassDescriptionsItem>
                <GlassDescriptionsItem label="风险等级">
                  <span class="lab-descriptions-secondary">中 · 演示说明（secondary 内容）</span>
                </GlassDescriptionsItem>
              </GlassDescriptions>
            </div>
            <template #footer>
              <span>只读详情 · 请求编号 REQ-2026-1018</span>
            </template>
          </GlassPanel>
        </div>
      </GlassSurface>
    </section>

    <!-- Empty · Quiet TeachingTip / 列表空态 · type 矩阵 + action -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.empty') }}</span>
        <span class="lab-section-meta">
          TDesign：t-empty（type / title / description / image / size / action）·
          玻璃：Quiet Empty · Neutral illustration（透明底、无蓝染满铺、muted 描述、默认插图不加品牌滤镜）·
          action 槽用 GlassButton · empty/network-error/maintenance 走中性灰图，success/fail 保留语义色 ·
          容器：<code>GlassSurface → GlassPanel variant="standalone" → GlassEmpty</code>（E1–E7 各一块）·
          E1–E5 为类型矩阵（无 action），业务空态须带下一步（见 E6 / E7）
        </span>
      </div>

      <GlassSurface class="lab-surface-host">
        <div class="lab-plate-grid lab-plate-grid--compact">
          <GlassPanel variant="standalone" title="E1 · type=empty" class="lab-plate">
            <GlassEmpty type="empty" title="暂无数据" description="这里还没有内容，换个条件再试试。" />
          </GlassPanel>
          <GlassPanel variant="standalone" title="E2 · type=success" class="lab-plate">
            <GlassEmpty type="success" title="已处理完成" description="相关任务已全部收口。" />
          </GlassPanel>
          <GlassPanel variant="standalone" title="E3 · type=fail" class="lab-plate">
            <GlassEmpty type="fail" title="处理失败" description="请稍后重试或联系管理员。" />
          </GlassPanel>
          <GlassPanel variant="standalone" title="E4 · type=network-error" class="lab-plate">
            <GlassEmpty type="network-error" title="网络连接异常" description="检查网络后重试。" />
          </GlassPanel>
          <GlassPanel variant="standalone" title="E5 · type=maintenance" class="lab-plate">
            <GlassEmpty type="maintenance" title="功能建设中" description="该模块即将上线，敬请期待。" />
          </GlassPanel>
          <GlassPanel variant="standalone" title="E6 · action · size=small" class="lab-plate">
            <GlassEmpty
              type="empty"
              title="暂无条目"
              description="新建条目后，这里会展示条目列表。"
              size="small"
            >
              <template #action>
                <GlassButton variant="primary" shape="round">新建条目</GlassButton>
              </template>
            </GlassEmpty>
          </GlassPanel>
          <GlassPanel variant="standalone" title="E7 · action · size=large" class="lab-plate">
            <GlassEmpty
              type="maintenance"
              title="模块建设中"
              description="该模块正在建设中，先去看看别的演示。"
              size="large"
            >
              <template #action>
                <GlassButton variant="quiet">返回首页</GlassButton>
              </template>
            </GlassEmpty>
          </GlassPanel>
        </div>
      </GlassSurface>
    </section>

    <!-- List · Quiet List 三件套（基础 / Meta+action / split·stripe / asyncLoading） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.list') }}</span>
        <span class="lab-section-meta">
          TDesign：t-list / t-list-item / t-list-item-meta（split / stripe / size / header / footer / asyncLoading / load-more / scroll）·
          玻璃：GlassList 组件非托盘、透明底 Quiet 列表；Lab 用
          <code>GlassSurface → GlassPanel variant="standalone" → GlassList</code> 展示真实宿主（L1–L4b 各一块；禁双托盘）·
          Light hover = 提亮 Soft 洗（可辨、不偏暗）· active = Soft Active Wash 原样 · stripe = Soft 中性斑马微洗、无 lift ·
          stripe hover ≠ active · Dark active .12 / stripe hover .09 / hover .05 ·
          rail active 仍走 rail-* · Meta 头像圆角对齐 Comment
        </span>
      </div>

      <GlassSurface class="lab-surface-host">
        <div class="lab-plate-grid">
          <!-- L1 · 基础列表 -->
          <GlassPanel variant="standalone" title="L1 · 基础列表 · size=small" class="lab-plate">
            <div class="lab-plate-stack">
              <GlassList size="small">
                <GlassListItem v-for="row in listRows" :key="row.id">
                  <GlassListItemMeta :title="row.title" :description="row.desc" />
                </GlassListItem>
              </GlassList>
              <div class="lab-control-note">
                透明底 Quiet 列表 · Light hover = Soft 一档可辨（--glass-wb-list-item-hover-bg）
              </div>
            </div>
          </GlassPanel>

          <!-- L2 · Meta+action -->
          <GlassPanel variant="standalone" title="L2 · Meta+action · image / action 槽" class="lab-plate">
            <div class="lab-plate-stack">
              <GlassList>
                <GlassListItem v-for="row in listRows" :key="row.id">
                  <GlassListItemMeta :title="row.title" :description="row.desc">
                    <template #image>
                      <div class="lab-list-avatar">{{ row.tag }}</div>
                    </template>
                  </GlassListItemMeta>
                  <template #action>
                    <GlassButton variant="text">查看</GlassButton>
                  </template>
                </GlassListItem>
              </GlassList>
              <div class="lab-control-note">
                头像 40 · circle（50%）对齐 Comment · action 槽放 GlassButton（Quiet Ink，无底无边）
              </div>
            </div>
          </GlassPanel>

          <!-- L3 · split·stripe -->
          <GlassPanel variant="standalone" title="L3a · split（行间软分割线）" class="lab-plate">
            <GlassList split>
              <GlassListItem v-for="row in listRows" :key="row.id">
                <GlassListItemMeta :title="row.title" :description="row.desc" />
              </GlassListItem>
            </GlassList>
          </GlassPanel>
          <GlassPanel variant="standalone" title="L3b · stripe + active（Soft Active Wash）" class="lab-plate">
            <GlassList stripe>
              <GlassListItem
                v-for="(row, index) in listRows"
                :key="row.id"
                :data-active="index === 1 ? 'true' : undefined"
              >
                <GlassListItemMeta :title="row.title" :description="row.desc" />
              </GlassListItem>
            </GlassList>
          </GlassPanel>

          <!-- L4 · asyncLoading -->
          <GlassPanel variant="standalone" title="L4a · asyncLoading = loading" class="lab-plate">
            <GlassList async-loading="loading">
              <GlassListItem v-for="row in listRows" :key="row.id">
                <GlassListItemMeta :title="row.title" :description="row.desc" />
              </GlassListItem>
            </GlassList>
          </GlassPanel>
          <GlassPanel variant="standalone" title="L4b · asyncLoading = load-more" class="lab-plate">
            <div class="lab-plate-stack">
              <GlassList async-loading="load-more" @load-more="onListLoadMore">
                <GlassListItem v-for="row in listRows" :key="row.id">
                  <GlassListItemMeta :title="row.title" :description="row.desc" />
                </GlassListItem>
              </GlassList>
              <div class="lab-control-note">点击底部「加载更多」写入 lastAction</div>
            </div>
          </GlassPanel>
        </div>
      </GlassSurface>
    </section>

    <!-- Skeleton · Neutral Soft bone · Contour-free（T3） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.skeleton') }}</span>
        <span class="lab-section-meta">
          TDesign：t-skeleton（theme / animation / rowCol / loading / delay）·
          玻璃：Neutral Soft bone · Contour-free（中性 soft 骨块 + 两层中性灰白染层呼吸，无冷蓝）·
          gradient / flashed 保留双层结构；无扫光，flashed 为染层透明度呼吸，reduced-motion 关闭动画·
          loading=false 时默认槽渲染真实内容 ·
          容器：<code>GlassSurface → GlassPanel variant="standalone" → GlassSkeleton</code>（theme / animation 两块；
          plate 内只保留排版 grid，不再套 soft hairline 小卡）
        </span>
      </div>

      <GlassSurface class="lab-surface-host">
        <div class="lab-plate-grid">
          <GlassPanel variant="standalone" title="Sk1 · theme 矩阵 · loading 开关切换真实内容" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-table-title-row">
                <span class="lab-control-note">text / avatar / paragraph / avatar-text</span>
                <GlassButton variant="soft" @click="toggleSkeletonLoading">
                  {{ skeletonLoading ? '切换为真实内容' : '切换为骨架屏' }}
                </GlassButton>
              </div>

              <div class="lab-skeleton-matrix">
                <!-- text -->
                <div class="lab-skeleton-cell">
                  <div class="lab-table-caption">text</div>
                  <GlassSkeleton theme="text" :loading="skeletonLoading">
                    <p class="lab-skeleton-text">演示条目 02 · 陈浩 · 今天 16:46</p>
                  </GlassSkeleton>
                </div>

                <!-- avatar -->
                <div class="lab-skeleton-cell">
                  <div class="lab-table-caption">avatar</div>
                  <GlassSkeleton theme="avatar" :loading="skeletonLoading">
                    <div class="lab-skeleton-avatar-row">
                      <GlassAvatar shape="circle" size="medium" aria-hidden="true">陈</GlassAvatar>
                      <div class="lab-skeleton-stack">
                        <p class="lab-skeleton-title">陈浩 · 角色 B</p>
                        <p class="lab-skeleton-sub">今天 16:46</p>
                      </div>
                    </div>
                  </GlassSkeleton>
                </div>

                <!-- paragraph -->
                <div class="lab-skeleton-cell">
                  <div class="lab-table-caption">paragraph</div>
                  <GlassSkeleton theme="paragraph" :loading="skeletonLoading">
                    <div class="lab-skeleton-stack">
                      <p class="lab-skeleton-title">演示条目 02 · 分组 A</p>
                      <p class="lab-skeleton-text">演示备注示例：内容已收敛，下周对齐结论。</p>
                      <p class="lab-skeleton-sub">负责人 陈浩 · 优先级 P0</p>
                    </div>
                  </GlassSkeleton>
                </div>

                <!-- avatar-text -->
                <div class="lab-skeleton-cell">
                  <div class="lab-table-caption">avatar-text</div>
                  <GlassSkeleton theme="avatar-text" :loading="skeletonLoading">
                    <div class="lab-skeleton-avatar-row">
                      <GlassAvatar shape="circle" size="medium" aria-hidden="true">王</GlassAvatar>
                      <div class="lab-skeleton-stack">
                        <p class="lab-skeleton-title">王倩 · 角色 A</p>
                        <p class="lab-skeleton-text">演示备注 1</p>
                      </div>
                    </div>
                  </GlassSkeleton>
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel variant="standalone" title="Sk2 · animation 矩阵 · gradient / flashed / none" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-skeleton-anim-row">
                <div class="lab-skeleton-cell">
                  <div class="lab-table-caption">gradient（默认）</div>
                  <GlassSkeleton theme="paragraph" animation="gradient" />
                </div>
                <div class="lab-skeleton-cell">
                  <div class="lab-table-caption">flashed</div>
                  <GlassSkeleton theme="paragraph" animation="flashed" />
                </div>
                <div class="lab-skeleton-cell">
                  <div class="lab-table-caption">none</div>
                  <GlassSkeleton theme="paragraph" animation="none" />
                </div>
              </div>
              <div class="lab-control-note">
                gradient = Neutral soft 底 + 双层中性灰白染层漂移叠压（非扫光）·
                flashed = 染层深浅交替呼吸 · none = 静态 Neutral Soft 骨块
              </div>
            </div>
          </GlassPanel>
        </div>
      </GlassSurface>
    </section>

    <!-- Statistic · Quiet Number · semantic tone · Neutral loading bone（T1） -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('data.section.statistic') }}</span>
        <span class="lab-section-meta">
          TDesign：t-statistic（value / title / unit / prefix / suffix / extra / trend / trendPlacement / separator / decimalPlaces / loading / animation / animationStart）·
          玻璃：Quiet Number · semantic tone · Neutral loading bone（非托盘、透明底）；Lab 用
          <code>GlassSurface → GlassPanel variant="standalone" → GlassStatistic</code> 展示真实宿主（St1–St5 各一块；禁双托盘）·
          数值 tone 五态走 token；trend 图标色跟语义（increase 酷安绿 / decrease 危险红）；loading 复用 Neutral Skeleton
        </span>
      </div>

      <GlassSurface class="lab-surface-host">
        <div class="lab-plate-grid">
          <!-- St1 · Quiet 默认 -->
          <GlassPanel variant="standalone" title="St1 · Quiet 默认 · title + value + unit" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-statistic-row">
                <GlassStatistic title="本月新增条目" :value="128" unit="个" />
                <GlassStatistic title="处理中条目" :value="36" unit="项" />
                <GlassStatistic title="预计金额" :value="2860000" separator="," :decimal-places="2" unit="元" />
              </div>
              <div class="lab-control-note">
                默认 tone：数值 primary、标题 / 单位 secondary；透明底，非托盘 ·
                千分位走 separator（TD 默认 ','）+ decimalPlaces 控制小数位
              </div>
            </div>
          </GlassPanel>

          <!-- St2 · tone 五态 -->
          <GlassPanel variant="standalone" title="St2 · tone 五态 · default / brand / success / warning / danger" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-statistic-row">
                <GlassStatistic title="默认" :value="128" unit="个" tone="default" />
                <GlassStatistic title="品牌蓝" :value="128" unit="个" tone="brand" />
                <GlassStatistic title="成功绿" :value="128" unit="个" tone="success" />
                <GlassStatistic title="警示" :value="128" unit="个" tone="warning" />
                <GlassStatistic title="危险" :value="128" unit="个" tone="danger" />
              </div>
              <div class="lab-control-note">
                数值色全部走 --glass-wb-statistic-* token（brand=行动蓝 / success=酷安绿 / warning=alert warning / danger=alert error）·
                禁对外透传 TD 原始 color 字符串
              </div>
            </div>
          </GlassPanel>

          <!-- St3 · trend -->
          <GlassPanel variant="standalone" title="St3 · trend · increase / decrease · 左右 placement" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-statistic-row">
                <GlassStatistic title="环比增长 · 左" :value="12.8" unit="%" trend="increase" />
                <GlassStatistic title="环比增长 · 右" :value="12.8" unit="%" trend="increase" trend-placement="right" />
                <GlassStatistic title="环比下降 · 左" :value="6.4" unit="%" trend="decrease" />
                <GlassStatistic title="环比下降 · 右" :value="6.4" unit="%" trend="decrease" trend-placement="right" />
              </div>
              <div class="lab-control-note">
                trend 图标色跟语义（increase 酷安绿 / decrease 危险红），与 tone 解耦 ·
                trendPlacement 控制图标在数值左 / 右（TD 默认 left）
              </div>
            </div>
          </GlassPanel>

          <!-- St4 · prefix / suffix / extra -->
          <GlassPanel variant="standalone" title="St4 · prefix / suffix / extra · props + 槽透传" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-statistic-row">
                <GlassStatistic title="金额" :value="286" prefix="¥" unit="万" extra="较上月 +12.4% · 已结算 218 万" />
                <GlassStatistic title="完成率" :value="18.6" suffix="%" :decimal-places="1">
                  <template #extra>示例加权 · 近 30 天</template>
                </GlassStatistic>
                <GlassStatistic title="均值" :value="1280">
                  <template #prefix><span>≈</span></template>
                  <template #suffix><span>元</span></template>
                  <template #extra>示例口径 · 去税</template>
                </GlassStatistic>
              </div>
              <div class="lab-control-note">
                prefix / suffix 继承数值 tone 色；extra 走 muted ·
                title / unit / prefix / suffix / extra 五槽透传（props 与 slot 两种路径均可用）
              </div>
            </div>
          </GlassPanel>

          <!-- St5 · loading + animation -->
          <GlassPanel variant="standalone" title="St5 · loading + animation · 实例方法 start()" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-table-title-row">
                <span class="lab-control-note">TD 内建 skeleton + 数值重播</span>
                <GlassButton variant="soft" @click="replayStatisticAnimation">重播数值动画</GlassButton>
              </div>
              <div class="lab-statistic-row">
                <GlassStatistic title="加载中（TD 内建 skeleton）" :value="128" unit="个" loading />
                <GlassStatistic
                  ref="statisticAnimationRef"
                  title="数值动画（0 → 128）"
                  :value="128"
                  unit="个"
                  :animation="{ duration: 1200, valueFrom: 0 }"
                  animation-start
                />
              </div>
              <div class="lab-control-note">
                loading 走 TD 内建 skeleton（骨块复用 --glass-wb-skeleton-fill 微透叠压染色，勿实白盖板）·
                动画按钮调用实例 start() 从 valueFrom 重播
              </div>
            </div>
          </GlassPanel>
        </div>
      </GlassSurface>
    </section>

  </LabPageShell>
</template>

<style scoped>
/* 共享宿主：单层 L1 Host Tray 托住多块 Panel standalone；Descriptions 与
   Empty / List / Loading / Skeleton / Statistic 复用同一路径，不套第二层 Surface。 */
.lab-surface-host {
  width: 100%;
}

.lab-plate-grid {
  flex: 1;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
  gap: 14px;
  align-items: start;
}

.lab-plate-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.lab-plate {
  min-width: 0;
}

.lab-plate-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.lab-descriptions-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.lab-descriptions-demo-note {
  width: 100%;
  font-size: 12px;
  color: var(--glass-text-muted);
  line-height: 1.5;
}

/* content secondary：对齐 --glass-wb-descriptions-content-secondary（quiet 次级内容） */
.lab-descriptions-secondary {
  color: var(--glass-wb-descriptions-content-secondary);
}

/* 展开行演示备注：只做 Quiet 次级文案，不另起卡片 / 模块 */
.lab-table-expanded-note {
  color: var(--glass-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

/* tray | inset 并排：inset 必须坐在 Stage 内，半栏收紧 body 侧向 padding */
.lab-tray-inset-stage {
  display: flex;
  min-height: 220px;
  padding: 12px;
  border-radius: var(--glass-wb-card-radius);
  border: 1px solid var(--glass-border-soft);
  background: var(--glass-page-bg-accent);
}

.lab-tray-inset-glass-stage {
  width: 100%;
  min-height: 196px;
  border-radius: var(--glass-wb-card-radius);
  overflow: visible;
}

.lab-tray-inset-glass-stage :deep(.glass-stage__body) {
  padding-left: 12px;
  padding-right: 12px;
}

/* Data Display · Card / Bubble / Progress 三个独立橱窗 */
.lab-data-showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.lab-data-showcase-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--glass-wb-card-radius);
  background: var(--glass-page-bg-accent);
}

.lab-data-showcase-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lab-data-showcase-head code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--glass-text-muted);
}

.lab-data-showcase-stage {
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 160px;
  padding: 16px;
  border-radius: var(--glass-wb-card-radius);
  background:
    var(--glass-layer-l0-air),
    var(--glass-layer-l0-wash);
}

.lab-avatar-live-copy {
  font-size: 12px;
  color: var(--glass-text-secondary);
  white-space: nowrap;
}

.lab-avatar-matrix {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lab-avatar-source-note {
  margin: 0;
  font-size: 12px;
  color: var(--glass-text-muted);
  line-height: 1.5;
}

.lab-avatar-matrix-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 78px;
  padding: 8px 0;
  border-top: 1px solid var(--glass-border-soft);
}

.lab-avatar-matrix-shape {
  flex: 0 0 48px;
  font-size: 11px;
  color: var(--glass-text-muted);
}

.lab-avatar-matrix-cells {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px 18px;
}

.lab-avatar-matrix-cell {
  display: flex;
  min-width: 58px;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.lab-avatar-matrix-size {
  font-size: 11px;
  color: var(--glass-text-muted);
}

.lab-avatar-group-plate {
  grid-column: 1 / -1;
}

.lab-avatar-group-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 32px;
}

.lab-avatar-group-item {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
}

.lab-avatar-group-caption {
  font-size: 11px;
  color: var(--glass-text-muted);
}

.lab-avatar-raw-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border-soft);
}

.lab-avatar-raw-row .lab-avatar-group-caption {
  margin-right: 4px;
}

.lab-bubble-host {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px 0;
}

.lab-progress-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  padding: 10px 0;
}

.lab-collapse-host {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  padding: 16px;
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--glass-wb-card-radius);
  background:
    var(--glass-layer-l0-air),
    var(--glass-layer-l0-wash);
}

.lab-comment-host {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 720px;
  padding: 16px;
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--glass-wb-card-radius);
  background:
    var(--glass-layer-l0-air),
    var(--glass-layer-l0-wash);
}

.lab-comment-copy {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--glass-text-secondary);
}

.lab-panel-copy {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--glass-text-secondary);
}

@media (max-width: 900px) {
  .lab-plate-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .lab-avatar-group-plate {
    grid-column: auto;
  }

  .lab-data-showcase-grid {
    grid-template-columns: 1fr;
  }
}

/* List Meta image 槽：头像占位，渐变玻璃字标（贴 40 · circle 50% 头像容器） */
.lab-list-avatar {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: var(--glass-wb-avatar-gradient);
  color: var(--glass-wb-white);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lab-skeleton-matrix {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.lab-skeleton-anim-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.lab-skeleton-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  min-height: 120px;
}

/* 真实内容（loading=false 时默认槽渲染） */
.lab-skeleton-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lab-skeleton-avatar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lab-skeleton-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--glass-text-primary);
  line-height: 20px;
}

.lab-skeleton-text {
  margin: 0;
  font-size: 13px;
  color: var(--glass-text-secondary);
  line-height: 20px;
}

.lab-skeleton-sub {
  margin: 0;
  font-size: 12px;
  color: var(--glass-text-muted);
  line-height: 18px;
}

.lab-statistic-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px 32px;
}

@media (max-width: 720px) {
  .lab-avatar-group-row {
    grid-template-columns: 1fr;
  }

  .lab-skeleton-anim-row {
    grid-template-columns: 1fr;
  }
}
</style>
