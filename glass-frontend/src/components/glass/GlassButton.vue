<script setup lang="ts">
/**
 * GlassButton — Compound Wrapper 盖 t-button
 * 与 TDesign 用语对照（TD Button：variant=base|outline|dashed|text；ghost=Boolean；
 * icon-only = shape+icon 组合，无独立 variant 名）：
 *
 * | Glass variant | t-button 透传 | Glass 语义 |
 * | primary | theme=primary · variant=base | 主操作 42/12；shape=round → Pill 38 |
 * | quiet | theme=default · variant=base | Header Quiet CTA；Pill 38 |
 * | icon | theme=default · variant=base · shape=circle | 对 TD icon-only 的 32 圆钮密度+材质预设 |
 * | ghost | theme=primary · variant=base · ghost=true | TD 镂空：透底 + 描边/字色；非 32 圆钮 |
 * | outline | theme=primary · variant=outline | TD 描边；近白玻璃底 + Quiet 蓝描边 |
 * | dashed | theme=primary · variant=dashed | TD 虚框；几何同 outline |
 * | send | theme=primary · variant=base · shape=circle | 发送圆钮；locked 浅底 + 品牌蓝 icon |
 * | soft | theme=default · variant=base | Composer 角色软胶囊 32px |
 * | text | theme=default · variant=text | Text CTA / Ink Link；28/8/13/radius8 |
 * | danger / warning / success | theme 同名 · variant=base | Status Theme Semantic Filled（42/12） |
 *
 * icon vs ghost：icon 是 Glass 的 icon-only 密度预设（circle 32 + Quiet 蓝 icon + inset hairline）；
 * ghost 是 TD 镂空语义（带文案的普通矩形/可 round，透底 + 实线描边），二者禁止混用。
 * outline / dashed / ghost 共用 Quiet Outline Track：hover 同一套 WinUI Subtle
 * （透底无板 · 外影 none · 描边加深 · Quiet Lift）；active 保持 Quiet Active Wash；
 * 禁止 Press Invert（字色反转浅/白）。
 * Interaction：Liquid Lift Press — Filled hover = Hover Lift + Shadow Bloom（无内部 Color Shift）；
 * active = Active Press（translateY 回落/微下沉 + scale）+ 颜色反馈。
 * Separate Tracks：Tonal（quiet/soft/icon/ghost/outline/dashed/text）active = Quiet Active Wash；
 * Filled（primary/send/danger/warning/success）hover 只保留 Lift + Shadow Bloom；
 * active = 满浓 Press，不削弱按压。
 * Contrast-Safe Press：Tonal active 禁止 Press Invert（字色反转浅/白）— 否决见
 * .agents/tmp-quiet-active-invert-eval.md；勿在 active 把字改成白/浅。
 * Tonal Quiet Chrome：soft/icon 无实线 border，轮廓走 inset hairline（--glass-wb-tonal-hairline*）；
 * ghost/outline/dashed 走实线 Quiet Outline token（--glass-wb-ghost-*），不套 inset hairline；
 * quiet = Shadow-only Chrome（对齐 html .pill）：border none，无 inset hairline，仅外影。
 * soft/icon hover hairline Fade（更淡），悬停交给 fill + Hover Lift + Shadow Bloom，禁止脏箍描边。
 * Primary Filled：border none + border-color transparent 盖 TDesign 灰边泄漏；禁止 inset hairline。
 * 幅度 Quiet < Primary（send / status 同 Primary）；disabled / loading 无抬升。
 * 色值一律走 --glass-wb-* / --glass-*，禁止魔法色。
 */
import { computed } from 'vue'

import type { ButtonProps } from 'tdesign-vue-next'

const props = withDefaults(
  defineProps<{
    /** 玻璃材质变体；danger/warning/success = Status Theme Semantic Filled */
    variant?:
      | 'primary'
      | 'quiet'
      | 'icon'
      | 'ghost'
      | 'send'
      | 'soft'
      | 'text'
      | 'outline'
      | 'dashed'
      | 'danger'
      | 'warning'
      | 'success'
    /** t-button shape；icon/send 默认 circle；soft/quiet 默认 round */
    shape?: ButtonProps['shape']
    disabled?: boolean
    /** 透传 t-button loading；交互锁定 */
    loading?: boolean
    block?: boolean
    /** 图标按钮时的无障碍名称 */
    ariaLabel?: string
    /** 透传 t-button icon（TNode）；优先走 #icon 槽 */
    icon?: ButtonProps['icon']
    /** 透传 t-button suffix（TNode）；优先走 #suffix 槽 */
    suffix?: ButtonProps['suffix']
  }>(),
  {
    variant: 'primary',
    shape: undefined,
    disabled: false,
    loading: false,
    block: false,
    ariaLabel: undefined,
    icon: undefined,
    suffix: undefined,
  },
)

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const resolvedShape = computed<ButtonProps['shape']>(() => {
  if (props.shape) return props.shape
  if (props.variant === 'send' || props.variant === 'icon') return 'circle'
  if (props.variant === 'soft' || props.variant === 'quiet') return 'round'
  return undefined
})

/** 透传 t-button variant：text / outline / dashed 同名；其余显式 'base' */
const tButtonVariant = computed<ButtonProps['variant']>(() => {
  if (props.variant === 'text') return 'text'
  if (props.variant === 'outline') return 'outline'
  if (props.variant === 'dashed') return 'dashed'
  return 'base'
})

/** TD ghost 仅在 Glass ghost（镂空）开启；icon 是 icon-only 预设，不传 ghost */
const tButtonGhost = computed(() => props.variant === 'ghost')

/** Status Theme（Semantic Filled）：danger / warning / success */
const isStatusVariant = computed(
  () =>
    props.variant === 'danger' || props.variant === 'warning' || props.variant === 'success',
)

/** Quiet Outline Track：ghost / outline / dashed（带文案，非 icon-only 圆钮） */
const isQuietOutlineVariant = computed(
  () =>
    props.variant === 'ghost' || props.variant === 'outline' || props.variant === 'dashed',
)

/** 透传 t-button theme：status 同名；primary/send/ghost/outline/dashed → primary；
    quiet/soft/icon/text → default（text 勿误挂满浓 primary 底） */
const tButtonTheme = computed<ButtonProps['theme']>(() => {
  if (props.variant === 'danger') return 'danger'
  if (props.variant === 'warning') return 'warning'
  if (props.variant === 'success') return 'success'
  if (
    props.variant === 'primary' ||
    props.variant === 'send' ||
    props.variant === 'ghost' ||
    props.variant === 'outline' ||
    props.variant === 'dashed'
  ) {
    return 'primary'
  }
  return 'default'
})

/** Pill Control density：quiet 一律；primary/status/ghost/outline/dashed 仅 shape=round；text 不进 pill */
const isPillDensity = computed(
  () =>
    props.variant === 'quiet' ||
    ((props.variant === 'primary' ||
      isStatusVariant.value ||
      isQuietOutlineVariant.value) &&
      resolvedShape.value === 'round'),
)

/** disabled / loading 锁定：无 Hover Lift / Active Press */
const isLocked = computed(() => props.disabled || props.loading)

function onClick(e: MouseEvent) {
  if (isLocked.value) return
  emit('click', e)
}
</script>

<template>
  <t-button
    class="glass-button"
    :class="[
      `glass-button--${variant}`,
      {
        'glass-button--pill': isPillDensity,
        'glass-button--locked': isLocked,
      },
    ]"
    :theme="tButtonTheme"
    :variant="tButtonVariant"
    :ghost="tButtonGhost"
    :shape="resolvedShape"
    :disabled="disabled"
    :loading="loading"
    :block="block"
    :icon="icon"
    :suffix="suffix"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <!-- TD 槽位：icon / suffix 勿散落 default，走 .t-icon / __suffix 对齐 -->
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
    <!-- icon-only（icon/send）loading：只留 spinner，避免星标与转圈叠压 -->
    <slot v-if="!(loading && (variant === 'icon' || variant === 'send'))" />
  </t-button>
</template>

<style scoped>
/* Compound Wrapper：外层 Glass 语义壳，内嵌 t-button；材质覆盖走 --glass-wb-* */
.glass-button {
  /* 与 TD `.t-button` 一致：图标 / 文案 / suffix 同一 flex 中轴 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  font-weight: 500;
  transition: var(--glass-wb-control-transition);
}

/* icon / 内嵌 svg 不撑偏 line-box：flex 子项收缩 + 纵向居中 */
.glass-button :deep(.t-icon) {
  display: inline-flex;
  flex-shrink: 0;
  vertical-align: middle;
}

.glass-button :deep(svg) {
  display: block;
  flex-shrink: 0;
  vertical-align: middle;
}

/* —— Liquid Lift Press ——
   Filled hover = Hover Lift（translateY）+ Shadow Bloom，无内部 Color Shift
   active = Active Press（位移回落/微下沉 + scale）+ 颜色反馈
   Separate Tracks：Tonal = Quiet Active Wash；Filled = 满浓 Press
   幅度：Quiet < Primary（send 同 Primary） */

/* Quiet / Soft / Icon / Ghost / Outline / Dashed / Text 幅度
   （text 与 quiet 同 lift 档，幅度可更弱由色态表达） */
.glass-button--quiet:not(.glass-button--locked):hover,
.glass-button--soft:not(.glass-button--locked):hover,
.glass-button--icon:not(.glass-button--locked):hover,
.glass-button--ghost:not(.glass-button--locked):hover,
.glass-button--outline:not(.glass-button--locked):hover,
.glass-button--dashed:not(.glass-button--locked):hover,
.glass-button--text:not(.glass-button--locked):hover {
  transform: translateY(var(--glass-wb-control-lift-quiet));
}

.glass-button--quiet:not(.glass-button--locked):active,
.glass-button--soft:not(.glass-button--locked):active,
.glass-button--icon:not(.glass-button--locked):active,
.glass-button--ghost:not(.glass-button--locked):active,
.glass-button--outline:not(.glass-button--locked):active,
.glass-button--dashed:not(.glass-button--locked):active,
.glass-button--text:not(.glass-button--locked):active {
  transform: translateY(var(--glass-wb-control-press-y)) scale(var(--glass-wb-control-active-scale));
}

/* Primary / Send / Status 幅度 */
.glass-button--primary:not(.glass-button--locked):hover,
.glass-button--send:not(.glass-button--locked):hover,
.glass-button--danger:not(.glass-button--locked):hover,
.glass-button--warning:not(.glass-button--locked):hover,
.glass-button--success:not(.glass-button--locked):hover {
  transform: translateY(var(--glass-wb-control-lift-primary));
}

.glass-button--primary:not(.glass-button--locked):active,
.glass-button--send:not(.glass-button--locked):active,
.glass-button--danger:not(.glass-button--locked):active,
.glass-button--warning:not(.glass-button--locked):active,
.glass-button--success:not(.glass-button--locked):active {
  transform: translateY(var(--glass-wb-control-press-y)) scale(var(--glass-wb-control-active-scale));
}

/* Focus Ring：无位移，rest 影 + ring */
.glass-button:focus-visible {
  outline: none;
  box-shadow: var(--glass-wb-control-focus-ring);
}

/* disabled / loading：降强调，无抬升交互 */
.glass-button--locked {
  cursor: not-allowed;
  filter: none;
  transform: none;
}

.glass-button:disabled {
  opacity: var(--glass-wb-control-disabled-opacity);
  box-shadow: none;
}

/* primary —— 主操作（新会话等）；默认块级，不随 pill 改几何 */
.glass-button--primary {
  height: 42px;
  border-radius: 12px;
  border: none;
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  box-shadow: var(--glass-wb-btn-blue-shadow);
}

/* Primary 禁灰边：高特异性盖 t-button 可能泄漏的灰 border；Filled 不加 inset hairline */
.t-button.glass-button.glass-button--primary {
  border: none;
  border-color: transparent;
}

.glass-button--primary:not(.glass-button--locked):hover {
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  box-shadow: var(--glass-wb-btn-blue-hover-shadow);
}

.glass-button--primary:not(.glass-button--locked):active {
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  filter: none;
  box-shadow: var(--glass-wb-control-active-shadow-tight);
}

.glass-button--primary:focus-visible {
  box-shadow:
    var(--glass-wb-btn-blue-shadow),
    var(--glass-wb-control-focus-ring);
}

/* Pill Control density —— 与 Capsule Field（GlassInput 38px）对齐
   Primary vs Quiet CTA：primary 满浓品牌蓝小物件 / quiet 玻璃次要 */
.glass-button--pill {
  height: var(--glass-wb-pill-height);
  padding: 0 var(--glass-wb-pill-pad-x);
  border-radius: var(--glass-wb-pill-radius);
  font-size: var(--glass-wb-pill-font-size);
  font-weight: var(--glass-wb-pill-font-weight);
}

.glass-button--primary.glass-button--pill {
  box-shadow: var(--glass-wb-pill-pri-shadow);
}

.glass-button--primary.glass-button--pill:not(.glass-button--locked):hover {
  box-shadow: var(--glass-wb-pill-pri-hover-shadow);
}

.glass-button--primary.glass-button--pill:not(.glass-button--locked):active {
  box-shadow: var(--glass-wb-control-active-shadow-tight);
}

.glass-button--primary.glass-button--pill:focus-visible {
  box-shadow:
    var(--glass-wb-pill-pri-shadow),
    var(--glass-wb-control-focus-ring);
}

/* Tonal ripple = 品牌冷色 whisper：盖掉 TDesign base 灰 ripple（#a6a6a6 / --td-gray-color-10）。
   quiet btn/pill 同一类绑定（quiet 一律 Pill density），click tone 不随形态分叉。
   特异性：TDesign `.t-button--variant-base:not(.t-is-disabled):not(.t-button--ghost)` = (0,3,0)；
   本规则 3 class + scoped [data-v] = (0,4,0)，稳定压过；禁止改回弱选择器。 */
.t-button.glass-button.glass-button--quiet {
  --ripple-color: var(--glass-wb-pill-quiet-ripple);
}

.t-button.glass-button.glass-button--soft {
  --ripple-color: var(--glass-wb-soft-ripple);
}

.t-button.glass-button.glass-button--icon {
  --ripple-color: var(--glass-wb-icon-ripple);
}

.t-button.glass-button.glass-button--ghost,
.t-button.glass-button.glass-button--outline,
.t-button.glass-button.glass-button--dashed {
  --ripple-color: var(--glass-wb-ghost-ripple);
}

.t-button.glass-button.glass-button--text {
  --ripple-color: var(--glass-wb-text-cta-ripple);
}

/* quiet —— Header Quiet CTA（分享等）：近白微透玻璃 + 深蓝字；
   Shadow-only Chrome（对齐 html .pill）：border none，无 inset hairline，仅外影 */

.glass-button--quiet {
  border: none;
  background: var(--glass-wb-pill-quiet-bg);
  color: var(--glass-wb-pill-quiet-color);
  -webkit-backdrop-filter: var(--glass-wb-pill-quiet-blur);
  backdrop-filter: var(--glass-wb-pill-quiet-blur);
  box-shadow: var(--glass-wb-pill-quiet-shadow);
}

.glass-button--quiet:not(.glass-button--locked):hover {
  border: none;
  background: var(--glass-wb-pill-quiet-hover-bg);
  color: var(--glass-wb-pill-quiet-color);
  filter: none;
  box-shadow: var(--glass-wb-pill-quiet-hover-shadow);
}

.glass-button--quiet:not(.glass-button--locked):active {
  border: none;
  background: var(--glass-wb-pill-quiet-active-bg);
  color: var(--glass-wb-pill-quiet-active-color);
  filter: none;
  box-shadow: var(--glass-wb-pill-quiet-active-shadow);
}

/* 盖掉 TDesign 默认 :active 深色渗透 / 白字（Contrast-Safe Press，勿靠全局 filter）
   Tonal = Quiet Active Wash + 深字；Press Invert（白/浅字）否决，禁止把 active 字色改浅 */
.glass-button--quiet:not(.glass-button--locked):active {
  background-color: var(--glass-wb-pill-quiet-active-bg);
  color: var(--glass-wb-pill-quiet-active-color);
  filter: none;
}

.glass-button--soft:not(.glass-button--locked):active {
  background-color: var(--glass-wb-soft-active-bg);
  color: var(--glass-wb-soft-active-color);
  filter: none;
}

.glass-button--icon:not(.glass-button--locked):active {
  background-color: var(--glass-wb-icon-active-bg);
  color: var(--glass-wb-icon-active-color);
  filter: none;
}

.glass-button--quiet:focus-visible {
  box-shadow:
    var(--glass-wb-pill-quiet-shadow),
    var(--glass-wb-control-focus-ring);
}

/* quiet loading / locked 字色重申 Quiet CTA 蓝：
   TDesign `.t-button--variant-base.t-is-loading`（0,2,0）把 color/bg/border 洗成 disabled 灰，
   压过 `.glass-button--quiet`（0,1,0）。本规则 3 class 压回蓝字轨；只追加，勿动 rest/hover/active 影栈。 */
.t-button.glass-button.glass-button--quiet.t-is-loading,
.t-button.glass-button.glass-button--quiet.glass-button--locked {
  color: var(--glass-wb-pill-quiet-color);
  background: var(--glass-wb-pill-quiet-bg);
  border-color: transparent;
}

.t-button.glass-button.glass-button--quiet.t-is-loading :deep(.t-loading),
.t-button.glass-button.glass-button--quiet.t-is-loading :deep(.t-icon) {
  color: inherit;
}

/* icon —— TD icon-only 的 Glass 密度预设（附件等）：
   circle 32 + Quiet 蓝 icon + inset hairline；不传 t-button ghost */
.t-button.glass-button.glass-button--icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  border: none;
  background: var(--glass-wb-white);
  color: var(--glass-wb-icon-color);
  box-shadow: var(--glass-wb-tonal-hairline);
}

.glass-button--icon:not(.glass-button--locked):hover {
  border: none;
  background: var(--glass-wb-icon-hover-bg);
  color: var(--glass-wb-icon-color);
  filter: none;
  /* hairline Fade 在前，外影 bloom 在后 */
  box-shadow:
    var(--glass-wb-tonal-hairline-hover),
    var(--glass-wb-pill-quiet-hover-shadow);
}

.glass-button--icon:not(.glass-button--locked):active {
  border: none;
  background: var(--glass-wb-icon-active-bg);
  color: var(--glass-wb-icon-active-color);
  filter: none;
  box-shadow:
    var(--glass-wb-tonal-hairline-active),
    var(--glass-wb-icon-active-shadow);
}

.glass-button--icon:focus-visible {
  box-shadow:
    var(--glass-wb-tonal-hairline),
    var(--glass-wb-control-focus-ring);
}

/* ghost / outline / dashed —— TD 镂空与描边族（带文案，普通矩形 / 可 round）：
   rest：ghost 透底；outline / dashed 近白玻璃底。
   hover：三者共用同一套 WinUI Subtle（透底无板 · 外影 none · 描边加深）；
   active 保持 Quiet Active Wash，禁止 Press Invert。 */
.t-button.glass-button.glass-button--ghost,
.t-button.glass-button.glass-button--outline,
.t-button.glass-button.glass-button--dashed {
  color: var(--glass-wb-ghost-color);
  border: 1px solid var(--glass-wb-ghost-border-color);
  box-shadow: none;
}

.t-button.glass-button.glass-button--ghost {
  background-color: transparent;
}

.t-button.glass-button.glass-button--outline,
.t-button.glass-button.glass-button--dashed {
  background-color: var(--glass-wb-outline-bg);
}

.t-button.glass-button.glass-button--dashed {
  border-style: dashed;
}

/* 默认块级几何 42/12；shape=round 走 Pill 38（见 .glass-button--pill） */
.glass-button--ghost:not(.glass-button--pill),
.glass-button--outline:not(.glass-button--pill),
.glass-button--dashed:not(.glass-button--pill) {
  height: 42px;
  border-radius: 12px;
  font-size: var(--glass-wb-pill-font-size);
  font-weight: var(--glass-wb-pill-font-weight);
}

.t-button.glass-button.glass-button--ghost:not(.glass-button--locked):hover,
.t-button.glass-button.glass-button--outline:not(.glass-button--locked):hover,
.t-button.glass-button.glass-button--dashed:not(.glass-button--locked):hover {
  background-color: var(--glass-wb-ghost-hover-bg);
  color: var(--glass-wb-ghost-hover-color);
  border-color: var(--glass-wb-ghost-hover-border-color);
  filter: none;
  box-shadow: var(--glass-wb-ghost-hover-shadow);
}

.t-button.glass-button.glass-button--ghost:not(.glass-button--locked):active,
.t-button.glass-button.glass-button--outline:not(.glass-button--locked):active,
.t-button.glass-button.glass-button--dashed:not(.glass-button--locked):active {
  background-color: var(--glass-wb-ghost-active-bg);
  color: var(--glass-wb-ghost-active-color);
  border-color: var(--glass-wb-ghost-active-border-color);
  filter: none;
  box-shadow: var(--glass-wb-ghost-active-shadow);
}

.t-button.glass-button.glass-button--ghost:focus-visible,
.t-button.glass-button.glass-button--outline:focus-visible,
.t-button.glass-button.glass-button--dashed:focus-visible {
  box-shadow: var(--glass-wb-control-focus-ring);
}

/* soft —— 软胶囊（角色切换等）；Composer 32px，勿用 pill density；inset hairline */
.glass-button--soft {
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: none;
  background: var(--glass-wb-soft-bg);
  color: var(--glass-wb-soft-color);
  font-size: 12px;
  box-shadow: var(--glass-wb-tonal-hairline);
}

.glass-button--soft:not(.glass-button--locked):hover {
  border: none;
  background: var(--glass-wb-soft-hover-bg);
  color: var(--glass-wb-soft-color);
  filter: none;
  /* hairline Fade 在前，外影 bloom 在后 */
  box-shadow:
    var(--glass-wb-tonal-hairline-hover),
    var(--glass-wb-pill-quiet-hover-shadow);
}

.glass-button--soft:not(.glass-button--locked):active {
  border: none;
  background: var(--glass-wb-soft-active-bg);
  color: var(--glass-wb-soft-active-color);
  filter: none;
  box-shadow:
    var(--glass-wb-tonal-hairline-active),
    var(--glass-wb-soft-active-shadow);
}

.glass-button--soft:focus-visible {
  box-shadow:
    var(--glass-wb-tonal-hairline),
    var(--glass-wb-control-focus-ring);
}

/* soft / icon loading·locked·disabled 字色：盖 TDesign `.t-is-loading` / `.t-is-disabled` 灰轨。
   特异性 3 class + scoped 压过 TD `.t-button--variant-base.t-is-loading` (0,2,0)。
   soft/icon hairline（Track Q）保留；spinner / icon 跟主题蓝字色。quiet 归 Track S，此处勿动。
   icon-only disabled 可略降 opacity（--glass-wb-control-disabled-opacity），色相仍 --glass-wb-icon-color，勿脏灰。 */
.t-button.glass-button.glass-button--soft.t-is-loading,
.t-button.glass-button.glass-button--soft.glass-button--locked {
  color: var(--glass-wb-soft-color);
  background: var(--glass-wb-soft-bg);
  border-color: transparent;
}

.t-button.glass-button.glass-button--icon.t-is-loading,
.t-button.glass-button.glass-button--icon.t-is-disabled,
.t-button.glass-button.glass-button--icon.glass-button--locked {
  color: var(--glass-wb-icon-color);
  background: var(--glass-wb-white);
  border-color: transparent;
  /* 盖掉全局 :disabled { box-shadow: none }，避免 icon disabled 只剩「裸星」 */
  box-shadow: var(--glass-wb-tonal-hairline);
}

.t-button.glass-button.glass-button--soft.t-is-loading :deep(.t-loading),
.t-button.glass-button.glass-button--soft.t-is-loading :deep(.t-icon) {
  color: inherit;
}

.t-button.glass-button.glass-button--icon.t-is-loading :deep(.t-loading),
.t-button.glass-button.glass-button--icon.t-is-loading :deep(.t-icon),
.t-button.glass-button.glass-button--icon.t-is-loading :deep(svg),
.t-button.glass-button.glass-button--icon.t-is-disabled :deep(.t-icon),
.t-button.glass-button.glass-button--icon.t-is-disabled :deep(svg),
.t-button.glass-button.glass-button--icon.glass-button--locked :deep(.t-icon),
.t-button.glass-button.glass-button--icon.glass-button--locked :deep(svg) {
  color: var(--glass-wb-icon-color);
}

/* ghost / outline / dashed locked：透底或近白底保持，描边与字色回到 Quiet 蓝，不出现 TD 灰轨 */
.t-button.glass-button.glass-button--ghost.t-is-loading,
.t-button.glass-button.glass-button--ghost.t-is-disabled,
.t-button.glass-button.glass-button--ghost.glass-button--locked {
  color: var(--glass-wb-ghost-color);
  background-color: transparent;
  border-color: var(--glass-wb-ghost-border-color);
  box-shadow: none;
}

.t-button.glass-button.glass-button--outline.t-is-loading,
.t-button.glass-button.glass-button--outline.t-is-disabled,
.t-button.glass-button.glass-button--outline.glass-button--locked,
.t-button.glass-button.glass-button--dashed.t-is-loading,
.t-button.glass-button.glass-button--dashed.t-is-disabled,
.t-button.glass-button.glass-button--dashed.glass-button--locked {
  color: var(--glass-wb-ghost-color);
  background-color: var(--glass-wb-outline-bg);
  border-color: var(--glass-wb-ghost-border-color);
  box-shadow: none;
}

.t-button.glass-button.glass-button--ghost.t-is-loading :deep(.t-loading),
.t-button.glass-button.glass-button--ghost.t-is-loading :deep(.t-icon),
.t-button.glass-button.glass-button--ghost.t-is-loading :deep(svg),
.t-button.glass-button.glass-button--ghost.t-is-disabled :deep(.t-icon),
.t-button.glass-button.glass-button--ghost.t-is-disabled :deep(svg),
.t-button.glass-button.glass-button--ghost.glass-button--locked :deep(.t-icon),
.t-button.glass-button.glass-button--ghost.glass-button--locked :deep(svg),
.t-button.glass-button.glass-button--outline.t-is-loading :deep(.t-loading),
.t-button.glass-button.glass-button--outline.t-is-loading :deep(.t-icon),
.t-button.glass-button.glass-button--outline.t-is-loading :deep(svg),
.t-button.glass-button.glass-button--outline.t-is-disabled :deep(.t-icon),
.t-button.glass-button.glass-button--outline.t-is-disabled :deep(svg),
.t-button.glass-button.glass-button--outline.glass-button--locked :deep(.t-icon),
.t-button.glass-button.glass-button--outline.glass-button--locked :deep(svg),
.t-button.glass-button.glass-button--dashed.t-is-loading :deep(.t-loading),
.t-button.glass-button.glass-button--dashed.t-is-loading :deep(.t-icon),
.t-button.glass-button.glass-button--dashed.t-is-loading :deep(svg),
.t-button.glass-button.glass-button--dashed.t-is-disabled :deep(.t-icon),
.t-button.glass-button.glass-button--dashed.t-is-disabled :deep(svg),
.t-button.glass-button.glass-button--dashed.glass-button--locked :deep(.t-icon),
.t-button.glass-button.glass-button--dashed.glass-button--locked :deep(svg) {
  color: var(--glass-wb-ghost-color);
}

/* text —— Text CTA / Ink Link（Alert operation / 行内次要行动）：
   无底无边文字钮；无 inset hairline、无静息外影；密度走 token（28/8/13/radius8，非 999 pill）。
   色相 alias Quiet 蓝族；hover = 极淡冷洗 + lift-quiet；active = Quiet Active Wash（深字，禁止反转）。
   与 icon 圆钮区分：不 round/circle、不进 pill density、loading 保留文字槽。 */
.glass-button--text {
  height: var(--glass-wb-text-cta-height);
  padding: 0 var(--glass-wb-text-cta-pad-x);
  border: none;
  border-radius: var(--glass-wb-text-cta-radius);
  background: transparent;
  color: var(--glass-wb-text-cta-color);
  font-size: var(--glass-wb-text-cta-font-size);
  box-shadow: none;
}

/* 高特异性盖 TDesign text 变体可能的底色 / 描边泄漏；text 永不加 hairline */
.t-button.glass-button.glass-button--text {
  border: none;
  border-color: transparent;
  background-color: transparent;
}

.glass-button--text:not(.glass-button--locked):hover {
  border: none;
  background: var(--glass-wb-text-cta-hover-bg);
  color: var(--glass-wb-text-cta-hover-color);
  filter: none;
  box-shadow: none;
}

.glass-button--text:not(.glass-button--locked):active {
  border: none;
  background-color: var(--glass-wb-text-cta-active-bg);
  color: var(--glass-wb-text-cta-active-color);
  filter: none;
  box-shadow: none;
}

/* 键盘焦点：透明底 + Quiet 蓝字 + ring；盖 TDesign text :focus-visible 灰 wash（勿脏灰） */
.glass-button--text:focus-visible {
  border: none;
  background: transparent;
  color: var(--glass-wb-text-cta-color);
  box-shadow: var(--glass-wb-control-focus-ring);
}

/* text loading / locked / disabled 字色：3 class 盖 TDesign `.t-is-loading` / `.t-is-disabled` 灰轨；
   字色重申 Quiet 蓝（透明度交给 --glass-wb-control-disabled-opacity），不脏灰到不可读 */
.t-button.glass-button.glass-button--text.t-is-loading,
.t-button.glass-button.glass-button--text.t-is-disabled,
.t-button.glass-button.glass-button--text.glass-button--locked {
  color: var(--glass-wb-text-cta-color);
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

.t-button.glass-button.glass-button--text.t-is-loading :deep(.t-loading),
.t-button.glass-button.glass-button--text.t-is-loading :deep(.t-icon),
.t-button.glass-button.glass-button--text.t-is-disabled :deep(.t-icon),
.t-button.glass-button.glass-button--text.t-is-disabled :deep(svg),
.t-button.glass-button.glass-button--text.glass-button--locked :deep(.t-icon),
.t-button.glass-button.glass-button--text.glass-button--locked :deep(svg) {
  color: var(--glass-wb-text-cta-color);
}

/* send —— 发送圆钮：可用满浓蓝+白星；不可用浅冷底+品牌蓝 icon（幅度同 Primary） */
.glass-button--send {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: var(--glass-wb-send-bg);
  color: var(--glass-wb-send-text);
  box-shadow: none;
}

.glass-button--send:not(.glass-button--locked) {
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  box-shadow: var(--glass-wb-btn-blue-shadow);
}

.glass-button--send:not(.glass-button--locked):hover {
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  box-shadow: var(--glass-wb-btn-blue-hover-shadow);
}

.glass-button--send:not(.glass-button--locked):active {
  background: var(--glass-wb-btn-blue);
  color: var(--glass-wb-white);
  filter: none;
  box-shadow: var(--glass-wb-control-active-shadow-tight);
}

.glass-button--send:focus-visible {
  box-shadow: var(--glass-wb-control-focus-ring);
}

/* send locked/loading/disabled：3 class 盖 TD `.t-is-loading` 灰轨；icon/spinner 跟品牌蓝 */
.t-button.glass-button.glass-button--send.t-is-loading,
.t-button.glass-button.glass-button--send.t-is-disabled,
.t-button.glass-button.glass-button--send.glass-button--locked {
  background: var(--glass-wb-send-bg);
  color: var(--glass-wb-send-text);
  border-color: transparent;
  box-shadow: none;
}

.t-button.glass-button.glass-button--send.t-is-loading :deep(.t-loading),
.t-button.glass-button.glass-button--send.t-is-loading :deep(.t-icon),
.t-button.glass-button.glass-button--send.t-is-loading :deep(svg),
.t-button.glass-button.glass-button--send.t-is-disabled :deep(.t-icon),
.t-button.glass-button.glass-button--send.t-is-disabled :deep(svg),
.t-button.glass-button.glass-button--send.glass-button--locked :deep(.t-icon),
.t-button.glass-button.glass-button--send.glass-button--locked :deep(svg) {
  color: var(--glass-wb-send-text);
}

/* —— Status Themes：Semantic Filled（danger / warning / success） ——
   色相同源 Alert（danger↔error）；白字 + 满浓底；几何同 primary（42/12）。
   交互挂 Primary 轨（lift-primary / Shadow Bloom / Filled Press，无内部 brightness）；
   禁止 Quiet Active Wash / inset hairline / 白核渐变。 */
.glass-button--danger,
.glass-button--warning,
.glass-button--success {
  height: 42px;
  border-radius: 12px;
  border: none;
}

.glass-button--danger {
  background: var(--glass-wb-btn-danger);
  color: var(--glass-wb-btn-danger-text);
  box-shadow: var(--glass-wb-btn-danger-shadow);
}

.glass-button--danger:not(.glass-button--locked):hover {
  background: var(--glass-wb-btn-danger);
  color: var(--glass-wb-btn-danger-text);
  box-shadow: var(--glass-wb-btn-danger-hover-shadow);
}

.glass-button--danger:not(.glass-button--locked):active {
  background: var(--glass-wb-btn-danger);
  color: var(--glass-wb-btn-danger-text);
  filter: none;
  box-shadow: var(--glass-wb-btn-danger-active-shadow);
}

.glass-button--danger:focus-visible {
  box-shadow:
    var(--glass-wb-btn-danger-shadow),
    var(--glass-wb-control-focus-ring);
}

.glass-button--warning {
  background: var(--glass-wb-btn-warning);
  color: var(--glass-wb-btn-warning-text);
  box-shadow: var(--glass-wb-btn-warning-shadow);
}

.glass-button--warning:not(.glass-button--locked):hover {
  background: var(--glass-wb-btn-warning);
  color: var(--glass-wb-btn-warning-text);
  box-shadow: var(--glass-wb-btn-warning-hover-shadow);
}

.glass-button--warning:not(.glass-button--locked):active {
  background: var(--glass-wb-btn-warning);
  color: var(--glass-wb-btn-warning-text);
  filter: none;
  box-shadow: var(--glass-wb-btn-warning-active-shadow);
}

.glass-button--warning:focus-visible {
  box-shadow:
    var(--glass-wb-btn-warning-shadow),
    var(--glass-wb-control-focus-ring);
}

.glass-button--success {
  background: var(--glass-wb-btn-success);
  color: var(--glass-wb-btn-success-text);
  box-shadow: var(--glass-wb-btn-success-shadow);
}

.glass-button--success:not(.glass-button--locked):hover {
  background: var(--glass-wb-btn-success);
  color: var(--glass-wb-btn-success-text);
  box-shadow: var(--glass-wb-btn-success-hover-shadow);
}

.glass-button--success:not(.glass-button--locked):active {
  background: var(--glass-wb-btn-success);
  color: var(--glass-wb-btn-success-text);
  filter: none;
  box-shadow: var(--glass-wb-btn-success-active-shadow);
}

.glass-button--success:focus-visible {
  box-shadow:
    var(--glass-wb-btn-success-shadow),
    var(--glass-wb-control-focus-ring);
}

/* reduced-motion：取消位移与 scale，只保留颜色（+ 影态） */
@media (prefers-reduced-motion: reduce) {
  .glass-button {
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease,
      filter 0.15s ease;
  }

  .glass-button:not(.glass-button--locked):hover,
  .glass-button:not(.glass-button--locked):active {
    transform: none;
  }
}
</style>
