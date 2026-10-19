<script setup lang="ts">
/**
 * 实验室·表单密度 — Glass Form Density Living Demo（矩阵 A–G）
 * A Living top · B Label left · C Label right · D Choice Quiet
 * E Validation Whisper · F Disabled / Readonly · G Popup Width Sync
 * Density：Field 38 + radius 12 · Quiet Field Chrome · Label Rhythm · Kill Inner Rect。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import type { FormRules, SubmitContext } from 'tdesign-vue-next'

import {
  GlassButton,
  GlassForm,
  GlassInput,
  GlassRadio,
  GlassRadioGroup,
  GlassSelect,
} from '@/components/glass'

import { useDocsProps } from '@/layouts/useDocsProps'
import type { DocsDemoBlock } from '@/layouts/useDocsProps'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const lastAction = ref('（尚未交互）')
const docsProps = useDocsProps()

const demoRadioValue = ref('week')
const demoFormName = ref('')

const demoBlocks: DocsDemoBlock[] = [
  {
    id: 'radio-group',
    label: 'Radio Group',
    description: 'GlassRadioGroup · variant / appearance / disabled',
    props: [
      {
        key: 'variant',
        label: 'variant',
        type: 'select',
        defaultValue: 'rounded',
        options: [
          { label: 'default', value: 'default' },
          { label: 'rounded', value: 'rounded' },
          { label: 'capsule', value: 'capsule' },
        ],
      },
      {
        key: 'appearance',
        label: 'appearance',
        type: 'select',
        defaultValue: 'filled',
        options: [
          { label: 'outline', value: 'outline' },
          { label: 'filled', value: 'filled' },
        ],
      },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'form-density',
    label: 'Form Density',
    description: 'GlassForm · labelAlign / disabled / readonly',
    props: [
      {
        key: 'labelAlign',
        label: 'labelAlign',
        type: 'select',
        defaultValue: 'top',
        options: [
          { label: 'top', value: 'top' },
          { label: 'left', value: 'left' },
          { label: 'right', value: 'right' },
        ],
      },
      { key: 'disabled', label: 'disabled', type: 'boolean', defaultValue: false },
      { key: 'readonly', label: 'readonly', type: 'boolean', defaultValue: false },
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

const radioGroupDemo = computed(() => {
  const v = docsProps.state.values['radio-group'] ?? {}
  return {
    variant: (v.variant as 'default' | 'rounded' | 'capsule') ?? 'rounded',
    appearance: (v.appearance as 'outline' | 'filled') ?? 'filled',
    disabled: Boolean(v.disabled ?? false),
  }
})

const formDensity = computed(() => {
  const v = docsProps.state.values['form-density'] ?? {}
  return {
    labelAlign: (v.labelAlign as 'top' | 'left' | 'right') ?? 'top',
    disabled: Boolean(v.disabled ?? false),
    readonly: Boolean(v.readonly ?? false),
  }
})

/* ---------- A · Living top ---------- */
const formInitial = {
  title: '',
  role: '',
  note: '',
}

const formData = ref({ ...formInitial })
const formRef = ref<InstanceType<typeof GlassForm>>()

const roleOptions = [
  { label: '角色 A', value: '角色 A' },
  { label: '角色 B', value: '角色 B' },
  { label: '角色 C', value: '角色 C' },
]

const formRules: FormRules = {
  title: [
    { required: true, message: '请输入会话标题', type: 'error', trigger: 'blur' },
    {
      validator: (val: string) => (val?.length ?? 0) <= 40,
      message: '会话标题最长 40 字',
      type: 'error',
      trigger: 'blur',
    },
  ],
  role: [{ required: true, message: '请选择角色', type: 'error', trigger: 'change' }],
  note: [
    {
      validator: (val: string) => !val || val.length <= 200,
      message: '备注最长 200 字',
      type: 'error',
      trigger: 'blur',
    },
  ],
}

function onFormSubmit(context: SubmitContext) {
  if (context.validateResult === true) {
    lastAction.value = `form-submit → title=${formData.value.title || '（空）'}, role=${formData.value.role}`
  } else {
    lastAction.value = `form-submit invalid → ${context.firstError ?? '校验未通过'}`
  }
}

function onFormReset() {
  formData.value = { ...formInitial }
  lastAction.value = 'form-reset'
}

function onFormCancel() {
  formRef.value?.reset()
}

/* ---------- B / C · Label Align left / right ---------- */
const sideData = ref({ owner: '', channel: '' })

const channelOptions = [
  { label: '线上', value: '线上' },
  { label: '门店', value: '门店' },
  { label: '渠道', value: '渠道' },
]

/* ---------- D · Choice Quiet ---------- */
const choiceData = ref({
  scopes: ['范围 A'],
  priority: 'p1',
  notify: true,
})

const scopeOptions = [
  { label: '范围 A', value: '范围 A' },
  { label: '范围 B', value: '范围 B' },
  { label: '范围 C', value: '范围 C' },
]

const priorityOptions = [
  { label: 'P0 高', value: 'p0' },
  { label: 'P1 中', value: 'p1' },
  { label: 'P2 低', value: 'p2' },
]

/* ---------- D+ · Radio Group · variant × appearance 3×2 Matrix ---------- */
const radioDefaultOutline = ref('d1')
const radioDefaultFilled = ref('d1')
const radioRoundedOutline = ref('week')
const radioRoundedFilled = ref('week')
const radioCapsuleOutline = ref('week')
const radioCapsuleFilled = ref('week')
const radioCapsuleDisabled = ref('week')

const defaultOptions = [
  { label: '选项 A', value: 'd1' },
  { label: '选项 B', value: 'd2' },
  { label: '选项 C', value: 'd3' },
]

/* 分段轨（rounded / capsule 共用）：日 / 周 / 月 / 季（禁用） */
const segmentOptions = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '季（禁用）', value: 'quarter', disabled: true },
]

function onRadioDefaultChange(value: string | number | boolean) {
  lastAction.value = `radio default → ${String(value)}`
}

function onRadioCapsuleChange(value: string | number | boolean) {
  lastAction.value = `radio capsule → ${String(value)}`
}

/* ---------- E · Validation Whisper ---------- */
const whisperData = ref({ account: '', quota: '' })
const whisperRef = ref<InstanceType<typeof GlassForm>>()

function onWhisperValidateError() {
  whisperRef.value?.submit()
  lastAction.value = 'whisper → submit invalid (focus first error)'
}

function onWhisperInject() {
  whisperRef.value?.setValidateMessage({
    account: [{ type: 'warning', message: '账号长度偏短，建议使用企业邮箱前缀' }],
    quota: [{ type: 'success', message: '配额格式正确' }],
  })
  lastAction.value = 'whisper → setValidateMessage warning + success'
}

function onWhisperClear() {
  whisperRef.value?.clearValidate()
  lastAction.value = 'whisper → clearValidate'
}

/* ---------- F · Disabled / Readonly ---------- */
const lockedData = ref({ name: '演示条目 01', owner: '王倩' })

/* ---------- G · Popup Width Sync ---------- */
const widthSyncForm = ref({ widthSync: '' })
const widthSyncOptions = [
  { label: '角色 A · 分组 A', value: '角色 A · 分组 A' },
  { label: '角色 B · 分组 B', value: '角色 B · 分组 B' },
  { label: '角色 C · 分组 C', value: '角色 C · 分组 C' },
  { label: '角色 D · 分组 D', value: '角色 D · 分组 D' },
]
</script>

<template>
  <LabPageShell
    title="实验室·表单密度"
    desc="Glass Form Density · Quiet Field Chrome · Label Rhythm · Validation Whisper · Popup Width Sync · Field 38 + radius 12。矩阵 A–G 覆盖 top / left / right / Choice / Whisper / Disabled·Readonly / Width Sync。"
    :live="lastAction"
  >
    <!-- 0. Live Props Demo -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">0. Live Props Demo</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 variant / appearance / disabled / labelAlign / readonly；画布控件即时反映。
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">GlassRadioGroup · variant / appearance / disabled</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('radio-group') }"
              role="button"
              tabindex="0"
              @click="selectDemo('radio-group')"
              @keydown.enter="selectDemo('radio-group')"
              @keydown.space.prevent="selectDemo('radio-group')"
            >
              <GlassRadioGroup
                v-model="demoRadioValue"
                :variant="radioGroupDemo.variant"
                :appearance="radioGroupDemo.appearance"
                :disabled="radioGroupDemo.disabled"
                :options="segmentOptions"
              />
            </div>
          </div>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">GlassForm · labelAlign / disabled / readonly</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('form-density') }"
              role="button"
              tabindex="0"
              @click="selectDemo('form-density')"
              @keydown.enter="selectDemo('form-density')"
              @keydown.space.prevent="selectDemo('form-density')"
            >
              <div class="lab-form-panel lab-form-panel--narrow">
                <GlassForm
                  :data="{ name: demoFormName }"
                  :label-align="formDensity.labelAlign"
                  :colon="false"
                  :status-icon="false"
                  :disabled="formDensity.disabled"
                  :readonly="formDensity.readonly"
                >
                  <t-form-item label="会话名称" name="name">
                    <GlassInput
                      v-model="demoFormName"
                      placeholder="试试右栏改动"
                      clearable
                    />
                  </t-form-item>
                </GlassForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- A · Living · top -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">A · Living · top（默认 Glass Density）</span>
        <span class="lab-section-meta">
          GlassForm · GlassSelect · 底层 t-form / t-select / t-textarea · Quiet Field Chrome · Soft Surface
        </span>
      </div>
      <div class="lab-form-panel">
        <GlassForm
          ref="formRef"
          :data="formData"
          :rules="formRules"
          label-align="top"
          :colon="false"
          :status-icon="false"
          @submit="onFormSubmit"
          @reset="onFormReset"
        >
          <t-form-item label="会话标题" name="title" :required-mark="true">
            <GlassInput v-model="formData.title" placeholder="例如：演示条目 01" clearable />
          </t-form-item>

          <t-form-item label="角色" name="role" :required-mark="true">
            <GlassSelect
              v-model="formData.role"
              :options="roleOptions"
              placeholder="选择 AI 角色"
              clearable
            />
          </t-form-item>

          <t-form-item label="备注" name="note">
            <t-textarea
              v-model="formData.note"
              placeholder="可选备注，最长 200 字"
              :maxlength="200"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>

          <div class="lab-form-actions">
            <GlassButton variant="primary" @click="formRef?.submit()">提交</GlassButton>
            <GlassButton variant="soft" @click="onFormCancel">取消</GlassButton>
            <GlassButton variant="quiet" @click="onFormReset">重置</GlassButton>
          </div>
        </GlassForm>
      </div>
      <p class="lab-control-note">
        不填写直接「提交」即可验证多错首错落焦：焦点会落到首个无效字段，错误文案通过
        <code>aria-describedby</code> / <code>aria-invalid</code> 关联，并以 live region 播报。
        可见 label 已自动生成 <code>for</code> / <code>id</code> 关联；placeholder 不再充当可访问名。
      </p>
    </section>

    <!-- B · Label Align · left -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">B · Label Align · left</span>
        <span class="lab-section-meta">
          Label Rhythm · labelWidth 96 · 控件列与 Field 38 垂直居中 · 短表示意
        </span>
      </div>
      <div class="lab-form-panel">
        <GlassForm
          :data="sideData"
          label-align="left"
          :label-width="96"
          :colon="false"
          :status-icon="false"
        >
          <t-form-item label="负责人" name="owner">
            <GlassInput v-model="sideData.owner" placeholder="输入姓名" />
          </t-form-item>
          <t-form-item label="来源渠道" name="channel">
            <GlassSelect
              v-model="sideData.channel"
              :options="channelOptions"
              placeholder="选择渠道"
              clearable
            />
          </t-form-item>
          <div class="lab-form-actions">
            <GlassButton variant="soft">保存</GlassButton>
          </div>
        </GlassForm>
      </div>
    </section>

    <!-- C · Label Align · right -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">C · Label Align · right</span>
        <span class="lab-section-meta">
          Label Rhythm · labelWidth 96 · 右对齐标签 · 与 B 同密度
        </span>
      </div>
      <div class="lab-form-panel">
        <GlassForm
          :data="sideData"
          label-align="right"
          :label-width="96"
          :colon="false"
          :status-icon="false"
        >
          <t-form-item label="负责人" name="owner">
            <GlassInput v-model="sideData.owner" placeholder="输入姓名" />
          </t-form-item>
          <t-form-item label="来源渠道" name="channel">
            <GlassSelect
              v-model="sideData.channel"
              :options="channelOptions"
              placeholder="选择渠道"
              clearable
            />
          </t-form-item>
          <div class="lab-form-actions">
            <GlassButton variant="soft">保存</GlassButton>
          </div>
        </GlassForm>
      </div>
    </section>

    <!-- D · Controls · Choice -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">D · Controls · Choice Quiet</span>
        <span class="lab-section-meta">
          CheckboxGroup + RadioGroup + Switch · 字色 secondary · 三者选中统一 Action Blue · 禁用降透 · 无脏方框
        </span>
      </div>
      <div class="lab-form-panel">
        <GlassForm
          :data="choiceData"
          label-align="top"
          :colon="false"
          :status-icon="false"
        >
          <t-form-item label="授权范围" name="scopes">
            <t-checkbox-group v-model="choiceData.scopes" :options="scopeOptions" />
          </t-form-item>
          <t-form-item label="优先级" name="priority">
            <GlassRadioGroup v-model="choiceData.priority" variant="default" :options="priorityOptions" />
          </t-form-item>
          <t-form-item label="变更通知" name="notify">
            <t-switch v-model="choiceData.notify" />
          </t-form-item>
          <div class="lab-form-actions">
            <GlassButton variant="soft">应用</GlassButton>
          </div>
        </GlassForm>
      </div>
    </section>

    <!-- D+ · Radio Group · variant × appearance 3×2 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">D+ · GlassRadioGroup — variant × appearance</span>
        <span class="lab-section-meta">
          variant=default/rounded/capsule × appearance=outline/filled 3×2 矩阵
          · 形状：default 圆点 · rounded 圆角矩形 · capsule 真胶囊
          · State Matrix：checked / hover / disabled / focus（hover 与 focus 为交互态，悬停 / Tab 聚焦观察）
        </span>
      </div>
      <div class="lab-form-row">
        <div class="lab-form-panel lab-form-panel--narrow">
          <p class="lab-control-note">default × outline · 空心圆 + 选中蓝边 Action Blue 点芯（slot + 禁用项）</p>
          <GlassRadioGroup v-model="radioDefaultOutline" variant="default" appearance="outline" @change="onRadioDefaultChange">
            <GlassRadio value="d1">选项 A</GlassRadio>
            <GlassRadio value="d2">选项 B</GlassRadio>
            <GlassRadio value="d3" disabled>选项 C</GlassRadio>
          </GlassRadioGroup>
        </div>
        <div class="lab-form-panel lab-form-panel--narrow">
          <p class="lab-control-note">default × filled · 选中整圆实心 Action Blue（无白核）</p>
          <GlassRadioGroup v-model="radioDefaultFilled" variant="default" appearance="filled" :options="defaultOptions" />
        </div>
      </div>
      <div class="lab-form-row">
        <div class="lab-form-panel lab-form-panel--narrow">
          <p class="lab-control-note">rounded × outline · 圆角矩形分段（track 12 / item 8）+ 蓝描边 wash</p>
          <GlassRadioGroup v-model="radioRoundedOutline" variant="rounded" appearance="outline" :options="segmentOptions" />
        </div>
        <div class="lab-form-panel lab-form-panel--narrow">
          <p class="lab-control-note">rounded × filled · 圆角矩形分段 + 选中实心 Action Blue</p>
          <GlassRadioGroup v-model="radioRoundedFilled" variant="rounded" appearance="filled" :options="segmentOptions" />
        </div>
      </div>
      <div class="lab-form-row">
        <div class="lab-form-panel lab-form-panel--narrow">
          <p class="lab-control-note">capsule × outline · 真胶囊（pill 两端半圆）+ 蓝描边 wash</p>
          <GlassRadioGroup v-model="radioCapsuleOutline" variant="capsule" appearance="outline" :options="segmentOptions" @change="onRadioCapsuleChange" />
        </div>
        <div class="lab-form-panel lab-form-panel--narrow">
          <p class="lab-control-note">capsule × filled · 真胶囊 + 选中实心 Action Blue</p>
          <GlassRadioGroup v-model="radioCapsuleFilled" variant="capsule" appearance="filled" :options="segmentOptions" />
        </div>
      </div>
      <div class="lab-form-panel lab-form-panel--narrow">
        <p class="lab-control-note">capsule disabled（整组 disabled，含选中）</p>
        <GlassRadioGroup v-model="radioCapsuleDisabled" variant="capsule" :options="segmentOptions" disabled />
      </div>
      <p class="lab-control-note">
        与 Form 内「Choice Quiet」的关系：Form 内 GlassRadioGroup（default）与上方独立 Radio 同轨 Action Blue；
        Checkbox / Radio / Switch 三者选中统一 Action Blue。hover = 点/分段项轻提亮（Hover Whisper）·
        active = scale(0.98) 压入 · focus = :focus-visible token ring · disabled = 降透 not-allowed ·
        prefers-reduced-motion 下关闭 scale。appearance 默认：default→outline，rounded/capsule→filled（显式传值可交叉）。
        圆角矩形（rounded）与真胶囊（capsule）是两种不同 shape，勿混称。
      </p>
    </section>

    <!-- E · Validation Whisper -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">E · Validation Whisper</span>
        <span class="lab-section-meta">
          error（required）· setValidateMessage 注入 warning + success · 12px 柔色 tip · statusIcon=false ·
          submit 失败落焦首个无效字段
        </span>
      </div>
      <div class="lab-form-panel">
        <GlassForm
          ref="whisperRef"
          :data="whisperData"
          label-align="top"
          :colon="false"
          :status-icon="false"
          :rules="{
            account: [{ required: true, message: '请输入账号', type: 'error', trigger: 'blur' }],
          }"
        >
          <t-form-item label="账号" name="account" :required-mark="true">
            <GlassInput v-model="whisperData.account" placeholder="blur 后触发 required error" />
          </t-form-item>
          <t-form-item label="配额" name="quota">
            <GlassInput v-model="whisperData.quota" placeholder="可注入 warning / success 示意" />
          </t-form-item>
          <div class="lab-form-actions">
            <GlassButton variant="primary" @click="onWhisperValidateError">触发 error</GlassButton>
            <GlassButton variant="soft" @click="onWhisperInject">注入 warning+success</GlassButton>
            <GlassButton variant="quiet" @click="onWhisperClear">清除</GlassButton>
          </div>
        </GlassForm>
      </div>
    </section>

    <!-- F · Disabled / Readonly -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">F · Disabled / Readonly</span>
        <span class="lab-section-meta">
          整表 disabled 降透（Glass 壳同步）· 整表 readonly 透传 Form API · Quiet hairline 保持边界可读
        </span>
      </div>
      <div class="lab-form-row">
        <div class="lab-form-panel lab-form-panel--narrow">
          <p class="lab-control-note">disabled</p>
          <GlassForm :data="lockedData" label-align="top" :colon="false" :status-icon="false" disabled>
            <t-form-item label="条目名称" name="name">
              <GlassInput v-model="lockedData.name" />
            </t-form-item>
            <t-form-item label="负责人" name="owner">
              <GlassSelect
                v-model="lockedData.owner"
                :options="[
                  { label: '王倩', value: '王倩' },
                  { label: '李昂', value: '李昂' },
                ]"
              />
            </t-form-item>
          </GlassForm>
        </div>
        <div class="lab-form-panel lab-form-panel--narrow">
          <p class="lab-control-note">readonly</p>
          <GlassForm :data="lockedData" label-align="top" :colon="false" :status-icon="false" readonly>
            <t-form-item label="条目名称" name="name">
              <t-input v-model="lockedData.name" />
            </t-form-item>
            <t-form-item label="负责人" name="owner">
              <t-select
                v-model="lockedData.owner"
                :options="[
                  { label: '王倩', value: '王倩' },
                  { label: '李昂', value: '李昂' },
                ]"
              />
            </t-form-item>
          </GlassForm>
        </div>
      </div>
    </section>

    <!-- G · Popup Width Sync -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">G · Popup Width Sync</span>
        <span class="lab-section-meta">
          固定宽 280px 触发器 + filterable（Form 内）· 下拉宽同步 · hover 无内环
        </span>
      </div>
      <div class="lab-form-panel">
        <div class="lab-popup-width-demo">
          <!-- 包进 GlassForm：filterable 无 t-is-readonly，覆盖 Form :deep hover 回写内环回归 -->
          <GlassForm
            :data="widthSyncForm"
            label-align="top"
            :colon="false"
            :status-icon="false"
          >
            <t-form-item label="可筛选 Select" name="widthSync">
              <GlassSelect
                v-model="widthSyncForm.widthSync"
                :options="widthSyncOptions"
                filterable
                clearable
                placeholder="展开后量宽 ≈ 280px · hover 无内环"
                class="lab-popup-width-demo__trigger"
              />
            </t-form-item>
          </GlassForm>
          <p class="lab-control-note">
            GlassSelect 默认注入
            <code>popupProps.overlayInnerStyle</code>
            （函数返回 width = trigger.offsetWidth）。若调用方已传 overlayInnerStyle.width 或自定义函数，则尊重覆盖、不二次锁宽。
            请展开下拉对照面板宽与触发器一致；hover 时内芯无环、外壳 Quiet hairline Fade。
          </p>
        </div>
      </div>
    </section>
  </LabPageShell>
</template>

<style scoped>
/* G · Popup Width Sync：固定宽触发器，便于对照下拉面板宽 */
.lab-popup-width-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.lab-popup-width-demo__trigger {
  width: 280px;
}

.lab-popup-width-demo code {
  font-size: 12px;
  color: var(--glass-text-secondary);
}
</style>
