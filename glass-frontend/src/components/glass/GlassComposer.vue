<script setup lang="ts">
/**
 * GlassComposer — 输入区包装（Compound Wrapper）
 * 角色下拉 / 附件 / 字数 / 发送 / 免责声明；底层 t-textarea + GlassDropdown + GlassButton。
 * 免责声明为固定示范文案槽位，禁止擅自改写。
 */
import { computed, ref } from 'vue'
import { AddIcon, ArrowUpIcon, ChevronDownIcon, StarIcon } from 'tdesign-icons-vue-next'
import type { DropdownOption } from 'tdesign-vue-next'

import GlassButton from './GlassButton.vue'
import GlassDropdown from './GlassDropdown.vue'

const props = withDefaults(
  defineProps<{
    /** 当前角色名 */
    roleName?: string
    /** 角色下拉选项 */
    roleOptions?: string[]
    /** 受控输入文本；非受控时用内部状态 */
    modelValue?: string
    maxLength?: number
    placeholder?: string
    disclaimer?: string
  }>(),
  {
    roleName: '角色 A',
    roleOptions: () => ['角色 A', '角色 B', '角色 C'],
    modelValue: undefined,
    maxLength: 2000,
    placeholder: '输入消息',
    disclaimer: '内容由 AI 生成，仅供参考，关键业务动作请人工确认',
  },
)

const emit = defineEmits<{
  send: [text: string]
  'update:role': [role: string]
  'update:modelValue': [text: string]
  attach: []
}>()

const innerText = ref('')

const text = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : innerText.value),
  set: (v: string) => {
    if (props.modelValue === undefined) innerText.value = v
    emit('update:modelValue', v)
  },
})

const length = computed(() => String(text.value).length)
const counterText = computed(() => `${length.value}/${props.maxLength}`)
const canSend = computed(() => length.value > 0 && length.value <= props.maxLength)

const dropdownOptions = computed<DropdownOption[]>(() =>
  props.roleOptions.map((role) => ({ content: role, value: role })),
)

function onInput(value: string | number) {
  const raw = String(value)
  text.value = raw.length > props.maxLength ? raw.slice(0, props.maxLength) : raw
}

function onSend() {
  if (!canSend.value) return
  emit('send', text.value)
  text.value = ''
}

function onRoleClick(option: DropdownOption) {
  const role = String(option.value)
  emit('update:role', role)
}
</script>

<template>
  <div class="glass-composer">
    <div class="glass-composer__card">
      <t-textarea
        v-model="text"
        class="glass-composer__input"
        :placeholder="placeholder"
        :maxlength="maxLength"
        :autosize="{ minRows: 2, maxRows: 6 }"
        :aria-label="placeholder"
        @change="onInput"
        @keydown.enter.exact.prevent="onSend"
      />

      <div class="glass-composer__toolbar">
        <div class="glass-composer__toolbar-left">
          <GlassDropdown
            :options="dropdownOptions"
            trigger="click"
            trigger-variant="soft"
            @click="onRoleClick"
          >
            <GlassButton variant="soft" aria-label="切换角色">
              <template #icon>
                <StarIcon size="13" />
              </template>
              <span>{{ props.roleName }}</span>
              <template #suffix>
                <ChevronDownIcon size="13" />
              </template>
            </GlassButton>
          </GlassDropdown>
          <GlassButton variant="icon" aria-label="添加附件" @click="emit('attach')">
            <AddIcon size="16" />
          </GlassButton>
        </div>

        <div class="glass-composer__toolbar-right">
          <span class="glass-composer__counter">{{ counterText }}</span>
          <GlassButton
            variant="send"
            :disabled="!canSend"
            aria-label="发送"
            @click="onSend"
          >
            <ArrowUpIcon size="16" />
          </GlassButton>
        </div>
      </div>
    </div>

    <p class="glass-composer__disclaimer">{{ disclaimer }}</p>
  </div>
</template>

<style scoped>
.glass-composer {
  width: 100%;
  max-width: var(--glass-wb-main-max);
  margin: 0 auto;
  padding: 0 4px;
  flex-shrink: 0;
}

.glass-composer__card {
  border: 1px solid var(--glass-border-soft);
  border-radius: var(--glass-wb-card-radius);
  background: var(--glass-wb-white);
  padding: 14px 16px 12px;
  box-shadow: var(--glass-wb-card-shadow);
}

.glass-composer__input :deep(.t-textarea__inner) {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 14px;
  color: var(--glass-text-primary);
  line-height: 1.5;
  resize: none;
  box-shadow: none;
}

.glass-composer__input :deep(.t-textarea__inner::placeholder) {
  color: var(--glass-text-muted);
}

/* t-textarea 在 maxlength 下自绘计数；本组件用工具栏自定义 counter，隐藏内建避免重复 */
.glass-composer__input :deep(.t-textarea__limit) {
  display: none;
}

.glass-composer__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}

.glass-composer__toolbar-left,
.glass-composer__toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.glass-composer__counter {
  font-size: 12px;
  color: var(--glass-text-muted);
  min-width: 48px;
  text-align: right;
}

.glass-composer__disclaimer {
  margin: 14px 0 0;
  text-align: center;
  font-size: 12px;
  color: var(--glass-text-muted);
  line-height: 1.5;
}
</style>
