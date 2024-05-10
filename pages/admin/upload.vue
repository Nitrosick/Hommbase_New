<template>
  <div
    class="admin"
    :class="{ 'admin-fullscreen': fullscreen }"
  >
    <Entities
      v-if="!fullscreen"
      :title="$t('label.catalogs')"
      :data="catalogs"
      :selected="selected"
      @select="selectCatalog"
    />
    <div class="editor">
      <Spinner v-if="loading" />
      <form @submit.prevent="onSubmit">
        <div class="editor-main">
          <Input
            id="alias"
            :label="$t('label.alias')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            v-model="alias"
          />
          <File
            ref="fileField"
            id="file"
            :label="$t('label.file')"
            :required="true"
            :disabled="loading"
            :accept="selected.accept ? selected.accept : '.jpg, .jpeg, .png, .webp'"
            :size-limit="selected.max ?? 512"
            :resolution="selected.resolution ?? null"
            @input="val => file = val"
          />
          <Checkbox
            id="force"
            :label="$t('label.rewrite')"
            :disabled="loading"
            v-model="force"
          />
        </div>

        <div
          v-if="error"
          class="editor-error"
        >
          <Error :data="error" />
        </div>

        <div class="editor-control">
          <Button
            :text="$t('label.upload')"
            type="submit"
            :disabled="loading || !file"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import Spinner from '@/components/app/Spinner.vue'
import Entities from '@/components/page/admin/Entities.vue'

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

const { $api, $toast } = useNuxtApp()
const fullscreen = useFullscreen()
const { projectTitle } = useRuntimeConfig().public
const { me } = useUserStore()
const { t } = useI18n()
const alias = ref(null)
const force = ref(false)
const fileField = ref(null)
const file = ref(null)
const loading = ref(false)
const error = ref(null)

const catalogs = [
  { id: 1, title_en: 'News', title_ru: 'Новости', path: 'images/news', accept: '.webp', max: 128 },
  { id: 2, title_en: 'Mobs', title_ru: 'Существа', path: 'images/mobs', accept: '.webp', max: 128, resolution: '120x160px' },
  { id: 3, title_en: 'Heroes', title_ru: 'Герои', path: 'images/heroes/portrait', accept: '.webp', max: 128, resolution: '120x130px' },
  { id: 4, title_en: 'Specializations', title_ru: 'Специализации', path: 'images/specialization', accept: '.webp', max: 64, resolution: '1/1' },
  { id: 5, title_en: 'Artifacts', title_ru: 'Артефакты', path: 'images/artifacts', accept: '.webp', max: 128, resolution: '120x120px' },
  { id: 6, title_en: 'Objects / Main', title_ru: 'Объекты / Основные', path: 'images/objects/picture', accept: '.webp,.gif', max: 128, resolution: '150x150px' },
  { id: 7, title_en: 'Objects / Schemes', title_ru: 'Объекты / Схемы', path: 'images/objects/scheme', accept: '.png', max: 64, resolution: '390x150px' },
  { id: 8, title_en: 'Towns / Tiles', title_ru: 'Города / Тайлы', path: 'images/towns/tile', accept: '.webp', max: 128, resolution: '400x160px' },
  { id: 9, title_en: 'Mechanics / Common', title_ru: 'Механики / Общие', path: 'images/titles/common', max: 1024 },
  { id: 10, title_en: 'Mechanics / Editor', title_ru: 'Механики / Редактор карт', path: 'images/titles/editor', max: 1024 },
  { id: 11, title_en: 'Mechanics / Headers', title_ru: 'Механики / Заголовки', path: 'images/titles/header', accept: '.png', max: 128 },
  { id: 12, title_en: 'Mechanics / Icons', title_ru: 'Механики / Иконки', path: 'images/titles/icon', accept: '.png', max: 32 }
]

const selected = ref(catalogs[0])

useHead({ title: () => `${t('menu.admin')} | ${projectTitle}` })
watch([alias, file], () => { error.value = null })

const selectCatalog = (item) => {
  if (item === selected.value) return
  selected.value = item
}

const onSubmit = async () => {
  error.value = null

  if (!alias.value || !alias.value.match(/^[a-z0-9_-]*$/)) {
    error.value = t('error.alias') + ': a-z 0-9 _ -'
    return
  }

  loading.value = true
  const formData = new FormData()
  formData.append('files[]', file.value)
  formData.append('alias', alias.value)
  formData.append('catalog', selected.value.path)
  formData.append('force', force.value)
  formData.append('token', me.token)

  const [, err] = await $api('admin/upload', formData, false, true)

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  $toast(t('success.uploaded'), 5, 'success')
  alias.value = null
  fileField.value.clear()
  loading.value = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';
@include scrollbar;
</style>
