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
  label: string
  path: string
}

export interface DocsNavGroup {
  key: string
  label: string
  icon: Component
  items: DocsNavItem[]
}

/**
 * DocsShell 左侧可搜索目录唯一数据源。
 * 扁平 path 与 router/index.ts 对齐；禁止写入 示范壳业务导航（今日现场 / 作业空间 / …）。
 */
export const docsNavGroups: DocsNavGroup[] = [
  {
    key: 'overview',
    label: 'Overview',
    icon: HomeIcon,
    items: [{ key: 'overview', label: 'Overview', path: '/' }],
  },
  {
    key: 'layout',
    label: 'Layout',
    icon: LayersIcon,
    items: [
      { key: 'layout', label: 'Layout', path: '/layout' },
      { key: 'poster', label: 'Poster 技法', path: '/poster' },
    ],
  },
  {
    key: 'actions',
    label: 'Actions',
    icon: ButtonIcon,
    items: [{ key: 'actions', label: 'Actions', path: '/actions' }],
  },
  {
    key: 'inputs',
    label: 'Inputs',
    icon: KeyboardIcon,
    items: [{ key: 'inputs', label: 'Inputs', path: '/inputs' }],
  },
  {
    key: 'forms',
    label: 'Forms',
    icon: FormIcon,
    items: [{ key: 'forms', label: 'Forms', path: '/forms' }],
  },
  {
    key: 'overlay',
    label: 'Overlay',
    icon: ViewModuleIcon,
    items: [{ key: 'overlay', label: 'Overlay', path: '/overlay' }],
  },
  {
    key: 'feedback',
    label: 'Feedback',
    icon: NotificationIcon,
    items: [{ key: 'feedback', label: 'Feedback', path: '/feedback' }],
  },
  {
    key: 'data',
    label: 'Data',
    icon: TableIcon,
    items: [{ key: 'data', label: 'Data', path: '/data' }],
  },
  {
    key: 'navigation',
    label: 'Navigation',
    icon: CompassIcon,
    items: [{ key: 'navigation', label: 'Navigation', path: '/navigation' }],
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
