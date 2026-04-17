// nuxt.config.ts
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  alias: {
    // alias final yang ingin dipakai
    '#features': fileURLToPath(new URL('./features', import.meta.url)),
    '#config': fileURLToPath(new URL('./config', import.meta.url)),
    '#stores': fileURLToPath(new URL('./stores', import.meta.url)),
    '#types': fileURLToPath(new URL('./types', import.meta.url)),
    '#composables': fileURLToPath(new URL('./composables', import.meta.url)),
  },

  css: [
    '~/assets/css/main.css',
    '@vuepic/vue-datepicker/dist/main.css',
  ],

  image: {
    domains: ['lh3.googleusercontent.com'],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
  ],

  i18n: {
    defaultLocale: 'id',
    strategy: 'prefix_and_default',
    locales: [
      { code: 'id', name: 'Bahasa', file: 'id.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '#features/shared/dashboard/components',
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    adminAiToken: process.env.ADMIN_AI_TOKEN || '',
    ollamaBase: process.env.OLLAMA_BASE || 'http://127.0.0.1:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:3b-instruct',

    public: {
      academicCalendarFileId: process.env.NUXT_ACADEMIC_CALENDAR_FILE_ID || '',
      apiBase: process.env.API_BASE || 'http://localhost:3001',
    },
  },

  typescript: {
    typeCheck: true,
  },
})