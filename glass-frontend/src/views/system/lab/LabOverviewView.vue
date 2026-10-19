<script setup lang="ts">
/**
 * 组件实验室总览 · Lab Hub
 * Material / Density / Tone 三行宪章摘要 + 卡片链到 Living Demo。
 */
import { useRouter } from 'vue-router'

import LabPageShell from './LabPageShell.vue'
import './lab-shared.css'

const router = useRouter()

const hubCards = [
  {
    path: '/',
    title: '总览',
    desc: 'Material / Density / Tone 宪章 · Live Props 指引 · Living Demo 全量索引',
  },
  {
    path: '/layout',
    title: '布局',
    desc: '四层栈 L0–L3 · Surface / Panel / Rail / Stage · Flush / 禁双托盘；Composer 见 Inputs · Table 见 Data',
  },
  {
    path: '/poster',
    title: '海报技法',
    desc: '七色 / 深度五档 · 海报三技法 · 小物件↔大容器 · 换算表 · PosterWash 整装舞台',
  },
  {
    path: '/actions',
    title: '按钮与行动',
    desc: 'Primary Pill · Quiet Chrome · Action Pair · StickyTool FAB 52',
  },
  {
    path: '/inputs',
    title: '输入与日期',
    desc: 'Capsule Search / Field / Suggest Chip / Composer · Date / Time / Range Picker · Calendar',
  },
  {
    path: '/forms',
    title: '表单密度',
    desc: 'Glass Form Density · Field 38 + radius 12 · Choice Quiet 三件统一 Action Blue · Radio variant×appearance 2×2',
  },
  {
    path: '/overlay',
    title: '遮罩与整装',
    desc: 'GlassDialog Confirm Sheet · GlassFormPane 表单整装 · Popconfirm · 选型边界',
  },
  {
    path: '/feedback',
    title: '反馈与加载',
    desc: 'Inline Banner · Soft Toast / Notice · Sound Wave Loading / Fullscreen',
  },
  {
    path: '/data',
    title: '数据展示',
    desc: 'Quiet Grid · Descriptions / Card / Bubble / Progress / Comment / Collapse · Badge',
  },
  {
    path: '/navigation',
    title: '导航与步骤',
    desc: 'GlassTabs · line / soft / capsule / card · GlassSteps default / dot · 状态与只读',
  },
] as const

function go(path: string) {
  void router.push(path)
}
</script>

<template>
  <LabPageShell
    title="组件实验室 · Glass Component Lab"
    desc="独立 Demo 路由族。视觉权威已定 --glass-wb-* / --glass-* token；每页 Living Demo 可点可用。"
  >
    <!-- 宪章三行摘要 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">风格一致性宪章</span>
        <span class="lab-section-meta">Material Stack / Density / Tone · 术语用于注释、分区标题与面包屑</span>
      </div>
      <div class="lab-charter">
        <div class="lab-charter-row">
          <span class="lab-charter-term">Material</span>
          <span>
            Poster Wash(z0) · Host Tray / Behind Surface(z3) · Frost Glass(Rail) · Near-White Stage /
            Floating Plate(Stage) · Inset Reveal · Flush Stitch(gap=0) · surface-air bloom
          </span>
        </div>
        <div class="lab-charter-row">
          <span class="lab-charter-term">Density</span>
          <span>
            Capsule Search 33 · Field·Pill 38 / radius 999 · Table size=small · FAB 52 · 同页同一垂直节奏
          </span>
        </div>
        <div class="lab-charter-row">
          <span class="lab-charter-term">Tone</span>
          <span>
            小物件满浓蓝（Primary Pill / Affordant Orb）vs 大容器 5–15% 蓝染；无锐白高光核；无 1px 硬描边
          </span>
        </div>
      </div>
    </section>

    <!-- Living Demo 卡片链 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">Living Demo 导航</span>
        <span class="lab-section-meta">每路由独立文件 · 双通道：侧栏「实验室·」扁平子项 + 下方卡片</span>
      </div>
      <div class="lab-hub-grid">
        <button
          v-for="card in hubCards"
          :key="card.path"
          type="button"
          class="lab-hub-card"
          @click="go(card.path)"
          @keydown.enter="go(card.path)"
        >
          <span class="lab-hub-card-title">{{ card.title }}</span>
          <span class="lab-hub-card-desc">{{ card.desc }}</span>
        </button>
      </div>
    </section>

    <!-- Live Props 试用指引 -->
    <section class="lab-section">
      <div class="lab-section-label">
        <span class="lab-section-name">Live Props 试用指引</span>
        <span class="lab-section-meta">各页顶部均有「0. Live Props Demo」区块：点选演示卡片后，右栏 Props 面板即可改属性并即时反映。</span>
      </div>
      <p class="lab-control-note">
        Inputs / Overlay / Feedback / Forms / Layout 五页已打通完整闭环；Navigation / Data / Poster
        也各有一个可调区块。Overview 仅作索引说明，不硬造无控件 Props。
      </p>
    </section>

  </LabPageShell>
</template>
