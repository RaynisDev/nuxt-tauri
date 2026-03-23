import { useTauri } from './useTauri'

interface NotificationOptions {
  title: string
  body?: string
  icon?: string
}

/**
 * Composable for native desktop notifications via `tauri-plugin-notification`.
 *
 * **Requires** the Rust plugin in `Cargo.toml`:
 * ```toml
 * tauri-plugin-notification = "2"
 * ```
 * And registered in `lib.rs`:
 * ```rust
 * .plugin(tauri_plugin_notification::init())
 * ```
 *
 * @example
 * ```vue
 * <script setup>
 * const { send } = useTauriNotification()
 * await send({ title: 'Order ready!', body: 'Table 4 is served.' })
 * </script>
 * ```
 */
export const useTauriNotification = () => {
  const { isTauri } = useTauri()

  const isPermissionGranted = async (): Promise<boolean> => {
    if (!isTauri.value) return false
    const { isPermissionGranted: check } = await import(
      '@tauri-apps/plugin-notification'
    )
    return check()
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!isTauri.value) return false
    const { requestPermission: request } = await import(
      '@tauri-apps/plugin-notification'
    )
    const result = await request()
    return result === 'granted'
  }

  /**
   * Send a notification. Requests permission automatically if not yet granted.
   */
  const send = async (options: NotificationOptions): Promise<void> => {
    if (!isTauri.value) return

    const { isPermissionGranted: check, requestPermission: request, sendNotification } =
      await import('@tauri-apps/plugin-notification')

    let granted = await check()
    if (!granted) {
      const res = await request()
      granted = res === 'granted'
    }
    if (granted) sendNotification(options)
  }

  return { send, isPermissionGranted, requestPermission }
}
