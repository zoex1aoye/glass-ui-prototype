/**
 * GlassMessagePlugin — 命令式 Soft Toast 门面（包装 tdesign MessagePlugin）
 *
 * - 每次调用合并 className 含 `glass-message`（保留调用方额外 class）
 * - API 对齐 MessagePlugin：info / success / warning / error / loading / question /
 *   close / closeAll；另加 config（TDesign Message 无内置 config，此处做本地默认合并，
 *   theme 由各方法固定）
 * - 可调用入口：GlassMessagePlugin(theme, message, duration?, context?)
 *
 * MessagePlugin 会 teleport 至 body，材质由 theme.css 全局 `.t-message` 提供；
 * 本文件不写样式、不写魔法色。
 */
import { isVNode } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { AppContext, VNode } from 'vue'
import type {
  MessageInfoOptions,
  MessageInstance,
  MessageOptions,
  MessageThemeList,
  TNode,
} from 'tdesign-vue-next'

const GLASS_CLASS = 'glass-message'

/** 全局默认配置（TDesign Message 未内置 config；本地默认合并） */
const defaultConfig: MessageInfoOptions = {}

type GlassMessageParams = string | TNode | MessageInfoOptions

/** 合并 glass 锚 class，保留调用方额外 class，避免重复 */
function mergeGlassClass(className?: string): string {
  const parts = String(className ?? '')
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  return parts.includes(GLASS_CLASS) ? parts.join(' ') : [GLASS_CLASS, ...parts].join(' ')
}

/** 归一化入参（string / TNode / VNode / options），合并默认配置 + duration + className */
function buildOptions(params: GlassMessageParams, duration?: number): MessageInfoOptions {
  let base: MessageInfoOptions

  if (typeof params === 'string') {
    base = { content: params }
  } else if (typeof params === 'function') {
    base = { content: params }
  } else if (params && typeof params === 'object') {
    base = isVNode(params)
      ? { content: () => params as VNode }
      : { ...(params as MessageInfoOptions) }
  } else {
    base = {}
  }

  const merged: MessageInfoOptions = { ...defaultConfig, ...base }
  if (duration !== undefined) {
    merged.duration = duration
  }

  return {
    ...merged,
    className: mergeGlassClass(merged.className),
  }
}

function info(params: GlassMessageParams, duration?: number, context?: AppContext) {
  return MessagePlugin.info(buildOptions(params, duration), undefined, context)
}

function success(params: GlassMessageParams, duration?: number, context?: AppContext) {
  return MessagePlugin.success(buildOptions(params, duration), undefined, context)
}

function warning(params: GlassMessageParams, duration?: number, context?: AppContext) {
  return MessagePlugin.warning(buildOptions(params, duration), undefined, context)
}

function error(params: GlassMessageParams, duration?: number, context?: AppContext) {
  return MessagePlugin.error(buildOptions(params, duration), undefined, context)
}

function loading(params: GlassMessageParams, duration?: number, context?: AppContext) {
  return MessagePlugin.loading(buildOptions(params, duration), undefined, context)
}

function question(params: GlassMessageParams, duration?: number, context?: AppContext) {
  return MessagePlugin.question(buildOptions(params, duration), undefined, context)
}

function close(instance: Promise<MessageInstance>) {
  MessagePlugin.close(instance)
}

function closeAll() {
  MessagePlugin.closeAll()
}

function config(options: MessageOptions) {
  Object.assign(defaultConfig, options)
}

export interface GlassMessagePluginType {
  (
    theme: MessageThemeList,
    message: string | TNode | MessageOptions,
    duration?: number,
    context?: AppContext,
  ): Promise<MessageInstance>
  info: typeof info
  success: typeof success
  warning: typeof warning
  error: typeof error
  loading: typeof loading
  question: typeof question
  close: typeof close
  closeAll: typeof closeAll
  config: typeof config
}

const plugin = ((
  theme: MessageThemeList,
  message: string | TNode | MessageOptions,
  duration?: number,
  context?: AppContext,
) => MessagePlugin(theme, buildOptions(message as GlassMessageParams, duration), undefined, context)) as GlassMessagePluginType

plugin.info = info
plugin.success = success
plugin.warning = warning
plugin.error = error
plugin.loading = loading
plugin.question = question
plugin.close = close
plugin.closeAll = closeAll
plugin.config = config

export const GlassMessagePlugin = plugin
export default GlassMessagePlugin
