/**
 * Overlay a11y · GlassDialog / GlassFormPane 共用的小型 DOM 增强
 *
 * TDesign 1.20.10 的 t-dialog 只渲染普通 div：
 * - 面板没有 role="dialog" / aria-modal / 标题关联；
 * - 默认关闭钮是 click-only span；
 * - 打开后不落焦，Tab 可落到遮罩后的页面。
 *
 * 本 helper 只做上述补偿，不接管 TDesign 的开关、Esc、遮罩点击或视觉。
 * 所有焦点候选均限制在面板内部，避免把焦点送到 body。
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export interface OverlayA11yOptions {
  panel: HTMLElement
  /** 同一实例复用同一 id，保证重开时标题 / 描述关联稳定 */
  idSeed: string
  /** 按优先级查找可见标题；首个命中节点作为 aria-labelledby */
  titleSelectors: string[]
  /** 按优先级查找可见描述；首个命中节点作为 aria-describedby */
  descriptionSelectors?: string[]
  /** 打开后的落焦优先级；先主内容 / 首字段，再安全取消钮，最后关闭钮 */
  initialFocusSelectors: string[]
}

export interface OverlayA11yBinding {
  focusInitial: () => void
  ensureFocusInside: () => void
  destroy: () => void
}

function isVisible(element: HTMLElement) {
  if (element.hidden || element.closest('[inert]')) return false
  if (element.getAttribute('aria-hidden') === 'true') return false
  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getClientRects().length > 0
  )
}

function isDisabled(element: HTMLElement) {
  return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true'
}

function isTabbable(element: HTMLElement) {
  if (!isVisible(element) || isDisabled(element)) return false
  const tabindex = element.getAttribute('tabindex')
  return tabindex === null || Number(tabindex) >= 0
}

function queryFirst(
  panel: HTMLElement,
  selectors: string[],
  predicate: (element: HTMLElement) => boolean,
) {
  for (const selector of selectors) {
    for (const element of panel.querySelectorAll<HTMLElement>(selector)) {
      if (predicate(element)) return element
    }
  }
  return null
}

function getFocusableElements(panel: HTMLElement) {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isTabbable)
}

function focusElement(element: HTMLElement) {
  element.focus({ preventScroll: true })
  return document.activeElement === element
}

export function captureOverlayTrigger() {
  const active = document.activeElement
  return active instanceof HTMLElement && active !== document.body ? active : null
}

export function restoreOverlayTrigger(trigger: HTMLElement | null) {
  if (!trigger || !trigger.isConnected || trigger.closest('[inert]')) return
  if (trigger.hidden || trigger.getAttribute('aria-hidden') === 'true') return
  trigger.focus({ preventScroll: true })
}

export function bindOverlayA11y(options: OverlayA11yOptions): OverlayA11yBinding {
  const { panel, idSeed } = options
  const closeRoot = panel.querySelector<HTMLElement>('.t-dialog__close')

  const addedPanelAttributes: string[] = []
  const setPanelAttribute = (name: string, value: string) => {
    if (!panel.hasAttribute(name)) addedPanelAttributes.push(name)
    panel.setAttribute(name, value)
  }

  setPanelAttribute('role', 'dialog')
  setPanelAttribute('aria-modal', 'true')
  panel.setAttribute('tabindex', '-1')

  const title = queryFirst(panel, options.titleSelectors, isVisible)
  if (title) {
    if (!title.id) title.id = `${idSeed}-title`
    setPanelAttribute('aria-labelledby', title.id)
  }

  const description = queryFirst(panel, options.descriptionSelectors ?? [], isVisible)
  if (description) {
    if (!description.id) description.id = `${idSeed}-description`
    setPanelAttribute('aria-describedby', description.id)
  }

  let addedCloseRole = false
  let addedCloseTabindex = false
  let addedCloseLabel = false
  let addedIconAriaHidden = false
  let closeControl: HTMLElement | null = null
  let onCloseKeydown: ((event: KeyboardEvent) => void) | null = null

  if (closeRoot) {
    closeRoot.dataset.glassOverlayClose = 'true'

    const nestedControl = closeRoot.querySelector<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    )
    const rootIsControl =
      closeRoot.matches('button, a[href]') ||
      (closeRoot.hasAttribute('tabindex') && Number(closeRoot.getAttribute('tabindex')) >= 0)

    closeControl = rootIsControl ? closeRoot : nestedControl ?? closeRoot

    if (closeControl === closeRoot && !rootIsControl) {
      closeRoot.setAttribute('role', 'button')
      closeRoot.tabIndex = 0
      addedCloseRole = true
      addedCloseTabindex = true
    }

    const hasVisibleText = Boolean(closeControl.textContent?.trim())
    if (
      !hasVisibleText &&
      !closeControl.hasAttribute('aria-label') &&
      !closeControl.hasAttribute('aria-labelledby')
    ) {
      closeControl.setAttribute('aria-label', '关闭')
      addedCloseLabel = true
    }

    const icon = closeRoot.querySelector('svg')
    if (icon && !icon.hasAttribute('aria-hidden')) {
      icon.setAttribute('aria-hidden', 'true')
      addedIconAriaHidden = true
    }

    onCloseKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return
      event.preventDefault()
      event.stopPropagation()
      closeRoot.click()
    }
    closeRoot.addEventListener('keydown', onCloseKeydown)
  }

  const onPanelKeydown = (event: KeyboardEvent) => {
    if (
      event.key !== 'Tab' ||
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return
    }

    const focusable = getFocusableElements(panel)
    if (!focusable.length) {
      event.preventDefault()
      panel.focus({ preventScroll: true })
      return
    }

    const active = document.activeElement as HTMLElement | null
    const currentIndex = active ? focusable.indexOf(active) : -1
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey) {
      if (currentIndex <= 0) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      }
      return
    }

    if (currentIndex === -1 || currentIndex === focusable.length - 1) {
      event.preventDefault()
      first.focus({ preventScroll: true })
    }
  }

  panel.addEventListener('keydown', onPanelKeydown)

  const focusInitial = () => {
    const target =
      queryFirst(panel, options.initialFocusSelectors, (element) => isTabbable(element)) ??
      getFocusableElements(panel)[0] ??
      panel
    focusElement(target)
  }

  const ensureFocusInside = () => {
    const active = document.activeElement
    if (active instanceof HTMLElement && active !== panel && panel.contains(active)) return
    focusInitial()
  }

  const destroy = () => {
    panel.removeEventListener('keydown', onPanelKeydown)

    for (const name of addedPanelAttributes) panel.removeAttribute(name)
    panel.removeAttribute('tabindex')

    if (closeRoot) {
      if (onCloseKeydown) closeRoot.removeEventListener('keydown', onCloseKeydown)
      delete closeRoot.dataset.glassOverlayClose
    }
    if (closeControl) {
      if (addedCloseLabel) closeControl.removeAttribute('aria-label')
    }
    if (closeRoot && closeControl === closeRoot) {
      if (addedCloseRole) closeRoot.removeAttribute('role')
      if (addedCloseTabindex) closeRoot.removeAttribute('tabindex')
    }
    if (addedIconAriaHidden) closeRoot?.querySelector('svg')?.removeAttribute('aria-hidden')
  }

  return { focusInitial, ensureFocusInside, destroy }
}
