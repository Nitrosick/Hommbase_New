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
      agregator="group"
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
            :disabled="loading"
            v-model="alias"
          />
          <Select
            v-if="selected.selectable && towns"
            id="town"
            :label="$t('parameters.town')"
            :options="towns"
            :required="true"
            :disabled="loading"
            :default-value="false"
            v-model="town"
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
import { catalogs } from '@/const/uploads'
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
const selected = ref(catalogs[0])
const towns = ref(null)
const town = ref(null)

useHead({ title: () => `${t('menu.admin')} | ${projectTitle}` })
watch([alias, file], () => { error.value = null })
onMounted(() => getData())

const getData = async () => {
  const [res, err] = await $api('towns/list', null, true)
  if (err) {
    console.error(err)
    throw showError(err)
  }
  if (!res.length) return
  towns.value = res
    .filter(item => +item.id !== 0)
    .reduce(
      (carry, item) => {
        carry[item.name_en] = item.name_en
        return carry
      }, {}
    )
}

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
  if (town.value) formData.append('town', town.value)

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
