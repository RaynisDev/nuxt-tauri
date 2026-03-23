import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    '@tauri-apps/api',
    '@tauri-apps/api/core',
    '@tauri-apps/api/window',
    '@tauri-apps/plugin-notification',
    '@tauri-apps/plugin-os',
  ],
})
