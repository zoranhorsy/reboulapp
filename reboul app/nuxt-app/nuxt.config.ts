// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: '',
      titleTemplate: '%s | REBOUL STORE 2.0',  // Ajout du template
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'REBOUL STORE 2.0' }
      ],
    }
  },
  ssr: true,
  experimental: {
    payloadExtraction: false
  },
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/content'
  ],
  // Ajoutez ces configurations pour résoudre les problèmes de build
  vite: {
    optimizeDeps: {
      include: ['pinia']
    }
  },
  // Si vous utilisez TypeScript, ajoutez ceci
  typescript: {
    strict: true
  }
})