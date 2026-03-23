import { useTauri } from './useTauri'

/**
 * Composable for native window controls (minimize, maximize, fullscreen, etc.).
 * All methods are no-ops when called outside a Tauri context.
 *
 * Requires `@tauri-apps/api` — no additional Rust plugins needed.
 *
 * @example
 * ```vue
 * <script setup>
 * const { minimize, toggleMaximize, close } = useTauriWindow()
 * </script>
 * <template>
 *   <button @click="minimize">_</button>
 *   <button @click="toggleMaximize">□</button>
 *   <button @click="close">✕</button>
 * </template>
 * ```
 */
export const useTauriWindow = () => {
  const { isTauri } = useTauri()

  const getWindow = async () => {
    if (!isTauri.value) return null
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    return getCurrentWindow()
  }

  const minimize = () => getWindow().then((w) => w?.minimize())
  const maximize = () => getWindow().then((w) => w?.maximize())
  const unmaximize = () => getWindow().then((w) => w?.unmaximize())
  const toggleMaximize = () => getWindow().then((w) => w?.toggleMaximize())
  const close = () => getWindow().then((w) => w?.close())
  const hide = () => getWindow().then((w) => w?.hide())
  const show = () => getWindow().then((w) => w?.show())
  const setTitle = (title: string) => getWindow().then((w) => w?.setTitle(title))
  const setFullscreen = (fs: boolean) => getWindow().then((w) => w?.setFullscreen(fs))
  const isMaximized = () => getWindow().then((w) => w?.isMaximized() ?? false)
  const isFullscreen = () => getWindow().then((w) => w?.isFullscreen() ?? false)

  return {
    minimize,
    maximize,
    unmaximize,
    toggleMaximize,
    close,
    hide,
    show,
    setTitle,
    setFullscreen,
    isMaximized,
    isFullscreen,
  }
}
