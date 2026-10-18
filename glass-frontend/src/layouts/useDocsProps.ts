/**
 * DocsShell 右侧 Props 面板的共享状态控制器（provide/inject，仅在 DocsShell 树内生效）。
 *
 * v2 范围：Actions 页保持既有 4 个演示区块；Inputs / Feedback / Forms / Containers /
 * Navigation / Data / Flow / Poster 各页新增「0. Live Props Demo」区块，复用同一
 * registerDemo / unregisterDemo / selectDemo / values 通道，选中状态随页面卸载自动清理。
 * 状态随 DocsShell 生命周期创建；各 Lab 页挂载时 registerDemo、卸载时 unregisterDemo。
 */
import { computed, inject, provide, reactive } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'

export type DocsPropValue = string | boolean | number

export type DocsPropControlType = 'select' | 'boolean' | 'text'

export interface DocsPropOption {
  label: string
  value: DocsPropValue
}

export interface DocsPropControl {
  key: string
  label: string
  type: DocsPropControlType
  options?: DocsPropOption[]
  defaultValue: DocsPropValue
}

export interface DocsDemoBlock {
  id: string
  label: string
  description?: string
  props: DocsPropControl[]
}

export interface DocsPropsStore {
  state: {
    blocks: DocsDemoBlock[]
    activeDemoId: string | null
    values: Record<string, Record<string, DocsPropValue>>
  }
  activeDemo: ComputedRef<DocsDemoBlock | null>
  registerDemo(block: DocsDemoBlock): void
  unregisterDemo(id: string): void
  selectDemo(id: string | null): void
  setValue(id: string, key: string, value: DocsPropValue): void
}

const docsPropsKey: InjectionKey<DocsPropsStore> = Symbol('docs-props')

export function createDocsPropsStore(): DocsPropsStore {
  const state = reactive<DocsPropsStore['state']>({
    blocks: [],
    activeDemoId: null,
    values: {},
  })

  const activeDemo = computed<DocsDemoBlock | null>(() => {
    if (!state.activeDemoId) return null
    return state.blocks.find((block) => block.id === state.activeDemoId) ?? null
  })

  function registerDemo(block: DocsDemoBlock): void {
    const index = state.blocks.findIndex((item) => item.id === block.id)
    if (index >= 0) {
      state.blocks[index] = block
    } else {
      state.blocks.push(block)
    }

    const defaults: Record<string, DocsPropValue> = {}
    for (const control of block.props) {
      defaults[control.key] = control.defaultValue
    }
    const current = state.values[block.id] ?? {}
    state.values[block.id] = { ...defaults, ...current }
  }

  function unregisterDemo(id: string): void {
    const index = state.blocks.findIndex((item) => item.id === id)
    if (index >= 0) state.blocks.splice(index, 1)
    delete state.values[id]
    if (state.activeDemoId === id) state.activeDemoId = null
  }

  function selectDemo(id: string | null): void {
    state.activeDemoId =
      id != null && state.blocks.some((block) => block.id === id) ? id : null
  }

  function setValue(id: string, key: string, value: DocsPropValue): void {
    const blockValues = state.values[id] ?? {}
    blockValues[key] = value
    state.values[id] = blockValues
  }

  return {
    state,
    activeDemo,
    registerDemo,
    unregisterDemo,
    selectDemo,
    setValue,
  }
}

export function provideDocsProps(): DocsPropsStore {
  const store = createDocsPropsStore()
  provide(docsPropsKey, store)
  return store
}

export function useDocsProps(): DocsPropsStore {
  const store = inject(docsPropsKey)
  if (!store) {
    throw new Error('useDocsProps 必须在 DocsShell 的 provide 作用域内使用')
  }
  return store
}
