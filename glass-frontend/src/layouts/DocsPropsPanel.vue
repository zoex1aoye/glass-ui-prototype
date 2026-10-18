<script setup lang="ts">
/**
 * DocsPropsPanel — DocsShell 右侧 280px Props 面板。
 * 展示当前页注册的演示区块；选中后提供可交互 controls（select / boolean / text）。
 * 状态来自 useDocsProps（由 DocsShell provide）；本组件不修改 Glass 组件实现。
 * 样式只走 --glass-* / --glass-wb-* token，禁止魔法 hex/rgba。
 */
import { computed } from 'vue'

import { useDocsProps } from './useDocsProps'
import type { DocsPropControl, DocsPropValue } from './useDocsProps'

const store = useDocsProps()

const blocks = computed(() => store.state.blocks)
const activeDemo = computed(() => store.activeDemo.value)

function selectDemo(id: string | null): void {
  store.selectDemo(id)
}

function controlValue(control: DocsPropControl): DocsPropValue {
  const block = activeDemo.value
  if (!block) return control.defaultValue
  return store.state.values[block.id]?.[control.key] ?? control.defaultValue
}

function controlDisplay(control: DocsPropControl): string {
  const value = controlValue(control)
  if (control.type === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

function setControl(control: DocsPropControl, value: DocsPropValue): void {
  const block = activeDemo.value
  if (block) store.setValue(block.id, control.key, value)
}

function onSelectChange(control: DocsPropControl, event: Event): void {
  setControl(control, (event.target as HTMLSelectElement).value)
}

function onToggleBoolean(control: DocsPropControl): void {
  setControl(control, !Boolean(controlValue(control)))
}

function onTextInput(control: DocsPropControl, event: Event): void {
  setControl(control, (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="docs-props-panel">
    <div class="docs-props-head">
      <span class="docs-props-title">Props</span>
      <button v-if="activeDemo" type="button" class="docs-props-clear" @click="selectDemo(null)">
        返回列表
      </button>
    </div>

    <p v-if="blocks.length === 0" class="docs-props-empty">
      当前页面无可调属性。进入各 Lab 页并点选 Live Props 演示区块后，可在此调整其 props。
    </p>

    <template v-else-if="activeDemo">
      <div class="docs-props-meta">
        <span class="docs-props-meta-name">{{ activeDemo.label }}</span>
        <span v-if="activeDemo.description" class="docs-props-meta-desc">
          {{ activeDemo.description }}
        </span>
      </div>

      <div class="docs-props-controls">
        <div v-for="control in activeDemo.props" :key="control.key" class="docs-prop">
          <label class="docs-prop-label" :for="`docs-prop-${control.key}`">
            <span class="docs-prop-key">{{ control.label }}</span>
            <span class="docs-prop-value">{{ controlDisplay(control) }}</span>
          </label>

          <select
            v-if="control.type === 'select'"
            :id="`docs-prop-${control.key}`"
            class="docs-prop-select"
            :value="String(controlValue(control))"
            @change="onSelectChange(control, $event)"
          >
            <option
              v-for="option in control.options"
              :key="String(option.value)"
              :value="String(option.value)"
            >
              {{ option.label }}
            </option>
          </select>

          <button
            v-else-if="control.type === 'boolean'"
            :id="`docs-prop-${control.key}`"
            type="button"
            class="docs-prop-switch"
            :class="{ 'is-on': Boolean(controlValue(control)) }"
            role="switch"
            :aria-checked="Boolean(controlValue(control))"
            :aria-label="control.label"
            @click="onToggleBoolean(control)"
          >
            <span class="docs-prop-switch-thumb"></span>
          </button>

          <input
            v-else
            :id="`docs-prop-${control.key}`"
            class="docs-prop-text"
            type="text"
            :value="String(controlValue(control))"
            :aria-label="control.label"
            @input="onTextInput(control, $event)"
          />
        </div>
      </div>
    </template>

    <div v-else class="docs-props-blocks">
      <button
        v-for="block in blocks"
        :key="block.id"
        type="button"
        class="docs-props-block"
        @click="selectDemo(block.id)"
      >
        <span class="docs-props-block-name">{{ block.label }}</span>
        <span v-if="block.description" class="docs-props-block-desc">{{ block.description }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.docs-props-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
}

.docs-props-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.docs-props-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.docs-props-clear {
  height: 24px;
  padding: 0 8px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--glass-wb-text-cta-color);
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.docs-props-clear:hover {
  background: var(--glass-wb-text-cta-hover-bg);
}

.docs-props-clear:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

.docs-props-empty {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--glass-text-muted);
}

.docs-props-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.docs-props-meta-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.docs-props-meta-desc {
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--glass-text-muted);
}

.docs-props-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.docs-prop {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.docs-prop-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.docs-prop-key {
  font-size: 12px;
  font-weight: 500;
  color: var(--glass-text-secondary);
}

.docs-prop-value {
  font-size: 11px;
  color: var(--glass-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.docs-prop-select,
.docs-prop-text {
  width: 100%;
  height: 30px;
  padding: 0 8px;
  border: none;
  border-radius: 8px;
  background: var(--glass-wb-search-bg);
  box-shadow: var(--glass-wb-field-hairline);
  color: var(--glass-text-primary);
  font-size: 12px;
  outline: none;
}

.docs-prop-select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 26px;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--glass-text-muted) 50%),
    linear-gradient(135deg, var(--glass-text-muted) 50%, transparent 50%);
  background-position:
    calc(100% - 14px) 50%,
    calc(100% - 9px) 50%;
  background-size: 5px 5px;
  background-repeat: no-repeat;
  cursor: pointer;
}

.docs-prop-select:focus-visible,
.docs-prop-text:focus-visible {
  box-shadow: var(--glass-wb-control-focus-ring);
}

.docs-prop-switch {
  position: relative;
  width: 36px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--glass-wb-dropdown-item-active-bg);
  box-shadow: var(--glass-wb-field-hairline);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.docs-prop-switch.is-on {
  background: var(--glass-wb-btn-blue);
}

.docs-prop-switch:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

.docs-prop-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--glass-wb-white);
  box-shadow: var(--glass-wb-field-hairline), var(--glass-wb-tabs-card-item-active-shadow);
  transition: transform 0.15s var(--glass-wb-control-ease-lift);
}

.docs-prop-switch.is-on .docs-prop-switch-thumb {
  transform: translateX(16px);
}

.docs-props-blocks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.docs-props-block {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: var(--glass-wb-search-bg);
  box-shadow: var(--glass-wb-field-hairline);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.docs-props-block:hover {
  border-color: var(--glass-wb-btn-blue);
}

.docs-props-block:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

.docs-props-block-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.docs-props-block-desc {
  font-size: 11px;
  line-height: 1.45;
  color: var(--glass-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .docs-prop-switch,
  .docs-prop-switch-thumb,
  .docs-props-block {
    transition: none;
  }
}
</style>
