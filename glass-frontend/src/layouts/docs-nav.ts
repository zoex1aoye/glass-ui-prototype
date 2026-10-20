import type { Component } from 'vue'
import {
  ButtonIcon,
  CompassIcon,
  FormIcon,
  HomeIcon,
  KeyboardIcon,
  LayersIcon,
  NotificationIcon,
  TableIcon,
  ViewModuleIcon,
} from 'tdesign-icons-vue-next'

export interface DocsNavItem {
  key: string
  /** messages.ts 键，渲染时 t(labelKey) */
  labelKey: string
  /** messages.ts 键，侧栏 label 下安静一行说明；搜索亦匹配 */
  descKey: string
  path: string
}

export interface DocsNavGroup {
  key: string
  /** messages.ts 键，渲染时 t(labelKey) */
  labelKey: string
  icon: Component
  items: DocsNavItem[]
}

/**
 * DocsShell 左侧可搜索目录唯一数据源。
 * 扁平 path 与 router/index.ts 对齐；禁止写入 示范壳业务导航（今日现场 / 作业空间 / …）。
 * 可见文案走 labelKey → scheme messages（zh/en），禁止在此硬编码展示串。
 */
export const docsNavGroups: DocsNavGroup[] = [
  {
    key: 'overview',
    labelKey: 'nav.group.overview',
    icon: HomeIcon,
    items: [
      {
        key: 'overview',
        labelKey: 'nav.item.overview',
        descKey: 'nav.item.overview.desc',
        path: '/',
      },
    ],
  },
  {
    key: 'layout',
    labelKey: 'nav.group.layout',
    icon: LayersIcon,
    items: [
      {
        key: 'layout',
        labelKey: 'nav.item.layout',
        descKey: 'nav.item.layout.desc',
        path: '/layout',
      },
      {
        key: 'poster',
        labelKey: 'nav.item.poster',
        descKey: 'nav.item.poster.desc',
        path: '/poster',
      },
    ],
  },
  {
    key: 'actions',
    labelKey: 'nav.group.actions',
    icon: ButtonIcon,
    items: [
      {
        key: 'actions',
        labelKey: 'nav.item.actions',
        descKey: 'nav.item.actions.desc',
        path: '/actions',
      },
    ],
  },
  {
    key: 'inputs',
    labelKey: 'nav.group.inputs',
    icon: KeyboardIcon,
    items: [
      {
        key: 'inputs',
        labelKey: 'nav.item.inputs',
        descKey: 'nav.item.inputs.desc',
        path: '/inputs',
      },
    ],
  },
  {
    key: 'forms',
    labelKey: 'nav.group.forms',
    icon: FormIcon,
    items: [
      {
        key: 'forms',
        labelKey: 'nav.item.forms',
        descKey: 'nav.item.forms.desc',
        path: '/forms',
      },
    ],
  },
  {
    key: 'overlay',
    labelKey: 'nav.group.overlay',
    icon: ViewModuleIcon,
    items: [
      {
        key: 'overlay',
        labelKey: 'nav.item.overlay',
        descKey: 'nav.item.overlay.desc',
        path: '/overlay',
      },
    ],
  },
  {
    key: 'feedback',
    labelKey: 'nav.group.feedback',
    icon: NotificationIcon,
    items: [
      {
        key: 'feedback',
        labelKey: 'nav.item.feedback',
        descKey: 'nav.item.feedback.desc',
        path: '/feedback',
      },
    ],
  },
  {
    key: 'data',
    labelKey: 'nav.group.data',
    icon: TableIcon,
    items: [
      {
        key: 'data',
        labelKey: 'nav.item.data',
        descKey: 'nav.item.data.desc',
        path: '/data',
      },
    ],
  },
  {
    key: 'navigation',
    labelKey: 'nav.group.navigation',
    icon: CompassIcon,
    items: [
      {
        key: 'navigation',
        labelKey: 'nav.item.navigation',
        descKey: 'nav.item.navigation.desc',
        path: '/navigation',
      },
    ],
  },
]

export function findDocsEntry(path: string): {
  group: DocsNavGroup
  item: DocsNavItem
} | undefined {
  for (const group of docsNavGroups) {
    const item = group.items.find((it) => it.path === path)
    if (item) return { group, item }
  }
  return undefined
}
