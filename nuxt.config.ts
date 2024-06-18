const title = 'Hommbase'
const backend = 'https://hommbase.ru/api/index.php/'
const youtube = 'https://www.googleapis.com/youtube/v3'
const email = 'hommbase@gmail.com'

const googleApiKey = process.env.GOOGLE_API_KEY
const twitchClientId = process.env.TWITCH_CLIENT_ID
const twitchAuthToken = process.env.TWITCH_AUTH_TOKEN
const yandexMetrikaId = process.env.YANDEX_METRIKA_ID
const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  routeRules: {
    '/auth/**': { ssr: false },
    '/user/**': { ssr: false },
    '/admin/**': { ssr: false }
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
      charset: 'utf-8',
      title: title,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
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
    '@nuxtjs/i18n',
    'dayjs-nuxt',
    'nuxt-gtag',
    'yandex-metrika-module-nuxt3',
    'nuxt-aos',
    '@vite-pwa/nuxt'
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
  },
  gtag: {
    id: googleAnalyticsId
  },
  yandexMetrika: {
    id: yandexMetrikaId
  },
  aos: {
    delay: 150,
    duration: 1000,
    easing: 'ease-out',
    once: true
  },
  pwa: {
    manifest: {
      name: 'Hommbase',
      short_name: 'Hommbase',
      description: 'Heroes of Might and Magic III knowledge base',
      theme_color: '#393b3d',
      background_color: '#111212',
      icons: [
        {
          src: 'images/pwa/512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'images/pwa/192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'images/pwa/144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'images/pwa/64x64.png',
          sizes: '64x64',
          type: 'image/png'
        }
      ],
      // screenshots: [
      //   {
      //     src: "images/pwa/screenshot_d.jpg",
      //     sizes: "900x615",
      //     type: "image/jpg",
      //     form_factor: "wide",
      //     label: "Hommbase"
      //   },
      //   {
      //     src: "images/pwa/screenshot_m.jpg",
      //     sizes: "468x320",
      //     type: "image/jpg",
      //     form_factor: "narrow",
      //     label: "Hommbase"
      //   },
      // ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    },
    client: {
      installPrompt: true
    },
  }
})
