import { defineNuxtModule, addPlugin, addImportsDir, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Automatically set `ssr: false` (required for Tauri apps).
   * @default true
   */
  disableSsr?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-tauri',
    configKey: 'tauri',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {
    disableSsr: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Tauri apps are always client-side only
    if (options.disableSsr) {
      nuxt.options.ssr = false
    }

    // Provide $isTauri via Nuxt plugin
    addPlugin(resolver.resolve('./runtime/plugin.client'))

    // Auto-import all composables
    addImportsDir(resolver.resolve('./runtime/composables'))
  },
})
