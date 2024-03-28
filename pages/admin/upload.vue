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
            @input="val => file = val"
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
const fileField = ref(null)
const file = ref(null)
const loading = ref(false)
const error = ref(null)

const catalogs = [
  { id: 1, title_en: 'Mechanics / Common', title_ru: 'Механики / Общие', path: 'images/titles/common', max: 1024 },
  { id: 2, title_en: 'Mechanics / Editor', title_ru: 'Механики / Редактор карт', path: 'images/titles/editor', max: 1024 },
  { id: 3, title_en: 'Mechanics / Headers', title_ru: 'Механики / Заголовки', path: 'images/titles/header', accept: '.png', max: 128 },
  { id: 4, title_en: 'Mechanics / Icons', title_ru: 'Механики / Иконки', path: 'images/titles/icon', accept: '.png', max: 32 }
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
