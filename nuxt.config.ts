const title = 'Hommbase'
const backend = 'http://hommbase-new.ru/api/index.php/'
const youtube = 'https://www.googleapis.com/youtube/v3/channels'
const googleApiKey = process.env.GOOGLE_API_KEY
const twitchClientId = process.env.TWITCH_CLIENT_ID
const twitchAuthToken = process.env.TWITCH_AUTH_TOKEN
const email = 'hommbase@gmail.com'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  routeRules: {
    '/auth/**': { ssr: false },
    '/user/**': { ssr: false }
  },
  runtimeConfig: {
    public: {
      projectTitle: title,
      backendUrl: backend,
      youtubeApi: youtube,
      googleApiKey,
      twitchClientId,
      twitchAuthToken,
      email
    }
  },
  app: {
    head: {
      title: title,
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      noscript: [{ children: 'JavaScript is required' }]
    },
    // pageTransition: { name: 'page', mode: 'out-in' }
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
    '@nuxtjs/i18n',
    'dayjs-nuxt'
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
