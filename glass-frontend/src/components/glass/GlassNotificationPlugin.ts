/**
 * GlassNotificationPlugin — 命令式 Soft Notice 门面（包装 tdesign NotificationPlugin）
 *
 * - 每次调用合并 className 含 `glass-notification glass-notification--{theme}`
 *   （保留调用方额外 class）
 * - API 对齐 NotificationPlugin：info / success / warning / error / close / closeAll；
 *   另加 config（TDesign Notification 无内置 config，此处做本地默认合并，theme 由各方法固定）
 * - 可调用入口：GlassNotificationPlugin(theme, options, context?)
 * - 字符串快捷：允许 success('一段文案') → { content: '一段文案' }，便于 Lab 直调
 *
 * NotificationPlugin 会 teleport 至 body，材质由 theme.css 全局 `.t-notification` 提供；
 * 本文件不写样式、不写魔法色。
 */
import { isVNode } from 'vue'
import { NotifyPlugin as NotificationPlugin } from 'tdesign-vue-next'
import type { AppContext, VNode } from 'vue'
import type {
  NotificationInfoOptions,
  NotificationInstance,
  NotificationThemeList,
  TNode,
} from 'tdesign-vue-next'

const GLASS_CLASS = 'glass-notification'

/** 全局默认配置（TDesign Notification 未内置 config；本地默认合并） */
const defaultConfig: NotificationInfoOptions = {}

type GlassNotificationParams = string | TNode | NotificationInfoOptions

function themeClass(theme: NotificationThemeList): string {
  return `${GLASS_CLASS}--${theme}`
}

/** 合并 glass 锚 class（含 theme 态），保留调用方额外 class，避免重复 */
function mergeGlassClass(theme: NotificationThemeList, className?: string): string {
  const anchors = [GLASS_CLASS, themeClass(theme)]
  const parts = String(className ?? '')
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !anchors.includes(part))

  return [...anchors, ...parts].join(' ')
}

/** 归一化入参（string / TNode / VNode / options），合并默认配置 + theme className */
function buildOptions(
  params: GlassNotificationParams,
  theme: NotificationThemeList,
): NotificationInfoOptions {
  let base: NotificationInfoOptions

  if (typeof params === 'string') {
    base = { content: params }
  } else if (typeof params === 'function') {
    base = { content: params }
  } else if (params && typeof params === 'object') {
    base = isVNode(params)
      ? { content: () => params as VNode }
      : { ...(params as NotificationInfoOptions) }
  } else {
    base = {}
  }

  const merged: NotificationInfoOptions = { ...defaultConfig, ...base }
  return {
    ...merged,
    className: mergeGlassClass(theme, merged.className),
  }
}

function info(params: GlassNotificationParams, context?: AppContext) {
  return NotificationPlugin.info(buildOptions(params, 'info'), context)
}

function success(params: GlassNotificationParams, context?: AppContext) {
  return NotificationPlugin.success(buildOptions(params, 'success'), context)
}

function warning(params: GlassNotificationParams, context?: AppContext) {
  return NotificationPlugin.warning(buildOptions(params, 'warning'), context)
}

function error(params: GlassNotificationParams, context?: AppContext) {
  return NotificationPlugin.error(buildOptions(params, 'error'), context)
}

function close(instance: Promise<NotificationInstance>) {
  NotificationPlugin.close(instance)
}

function closeAll() {
  NotificationPlugin.closeAll()
}

function config(options: NotificationInfoOptions) {
  Object.assign(defaultConfig, options)
}

export interface GlassNotificationPluginType {
  (
    theme: NotificationThemeList,
    options: GlassNotificationParams,
    context?: AppContext,
  ): Promise<NotificationInstance>
  info: typeof info
  success: typeof success
  warning: typeof warning
  error: typeof error
  close: typeof close
  closeAll: typeof closeAll
  config: typeof config
}

const plugin = ((
  theme: NotificationThemeList,
  options: GlassNotificationParams,
  context?: AppContext,
) => NotificationPlugin(theme, buildOptions(options, theme), context)) as GlassNotificationPluginType

plugin.info = info
plugin.success = success
plugin.warning = warning
plugin.error = error
plugin.close = close
plugin.closeAll = closeAll
plugin.config = config

export const GlassNotificationPlugin = plugin
export default GlassNotificationPlugin
