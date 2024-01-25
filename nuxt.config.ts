const title = 'Hommbase'
const backend = 'http://nitrosick.eternalhost.info/hommbase/index.php/'
const email = 'hommbase@gmail.com'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    '/auth/**': { ssr: false },
    '/user/**': { ssr: false }
  },
  runtimeConfig: {
    public: {
      projectTitle: title,
      backendUrl: backend,
      email
    }
  },
  app: {
    head: {
      title: title,
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      noscript: [{ children: 'JavaScript is required' }]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  components: {
    dirs: [
      'components/ui',
      'components/field'
    ]
  },
  modules: [
    '@nuxtjs/style-resources',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],
  router: {
    options: {
      linkActiveClass: 'active-link',
      linkExactActiveClass: 'exact-active-link'
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/style/variables.scss";'
        },
      },
    },
  },
  css: [
    '@/assets/style/normalize.scss',
    '@/assets/style/main.scss'
  ],
  imports: {
    dirs: ['store']
  },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json'
      },
      {
        code: 'ru',
        file: 'ru.json'
      }
    ],
    langDir: 'lang',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    compilation: {
      strictMessage: false
    }
  }
})
