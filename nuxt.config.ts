// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    host: "0.0.0.0"
  },
  vite: {
    server: {
      hmr: {
        host: '0.0.0.0'
      }
    }
  },
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module", "@pinia/nuxt"]
})