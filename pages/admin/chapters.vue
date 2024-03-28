<template>
  <Spinner v-if="!data" />
  <div
    v-else
    class="admin"
    :class="{ 'admin-fullscreen': fullscreen }"
  >
    <Entities
      v-if="!fullscreen"
      :title="$t('label.toc')"
      :data="titles"
      :selected="selected"
      @select="selectChapter"
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
          <Input
            id="order"
            type="number"
            :label="$t('label.order')"
            :required="true"
            :disabled="loading"
            :attrs="{ min: 0, step: 5 }"
            v-model="edited.order_num"
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
import Spinner from '@/components/app/Spinner.vue'
import Entities from '@/components/page/admin/Entities.vue'
import LangSwitcher from '@/components/page/admin/LangSwitcher.vue'

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

const { $api, $toast } = useNuxtApp()
const fullscreen = useFullscreen()
const { projectTitle } = useRuntimeConfig().public
const { me } = useUserStore()
const { t } = useI18n()
const data = ref(null)
const loading = ref(false)
const error = ref(null)
const lang = ref('ru')

const initial = {
  id: null,
  order_num: 0,
  alias: null,
  title_en: null,
  title_ru: null
}

const edited = ref({ ...initial })
const selected = ref({})

useHead({ title: () => `${t('menu.admin')} | ${projectTitle}` })
onMounted(() => getData())
watch(() => ({...edited.value}), () => { error.value = null })

const getData = async () => {
  const [res, err] = await $api('mechanics/toc')
  if (err) {
    console.error(err)
    throw showError(err)
  }
  data.value = res.titles ?? null
}

const titles = computed(() => {
  if (!data.value) return []
  return [...data.value].sort((a, b) => a.order_num - b.order_num)
})

const selectChapter = (item) => {
  if (item === selected.value) return
  selected.value = item
  edited.value = { ...item }
}

const onSubmit = async () => {
  const newData = edited.value
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true
  const path = `admin/mechanics/chapters/${newData.id ? 'update' : 'create'}`

  const [res, err] = await $api(path, {
    token: me.token,
    data: newData
  })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  correctList(res.id ?? null)
  $toast(t('success.saved'), 5, 'success')
  loading.value = false
}

const checkInput = (data) => {
  if (!data) return false
  if (!data.title_en || !data.title_ru) {
    error.value = t('error.emptyfields')
    return false
  }
  if (!data.id && !data.alias.match(/^[a-z_]*$/)) {
    error.value = t('error.alias') + ': a-z _'
    return false
  }
  return true
}

const correctList = (newId) => {
  const newData = edited.value

  if (newId) {
    data.value.push({
      id: newId,
      ...newData
    })
    return
  }

  for (const item of data.value) {
    if (item.id === newData.id) {
      item.order_num = newData.order_num
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
@include scrollbar;
</style>
