<template>
  <div class="mechanics">
    <Toc
      :titles="titles"
      :selected="selected"
      @select="item => onSelect(item)"
    />
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

useHead({ title: () => `${t('menu.mechanics')} | ${projectTitle}` })

onMounted(() => {
  if (!query.alias || !data.value) return
  for (const subtitle of data.value.subtitles) {
    if (subtitle.alias === query.alias) {
      onSelect(subtitle)
      return
    }
  }
})

const titles = computed(() => {
  const d = data.value
  if (!d || !d.titles || !d.subtitles) return []

  const result = []
  for (const title of d.titles) {
    const temp = { id: title.id, en: title.title_en, ru: title.title_ru, sub: [] }
    for (const subtitle of d.subtitles) {
      if (subtitle.mechanics_id === title.id) temp.sub.push(subtitle)
    }
    result.push(temp)
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
          onSelect(s[j + 1])
          return
        } else if (t[i + 1]) {
          onSelect(t[i + 1].sub[0])
          return
        } else {
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

  // @include breakpoint-xxl {
  //   grid-template-columns: 2fr 3fr 2fr;
  // }

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
      background-color: $color-text;
      color: $color-background;
      padding: 1.5rem 0;
      flex-grow: 1;

      & ::v-deep(p) {
        text-indent: 2rem;
        padding: 0 1.5rem;
      }

      & ::v-deep(a),
      & ::v-deep(mark) {
        font-weight: 600;
        color: var(--color-gold-2);
        background-color: transparent;
      }
    }

    &-next {
      padding: 1rem;
      border-top: $border-main;
      transition: background-color 0.3s;

      &:hover {
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
