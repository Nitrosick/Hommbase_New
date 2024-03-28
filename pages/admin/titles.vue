<template>
  <Spinner v-if="!data" />
  <div
    v-else
    class="admin"
    :class="{ 'admin-fullscreen': fullscreen }"
  >
    <Toc
      v-if="!fullscreen"
      :titles="titles"
      :selected="selected"
      :fixed="true"
      @select="item => selectTitle(item)"
    />
    <div class="editor">
      <Spinner v-if="loading" />
      <form @submit.prevent="onSubmit">
        <div class="editor-main">
          <span
            v-if="edited.id"
            class="editor-id"
            v-html="edited.id"
          />
          <LangSwitcher v-model="lang" />
          <Checkbox
            v-if="edited.id"
            id="activity"
            :label="$t('label.activity')"
            :disabled="loading"
            v-model="edited.is_active"
          />
          <Input
            id="name"
            :label="$t('label.title')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            v-model="edited['title_' + lang]"
          />
          <Input
            v-if="!edited.id"
            id="alias"
            :label="$t('label.alias')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            v-model="edited.alias"
          />
          <Select
            id="section"
            :label="$t('label.chapter')"
            :options="chapterOptions"
            :required="true"
            :disabled="loading"
            :default-value="false"
            v-model="edited.mechanics_id"
          />
          <div class="editor-main-icon">
            <Select
              id="icon"
              :label="$t('label.icon')"
              :options="iconOptions"
              :disabled="loading"
              v-model="edited.title_image"
            />
            <img
              v-if="edited.title_image"
              :src="`/images/titles/header/${edited.title_image}.png`"
              alt="title icon"
              loading="lazy"
            >
          </div>
        </div>

        <details
          class="editor-group"
          open
        >
          <summary class="editor-group-summary">
            {{ $t('label.content') }}
          </summary>
          <Content
            :disabled="loading"
            v-model="edited['content_' + lang]"
          />
        </details>

        <details class="editor-group">
          <summary class="editor-group-summary">
            {{ $t('label.images') }}
          </summary>
          <Images :data="{
            common: data.img.common,
            editor: data.img.editor
          }" />
        </details>

        <details class="editor-group">
          <summary class="editor-group-summary">
            {{ $t('label.preview') }}
          </summary>
          <Preview :data="edited['content_' + lang]" />
        </details>

        <div
          v-if="error"
          class="editor-error"
        >
          <Error :data="error" />
        </div>

        <div class="editor-control">
          <Button
            :text="edited.id ? $t('label.save') : $t('label.create')"
            type="submit"
            :disabled="loading"
          />
          <Button
            :text="$t('label.cancel')"
            :disabled="loading"
            @btn-click="reset"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import Toc from '@/components/page/mechanics/Toc.vue'
import Spinner from '@/components/app/Spinner.vue'
import LangSwitcher from '@/components/page/admin/LangSwitcher.vue'
import Content from '@/components/page/admin/mechanics/Content.vue'
import Images from '@/components/page/admin/mechanics/Images.vue'
import Preview from '@/components/page/admin/mechanics/Preview.vue'

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

const { $api, $toast } = useNuxtApp()
const fullscreen = useFullscreen()
const { projectTitle } = useRuntimeConfig().public
const { me } = useUserStore()
const { t, locale } = useI18n()
const data = ref(null)
const loading = ref(false)
const error = ref(null)
const lang = ref('ru')

const initial = {
  id: null,
  is_active: true,
  mechanics_id: null,
  alias: null,
  title_en: null,
  title_ru: null,
  content_en: null,
  content_ru: null,
  title_image: null
}

const edited = ref({ ...initial })
const selected = ref({})

useHead({ title: () => `${t('menu.admin')} | ${projectTitle}` })
onMounted(() => getData())
watch(() => ({...edited.value}), () => { error.value = null })

const getData = async () => {
  const [res1, err1] = await $api('mechanics/toc')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('mechanics/images')
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }
  data.value = {
    toc: res1 || null,
    img: res2 || null
  }
}

const titles = computed(() => {
  const d = data.value.toc
  if (!d || !d.titles || !d.subtitles) return []
  let result = []

  for (const title of d.titles) {
    const temp = { id: title.id, en: title.title_en, ru: title.title_ru, sub: [], open: false }
    for (const subtitle of d.subtitles) {
      if (subtitle.mechanics_id === title.id) temp.sub.push(subtitle)
    }
    result.push(temp)
  }

  return result
})

const selectTitle = (item) => {
  if (item === selected.value) return
  selected.value = item
  getMechanics(item.alias)
}

const getMechanics = async (alias) => {
  loading.value = true

  const [res, err] = await $api(`mechanics?alias=${alias}`)
  if (err) {
    console.error(err)
    throw showError(err)
  }

  edited.value = {
    ...res,
    is_active: Boolean(+res.is_active),
    content_en: prepareContent(res.content_en),
    content_ru: prepareContent(res.content_ru)
  }

  loading.value = false
}

const prepareContent = (raw) => {
  if (!raw) return ''
  return raw
    .replaceAll('<p>', '\n<p>\n')
    .replaceAll('</p>', '\n</p>\n')
    .replaceAll('<table>', '\n<table>')
    .replaceAll('</table>', '\n</table>\n')
    .replaceAll('<tr>', '\n<tr>')
    .replaceAll('<ul>', '\n<ul>')
    .replaceAll('</ul>', '\n</ul>\n')
    .replaceAll('<li>', '\n<li>')
    .replaceAll('<div', '\n<div')
    .replaceAll('</div>', '</div>\n')
    .trim()
}

const chapterOptions = computed(() => {
  const result = {}
  if (!data.value.toc.titles) return result
  for (const item of data.value.toc.titles) { result[item.id] = item['title_' + locale.value] }
  return result
})

const iconOptions = computed(() => {
  const files = data.value.img.icons
  if (!files) return {}

  return files.reduce(
    (carry, item) => {
      const name = item.split('.png')[0]
      carry[name] = name
      return carry
    }, {}
  )
})

const onSubmit = async () => {
  const newData = edited.value
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true
  const path = `admin/mechanics/titles/${newData.id ? 'update' : 'create'}`

  const [res, err] = await $api(path, {
    token: me.token,
    data: {
      ...newData,
      content_en: newData.content_en.replaceAll('\n', ''),
      content_ru: newData.content_ru.replaceAll('\n', '')
    }
  })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  correctToc(res.id ?? null)
  $toast(t('success.saved'), 5, 'success')
  loading.value = false
}

const checkInput = (data) => {
  if (!data) return false
  if (
    !data.title_en ||
    !data.title_ru ||
    !data.content_en ||
    !data.content_ru
  ) {
    error.value = t('error.emptyfields')
    return false
  }
  if (!data.id && !data.alias.match(/^[a-z_]*$/)) {
    error.value = t('error.alias') + ': a-z _'
    return false
  }
  return true
}

const correctToc = (newId) => {
  const newData = edited.value

  if (newId) {
    data.value.toc.subtitles.push({
      id: newId,
      ...newData
    })
    return
  }

  for (const item of data.value.toc.subtitles) {
    if (item.id === newData.id) {
      item.mechanics_id = newData.mechanics_id
      item.title_en = newData.title_en
      item.title_ru = newData.title_ru
      return
    }
  }
}

const reset = () => {
  edited.value = { ...initial }
  selected.value = {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';
@import '@/assets/style/titles.scss';
@include scrollbar;
</style>
