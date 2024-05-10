<template>
  <Spinner v-if="!data" />
  <div
    v-else
    class="admin"
    :class="{ 'admin-fullscreen': fullscreen }"
  >
    <Entities
      v-if="!fullscreen"
      :title="$t('editor.list')"
      :data="data"
      :selected="edited"
      @select="selectItem"
    />
    <div class="editor">
      <Spinner v-if="loading" />
      <form
        v-if="edited.id"
        @submit.prevent="onSubmit"
      >
        <div class="editor-main">
          <span
            class="editor-id"
            v-html="edited.id"
          />
          <LangSwitcher v-model="lang" />
          <div class="editor-image">
            <img
              :src="imageUrl"
              alt="town image"
              loading="lazy"
            >
          </div>

          <div class="editor-grid">
            <Input
              id="name"
              :label="$t('label.title')"
              placeholder="..."
              :required="true"
              :disabled="true"
              v-model="edited['name_' + lang]"
            />
            <Color
              id="color"
              :label="$t('parameters.theme')"
              :disabled="loading"
              v-model="edited.color"
            />
            <Select
              id="land"
              :label="$t('parameters.land')"
              :options="landOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.land_id"
            />
            <Select
              id="worldview"
              :label="$t('parameters.worldview')"
              :options="worldviewOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.worldview_id"
            />
          </div>

          <Cost
            :value="edited.total_cost"
            :title="$t('label.totalcost')"
            :disabled="loading"
            @update="value => edited.total_cost = value"
          />

          <Textarea
            id="info"
            :label="$t('parameters.description')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 10 }"
            v-model="edited['info_' + lang]"
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
            :text="$t('label.save')"
            type="submit"
            :disabled="loading"
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
import Cost from '@/components/page/admin/Cost.vue'

const {
  $api, $toast, fullscreen, me, t, locale, data, loading, error, lang, edited, options,
  selectItem, getOptions
} = useAdmin()

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

onMounted(() => getData())

const getData = async () => {
  const [res1, err1] = await $api('towns')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('towns/options', null, true)
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }

  if (!res1.length) return

  const result = res1.map(item => (
    { ...item, color: '#' + item.color }
  ))

  data.value = result || null
  edited.value = result[0]
  options.value = res2 || null
}

const landOptions = computed(() => getOptions(options.value.lands))
const worldviewOptions = computed(() => getOptions(options.value.worldview))
const imageUrl = computed(() => `/images/towns/tile/${edited.value.name_en}.webp`)

const onSubmit = async () => {
  const newData = { ...edited.value }
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true
  newData.color = newData.color.replace('#', '')

  const [, err] = await $api('admin/towns/update', {
    token: me.token,
    data: newData
  })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  $toast(t('success.saved'), 5, 'success')
  loading.value = false
}

const checkInput = (data) => {
  if (!data) return false
  if (!data.info_en || !data.info_ru) {
    error.value = t('error.emptyfields')
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.editor-image {
  aspect-ratio: 5/2;
}

@include scrollbar;
</style>
