import { computed } from 'vue'

/**
 * Core composable for Tauri integration.
 *
 * @example
 * ```vue
 * <script setup>
 * const { isTauri, invoke } = useTauri()
 * const result = await invoke<string>('greet', { name: 'World' })
 * </script>
 * ```
 */
export const useTauri = () => {
  /** Reactive boolean — true when running inside a Tauri window */
  const isTauri = computed(
    () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window,
  )

  /**
   * Type-safe wrapper around Tauri's `invoke()`.
   * Throws if called outside of a Tauri context.
   *
   * @param command - Rust command name registered with `#[tauri::command]`
   * @param args    - Optional arguments passed to the command
   */
  const invoke = async <T = unknown>(
    command: string,
    args?: Record<string, unknown>,
  ): Promise<T> => {
    if (!isTauri.value) {
      throw new Error(
        `[nuxt-tauri] invoke("${command}") was called outside a Tauri context.`,
      )
    }
    const { invoke: tauriInvoke } = await import('@tauri-apps/api/core')
    return tauriInvoke<T>(command, args)
  }

  return { isTauri, invoke }
}
