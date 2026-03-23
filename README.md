# nuxt-tauri

[![npm version](https://img.shields.io/npm/v/nuxt-tauri.svg?color=blue)](https://www.npmjs.com/package/nuxt-tauri)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-tauri.svg)](https://www.npmjs.com/package/nuxt-tauri)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

> Nuxt module for **Tauri v2** — the missing glue layer between Nuxt and native desktop.

Add `nuxt-tauri` to your project and get:
- ✅ `ssr: false` auto-configured (Tauri is always client-side)
- ✅ `useTauri()` — type-safe `invoke()` + reactive `isTauri`
- ✅ `useTauriWindow()` — minimize, maximize, fullscreen, close with one line
- ✅ `useTauriNotification()` — native notifications with auto permission handling
- ✅ `$isTauri` — inject available in every component
- ✅ All composables are **auto-imported** — no manual imports needed
- ✅ \**Safe fallbacks** — all calls silently no-op in browser (perfect for hybrid apps)

---

## Install

```bash
npm install nuxt-tauri
# pnpm add nuxt-tauri
# yarn add nuxt-tauri
```

> **Peer dependency:** `@tauri-apps/api >= 2.0.0` must be installed in your project.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-tauri'],
})
```

That's it. `ssr: false` is set automatically and all composables are available globally.

---

## Composables

### `useTauri()`

Core composable. Provides `isTauri` (reactive) and `invoke()`.

```vue
<script setup>
const { isTauri, invoke } = useTauri()

// Type-safe Rust command call
const greeting = await invoke<string>('greet', { name: 'World' })

// Guard for Tauri-only UI
</script>

<template>
  <div v-if="isTauri">
    Running as desktop app
  </div>
</template>
```

### `useTauriWindow()`

Native window controls via `@tauri-apps/api/window`. No additional Rust plugins required.

```vue
<script setup>
const { minimize, toggleMaximize, close, setTitle, setFullscreen } = useTauriWindow()
</script>

<template>
  <!-- Custom titlebar -->
  <div class="titlebar" data-tauri-drag-region>
    <button @click="minimize">_</button>
    <button @click="toggleMaximize">□</button>
    <button @click="close">✕</button>
  </div>
</template>
```

| Method | Description |
|---|---|
| `minimize()` | Minimizes the window |
| `maximize()` | Maximizes the window |
| `unmaximize()` | Restores the window |
| `toggleMaximize()` | Toggle maximize/restore |
| `close()` | Closes the window |
| `hide()` | Hides the window from taskbar |
| `show()` | Shows a hidden window |
| `setTitle(title)` | Sets the window title |
| `setFullscreen(bool)` | Enter/exit fullscreen |
| `isMaximized()` | Resolves `true` if maximized |
| `isFullscreen()` | Resolves `true` if fullscreen |

### `useTauriNotification()`

Native desktop notifications via `tauri-plugin-notification`.

**Requires** in `Cargo.toml`:
```toml
tauri-plugin-notification = "2"
```

And registered in `lib.rs`:
```rust
.plugin(tauri_plugin_notification::init())
```

```vue
<script setup>
const { send } = useTauriNotification()

async function notifyOrderReady() {
  await send({
    title: 'Order ready!',
    body: 'Table 4 is served.',
  })
}
</script>
```

| Method | Returns | Description |
|---|---|---|
| `send({ title, body?, icon? })` | `Promise<void>` | Send notification (auto-requests permission) |
| `isPermissionGranted()` | `Promise<boolean>` | Check current permission |
| `requestPermission()` | `Promise<boolean>` | Request notification permission |

---

## Options

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-tauri'],
  tauri: {
    // Set to true only if you manage ssr:false yourself
    disableSsr: true, // default: true
  },
})
```

---

## How it works with your Rust backend

Everything goes through Tauri's standard `invoke()` bridge. Register commands in Rust:

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Call from your Vue component:

```ts
const { invoke } = useTauri()
const msg = await invoke<string>('greet', { name: 'Chahine' })
// → "Hello, Chahine!"
```

---

## Hybrid apps (Tauri + Browser)

All composables are safe to call in the browser — they return `null`/`undefined` or no-op,
so you can ship the same codebase for both browser and desktop:

```ts
const { isTauri, invoke } = useTauri()

// Only invoke if running in Tauri
if (isTauri.value) {
  const result = await invoke('native_command')
}
```

---

## Requirements

| | Version |
|---|---|
| Nuxt | ≥ 3.0.0 |
| Tauri | v2 |
| `@tauri-apps/api` | ≥ 2.0.0 |

---

## License

MIT © [Chahine Brini](https://chahine-brini.com)

---

> Part of the open-source toolkit at [chahine-brini.com](https://chahine-brini.com).
> Also check out [nuxt-ui-star-rating](https://github.com/RaynisDev/nuxt-ui-star-rating).
