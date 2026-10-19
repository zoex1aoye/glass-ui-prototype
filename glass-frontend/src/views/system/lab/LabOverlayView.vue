<script setup lang="ts">
/**
 * 实验室·遮罩与整装 — Confirm Sheet / Popconfirm / FormPane。
 * GlassDialog = 短确认；GlassFormPane = 多段表单整装会话窗。
 * 本页只演示 Overlay 选型、校验与关闭协议，不改 Glass 公共实现。
 */
import { nextTick, ref } from 'vue'

import type { FormRules, SubmitContext } from 'tdesign-vue-next'

import {
  GlassButton,
  GlassDialog,
  GlassDialogSection,
  GlassForm,
  GlassFormPane,
  GlassInput,
  GlassMessagePlugin,
  GlassPopconfirm,
  GlassSelect,
} from '@/components/glass'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const lastAction = ref('（尚未交互）')

interface DialogCloseContext {
  trigger: string
  e: MouseEvent | KeyboardEvent
}

const dialogVisible = ref(false)
const dangerDialogVisible = ref(false)

function openConfirmDialog() {
  dialogVisible.value = true
}

function openDangerDialog() {
  dangerDialogVisible.value = true
}

function onDialogConfirm() {
  dialogVisible.value = false
  lastAction.value = 'dialog confirm → neutral'
}

function onDialogCancel() {
  dialogVisible.value = false
  lastAction.value = 'dialog cancel → neutral'
}

function onDangerDialogConfirm() {
  dangerDialogVisible.value = false
  lastAction.value = 'dialog confirm → destructive'
}

function onDangerDialogCancel() {
  dangerDialogVisible.value = false
  lastAction.value = 'dialog cancel → destructive'
}

function onPopconfirmConfirm() {
  lastAction.value = 'popconfirm confirm → destructive delete'
}

function onPopconfirmCancel() {
  lastAction.value = 'popconfirm cancel → destructive delete'
}

function onNeutralPopconfirmConfirm() {
  lastAction.value = 'popconfirm confirm → neutral export'
}

function onNeutralPopconfirmCancel() {
  lastAction.value = 'popconfirm cancel → neutral export'
}

/* ---------- FormPane · Neutral 创建型 ---------- */
const roleOptions = [
  { label: '演示角色 A', value: '演示角色 A' },
  { label: '演示角色 B', value: '演示角色 B' },
  { label: '演示角色 C', value: '演示角色 C' },
]

const createVisible = ref(false)
const createForm = ref({ title: '', role: '', note: '' })
const createFormRef = ref<InstanceType<typeof GlassForm>>()

const createRules: FormRules = {
  title: [{ required: true, message: '请输入条目标题', type: 'error', trigger: 'blur' }],
  role: [{ required: true, message: '请选择演示角色', type: 'error', trigger: 'change' }],
  note: [
    {
      validator: (val: string) => !val || val.length <= 200,
      message: '备注最长 200 字',
      type: 'error',
      trigger: 'blur',
    },
  ],
}

function openCreateDialog() {
  createVisible.value = true
}

function onCreateConfirm() {
  createFormRef.value?.submit()
}

function onCreateSubmit(context: SubmitContext) {
  if (context.validateResult === true) {
    createVisible.value = false
    lastAction.value = `create submit → title=${createForm.value.title}, role=${createForm.value.role}`
  } else {
    lastAction.value = `create submit invalid → ${context.firstError ?? '校验未通过'}`
  }
}

function onCreateCancel() {
  createVisible.value = false
  lastAction.value = 'create dialog cancel → neutral'
}

function onCreateClose({ trigger }: DialogCloseContext) {
  createVisible.value = false
  lastAction.value = `create dialog close → ${trigger}`
}

/* ---------- Dialog · Destructive 删除确认 ---------- */
const deleteVisible = ref(false)
const deleteForm = ref({ reason: '', confirmed: false })
const deleteFormRef = ref<InstanceType<typeof GlassForm>>()

const deleteRules: FormRules = {
  reason: [{ required: true, message: '请输入删除原因', type: 'error', trigger: 'blur' }],
  confirmed: [
    {
      validator: (val: unknown) => ({
        result: val === true,
        message: '请先确认已知悉不可恢复',
        type: 'error' as const,
      }),
      trigger: 'change',
    },
  ],
}

function openDeleteDialog() {
  deleteVisible.value = true
}

function onDeleteConfirm() {
  deleteFormRef.value?.submit()
}

function onDeleteSubmit(context: SubmitContext) {
  if (context.validateResult === true) {
    deleteVisible.value = false
    lastAction.value = `delete submit → reason=${deleteForm.value.reason}`
  } else {
    lastAction.value = `delete submit invalid → ${context.firstError ?? '校验未通过'}`
  }
}

function onDeleteCancel() {
  deleteVisible.value = false
  lastAction.value = 'delete dialog cancel → destructive'
}

function onDeleteClose({ trigger }: DialogCloseContext) {
  deleteVisible.value = false
  lastAction.value = `delete dialog close → ${trigger}`
}

/* ---------- Dialog · Validation 三态并列 ---------- */
const validationVisible = ref(false)
const validationForm = ref({ account: '', quota: '', note: '' })
const validationFormRef = ref<InstanceType<typeof GlassForm>>()

function openValidationDialog() {
  validationVisible.value = true
  nextTick(() => {
    validationFormRef.value?.clearValidate()
  })
}

function injectValidationStates() {
  validationFormRef.value?.setValidateMessage({
    account: [{ type: 'error', message: '账号不能为空' }],
    quota: [{ type: 'warning', message: '配额接近上限' }],
    note: [{ type: 'success', message: '备注格式正确' }],
  })
  lastAction.value = 'validation → setValidateMessage error + warning + success'
}

function clearValidationStates() {
  validationFormRef.value?.clearValidate()
  lastAction.value = 'validation → clearValidate'
}

function onValidationConfirm() {
  validationVisible.value = false
  lastAction.value = 'validation confirm → close'
}

function onValidationCancel() {
  validationVisible.value = false
  lastAction.value = 'validation dialog cancel'
}

function onValidationClose({ trigger }: DialogCloseContext) {
  validationVisible.value = false
  lastAction.value = `validation dialog close → ${trigger}`
}

/* ---------- Dialog · 异步提交 Loading ---------- */
const asyncVisible = ref(false)
const asyncLoading = ref(false)
const asyncForm = ref({ note: '' })
const asyncFormRef = ref<InstanceType<typeof GlassForm>>()

const asyncRules: FormRules = {
  note: [{ required: true, message: '请输入备注', type: 'error', trigger: 'blur' }],
}

function openAsyncDialog() {
  asyncVisible.value = true
}

function onAsyncConfirm() {
  if (asyncLoading.value) return
  asyncFormRef.value?.submit()
}

async function onAsyncSubmit(context: SubmitContext) {
  if (context.validateResult !== true) {
    lastAction.value = `async submit invalid → ${context.firstError ?? '校验未通过'}`
    return
  }

  asyncLoading.value = true
  lastAction.value = 'async submit → confirmLoading=true (2000ms)'

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 2000)
  })

  asyncLoading.value = false
  asyncVisible.value = false
  GlassMessagePlugin.success('提交成功')
  lastAction.value = `async submit → success, note=${asyncForm.value.note}`
}

function onAsyncCancel() {
  if (asyncLoading.value) {
    lastAction.value = 'async cancel ignored → confirmLoading locked'
    return
  }
  asyncVisible.value = false
  lastAction.value = 'async dialog cancel → no submit'
}

function onAsyncVisibleChange(visible: boolean) {
  if (!visible && asyncLoading.value) {
    lastAction.value = 'async close blocked → confirmLoading locked'
    return
  }
  asyncVisible.value = visible
}

function onAsyncClose({ trigger }: DialogCloseContext) {
  if (asyncLoading.value) {
    lastAction.value = `async close blocked → confirmLoading locked (${trigger})`
    return
  }
  asyncVisible.value = false
  lastAction.value = `async dialog close → ${trigger}`
}

/* ---------- Dialog · Reset-on-Close 对照 ---------- */
const destroyVisible = ref(false)
const destroyForm = ref({ note: '' })

function openDestroyDialog() {
  destroyForm.value = { note: '' }
  destroyVisible.value = true
}

function onDestroyConfirm() {
  destroyVisible.value = false
  lastAction.value = 'reset-on-close(destroy) → cleared'
}

function onDestroyCancel() {
  destroyVisible.value = false
  lastAction.value = 'reset-on-close(destroy) → cleared'
}

function onDestroyClose({ trigger }: DialogCloseContext) {
  destroyVisible.value = false
  lastAction.value = `reset-on-close(destroy) → cleared (${trigger})`
}

const resetVisible = ref(false)
const resetForm = ref({ note: '' })
const resetFormRef = ref<InstanceType<typeof GlassForm>>()

function openResetDialog() {
  resetVisible.value = true
}

function resetInitialForm() {
  nextTick(() => {
    resetFormRef.value?.reset({ type: 'initial' })
  })
}

function onResetConfirm() {
  resetVisible.value = false
  lastAction.value = 'reset-on-close(initial) → formRef.reset'
  resetInitialForm()
}

function onResetCancel() {
  resetVisible.value = false
  lastAction.value = 'reset-on-close(initial) → formRef.reset'
  resetInitialForm()
}

function onResetClose({ trigger }: DialogCloseContext) {
  resetVisible.value = false
  lastAction.value = `reset-on-close(initial) → formRef.reset (${trigger})`
  resetInitialForm()
}
</script>

<template>
  <LabPageShell
    title="实验室·遮罩与整装"
    desc="Overlay 选型活文档：GlassDialog Confirm Sheet 负责短确认 / 危险确认；GlassFormPane 负责多段表单整装会话窗；GlassPopconfirm 负责页内低干扰确认。Scrim 共用，分区只用 Pure Spacing。"
    :live="lastAction"
  >
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">0. Dialog / FormPane 边界</span>
        <span class="lab-section-meta">
          先看任务形态，再选浮层；风险确认与表单整装不混用
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">GlassDialog · Confirm Sheet</span>
          <p class="lab-control-note">
            短确认、危险确认、单问题决策。默认脚钮；危险确认使用
            <code>theme="danger"</code>。不承载多段表单。
          </p>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">GlassFormPane · 表单整装会话窗</span>
          <p class="lab-control-note">
            多字段创建 / 编辑、需要 GlassDialogSection 分段。无默认脚钮，必须通过
            <code>#footer</code> 自备取消与确认；确认走 <code>formRef.submit()</code>。
          </p>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">GlassPopconfirm · 页内轻确认</span>
          <p class="lab-control-note">
            就近确认轻量操作，不打断页面；不需要独立 Form 时优先使用。危险操作仍须明确文案。
          </p>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">禁用边界</span>
          <p class="lab-control-note">
            聊天气泡、PosterWash、扇形头等 Nested Chrome 不得塞入 Overlay；Scrim 与分区不得用白渐变补白或
            inset hairline 伪造层次。
          </p>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">键盘与读屏验收（I1）</span>
          <p class="lab-control-note">
            打开任一 Dialog / FormPane 后：焦点落到首个字段或「取消」；Tab / Shift+Tab 只在面板内循环；
            Esc 或右上角「关闭」（Enter / Space）可退出；关闭后焦点回到触发按钮。
            FormPane 表单多项校验失败时，提交后焦点落到首个无效字段并关联错误描述。
          </p>
        </div>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">1. Confirm Sheet / Dialog + Inline Confirm / Popconfirm</span>
        <span class="lab-section-meta">
          GlassDialog + GlassPopconfirm · Modal Scrim · Destructive vs Neutral Confirm ·
          脚钮 = GlassButton（确认 primary/danger · 取消 quiet）· 底层 t-dialog / t-popconfirm
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Neutral Confirm（Confirm Sheet / Dialog）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="primary" @click="openConfirmDialog">打开信息确认</GlassButton>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">Destructive Confirm（Dialog theme=danger）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="danger" @click="openDangerDialog">打开删除确认</GlassButton>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">Neutral Inline Confirm（Popconfirm）</span>
          <div class="lab-control-row-items">
            <GlassPopconfirm
              content="将按当前筛选条件导出示范数据结果，是否继续？"
              @confirm="onNeutralPopconfirmConfirm"
              @cancel="onNeutralPopconfirmCancel"
            >
              <GlassButton variant="soft">导出示范数据</GlassButton>
            </GlassPopconfirm>
          </div>
        </div>
        <div class="lab-control-row">
          <span class="lab-control-label">Destructive Inline Confirm（Popconfirm）</span>
          <div class="lab-control-row-items">
            <GlassPopconfirm
              theme="danger"
              content="确认删除该演示条目？此操作不可恢复。"
              @confirm="onPopconfirmConfirm"
              @cancel="onPopconfirmCancel"
            >
              <GlassButton variant="soft">删除演示条目</GlassButton>
            </GlassPopconfirm>
          </div>
        </div>
      </div>
      <GlassDialog
        v-model:visible="dialogVisible"
        header="信息确认"
        subtitle="演示条目 · 当前筛选"
        theme="default"
        @confirm="onDialogConfirm"
        @cancel="onDialogCancel"
      >
        将按当前筛选条件导出示范数据结果，是否继续？
      </GlassDialog>
      <GlassDialog
        v-model:visible="dangerDialogVisible"
        header="删除确认"
        theme="danger"
        @confirm="onDangerDialogConfirm"
        @cancel="onDangerDialogCancel"
      >
        确认删除该演示条目？此操作不可恢复。
      </GlassDialog>
    </section>

    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">2. FormPane × Form vs Dialog × Form</span>
        <span class="lab-section-meta">
          GlassFormPane = 表单整装会话窗；GlassDialog = Confirm Sheet（短确认 / 危险确认）·
          Submit-via-Form Protocol · Async Confirm Loading · Reset-on-Close
        </span>
      </div>

      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">2.1 Neutral 创建型</span>
          <div class="lab-control-row-items">
            <GlassButton variant="primary" @click="openCreateDialog">新建演示条目</GlassButton>
          </div>
          <p class="lab-control-note">
            FormPane 自备 quiet 取消 + primary 确认；确认 → formRef.submit() →
            validateResult === true 才关闭，取消 / 关闭均记录 lastAction。
          </p>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">2.2 Destructive 删除确认</span>
          <div class="lab-control-row-items">
            <GlassButton variant="danger" @click="openDeleteDialog">删除演示条目</GlassButton>
          </div>
          <p class="lab-control-note">
            Dialog Confirm Sheet（theme=danger）· 删除原因 + 不可恢复确认均通过 Form rules，
            确认钮走默认 danger 变体。
          </p>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">2.3 Validation 三态并列</span>
          <div class="lab-control-row-items">
            <GlassButton variant="soft" @click="openValidationDialog">
              查看校验三态示例
            </GlassButton>
          </div>
          <p class="lab-control-note">
            setValidateMessage 一次注入 error / warning / success；success FormItem 开启 success-border 对照。
          </p>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">2.4 异步提交 Loading</span>
          <div class="lab-control-row-items">
            <GlassButton variant="primary" @click="openAsyncDialog">
              提交演示任务（异步）
            </GlassButton>
          </div>
          <p class="lab-control-note">
            Form 校验通过后 confirmLoading=true，模拟 2000ms 异步；loading 期间 Dialog 保持锁定。
          </p>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">2.5 Reset-on-Close 对照</span>
          <div class="lab-form-row">
            <div class="lab-form-panel lab-form-panel--narrow">
              <p class="lab-control-label">destroyOnClose=true</p>
              <GlassButton variant="soft" @click="openDestroyDialog">
                打开 Dialog A
              </GlassButton>
            </div>
            <div class="lab-form-panel lab-form-panel--narrow">
              <p class="lab-control-label">destroyOnClose=false + reset(initial)</p>
              <GlassButton variant="soft" @click="openResetDialog">
                打开 Dialog B
              </GlassButton>
            </div>
          </div>
          <p class="lab-control-note">
            输入备注后关闭再重开：左列由 destroyOnClose 重建，右列在 close 后执行
            formRef.reset({ type: 'initial' })。
          </p>
        </div>
      </div>

      <GlassFormPane
        v-model:visible="createVisible"
        title="新建演示条目"
        subtitle="填写后创建一条演示条目"
        @close="onCreateClose"
      >
        <GlassForm
          ref="createFormRef"
          :data="createForm"
          :rules="createRules"
          label-align="top"
          @submit="onCreateSubmit"
        >
          <GlassDialogSection title="基础信息">
            <t-form-item label="条目标题" name="title" :required-mark="true">
              <GlassInput
                v-model="createForm.title"
                placeholder="例如：示范数据复盘"
                clearable
              />
            </t-form-item>
            <t-form-item label="角色" name="role" :required-mark="true">
              <GlassSelect
                v-model="createForm.role"
                :options="roleOptions"
                placeholder="选择演示角色"
                clearable
              />
            </t-form-item>
          </GlassDialogSection>
          <GlassDialogSection title="说明" subtitle="可留空" :divider="true">
            <t-form-item label="备注" name="note">
              <t-textarea
                v-model="createForm.note"
                placeholder="可选备注，最长 200 字"
                :maxlength="200"
                :autosize="{ minRows: 3, maxRows: 5 }"
              />
            </t-form-item>
          </GlassDialogSection>
        </GlassForm>
        <template #footer>
          <GlassButton variant="quiet" @click="onCreateCancel">取消</GlassButton>
          <GlassButton variant="primary" shape="round" @click="onCreateConfirm">
            确认
          </GlassButton>
        </template>
      </GlassFormPane>

      <GlassDialog
        v-model:visible="deleteVisible"
        header="删除演示条目"
        theme="danger"
        :confirm-on-enter="false"
        @confirm="onDeleteConfirm"
        @cancel="onDeleteCancel"
        @close="onDeleteClose"
      >
        <p class="lab-control-note">删除后不可恢复，请填写原因并确认。</p>
        <GlassForm
          ref="deleteFormRef"
          :data="deleteForm"
          :rules="deleteRules"
          label-align="top"
          @submit="onDeleteSubmit"
        >
          <t-form-item label="删除原因" name="reason" :required-mark="true">
            <t-textarea
              v-model="deleteForm.reason"
              placeholder="请输入删除原因"
              :maxlength="200"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
          <t-form-item label="我已理解不可恢复" name="confirmed" :required-mark="true">
            <t-checkbox v-model="deleteForm.confirmed">确认删除该演示条目</t-checkbox>
          </t-form-item>
        </GlassForm>
      </GlassDialog>

      <GlassDialog
        v-model:visible="validationVisible"
        header="校验三态示例"
        theme="default"
        :confirm-on-enter="false"
        @confirm="onValidationConfirm"
        @cancel="onValidationCancel"
        @close="onValidationClose"
      >
        <div class="lab-control-row-items">
          <GlassButton variant="soft" @click="injectValidationStates">
            注入三态校验
          </GlassButton>
        </div>
        <p class="lab-control-note">
          一次注入 error / warning / success；success FormItem 开启 success-border 做对照。
        </p>
        <GlassForm
          ref="validationFormRef"
          :data="validationForm"
          label-align="top"
        >
          <t-form-item label="账号" name="account">
            <GlassInput v-model="validationForm.account" placeholder="error 态" />
          </t-form-item>
          <t-form-item label="配额" name="quota">
            <GlassInput v-model="validationForm.quota" placeholder="warning 态" />
          </t-form-item>
          <t-form-item label="备注" name="note" :success-border="true">
            <t-textarea
              v-model="validationForm.note"
              placeholder="success 态 + success-border"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </t-form-item>
        </GlassForm>
        <div class="lab-form-actions">
          <GlassButton variant="quiet" @click="clearValidationStates">
            清除校验
          </GlassButton>
        </div>
      </GlassDialog>

      <GlassDialog
        :visible="asyncVisible"
        header="提交演示任务"
        theme="default"
        :confirm-loading="asyncLoading"
        :confirm-on-enter="false"
        @update:visible="onAsyncVisibleChange"
        @confirm="onAsyncConfirm"
        @cancel="onAsyncCancel"
        @close="onAsyncClose"
      >
        <p class="lab-control-note">
          确认后模拟 2s 异步提交；confirmLoading 期间遮罩点击 / Esc 保持锁定。
        </p>
        <GlassForm
          ref="asyncFormRef"
          :data="asyncForm"
          :rules="asyncRules"
          label-align="top"
          @submit="onAsyncSubmit"
        >
          <t-form-item label="备注" name="note" :required-mark="true">
            <t-textarea
              v-model="asyncForm.note"
              placeholder="填写演示备注后提交"
              :maxlength="200"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
        </GlassForm>
        <template #footer>
          <GlassButton
            variant="quiet"
            :disabled="asyncLoading"
            @click="onAsyncCancel"
          >
            取消
          </GlassButton>
          <GlassButton
            variant="primary"
            shape="round"
            :loading="asyncLoading"
            @click="onAsyncConfirm"
          >
            确认
          </GlassButton>
        </template>
      </GlassDialog>

      <GlassDialog
        v-model:visible="destroyVisible"
        header="Dialog A · destroyOnClose"
        theme="default"
        :destroy-on-close="true"
        :confirm-on-enter="false"
        @confirm="onDestroyConfirm"
        @cancel="onDestroyCancel"
        @close="onDestroyClose"
      >
        <GlassForm :data="destroyForm" label-align="top">
          <t-form-item label="备注" name="note">
            <GlassInput
              v-model="destroyForm.note"
              placeholder="输入备注后关闭，再打开应为空"
            />
          </t-form-item>
        </GlassForm>
      </GlassDialog>

      <GlassDialog
        v-model:visible="resetVisible"
        header="Dialog B · reset(initial)"
        theme="default"
        :destroy-on-close="false"
        :confirm-on-enter="false"
        @confirm="onResetConfirm"
        @cancel="onResetCancel"
        @close="onResetClose"
      >
        <GlassForm ref="resetFormRef" :data="resetForm" label-align="top">
          <t-form-item label="备注" name="note">
            <GlassInput
              v-model="resetForm.note"
              placeholder="输入备注后关闭，再打开应恢复 initial"
            />
          </t-form-item>
        </GlassForm>
      </GlassDialog>
    </section>
  </LabPageShell>
</template>
