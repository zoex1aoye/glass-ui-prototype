/**
 * Form a11y · GlassForm 共用增强
 *
 * TDesign 1.20.10 的 t-form-item 只有在调用方显式传 `for` 时才给 label 写
 * `for`；错误提示是普通 div，控件也没有 `aria-invalid` / `aria-describedby`。
 * 本 helper 只在 GlassForm 根节点内同步这些语义，不接管校验、提交或 TDesign
 * 的视觉状态。DOM 由 MutationObserver 重新同步，覆盖条件字段、错误出现 /
 * 消失与 TDesign 内部重渲染。
 *
 * 可访问名策略：
 * - 原生 input / textarea / select：可见 label 的 `for` 指向控件 `id`；
 * - checkbox / radio group、switch、按钮型控件：label 的 id 写入
 *   `aria-labelledby`；
 * - 不把 placeholder 当可访问名，也不覆盖调用方已有的有效 `for`。
 *
 * 错误策略：
 * - 错误 / warning / success 文案若存在，追加到控件 `aria-describedby`；
 * - error 时控件 `aria-invalid="true"`，错误节点 `role="alert"` +
 *   `aria-live="assertive"`；warning / success 用礼貌 live region；
 * - 多错提交时由 GlassForm 调用 `focusFirstError()` 落焦首个无效字段。
 */

export interface FormA11yOptions {
  /** 同一页多个 GlassForm 时用于生成互不冲突的 id */
  idPrefix?: string
}

export interface FormA11yBinding {
  sync: () => void
  focusFirstError: () => boolean
  destroy: () => void
}

interface ManagedAttrState {
  original: string | null
  value: string | null
}

type FieldKind = 'native' | 'group' | 'switch' | 'button'

interface FieldEntry {
  kind: FieldKind
  target: HTMLElement
  /** 与可见 label 关联的控件；原生字段可能不止一个（如范围输入） */
  fieldTargets: HTMLElement[]
  /** 首错落焦时使用的真实焦点目标 */
  focusTarget: HTMLElement | null
}

const ITEM_SELECTOR = '.t-form__item'
const LABEL_SELECTOR = '.t-form__label label'
const CONTROLS_SELECTOR = '.t-form__controls'
const CONTENT_SELECTOR = '.t-form__controls-content'
const MESSAGE_SELECTOR = ':scope > .t-input__extra'

const NATIVE_FIELD_SELECTOR = 'input:not([type="hidden"]), textarea, select'
const GROUP_SELECTOR = '.t-checkbox-group, .t-radio-group, [role="group"], [role="radiogroup"]'
const FOCUSABLE_SELECTOR =
  'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [role="radio"]:not([aria-disabled="true"]), [role="checkbox"]:not([aria-disabled="true"])'

const itemKeys = new WeakMap<HTMLElement, string>()

let fallbackFormIndex = 0

function sanitizeIdPart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'field'
}

function splitTokens(value: string | null) {
  return value?.split(/\s+/).filter(Boolean) ?? []
}

/**
 * 每个 GlassForm 独立托管属性，销毁时只恢复本实例写入的 DOM。
 * token 属性会保留调用方原有值，例如 aria-describedby="hint" 追加错误 id 后
 * 变为 "hint error"，移除时回到 "hint"。
 */
class ManagedAttributeWriter {
  private readonly managed = new WeakMap<HTMLElement, Map<string, ManagedAttrState>>()
  private readonly touched = new Set<HTMLElement>()

  private ensureState(element: HTMLElement, name: string): ManagedAttrState {
    let attributes = this.managed.get(element)
    if (!attributes) {
      attributes = new Map()
      this.managed.set(element, attributes)
      this.touched.add(element)
    }

    let state = attributes.get(name)
    if (!state) {
      state = {
        original: element.getAttribute(name),
        value: element.getAttribute(name),
      }
      attributes.set(name, state)
    }
    return state
  }

  set(element: HTMLElement, name: string, value: string | null) {
    const state = this.ensureState(element, name)
    if (state.value === value) return

    state.value = value
    if (value === null) element.removeAttribute(name)
    else element.setAttribute(name, value)
  }

  setTokens(element: HTMLElement, name: string, tokens: string[]) {
    const state = this.ensureState(element, name)
    const merged = new Set(splitTokens(state.original))
    for (const token of tokens) merged.add(token)

    const value = merged.size ? Array.from(merged).join(' ') : null
    if (state.value === value) return

    state.value = value
    if (value === null) element.removeAttribute(name)
    else element.setAttribute(name, value)
  }

  ensureId(element: HTMLElement, id: string) {
    if (element.id && element.ownerDocument.getElementById(element.id) === element) {
      return element.id
    }

    this.set(element, 'id', id)
    return id
  }

  ensureLabelTarget(label: HTMLElement, targetId: string) {
    const current = label.getAttribute('for')
    if (current === targetId) return

    if (current) {
      const owner = label.ownerDocument.getElementById(current)
      if (owner && owner !== label) return
    }

    this.set(label, 'for', targetId)
  }

  restore() {
    for (const element of this.touched) {
      const attributes = this.managed.get(element)
      if (!attributes) continue

      for (const [name, state] of attributes) {
        if (state.original === null) element.removeAttribute(name)
        else element.setAttribute(name, state.original)
      }
      this.managed.delete(element)
    }
    this.touched.clear()
  }
}

function findFieldEntry(controls: HTMLElement): FieldEntry | null {
  const content =
    controls.querySelector<HTMLElement>(CONTENT_SELECTOR) ?? controls

  const group = content.querySelector<HTMLElement>(GROUP_SELECTOR)
  if (group) {
    const focusTarget =
      group.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? group
    return {
      kind: 'group',
      target: group,
      fieldTargets: [group, ...Array.from(group.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))],
      focusTarget,
    }
  }

  const switchControl = content.querySelector<HTMLElement>('.t-switch')
  if (switchControl) {
    return {
      kind: 'switch',
      target: switchControl,
      fieldTargets: [switchControl],
      focusTarget: switchControl,
    }
  }

  const nativeFields = Array.from(
    content.querySelectorAll<HTMLElement>(NATIVE_FIELD_SELECTOR),
  )
  if (nativeFields.length) {
    return {
      kind: 'native',
      target: nativeFields[0],
      fieldTargets: nativeFields,
      focusTarget:
        nativeFields.find((field) => !field.hasAttribute('disabled')) ?? nativeFields[0],
    }
  }

  const buttonControl = content.querySelector<HTMLElement>(
    'button:not([disabled]), [role="button"]:not([aria-disabled="true"])',
  )
  if (buttonControl) {
    return {
      kind: 'button',
      target: buttonControl,
      fieldTargets: [buttonControl],
      focusTarget: buttonControl,
    }
  }

  return null
}

function syncSwitch(
  entry: FieldEntry,
  labelId: string | undefined,
  writer: ManagedAttributeWriter,
) {
  const switchControl = entry.target
  const disabled =
    switchControl.classList.contains('t-is-disabled') ||
    switchControl.classList.contains('t-is-loading')

  writer.set(switchControl, 'role', 'switch')
  writer.set(
    switchControl,
    'aria-checked',
    switchControl.classList.contains('t-is-checked') ? 'true' : 'false',
  )
  writer.set(switchControl, 'tabindex', disabled ? '-1' : '0')
  writer.set(switchControl, 'aria-disabled', disabled ? 'true' : null)
  if (labelId) writer.setTokens(switchControl, 'aria-labelledby', [labelId])
}

function syncGroup(
  entry: FieldEntry,
  labelId: string | undefined,
  writer: ManagedAttributeWriter,
) {
  const group = entry.target
  if (group.classList.contains('t-radio-group') && !group.getAttribute('role')) {
    writer.set(group, 'role', 'radiogroup')
  }
  if (labelId) writer.setTokens(group, 'aria-labelledby', [labelId])
}

function isFocusable(element: HTMLElement) {
  if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
    return false
  }
  if (element.tabIndex >= 0) return true
  return element.matches('input, textarea, select, button, a[href]')
}

function focusElement(
  element: HTMLElement,
  writer: ManagedAttributeWriter,
  fallbackTabIndex = false,
) {
  if (!isFocusable(element)) {
    if (!fallbackTabIndex) return false
    writer.set(element, 'tabindex', '-1')
  }

  element.focus()
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView?.({
    block: 'center',
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
  return true
}

export function bindFormA11y(
  root: HTMLElement,
  options: FormA11yOptions = {},
): FormA11yBinding {
  const prefix = `${sanitizeIdPart(
    options.idPrefix ?? `glass-form-${++fallbackFormIndex}`,
  )}`
  let destroyed = false
  let scheduled = false
  let itemIndex = 0
  const writer = new ManagedAttributeWriter()

  const getItemKey = (item: HTMLElement) => {
    const existing = itemKeys.get(item)
    if (existing) return existing

    const nameClass = Array.from(item.classList).find((name) =>
      name.startsWith('t-form-item__'),
    )
    const name = nameClass?.slice('t-form-item__'.length)
    const key = `${sanitizeIdPart(name || 'field')}-${++itemIndex}`
    itemKeys.set(item, key)
    return key
  }

  const sync = () => {
    if (destroyed) return
    scheduled = false

    for (const item of root.querySelectorAll<HTMLElement>(ITEM_SELECTOR)) {
      const key = getItemKey(item)
      const label = item.querySelector<HTMLElement>(LABEL_SELECTOR)
      const controls = item.querySelector<HTMLElement>(CONTROLS_SELECTOR)
      if (!controls) continue

      const entry = findFieldEntry(controls)
      if (!entry) continue

      let labelId: string | undefined
      if (label?.textContent?.trim()) {
        labelId = writer.ensureId(label, `${prefix}-label-${key}`)
        if (entry.kind === 'native') {
          writer.ensureLabelTarget(
            label,
            writer.ensureId(entry.target, `${prefix}-field-${key}`),
          )
        }
      }

      if (entry.kind === 'group') syncGroup(entry, labelId, writer)
      if (entry.kind === 'switch') syncSwitch(entry, labelId, writer)
      if (entry.kind === 'button' && labelId) {
        writer.setTokens(entry.target, 'aria-labelledby', [labelId])
      }

      const message = controls.querySelector<HTMLElement>(MESSAGE_SELECTOR)
      const messageText = message?.textContent?.trim()
      const messageId = `${prefix}-message-${key}`
      const isError = controls.classList.contains('t-is-error')
      const isWarning = controls.classList.contains('t-is-warning')
      const isSuccess = controls.classList.contains('t-is-success')

      if (message && messageText) {
        const resolvedMessageId = writer.ensureId(message, messageId)
        for (const field of entry.fieldTargets) {
          writer.setTokens(field, 'aria-describedby', [resolvedMessageId])
        }

        if (isError) {
          writer.set(message, 'role', 'alert')
          writer.set(message, 'aria-live', 'assertive')
          writer.set(message, 'aria-atomic', 'true')
        } else if (isWarning || isSuccess) {
          writer.set(message, 'role', 'status')
          writer.set(message, 'aria-live', 'polite')
          writer.set(message, 'aria-atomic', 'true')
        } else {
          writer.set(message, 'role', null)
          writer.set(message, 'aria-live', null)
          writer.set(message, 'aria-atomic', null)
        }
      } else {
        for (const field of entry.fieldTargets) {
          writer.setTokens(field, 'aria-describedby', [])
        }
      }

      for (const field of entry.fieldTargets) {
        writer.set(field, 'aria-invalid', isError ? 'true' : null)
      }
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
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return

    const target = event.target
    if (!(target instanceof Element)) return
    const switchControl = target.closest<HTMLElement>('.t-switch')
    if (!switchControl || !root.contains(switchControl)) return
    if (
      switchControl.classList.contains('t-is-disabled') ||
      switchControl.classList.contains('t-is-loading')
    ) {
      return
    }

    event.preventDefault()
    switchControl.click()
  }

  const observer = new MutationObserver(scheduleSync)
  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class'],
  })

  root.addEventListener('keydown', onKeydown)
  sync()

  return {
    sync,
    focusFirstError: () => {
      sync()
      const invalidItem = Array.from(
        root.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
      ).find((item) =>
        item
          .querySelector<HTMLElement>(CONTROLS_SELECTOR)
          ?.classList.contains('t-is-error'),
      )
      if (!invalidItem) return false

      const controls = invalidItem.querySelector<HTMLElement>(CONTROLS_SELECTOR)
      if (!controls) return false
      const entry = findFieldEntry(controls)
      if (!entry?.focusTarget) return false

      return focusElement(entry.focusTarget, writer, entry.kind !== 'native')
    },
    destroy: () => {
      destroyed = true
      observer.disconnect()
      root.removeEventListener('keydown', onKeydown)
      writer.restore()
    },
  }
}
