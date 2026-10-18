<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRightIcon, SearchIcon } from 'tdesign-icons-vue-next'

import DocsPropsPanel from './DocsPropsPanel.vue'
import { docsNavGroups, findDocsEntry } from './docs-nav'
import { provideDocsProps } from './useDocsProps'

const route = useRoute()
const router = useRouter()

// 右侧 Props 面板共享状态：provide 给 DocsPropsPanel 与 Lab 页（多页已扩面）
provideDocsProps()

const query = ref('')

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

/** 可搜索目录：无关键字时全量，有关键字时过滤分组与条目（空组隐藏） */
const filteredGroups = computed(() => {
  const q = normalizedQuery.value
  if (!q) return docsNavGroups.map((group) => ({ group, items: group.items }))
  return docsNavGroups
    .map((group) => ({
      group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          group.label.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q),
      ),
    }))
    .filter((entry) => entry.items.length > 0)
})

const activePath = computed(() => route.path)

const breadcrumb = computed(() => findDocsEntry(route.path))

function navigate(path: string): void {
  if (route.path !== path) {
    void router.push(path)
  }
}
</script>

<template>
  <div class="docs-shell">
    <aside class="docs-sidebar">
      <div class="docs-brand">
        <span class="docs-brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <path
              d="M7 4.5h7.5M7 9.5h12M7 14.5h9M7 19.5h6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span class="docs-brand-title">Glass Component Lab</span>
      </div>

      <div class="docs-search">
        <SearchIcon class="docs-search-icon" size="16" />
        <input
          v-model="query"
          class="docs-search-input"
          type="search"
          placeholder="Filter components"
          aria-label="过滤组件目录"
        />
      </div>

      <nav class="docs-nav" aria-label="组件目录">
        <div v-for="entry in filteredGroups" :key="entry.group.key" class="docs-nav-group">
          <div class="docs-nav-group-label">
            <component :is="entry.group.icon" class="docs-nav-group-icon" size="16" />
            <span>{{ entry.group.label }}</span>
          </div>
          <div class="docs-nav-items">
            <button
              v-for="item in entry.items"
              :key="item.key"
              type="button"
              class="docs-nav-item"
              :class="{ 'is-active': activePath === item.path }"
              @click="navigate(item.path)"
            >
              <span class="docs-nav-item-label">{{ item.label }}</span>
            </button>
          </div>
        </div>
      </nav>

      <div class="docs-sidebar-foot">
        <span class="docs-sidebar-foot-text">Glass* · theme tokens</span>
      </div>
    </aside>

    <div class="docs-main">
      <header class="docs-topbar">
        <div class="docs-breadcrumb" aria-label="面包屑">
          <span class="docs-breadcrumb-root">Glass Component Lab</span>
          <template v-if="breadcrumb">
            <ChevronRightIcon size="14" class="docs-breadcrumb-sep" />
            <span>{{ breadcrumb.group.label }}</span>
            <ChevronRightIcon size="14" class="docs-breadcrumb-sep" />
            <span class="docs-breadcrumb-current">{{ breadcrumb.item.label }}</span>
          </template>
        </div>
      </header>

      <div class="docs-content">
        <main class="docs-stage">
          <router-view />
        </main>
        <aside class="docs-props">
          <DocsPropsPanel />
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 色值一律走 --glass-* / --glass-wb-* token；禁止魔法 hex/rgba。
   材质与控件密度统一消费 theme.css 的 :root workbench 默认值。 */
.docs-shell {
  display: flex;
  height: 100vh;
  min-height: 100%;
  background: var(--glass-layer-l0-fill);
}

/* ========== 左栏 ========== */
.docs-sidebar {
  width: 248px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 18px 14px 14px;
  background: var(--glass-layer-l3-fill);
  -webkit-backdrop-filter: var(--glass-layer-l3-blur);
  backdrop-filter: var(--glass-layer-l3-blur);
  box-shadow: var(--glass-layer-l3-hairline);
}

.docs-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 6px 16px;
}

.docs-brand-mark {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.docs-brand-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--glass-text-primary);
  letter-spacing: 0.1px;
  white-space: nowrap;
}

.docs-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: var(--glass-wb-search-bg);
  -webkit-backdrop-filter: var(--glass-wb-search-blur);
  backdrop-filter: var(--glass-wb-search-blur);
  box-shadow: var(--glass-wb-field-hairline);
}

.docs-search-icon {
  color: var(--glass-text-muted);
  flex-shrink: 0;
}

.docs-search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: var(--glass-text-primary);
}

.docs-search-input::placeholder {
  color: var(--glass-text-muted);
}

.docs-nav {
  flex: 1;
  overflow-y: auto;
  padding: 2px 0 10px;
}

.docs-nav-group {
  margin-bottom: 6px;
}

.docs-nav-group-label {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 10px 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--glass-text-muted);
}

.docs-nav-group-icon {
  color: inherit;
  flex-shrink: 0;
}

.docs-nav-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.docs-nav-item {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 10px 0 22px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--glass-text-secondary);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.docs-nav-item:hover {
  background: var(--glass-wb-text-cta-hover-bg);
  color: var(--glass-wb-btn-blue);
}

.docs-nav-item.is-active {
  background: var(--glass-wb-session-active-bg);
  color: var(--glass-wb-btn-blue);
  font-weight: 500;
  box-shadow: var(--glass-wb-session-active-shadow);
}

.docs-nav-item:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

.docs-nav-item-label {
  white-space: nowrap;
}

.docs-sidebar-foot {
  flex-shrink: 0;
  padding: 10px 6px 2px;
  border-top: 1px solid var(--glass-wb-collapse-content-divider);
}

.docs-sidebar-foot-text {
  font-size: 11px;
  color: var(--glass-text-muted);
}

/* ========== 右侧主区 ========== */
.docs-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.docs-topbar {
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 18px;
}

.docs-breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 13px;
  color: var(--glass-text-muted);
}

.docs-breadcrumb-root {
  color: var(--glass-text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.docs-breadcrumb-sep {
  color: var(--glass-text-muted);
  flex-shrink: 0;
}

.docs-breadcrumb-current {
  color: var(--glass-text-primary);
  font-weight: 500;
  white-space: nowrap;
}

.docs-content {
  flex: 1;
  min-height: 0;
  display: flex;
  padding: 0 18px 18px;
  gap: 16px;
}

.docs-stage {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  border-radius: var(--glass-wb-card-radius);
  background: var(--glass-panel-bg);
  box-shadow: var(--glass-panel-shadow);
  padding: 18px;
}

/* Props 右栏：渲染 DocsPropsPanel（选中演示区块 → 可交互 controls） */
.docs-props {
  width: 280px;
  flex-shrink: 0;
  min-height: 0;
  overflow: auto;
  border-radius: var(--glass-wb-card-radius);
  background: var(--glass-layer-l3-fill);
  -webkit-backdrop-filter: var(--glass-layer-l3-blur);
  backdrop-filter: var(--glass-layer-l3-blur);
  box-shadow: var(--glass-layer-l3-hairline);
}

@media (max-width: 1180px) {
  .docs-props {
    display: none;
  }
}

@media (max-width: 860px) {
  .docs-sidebar {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .docs-nav-item {
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }
}
</style>
