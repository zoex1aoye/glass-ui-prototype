<script setup lang="ts">
/**
 * 实验室·反馈与加载 — Inline InfoBar / Toast / Soft Notice / Sound Wave Loading。
 * Overlay（Dialog / FormPane / Popconfirm）与 GlassBadge 已按控件职能迁出。
 */
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'

import {
  GlassAlert,
  GlassButton,
  GlassLoading,
  GlassMessage,
  GlassMessagePlugin,
  GlassNotification,
  GlassNotificationPlugin,
  GlassPanel,
  GlassPosterWash,
  GlassSurface,
  GlassTooltip,
  GlassTooltipLite,
} from '@/components/glass'

import { useDocsProps } from '@/layouts/useDocsProps'
import type { DocsDemoBlock } from '@/layouts/useDocsProps'

import { useGlassScheme } from '@/scheme/useGlassScheme'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const { tt } = useGlassScheme()

const lastAction = ref('（尚未交互）')
const docsProps = useDocsProps()

const demoBlocks: DocsDemoBlock[] = [
  {
    id: 'inline-alert',
    label: 'Inline Banner',
    description: 'GlassAlert · theme / closeBtn / title',
    props: [
      {
        key: 'theme',
        label: 'theme',
        type: 'select',
        defaultValue: 'info',
        options: [
          { label: 'success', value: 'success' },
          { label: 'info', value: 'info' },
          { label: 'warning', value: 'warning' },
          { label: 'error', value: 'error' },
        ],
      },
      { key: 'closeBtn', label: 'closeBtn', type: 'boolean', defaultValue: true },
      { key: 'title', label: 'title', type: 'text', defaultValue: '同步完成' },
    ],
  },
]

onMounted(() => {
  for (const block of demoBlocks) docsProps.registerDemo(block)
})

function isDemoSelected(id: string): boolean {
  return docsProps.state.activeDemoId === id
}

function selectDemo(id: string): void {
  docsProps.selectDemo(id)
}

const inlineAlert = computed(() => {
  const v = docsProps.state.values['inline-alert'] ?? {}
  return {
    theme: (v.theme as 'success' | 'info' | 'warning' | 'error') ?? 'info',
    closeBtn: Boolean(v.closeBtn ?? true),
    title: String(v.title ?? '同步完成'),
  }
})

function onAlertClose(theme: string) {
  lastAction.value = `alert close → ${theme}`
}

function onAlertDetail() {
  lastAction.value = 'alert operation → 查看详情 (warning)'
}

/* ---------- Soft Toast / Message ---------- */
const toastMethods = {
  info: GlassMessagePlugin.info,
  success: GlassMessagePlugin.success,
  warning: GlassMessagePlugin.warning,
  error: GlassMessagePlugin.error,
  question: GlassMessagePlugin.question,
  loading: GlassMessagePlugin.loading,
} as const

type ToastTheme = keyof typeof toastMethods

const toastContent: Record<ToastTheme, string> = {
  info: 'info · Soft Toast via GlassMessagePlugin.info',
  success: 'success · 已保存：示范数据已更新',
  warning: 'warning · 示范数据波动较大，请复核口径',
  error: 'error · 导出失败：当前账号权限不足',
  question: 'question · 是否保留当前演示上下文？',
  loading: 'loading · 正在同步示范数据…',
}

function onToast(theme: ToastTheme) {
  toastMethods[theme](toastContent[theme])
  lastAction.value = `message → ${theme}`
}

function onClosableToast() {
  GlassMessagePlugin.info({
    content: '常驻提示：closeBtn 可手动关闭（duration=0）。',
    closeBtn: true,
    duration: 0,
  })
  lastAction.value = 'message → info closable（duration=0）'
}

function onCloseAllToast() {
  GlassMessagePlugin.closeAll()
  lastAction.value = 'message → closeAll'
}

/* ---------- Soft Notice / Notification ---------- */
const noticeMethods = {
  info: GlassNotificationPlugin.info,
  success: GlassNotificationPlugin.success,
  warning: GlassNotificationPlugin.warning,
  error: GlassNotificationPlugin.error,
} as const

type NoticeTheme = keyof typeof noticeMethods

const noticeContent: Record<NoticeTheme, { title: string; content: string }> = {
  info: {
    title: '演示数据保留策略',
    content: '演示上下文将保留 7 天，过期后自动清理。',
  },
  success: {
    title: '同步完成',
    content: '示范数据已全部同步完成，可以开始查看。',
  },
  warning: {
    title: '示范数据需复核',
    content: '示范数据「演示项 A」波动较大，建议复核口径。',
  },
  error: {
    title: '导出失败',
    content: '当前账号权限不足，请联系管理员。',
  },
}

function onNotice(theme: NoticeTheme) {
  noticeMethods[theme](noticeContent[theme])
  lastAction.value = `notification → ${theme}`
}

function onClosableNotice() {
  GlassNotificationPlugin.info({
    title: '常驻通知',
    content: 'closeBtn 可手动关闭（duration=0）。',
    closeBtn: true,
    duration: 0,
  })
  lastAction.value = 'notification → info closable（duration=0）'
}

function onCloseAllNotice() {
  GlassNotificationPlugin.closeAll()
  lastAction.value = 'notification → closeAll'
}

function onNoticeFooterAction() {
  lastAction.value = 'notification footer → 查看详情'
}

function onNoticeFooterLater() {
  lastAction.value = 'notification footer → 稍后处理'
}

/*
 * Collapse 演示（maxLine=1）：TDesign 按 message 数组「项数」折叠，非 CSS 视觉行。
 * 单条超长 string 不会触发折叠；须传 string[]。GlassAlert.message 已支持 string | string[]。
 */
const collapseMessage: string[] = [
  '同步策略：示范字段按新口径每日 02:00 增量同步。',
  '演示账号权限随分组刷新；跨区共享以最新配置为准。',
  '若遇延迟或冲突，请至「设置 · 同步任务」查看失败明细。',
]

/* ---------- Tooltip · Frosted tip / weak arrow ---------- */
const liteTrigger = () =>
  h(
    GlassButton,
    {
      variant: 'soft',
    },
    () => tt('feedback.tooltip.lite.trigger'),
  )

/* ---------- Loading · Sound Wave / Fullscreen ---------- */
const fullscreenLoading = ref(false)
let fullscreenLoadingTimer: ReturnType<typeof setTimeout> | undefined

function triggerFullscreenLoading() {
  if (fullscreenLoadingTimer) clearTimeout(fullscreenLoadingTimer)
  fullscreenLoading.value = true
  lastAction.value = 'loading fullscreen → 开启（约 1.8s 自动关闭）'
  fullscreenLoadingTimer = setTimeout(() => {
    fullscreenLoading.value = false
    lastAction.value = 'loading fullscreen → 已关闭'
  }, 1800)
}

onBeforeUnmount(() => {
  for (const block of demoBlocks) docsProps.unregisterDemo(block.id)
  if (fullscreenLoadingTimer) clearTimeout(fullscreenLoadingTimer)
})
</script>

<template>
  <LabPageShell
    :title="tt('feedback.page.title')"
    :desc="tt('feedback.page.desc')"
    :live="lastAction"
  >
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('lab.section.liveProps') }}</span>
        <span class="lab-section-meta">
          点选下方演示区块后，右栏 Props 面板可改 theme / closeBtn / title；画布控件即时反映。
        </span>
      </div>
      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Inline Banner · theme / closeBtn / title</span>
          <div class="lab-control-row-items">
            <div
              class="docs-demo-block"
              :class="{ 'is-selected': isDemoSelected('inline-alert') }"
              role="button"
              tabindex="0"
              @click="selectDemo('inline-alert')"
              @keydown.enter="selectDemo('inline-alert')"
              @keydown.space.prevent="selectDemo('inline-alert')"
            >
              <GlassAlert
                :theme="inlineAlert.theme"
                :title="inlineAlert.title"
                message="示范数据已全部同步完成，可以开始查看。"
                :close-btn="inlineAlert.closeBtn"
                @close="onAlertClose(inlineAlert.theme)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('feedback.section.banner') }}</span>
        <span class="lab-section-meta">
          Semantic Solid · InfoBar · blur none · 轻 Rest · Glass Host Demo（无左侧色带）
        </span>
      </div>
      <p class="lab-control-note">
        键盘验收（I3）：Tab 聚焦 Alert 的关闭 / 展开控件，或常驻 Message / Notice 的关闭控件，
        Enter / Space 触发；关闭控件可聚焦，但 Toast 不会自动抢焦点。
      </p>
      <GlassPosterWash class="lab-alert-host" fit="cover">
        <div class="lab-alert-stack">
          <div class="lab-alert-group">
            <p class="lab-alert-group-title">Tone Spectrum · success 带 title，其余仅 message</p>
            <GlassAlert
              theme="success"
              title="同步完成"
              message="示范数据已全部同步完成，可以开始查看。"
              @close="onAlertClose('success')"
            />
            <GlassAlert
              theme="info"
              message="演示上下文将保留 7 天，过期后自动清理。"
              @close="onAlertClose('info')"
            />
            <GlassAlert
              theme="warning"
              message="示范数据「演示项 A」波动较大，建议复核口径。"
              @close="onAlertClose('warning')"
            />
            <GlassAlert
              theme="error"
              message="导出失败：当前账号权限不足，请联系管理员。"
              @close="onAlertClose('error')"
            />
          </div>

          <div class="lab-alert-group">
            <p class="lab-alert-group-title">Persistent · closeBtn=false（不可关闭）</p>
            <GlassAlert
              theme="info"
              :close-btn="false"
              message="该公告不可关闭：示范数据同步策略自本月起调整，每日 00:00 自动执行增量同步。"
            />
          </div>

          <div class="lab-alert-group">
            <p class="lab-alert-group-title">
              Operation · #operation text CTA（无底文字钮 · 非 ghost 圆钮 / 非 quiet pill）
            </p>
            <GlassAlert
              theme="warning"
              message="示范数据「演示项 A」需复核，确认口径后再更新快照。"
            >
              <template #operation>
                <GlassButton variant="text" @click="onAlertDetail">查看详情</GlassButton>
              </template>
            </GlassAlert>
          </div>

          <div class="lab-alert-group">
            <p class="lab-alert-group-title">
              Collapse · maxLine=1 · 「展开更多/收起」与 Text CTA 同 --glass-wb-text-cta-*（TD __collapse 主题化，非裸 brand）
            </p>
            <GlassAlert theme="info" :max-line="1" :message="collapseMessage" />
          </div>
        </div>
      </GlassPosterWash>
    </section>

    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('feedback.section.tooltip') }}</span>
        <span class="lab-section-meta">{{ tt('feedback.tooltip.meta') }}</span>
      </div>

      <GlassSurface class="lab-surface-host">
        <div class="lab-plate-grid">
          <GlassPanel
            variant="standalone"
            :title="tt('feedback.tooltip.panel.default')"
            class="lab-plate"
          >
            <div class="lab-plate-stack">
              <div class="lab-tooltip-row">
                <GlassTooltip
                  placement="top"
                  :content="tt('feedback.tooltip.default.content')"
                >
                  <GlassButton variant="soft">
                    {{ tt('feedback.tooltip.placement.top') }}
                  </GlassButton>
                </GlassTooltip>
                <GlassTooltip
                  placement="right"
                  :content="tt('feedback.tooltip.default.content')"
                >
                  <GlassButton variant="quiet">
                    {{ tt('feedback.tooltip.placement.right') }}
                  </GlassButton>
                </GlassTooltip>
                <GlassTooltip
                  placement="bottom"
                  :content="tt('feedback.tooltip.default.content')"
                >
                  <GlassButton variant="soft">
                    {{ tt('feedback.tooltip.placement.bottom') }}
                  </GlassButton>
                </GlassTooltip>
                <GlassTooltip
                  placement="left"
                  :content="tt('feedback.tooltip.default.content')"
                >
                  <GlassButton variant="quiet">
                    {{ tt('feedback.tooltip.placement.left') }}
                  </GlassButton>
                </GlassTooltip>
              </div>
              <div class="lab-control-note">{{ tt('feedback.tooltip.note') }}</div>
            </div>
          </GlassPanel>

          <GlassPanel
            variant="standalone"
            :title="tt('feedback.tooltip.panel.lite')"
            class="lab-plate"
          >
            <div class="lab-plate-stack">
              <div class="lab-tooltip-row">
                <GlassTooltipLite
                  placement="top"
                  theme="light"
                  :content="tt('feedback.tooltip.lite.light.content')"
                >
                  <GlassButton variant="soft">
                    {{ tt('feedback.tooltip.lite.light.trigger') }}
                  </GlassButton>
                </GlassTooltipLite>
                <GlassTooltipLite
                  placement="bottom"
                  theme="default"
                  :content="tt('feedback.tooltip.lite.default.content')"
                  :trigger-element="liteTrigger"
                />
              </div>
              <div class="lab-control-note">{{ tt('feedback.tooltip.note') }}</div>
            </div>
          </GlassPanel>
        </div>
      </GlassSurface>
    </section>

    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('feedback.section.toast') }}</span>
        <span class="lab-section-meta">
          GlassMessage + GlassMessagePlugin · Semantic Solid · Toast · Plugin Portal · 底层 t-message
        </span>
      </div>

      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Imperative · Plugin 各态（自动消失）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="soft" @click="onToast('info')">info</GlassButton>
            <GlassButton variant="soft" @click="onToast('success')">success</GlassButton>
            <GlassButton variant="soft" @click="onToast('warning')">warning</GlassButton>
            <GlassButton variant="soft" @click="onToast('error')">error</GlassButton>
            <GlassButton variant="soft" @click="onToast('question')">question</GlassButton>
            <GlassButton variant="soft" @click="onToast('loading')">loading</GlassButton>
          </div>
          <p class="lab-control-note">
            点击经 GlassMessagePlugin.* 弹出（className 自动挂 glass-message），并写入 lastAction。
          </p>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Imperative · Closable（closeBtn + duration=0）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="soft" @click="onClosableToast">常驻可关闭</GlassButton>
            <GlassButton variant="quiet" @click="onCloseAllToast">closeAll</GlassButton>
          </div>
          <p class="lab-control-note">
            duration=0 常驻、closeBtn 手动关闭；closeAll 一键清空所有 Soft Toast。
          </p>
        </div>
      </div>

      <div class="lab-message-host">
        <div class="lab-message-stack">
          <GlassMessage theme="success" content="success · 已保存：示范数据已更新。" :duration="0" />
          <GlassMessage theme="info" content="info · 同步任务已入队，预计 2 分钟内完成。" :duration="0" />
          <GlassMessage theme="warning" content="warning · 示范数据波动较大，请复核口径。" :duration="0" />
          <GlassMessage theme="error" content="error · 导出失败：当前账号权限不足。" :duration="0" />
          <GlassMessage theme="question" content="question · 是否保留当前演示上下文？" :duration="0" />
          <GlassMessage theme="loading" content="loading · 正在同步示范数据…" :duration="0" />
        </div>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('feedback.section.notice') }}</span>
        <span class="lab-section-meta">
          GlassNotification + GlassNotificationPlugin · Semantic Solid · Soft Notice · Plugin Portal · 底层 t-notification
        </span>
      </div>

      <div class="lab-controls">
        <div class="lab-control-row">
          <span class="lab-control-label">Imperative · Plugin 四态（角区 Soft Notice）</span>
          <div class="lab-control-row-items">
            <GlassButton variant="soft" @click="onNotice('info')">info</GlassButton>
            <GlassButton variant="soft" @click="onNotice('success')">success</GlassButton>
            <GlassButton variant="soft" @click="onNotice('warning')">warning</GlassButton>
            <GlassButton variant="soft" @click="onNotice('error')">error</GlassButton>
          </div>
          <p class="lab-control-note">
            点击经 GlassNotificationPlugin.* 弹出（className 自动挂 glass-notification --{theme}），并写入 lastAction。
          </p>
        </div>

        <div class="lab-control-row">
          <span class="lab-control-label">Imperative · Closable（closeBtn + duration=0）+ closeAll</span>
          <div class="lab-control-row-items">
            <GlassButton variant="soft" @click="onClosableNotice">常驻可关闭</GlassButton>
            <GlassButton variant="quiet" @click="onCloseAllNotice">closeAll</GlassButton>
          </div>
          <p class="lab-control-note">
            duration=0 常驻、closeBtn 手动关闭；closeAll 一键清空所有 Soft Notice。
          </p>
        </div>
      </div>

      <div class="lab-message-host">
        <div class="lab-message-stack">
          <GlassNotification
            theme="success"
            title="同步完成"
            content="示范数据已全部同步完成，可以开始查看。"
            :duration="0"
          />
          <GlassNotification
            theme="info"
            title="演示数据保留策略"
            content="演示上下文将保留 7 天，过期后自动清理。"
            :duration="0"
          />
          <GlassNotification
            theme="warning"
            title="示范数据需复核"
            content="示范数据「演示项 A」波动较大，建议复核口径。"
            :duration="0"
          />
          <GlassNotification
            theme="error"
            title="导出失败"
            content="当前账号权限不足，请联系管理员。"
            :duration="0"
          />
          <GlassNotification
            theme="info"
            title="Footer · 右下角行动区"
            content="行动区贴主栏底、水平靠右：quiet 文字钮与次钮同排，gap 由 theme 层统一。"
            :duration="0"
          >
            <template #footer>
              <GlassButton variant="quiet" @click="onNoticeFooterLater">
                稍后处理
              </GlassButton>
              <GlassButton variant="quiet" @click="onNoticeFooterAction">
                查看详情
              </GlassButton>
            </template>
          </GlassNotification>
        </div>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">{{ tt('feedback.section.loading') }}</span>
        <span class="lab-section-meta">
          TDesign：t-loading（size / text / fullscreen / showOverlay / delay / indicator / attach / inheritColor）·
          玻璃：三条竖向音浪条错峰伸缩、无描边；reduced-motion 静止为三根中等高度 ·
          容器：GlassSurface → GlassPanel variant="standalone" → GlassLoading（Ld1–Ld3 各异）·
          fullscreen 仅按钮触发短演示，实例挂 section 末
        </span>
      </div>

      <GlassSurface class="lab-surface-host">
        <div class="lab-plate-grid">
          <GlassPanel variant="standalone" title="Ld1 · 三条竖向音浪 · size=small / medium / large" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-loading-row">
                <GlassLoading size="small" />
                <GlassLoading size="medium" />
                <GlassLoading size="large" />
              </div>
              <div class="lab-control-note">
                无内容 → 走 t-loading 独立分支；默认三条竖条错峰起伏，非 TD 硬圆环
              </div>
            </div>
          </GlassPanel>

          <GlassPanel variant="standalone" title="Ld2 · 包裹块 · showOverlay 轻 mask + text" class="lab-plate">
            <div class="lab-plate-stack">
              <GlassLoading loading text="数据加载中…" show-overlay>
                <div class="lab-loading-block">
                  <div class="lab-loading-block-title">会话清单占位</div>
                  <div class="lab-loading-block-body">这里是被包裹的内容，加载时上方覆盖轻 mask 与三条竖向音浪。</div>
                </div>
              </GlassLoading>
              <div class="lab-control-note">
                轻 mask 对齐 table loading mask，非实白盖板；音浪条仍可辨
              </div>
            </div>
          </GlassPanel>

          <GlassPanel variant="standalone" title="Ld3 · Fullscreen · 按钮触发短演示" class="lab-plate">
            <div class="lab-plate-stack">
              <div class="lab-table-title-row">
                <span class="lab-control-note">约 1.8s 自动关闭，可反复触发</span>
                <GlassButton variant="soft" @click="triggerFullscreenLoading">
                  {{ fullscreenLoading ? '演示中…' : '开启 Fullscreen Loading' }}
                </GlassButton>
              </div>
              <div class="lab-control-note">
                点击后全屏轻 mask 展示（preventScrollThrough）；fullscreen 实例挂 section 末，不进入 Panel standalone
              </div>
            </div>
          </GlassPanel>
        </div>
      </GlassSurface>

      <GlassLoading
        :loading="fullscreenLoading"
        fullscreen
        prevent-scroll-through
        text="加载中…"
      />
    </section>
  </LabPageShell>
</template>

<style scoped>
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

.lab-plate {
  min-width: 0;
}

.lab-plate-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.lab-loading-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

.lab-tooltip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.lab-loading-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 16px;
  border-radius: var(--glass-wb-card-radius);
  background: var(--glass-panel-bg);
}

.lab-loading-block-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--glass-text-primary);
}

.lab-loading-block-body {
  font-size: 12px;
  color: var(--glass-text-secondary);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .lab-plate-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
