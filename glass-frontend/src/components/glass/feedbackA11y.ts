/**
 * Feedback a11y · GlassAlert / GlassMessage / GlassNotification 共用增强
 *
 * TDesign 1.20.10 的 Feedback 关闭与 Alert 展开控件都是 click-only 的 div / span：
 * - Alert close / collapse 没有 role、tabindex、键盘事件与可访问名；
 * - Message / Notification close 同样只有 onClick，内部 SVG 还会进入 a11y 树。
 * - Message / Notification 根节点没有 live region，动态 Toast / Notice 不会被读屏播报。
 *
 * 本 helper 只补语义、焦点顺序、Enter / Space 与装饰图标隐藏，不接管 TDesign 的
 * 关闭、展开、duration 或动画；live region 属性由调用方在首帧传给 TDesign 根节点，
 * 确保内容插入前语义已存在。不主动 focus 任何 Toast。重渲染由 MutationObserver
 * 重新同步，控件状态用 WeakMap 保存，元素移除后不会阻止回收。
 */

const CONTROL_SELECTOR = [
  '.glass-alert .t-alert__close',
  '.glass-alert .t-alert__collapse',
  '.glass-message .t-message__close',
  '.glass-notification .t-message__close',
].join(',')

const COLLAPSE_SELECTOR = '.glass-alert .t-alert__collapse'
const NESTED_INTERACTIVE_SELECTOR =
  'button, a[href], input, select, textarea, [contenteditable="true"], [role="button"], [role="link"], [tabindex]'

type FeedbackControlKind =
  | 'alert-close'
  | 'alert-collapse'
  | 'message-close'
  | 'notification-close'

export interface FeedbackA11yBinding {
  sync: () => void
  destroy: () => void
}

export interface FeedbackLiveRegionAttrs {
  role: 'status' | 'alert'
  'aria-live': 'polite' | 'assertive'
  'aria-atomic': 'true'
}

/**
 * Toast / Notice 的 live region 语义。
 * 错误级用 alert 让读屏尽快得知失败；其余状态保持礼貌播报，避免打断当前任务。
 */
export function getFeedbackLiveRegionAttrs(theme?: string): FeedbackLiveRegionAttrs {
  if (theme === 'error') {
    return { role: 'alert', 'aria-live': 'assertive', 'aria-atomic': 'true' }
  }
  return { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' }
}

const collapseExpanded = new WeakMap<HTMLElement, boolean>()
const managedAttributes = new WeakMap<HTMLElement, Map<string, string | null>>()

interface FeedbackA11yGlobal {
  __glassFeedbackA11yBinding?: FeedbackA11yBinding
}

function isActivationKey(key: string) {
  return key === 'Enter' || key === ' ' || key === 'Spacebar'
}

function hasNestedInteractive(target: Element, owner: HTMLElement) {
  const interactive = target.closest<HTMLElement>(NESTED_INTERACTIVE_SELECTOR)
  return Boolean(interactive && interactive !== owner && owner.contains(interactive))
}

function getControlKind(control: HTMLElement): FeedbackControlKind | null {
  if (control.classList.contains('t-alert__collapse')) return 'alert-collapse'

  const root = control.closest('.glass-alert, .glass-message, .glass-notification')
  if (!root) return null
  if (root.classList.contains('glass-alert')) return 'alert-close'
  if (root.classList.contains('glass-message')) return 'message-close'
  if (root.classList.contains('glass-notification')) return 'notification-close'
  return null
}

function setManagedAttribute(element: HTMLElement, name: string, value: string) {
  if (element.getAttribute(name) === value) return

  let attributes = managedAttributes.get(element)
  if (!attributes) {
    attributes = new Map()
    managedAttributes.set(element, attributes)
  }
  if (!attributes.has(name)) attributes.set(name, element.getAttribute(name))
  element.setAttribute(name, value)
}

function restoreManagedAttributes(element: HTMLElement) {
  const attributes = managedAttributes.get(element)
  if (!attributes) return

  for (const [name, original] of attributes) {
    if (original === null) element.removeAttribute(name)
    else element.setAttribute(name, original)
  }
  managedAttributes.delete(element)
}

function hasCloseContent(control: HTMLElement) {
  if (control.querySelector('svg, img')) return true
  if (control.textContent?.trim()) return true
  if (control.getAttribute('aria-labelledby')?.trim()) return true
  // 只把调用方预先提供的 aria-label 视为有效内容；helper 自己写入的名称不算。
  return Boolean(control.getAttribute('aria-label')?.trim() && !managedAttributes.has(control))
}

function hasAccessibleName(element: HTMLElement) {
  if (element.getAttribute('aria-label')?.trim()) return true
  if (element.getAttribute('aria-labelledby')?.trim()) return true
  return Boolean(element.textContent?.trim())
}

function hideDecorativeSvgs(element: HTMLElement) {
  for (const svg of element.querySelectorAll('svg')) {
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('focusable', 'false')
  }
}

function syncControl(control: HTMLElement) {
  const kind = getControlKind(control)
  if (!kind) return

  if (kind !== 'alert-collapse' && !hasCloseContent(control)) {
    restoreManagedAttributes(control)
    return
  }
  if (control.querySelector(NESTED_INTERACTIVE_SELECTOR)) {
    restoreManagedAttributes(control)
    return
  }

  setManagedAttribute(control, 'role', 'button')
  setManagedAttribute(control, 'tabindex', '0')
  hideDecorativeSvgs(control)

  if (kind === 'alert-collapse') {
    const expanded = collapseExpanded.get(control) ?? false
    const visibleText = control.textContent?.trim()
    setManagedAttribute(control, 'aria-expanded', expanded ? 'true' : 'false')
    if (!control.getAttribute('aria-labelledby')?.trim()) {
      setManagedAttribute(
        control,
        'aria-label',
        visibleText || (expanded ? '收起' : '展开更多'),
      )
    }
    return
  }

  if (hasAccessibleName(control)) return
  const label =
    kind === 'alert-close'
      ? '关闭提示'
      : kind === 'message-close'
        ? '关闭消息'
        : '关闭通知'
  setManagedAttribute(control, 'aria-label', label)
}

/**
 * 在 root 内同步 Feedback 控件语义，并持续观察 TDesign 的重渲染。
 */
export function bindFeedbackA11y(root: HTMLElement): FeedbackA11yBinding {
  let destroyed = false
  let scheduled = false

  const sync = () => {
    if (destroyed) return
    scheduled = false
    for (const control of root.querySelectorAll<HTMLElement>(CONTROL_SELECTOR)) {
      syncControl(control)
    }
  }

  const scheduleSync = () => {
    if (destroyed || scheduled) return
    scheduled = true
    queueMicrotask(sync)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey) {
      return
    }
    if (!isActivationKey(event.key)) return

    const target = event.target
    if (!(target instanceof Element)) return
    const control = target.closest<HTMLElement>(CONTROL_SELECTOR)
    if (!control || !control.isConnected) return
    if (hasNestedInteractive(target, control)) return

    event.preventDefault()
    control.click()
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const control = target.closest<HTMLElement>(COLLAPSE_SELECTOR)
    if (!control) return

    queueMicrotask(() => {
      if (!control.isConnected) return
      collapseExpanded.set(control, !(collapseExpanded.get(control) ?? false))
      syncControl(control)
    })
  }

  const observer = new MutationObserver(scheduleSync)
  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  root.addEventListener('keydown', onKeydown)
  root.addEventListener('click', onClick)
  sync()

  return {
    sync,
    destroy: () => {
      destroyed = true
      observer.disconnect()
      root.removeEventListener('keydown', onKeydown)
      root.removeEventListener('click', onClick)
    },
  }
}

/**
 * 全局只安装一次；命令式 Plugin 与声明式 Wrapper 共用同一套增强。
 */
export function ensureFeedbackA11y(): FeedbackA11yBinding | null {
  if (typeof document === 'undefined') return null
  const globalScope = globalThis as typeof globalThis & FeedbackA11yGlobal
  if (!globalScope.__glassFeedbackA11yBinding) {
    globalScope.__glassFeedbackA11yBinding = bindFeedbackA11y(document.body)
  }
  return globalScope.__glassFeedbackA11yBinding
}
