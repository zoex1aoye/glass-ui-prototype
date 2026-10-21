<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItemProps, RadioValue } from 'tdesign-vue-next'

import {
  GlassBreadcrumb,
  GlassMenu,
  GlassMenuGroup,
  GlassMenuItem,
  GlassRadioGroup,
  GlassSearchCapsule,
} from '@/components/glass'
import { messageTextMatches } from '@/scheme/messages'
import { provideGlassScheme } from '@/scheme/useGlassScheme'

import DocsPropsPanel from './DocsPropsPanel.vue'
import { docsNavGroups, findDocsEntry } from './docs-nav'
import { provideDocsProps } from './useDocsProps'

const route = useRoute()

// 右侧 Props 面板共享状态：provide 给 DocsPropsPanel 与 Lab 页（多页已扩面）
provideDocsProps()

const scheme = provideGlassScheme()
const { locale, colorScheme, setLocale, setColorScheme, tt } = scheme

const localeOptions = computed(() => [
  { label: tt('shell.locale.zh'), value: 'zh' },
  { label: tt('shell.locale.en'), value: 'en' },
])

const colorSchemeOptions = computed(() => [
  { label: tt('shell.color.light'), value: 'light' },
  { label: tt('shell.color.dark'), value: 'dark' },
])

const query = ref('')

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

/** 可搜索目录：无关键字时全量；有关键字时匹配 path + zh/en 文案（跨语言） */
const filteredGroups = computed(() => {
  const q = normalizedQuery.value
  if (!q) return docsNavGroups.map((group) => ({ group, items: group.items }))
  return docsNavGroups
    .map((group) => ({
      group,
      items: group.items.filter(
        (item) =>
          messageTextMatches(item.labelKey, q) ||
          messageTextMatches(item.descKey, q) ||
          messageTextMatches(group.labelKey, q) ||
          item.path.toLowerCase().includes(q),
      ),
    }))
    .filter((entry) => entry.items.length > 0)
})

const activePath = computed(() => route.path)

/** 路由 meta.hideProps：试页（如 Dashboard）隐藏右侧 Live Props */
const showProps = computed(() => route.meta.hideProps !== true)

const breadcrumbOptions = computed<BreadcrumbItemProps[]>(() => {
  const entry = findDocsEntry(route.path)
  const items: BreadcrumbItemProps[] = [{ content: tt('shell.brand') }]
  if (entry) {
    items.push(
      { content: tt(entry.group.labelKey) },
      { content: tt(entry.item.labelKey) },
    )
  }
  return items
})

function onLocale(next: RadioValue): void {
  if (next === 'zh' || next === 'en') {
    setLocale(next)
  }
}

function onColorScheme(next: RadioValue): void {
  if (next === 'light' || next === 'dark') {
    setColorScheme(next)
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
        <span class="docs-brand-title">{{ tt('shell.brand') }}</span>
      </div>

      <div class="docs-search">
        <GlassSearchCapsule
          v-model="query"
          :placeholder="tt('shell.filter.placeholder')"
          :aria-label="tt('shell.filter.aria')"
        />
      </div>

      <nav class="docs-nav" :aria-label="tt('shell.nav.aria')">
        <GlassMenu
          class="docs-nav-menu"
          variant="rail"
          width="100%"
          :value="activePath"
        >
          <GlassMenuGroup
            v-for="entry in filteredGroups"
            :key="entry.group.key"
          >
            <template #title>
              <span class="docs-nav-group-title">
                <component :is="entry.group.icon" class="docs-nav-group-icon" size="16" />
                <span>{{ tt(entry.group.labelKey) }}</span>
              </span>
            </template>
            <GlassMenuItem
              v-for="item in entry.items"
              :key="item.key"
              :value="item.path"
              :to="item.path"
              :aria-current="activePath === item.path ? 'page' : undefined"
            >
              <span class="docs-nav-item-text">
                <span class="docs-nav-item-label">{{ tt(item.labelKey) }}</span>
                <span class="docs-nav-item-desc">{{ tt(item.descKey) }}</span>
              </span>
            </GlassMenuItem>
          </GlassMenuGroup>
        </GlassMenu>
      </nav>

      <div class="docs-sidebar-foot">
        <span class="docs-sidebar-foot-text">{{ tt('shell.foot') }}</span>
      </div>
    </aside>

    <div class="docs-main">
      <header class="docs-topbar">
        <GlassBreadcrumb
          class="docs-breadcrumb"
          :options="breadcrumbOptions"
          :aria-label="tt('shell.breadcrumb.aria')"
        />

        <div class="docs-scheme-toggles">
          <GlassRadioGroup
            variant="capsule"
            appearance="filled"
            :value="locale"
            :options="localeOptions"
            :aria-label="tt('shell.locale.aria')"
            @change="onLocale"
          />
          <GlassRadioGroup
            variant="capsule"
            appearance="filled"
            :value="colorScheme"
            :options="colorSchemeOptions"
            :aria-label="tt('shell.color.aria')"
            @change="onColorScheme"
          />
        </div>
      </header>

      <div class="docs-content">
        <main class="docs-stage">
          <router-view />
        </main>
        <aside v-if="showProps" class="docs-props">
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
  font-size: var(--glass-type-title-size);
  font-weight: var(--glass-type-title-weight);
  color: var(--glass-type-title-color);
  letter-spacing: 0.1px;
  white-space: nowrap;
}

.docs-search {
  width: 100%;
  margin-bottom: 10px;
}

.docs-search :deep(.glass-search-capsule) {
  width: 100%;
}

.docs-nav {
  flex: 1;
  overflow-y: auto;
  padding: 2px 0 10px;
}

.docs-nav-menu {
  min-height: 100%;
}

.docs-nav-menu :deep(.t-default-menu__inner .t-menu) {
  padding: 0;
  overflow: visible;
}

.docs-nav-menu :deep(.t-menu-group + .t-menu-group) {
  margin-top: 6px;
}

.docs-nav-menu :deep(.t-menu-group__title) {
  padding: 8px 10px 6px;
  color: var(--glass-type-label-color);
  font-size: var(--glass-type-label-size);
  font-weight: var(--glass-type-label-weight);
  line-height: var(--glass-type-label-line);
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.docs-nav-group-title {
  display: flex;
  align-items: center;
  gap: 7px;
}

.docs-nav-group-icon {
  color: inherit;
  flex-shrink: 0;
}

.docs-nav-menu :deep(.t-menu__item) {
  height: auto;
  min-height: 34px;
  padding: 7px 10px;
  line-height: 1.25;
  text-align: left;
  white-space: normal;
}

.docs-nav-menu :deep(.t-menu__item-link),
.docs-nav-menu :deep(.t-menu__content) {
  width: 100%;
  overflow: visible;
  white-space: normal;
}

.docs-nav-item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.docs-nav-item-label {
  white-space: nowrap;
  font-size: var(--glass-type-label-size);
  font-weight: var(--glass-type-label-weight);
  color: var(--glass-type-label-color);
}

.docs-nav-item-desc {
  font-size: var(--glass-type-caption-size);
  font-weight: var(--glass-type-caption-weight);
  line-height: var(--glass-type-caption-line);
  color: var(--glass-type-caption-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.docs-nav-menu :deep(.t-menu__item.t-is-active) .docs-nav-item-label {
  font-weight: 500;
}

.docs-sidebar-foot {
  flex-shrink: 0;
  padding: 10px 6px 2px;
  border-top: 1px solid var(--glass-wb-collapse-content-divider);
}

.docs-sidebar-foot-text {
  font-size: var(--glass-type-caption-size);
  font-weight: var(--glass-type-caption-weight);
  line-height: var(--glass-type-caption-line);
  color: var(--glass-type-caption-color);
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
  justify-content: space-between;
  gap: 12px;
  padding: 0 18px;
}

.docs-breadcrumb {
  min-width: 0;
  overflow: hidden;
}

/* Scheme toggles：locale / color-scheme；controls 由 GlassRadioGroup 提供 token 视觉 */
.docs-scheme-toggles {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
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

</style>
