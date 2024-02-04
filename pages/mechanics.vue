<template>
  <div class="mechanics">
    <Toc
      :titles="titles"
      :selected="selected"
      @select="item => onSelect(item)"
    >
      <template #settings>
        <Select
          id="theme"
          :label="$t('parameters.theme')"
          :options="themes"
          :defaultValue="false"
          v-model="settings.theme"
        />
        <Range
          :label="$t('parameters.fontsize')"
          :min="fontRange[0]"
          :max="fontRange[1]"
          :step="0.2"
          v-model="settings.fontSize"
        />
      </template>
      <template #toc>
        <Input
          id="title"
          type="search"
          :label="$t('label.search')"
          placeholder="..."
          v-model="settings.filter"
        />
      </template>
    </Toc>
    <div class="mechanics-titles">
      <Spinner v-if="loading" />
      <div
        v-if="mechanics"
        class="mechanics-content"
        :class="{ 'mechanics-content-expanded': scroll > 0 }"
      >
        <div class="mechanics-content-title">
          <h3>{{ mechanics['title_' + locale] }}</h3>
          <img
            v-if="mechanics.title_image"
            :src="`/images/titles/header/${mechanics.title_image}.png`"
            alt="title icon"
            class="mechanics-content-icon"
            loading="lazy"
          >
        </div>
        <div
          class="mechanics-content-text"
          :class="{
            'theme-light': settings.theme === 'light',
            'theme-dark': settings.theme === 'dark'
          }"
          :style="{ fontSize: `${settings.fontSize}rem` }"
          v-html="prepareHtml(mechanics['content_' + locale])"
        />
        <button
          class="mechanics-content-next"
          @click.prevent="nextTitle"
        >
          {{ $t('label.nexttitle') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Toc from '@/components/page/mechanics/Toc.vue';
import Spinner from '@/components/app/Spinner.vue';

const { $api } = useNuxtApp()

const { data, pending } = await useAsyncData('toc',
  async () => {
    // const [res, err] = await $api('mechanics/toc', null, true)
    const [res, err] = await $api('mechanics/toc')
    if (err) {
      console.error(err)
      throw showError(err)
    }
    return res || null
  }
)

const { projectTitle } = useRuntimeConfig().public
const router = useRouter()
const { query } = useRoute()
const { t, locale } = useI18n()
const scroll = useScroll()
const loading = ref(false)
const mechanics = ref(null)
const selected = ref({})

const themes = {
  light: 'светлая',
  dark: 'темная'
}
const fontRange = [0.8, 3]

const settings = reactive({
  filter: null,
  theme: 'light',
  fontSize: 1.2
})

useHead({ title: () => `${t('menu.mechanics')} | ${projectTitle}` })

onMounted(() => {
  const theme = localStorage.getItem('color-theme')
  const fontSize = localStorage.getItem('font-size')
  if (theme && themes[theme]) settings.theme = theme
  if (fontSize && fontSize >= fontRange[0] && fontSize <= fontRange[1]) settings.fontSize = fontSize

  if (!query.alias || !data.value) return
  for (const subtitle of data.value.subtitles) {
    if (subtitle.alias === query.alias) {
      onSelect(subtitle)
      return
    }
  }
})

watch(settings, (val) => {
  localStorage.setItem('color-theme', val.theme)
  localStorage.setItem('font-size', val.fontSize)
})

const titles = computed(() => {
  const d = data.value
  if (!d || !d.titles || !d.subtitles) return []
  let result = []

  for (const title of d.titles) {
    const temp = { id: title.id, en: title.title_en, ru: title.title_ru, sub: [], open: false }
    for (const subtitle of d.subtitles) {
      if (subtitle.mechanics_id === title.id) temp.sub.push(subtitle)
    }
    result.push(temp)
  }

  if (settings.filter) {
    const filter = settings.filter.trim().toLowerCase()
    result = result.filter(item => {
      if (
        item.en.toLowerCase().includes(filter) ||
        item.ru.toLowerCase().includes(filter)
      ) return true
      for (const sub of item.sub) {
        if (
          sub.title_en.toLowerCase().includes(filter) ||
          sub.title_ru.toLowerCase().includes(filter)
        ) {
          item.open = true
          return true
        }
      }
      return false
    })
  }

  return result
})

const onSelect = (item) => {
  if (item === selected.value) return
  selected.value = item
  getMechanics(item.alias)
  router.replace({ query: { alias: item.alias } })
}

const nextTitle = () => {
  const t = titles.value
  for (let i = 0; i < t.length; i++) {
    const s = t[i].sub
    for (let j = 0; j < s.length; j++) {
      if (selected.value === s[j]) {
        if (s[j + 1]) {
          t[i].open = true
          onSelect(s[j + 1])
          return
        } else if (t[i + 1]) {
          t[i + 1].open = true
          onSelect(t[i + 1].sub[0])
          return
        } else {
          t[0].open = true
          onSelect(t[0].sub[0])
          return
        }
      }
    }
  }
}

const getMechanics = async (alias) => {
  loading.value = true
  const [res, err] = await $api(`mechanics?alias=${alias}`)
  if (err) {
    console.error(err)
    throw showError(err)
  }
  mechanics.value = res ?? null
  loading.value = false
}

const prepareHtml = (raw) => {
  return raw
    .replaceAll('[m]', '<mark>')
    .replaceAll('[/m]', '</mark>')
    .replaceAll('[s]', '<b>')
    .replaceAll('[/s]', '</b>')
}
</script>

<style lang="scss" scoped>
.mechanics {
  display: grid;
  grid-template-columns: 2fr 7fr;
  min-height: calc(100vh - $height-header);
  border-left: $border-main;
  border-right: $border-main;

  @include breakpoint-lg {
    grid-template-columns: 1fr;
  }

  &-titles {
    position: relative;
  }

  &-content {
    display: flex;
    flex-direction: column;
    background-color: $color-background;
    height: 100%;
    padding-top: $height-header;
    transition: padding-top 0.3s;

    &-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.5rem;
      border-bottom: $border-main;
    }

    &-icon {
      height: 3rem;
    }

    &-text {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem 0;
      flex-grow: 1;

      & ::v-deep() {
        p {
          text-indent: 2rem;
          padding: 0 1.5rem;
        }

        a, mark {
          font-weight: 600;
          color: var(--color-gold-2);
          background-color: transparent;
          text-shadow: 1px 1px 0 var(--color-gold-3);
        }
      }

      &.theme-light {
        background-color: $color-text;
        color: $color-background;
      }

      &.theme-dark {
        & ::v-deep() {
          a, mark {
            color: var(--color-gold-1);
          }
        }
      }
    }

    &-next {
      padding: 1rem;
      border-top: $border-main;
      transition: background-color 0.3s;

      &:hover,
      &:focus {
        background-color: var(--color-grey-2);
      }
    }
  }

  &-content-expanded {
    padding-top: $height-header-m;
  }

  &-parameters {
    border-left: $border-main;
    background-color: $color-background;
  }
}
</style>
