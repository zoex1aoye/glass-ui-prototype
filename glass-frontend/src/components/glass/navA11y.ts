/**
 * Navigation a11y · GlassTabs / GlassSteps 共用的小型 DOM 增强
 *
 * TDesign 1.20.10 的 tab nav item 与 step inner 都是 click-only div：
 * - Tabs item 没有 role / tabindex / aria-selected，也没有方向键处理；
 * - Steps 可点 inner 没有 role / tabindex，当前步只有 process class。
 *
 * 本 helper 只补语义、roving tabindex 与 Enter / Space，不接管 TDesign 的
 * 选择状态、点击行为、readonly / disabled 或视觉。重渲染由 MutationObserver
 * 重新同步；所有新增属性在销毁时恢复。
 */

const TAB_ITEM_SELECTOR = '.t-tabs__nav-item'
const TAB_NAV_SELECTOR = '.t-tabs__nav-container'
const STEP_ITEM_SELECTOR = '.t-steps-item'
const STEP_INNER_SELECTOR = '.t-steps-item__inner'
const CLICKABLE_STEP_SELECTOR = '.t-steps-item__inner.t-steps-item--clickable'
const NESTED_INTERACTIVE_SELECTOR =
  'button, a[href], input, select, textarea, [contenteditable="true"], [role="button"], [role="tab"], [role="link"], [tabindex]'

export interface NavA11yBinding {
  sync: () => void
  destroy: () => void
}

interface AttributeWriter {
  set: (element: HTMLElement, name: string, value: string) => void
  unset: (element: HTMLElement, name: string) => void
  restore: () => void
}

let tabsIdSeed = 0

function createAttributeWriter(): AttributeWriter {
  const managed = new Map<HTMLElement, Map<string, string | null>>()

  const set = (element: HTMLElement, name: string, value: string) => {
    if (element.getAttribute(name) === value) return

    let attributes = managed.get(element)
    if (!attributes) {
      attributes = new Map()
      managed.set(element, attributes)
    }
    if (!attributes.has(name)) attributes.set(name, element.getAttribute(name))
    element.setAttribute(name, value)
  }

  const unset = (element: HTMLElement, name: string) => {
    const attributes = managed.get(element)
    if (!attributes?.has(name)) return

    const original = attributes.get(name) ?? null
    if (original === null) element.removeAttribute(name)
    else element.setAttribute(name, original)
    attributes.delete(name)
    if (!attributes.size) managed.delete(element)
  }

  const restore = () => {
    for (const [element, attributes] of managed) {
      if (!element.isConnected) continue
      for (const [name, original] of attributes) {
        if (original === null) element.removeAttribute(name)
        else element.setAttribute(name, original)
      }
    }
    managed.clear()
  }

  return { set, unset, restore }
}

function ensureId(writer: AttributeWriter, element: HTMLElement, id: string) {
  if (element.id) return element.id
  writer.set(element, 'id', id)
  return id
}

function isDisabled(element: HTMLElement) {
  return element.classList.contains('t-is-disabled')
}

function isActive(element: HTMLElement) {
  return element.classList.contains('t-is-active')
}

function isActivationKey(key: string) {
  return key === 'Enter' || key === ' ' || key === 'Spacebar'
}

function hasNestedInteractive(target: HTMLElement, owner: HTMLElement) {
  const interactive = target.closest<HTMLElement>(NESTED_INTERACTIVE_SELECTOR)
  return Boolean(interactive && interactive !== owner && owner.contains(interactive))
}

function observe(root: HTMLElement, sync: () => void) {
  const observer = new MutationObserver(sync)
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  })
  return observer
}

/**
 * Tabs：tablist / tab / aria-selected + roving tabindex。
 * 方向键按 placement 切换左右或上下；Home / End 跳首尾；Enter / Space 激活。
 */
export function bindTabsA11y(root: HTMLElement): NavA11yBinding {
  const writer = createAttributeWriter()
  const idSeed = `glass-tabs-a11y-${++tabsIdSeed}`
  let rovingItem: HTMLElement | null = null
  let lastActiveItem: HTMLElement | null = null
  let destroyed = false

  const getCore = () => root.querySelector<HTMLElement>(':scope > .glass-tabs__core')
  const getNav = (core: HTMLElement) =>
    core.querySelector<HTMLElement>(`:scope > .t-tabs__header ${TAB_NAV_SELECTOR}`)

  const getPanels = (core: HTMLElement) => {
    const content = core.querySelector<HTMLElement>(':scope > .t-tabs__content')
    const scope = content ?? core
    return Array.from(scope.querySelectorAll<HTMLElement>(':scope > .t-tab-panel'))
  }

  const getItems = (nav: HTMLElement) =>
    Array.from(nav.querySelectorAll<HTMLElement>(TAB_ITEM_SELECTOR))

  const isVerticalNav = (nav: HTMLElement) =>
    nav.classList.contains('t-is-left') || nav.classList.contains('t-is-right')

  const sync = () => {
    if (destroyed) return

    const core = getCore()
    const nav = core ? getNav(core) : null
    if (!core || !nav) return

    const vertical = isVerticalNav(nav)
    writer.set(nav, 'role', 'tablist')
    writer.set(nav, 'aria-orientation', vertical ? 'vertical' : 'horizontal')

    const items = getItems(nav)
    if (!items.length) return

    const activeItem = items.find(isActive) ?? null
    if (activeItem !== lastActiveItem) {
      lastActiveItem = activeItem
      const activeElement = document.activeElement
      const navHasFocus =
        activeElement instanceof HTMLElement &&
        activeElement !== nav &&
        nav.contains(activeElement)
      if (!navHasFocus) rovingItem = activeItem
    }

    const enabledItems = items.filter((item) => !isDisabled(item))
    const fallbackTabStop =
      (activeItem && !isDisabled(activeItem) ? activeItem : null) ?? enabledItems[0] ?? null
    const tabStop =
      rovingItem && items.includes(rovingItem) && !isDisabled(rovingItem)
        ? rovingItem
        : fallbackTabStop

    const panels = getPanels(core)
    const linkPanels = panels.length === items.length

    items.forEach((item, index) => {
      const selected = isActive(item)
      const disabled = isDisabled(item)
      const tabId = ensureId(writer, item, `${idSeed}-tab-${index}`)

      writer.set(item, 'role', 'tab')
      writer.set(item, 'aria-selected', selected ? 'true' : 'false')
      writer.set(item, 'tabindex', item === tabStop ? '0' : '-1')

      if (disabled) writer.set(item, 'aria-disabled', 'true')
      else writer.unset(item, 'aria-disabled')

      if (!linkPanels) {
        writer.unset(item, 'aria-controls')
        return
      }

      const panel = panels[index]
      const panelId = ensureId(writer, panel, `${idSeed}-panel-${index}`)
      writer.set(item, 'aria-controls', panelId)
      writer.set(panel, 'role', 'tabpanel')
      writer.set(panel, 'aria-labelledby', tabId)
    })

    if (!linkPanels) {
      for (const panel of panels) {
        writer.unset(panel, 'role')
        writer.unset(panel, 'aria-labelledby')
      }
    }
  }

  const onFocusIn = (event: FocusEvent) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const item = target.closest<HTMLElement>(TAB_ITEM_SELECTOR)
    const core = getCore()
    const nav = core ? getNav(core) : null
    if (!item || !nav || item.closest(TAB_NAV_SELECTOR) !== nav || isDisabled(item)) return
    rovingItem = item
    sync()
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return

    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const item = target.closest<HTMLElement>(TAB_ITEM_SELECTOR)
    const core = getCore()
    const ownNav = core ? getNav(core) : null
    if (!item || !ownNav || item.closest(TAB_NAV_SELECTOR) !== ownNav || isDisabled(item)) return
    if (hasNestedInteractive(target, item)) return

    if (isActivationKey(event.key)) {
      event.preventDefault()
      item.click()
      return
    }

    const items = getItems(ownNav)
    const enabledItems = items.filter((candidate) => !isDisabled(candidate))
    const currentIndex = enabledItems.indexOf(item)
    if (currentIndex < 0) return

    const vertical = isVerticalNav(ownNav)
    let nextIndex: number | null = null

    if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) {
      nextIndex = (currentIndex + 1) % enabledItems.length
    } else if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) {
      nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = enabledItems.length - 1
    }

    if (nextIndex === null) return

    event.preventDefault()
    const nextItem = enabledItems[nextIndex]
    rovingItem = nextItem
    sync()
    nextItem.focus({ preventScroll: true })
  }

  const observer = observe(root, sync)
  root.addEventListener('focusin', onFocusIn)
  root.addEventListener('keydown', onKeydown)
  sync()

  return {
    sync,
    destroy: () => {
      destroyed = true
      observer.disconnect()
      root.removeEventListener('focusin', onFocusIn)
      root.removeEventListener('keydown', onKeydown)
      writer.restore()
    },
  }
}

/**
 * Steps：可点击步骤补 role="button" + tabindex="0"；当前 process 步补
 * aria-current="step"。Enter / Space 交给 TDesign 原有 click 处理。
 */
export function bindStepsA11y(root: HTMLElement): NavA11yBinding {
  const writer = createAttributeWriter()
  let destroyed = false

  const getCore = () => root.querySelector<HTMLElement>(':scope > .glass-steps__core')

  const sync = () => {
    if (destroyed) return

    const core = getCore()
    if (!core) return

    const items = Array.from(
      core.querySelectorAll<HTMLElement>(`:scope > ${STEP_ITEM_SELECTOR}`),
    )

    for (const item of items) {
      const inner = item.querySelector<HTMLElement>(`:scope > ${STEP_INNER_SELECTOR}`)
      if (!inner) continue

      const current = item.classList.contains('t-steps-item--process')
      if (current) writer.set(inner, 'aria-current', 'step')
      else writer.unset(inner, 'aria-current')

      if (inner.classList.contains('t-steps-item--clickable')) {
        writer.set(inner, 'role', 'button')
        writer.set(inner, 'tabindex', '0')
      } else {
        writer.unset(inner, 'role')
        writer.unset(inner, 'tabindex')
      }
    }
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if (!isActivationKey(event.key)) return

    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const inner = target.closest<HTMLElement>(CLICKABLE_STEP_SELECTOR)
    const core = getCore()
    if (!inner || !core || inner.closest('.glass-steps__core') !== core) return
    if (hasNestedInteractive(target, inner)) return

    event.preventDefault()
    inner.click()
  }

  const observer = observe(root, sync)
  root.addEventListener('keydown', onKeydown)
  sync()

  return {
    sync,
    destroy: () => {
      destroyed = true
      observer.disconnect()
      root.removeEventListener('keydown', onKeydown)
      writer.restore()
    },
  }
}
