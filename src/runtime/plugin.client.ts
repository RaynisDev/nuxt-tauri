import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const isTauri =
    typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

  return {
    provide: {
      isTauri,
    },
  }
})
