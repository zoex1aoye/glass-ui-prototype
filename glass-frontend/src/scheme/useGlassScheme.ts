/**
 * Glass Scheme 底座：locale（zh|en）+ color-scheme（light|dark）。
 * 零新依赖；persist localStorage；apply 到 document.documentElement。
 * 文案表：scheme/messages.ts（Shell + docs-nav + Overview + 全 Lab 页）。
 */
import { inject, provide, readonly, ref, type InjectionKey, type Ref } from 'vue'

import { shellMessages } from './messages'

export type GlassLocale = 'zh' | 'en'
export type GlassColorScheme = 'light' | 'dark'

const STORAGE_LOCALE = 'glass.locale'
const STORAGE_COLOR = 'glass.color-scheme'

const glassSchemeKey: InjectionKey<GlassSchemeApi> = Symbol('glass-scheme')

export interface GlassSchemeApi {
  locale: Readonly<Ref<GlassLocale>>
  colorScheme: Readonly<Ref<GlassColorScheme>>
  setLocale: (next: GlassLocale) => void
  setColorScheme: (next: GlassColorScheme) => void
  t: (key: string) => string
  /**
   * 模板用文案函数：渲染期读 localeRef，保证切语言后整页重绘。
   * （勿再包成 computed(() => fn)，外层无依赖会导致漏更新。）
   */
  tt: (key: string) => string
}

function isLocale(value: string | null): value is GlassLocale {
  return value === 'zh' || value === 'en'
}

function isColorScheme(value: string | null): value is GlassColorScheme {
  return value === 'light' || value === 'dark'
}

function readStoredLocale(): GlassLocale | null {
  try {
    const raw = localStorage.getItem(STORAGE_LOCALE)
    return isLocale(raw) ? raw : null
  } catch {
    return null
  }
}

function readStoredColorScheme(): GlassColorScheme | null {
  try {
    const raw = localStorage.getItem(STORAGE_COLOR)
    return isColorScheme(raw) ? raw : null
  } catch {
    return null
  }
}

function guessInitialColorScheme(): GlassColorScheme {
  const stored = readStoredColorScheme()
  if (stored) return stored
  try {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  } catch {
    /* ignore */
  }
  return 'light'
}

function guessInitialLocale(): GlassLocale {
  return readStoredLocale() ?? 'zh'
}

function applyLocale(locale: GlassLocale): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.locale = locale
  document.documentElement.setAttribute('lang', locale === 'zh' ? 'zh-CN' : 'en')
}

function applyColorScheme(scheme: GlassColorScheme): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.colorScheme = scheme
  root.style.colorScheme = scheme
  // TDesign 官方深色开关：theme-mode="dark"；浅色须移除属性
  if (scheme === 'dark') {
    root.setAttribute('theme-mode', 'dark')
    root.classList.add('dark')
  } else {
    root.removeAttribute('theme-mode')
    root.classList.remove('dark')
  }
}

const localeRef = ref<GlassLocale>('zh')
const colorSchemeRef = ref<GlassColorScheme>('light')
let initialized = false

function persistLocale(locale: GlassLocale): void {
  try {
    localStorage.setItem(STORAGE_LOCALE, locale)
  } catch {
    /* ignore quota / private mode */
  }
}

function persistColorScheme(scheme: GlassColorScheme): void {
  try {
    localStorage.setItem(STORAGE_COLOR, scheme)
  } catch {
    /* ignore */
  }
}

function translate(key: string, locale: GlassLocale = localeRef.value): string {
  return shellMessages[locale]?.[key] ?? shellMessages.zh[key] ?? key
}

function setLocale(next: GlassLocale): void {
  localeRef.value = next
  applyLocale(next)
  persistLocale(next)
}

function setColorScheme(next: GlassColorScheme): void {
  colorSchemeRef.value = next
  applyColorScheme(next)
  persistColorScheme(next)
}

/**
 * 在 createApp / mount 前调用，避免首帧闪错语言或主题。
 */
export function initGlassScheme(): void {
  if (initialized) {
    applyLocale(localeRef.value)
    applyColorScheme(colorSchemeRef.value)
    return
  }
  const locale = guessInitialLocale()
  const color = guessInitialColorScheme()
  localeRef.value = locale
  colorSchemeRef.value = color
  applyLocale(locale)
  applyColorScheme(color)
  initialized = true
}

function createApi(): GlassSchemeApi {
  const tt = (key: string) => translate(key, localeRef.value)
  return {
    locale: readonly(localeRef),
    colorScheme: readonly(colorSchemeRef),
    setLocale,
    setColorScheme,
    t: (key: string) => translate(key),
    tt,
  }
}

/** 单例 API：无 provide 时 useGlassScheme 仍可工作 */
let singletonApi: GlassSchemeApi | null = null

function getSingletonApi(): GlassSchemeApi {
  if (!singletonApi) singletonApi = createApi()
  return singletonApi
}

export function provideGlassScheme(): GlassSchemeApi {
  initGlassScheme()
  const api = getSingletonApi()
  provide(glassSchemeKey, api)
  return api
}

export function useGlassScheme(): GlassSchemeApi {
  const injected = inject(glassSchemeKey, null)
  if (injected) return injected
  initGlassScheme()
  return getSingletonApi()
}

/** 便捷：当前 locale 下取文案（非组件上下文亦可） */
export function t(key: string): string {
  initGlassScheme()
  return translate(key)
}
