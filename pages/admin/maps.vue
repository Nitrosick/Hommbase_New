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
      :selected="selected"
      @select="selectItem"
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
          <div class="editor-image">
            <img
              v-if="edited.id"
              :src="imageUrl"
              alt="map poster"
              loading="lazy"
              @error="imgDefaultUrl"
            >
          </div>

          <Checkbox
            v-if="edited.id"
            id="activity"
            :label="$t('label.activity')"
            :disabled="loading"
            v-model="edited.is_active"
          />

          <div class="editor-grid">
            <Input
              id="name"
              :label="$t('label.title')"
              placeholder="..."
              :required="true"
              :disabled="loading"
              v-model="edited['name_' + lang]"
            />
            <Select
              id="size"
              :label="$t('parameters.size')"
              :options="sizeOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.size_id"
            />
            <Input
              id="players"
              type="number"
              :label="$t('parameters.players')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 1, max: 8, step: 1 }"
              v-model="edited.players"
            />
            <Input
              id="players-humans"
              type="number"
              :label="$t('parameters.playershumans')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 1, max: 8, step: 1 }"
              v-model="edited.players_humans"
            />
            <Input
              id="teams"
              type="number"
              :label="$t('parameters.teams')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, max: 8, step: 1 }"
              v-model="edited.teams"
            />
            <Select
              id="version"
              :label="$t('parameters.version')"
              :options="versionOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.version"
            />
            <Select
              id="target"
              :label="$t('parameters.target')"
              :options="targetOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.target_id"
            />
            <Select
              id="type"
              :label="$t('parameters.type')"
              :options="typeOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.type_id"
            />
            <Input
              id="author"
              :label="$t('parameters.author')"
              placeholder="..."
              :required="true"
              :disabled="loading"
              v-model="edited.author"
            />
            <Select
              id="file"
              :label="$t('label.file')"
              :options="fileOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.download_file"
            />
          </div>

          <Checkbox
            id="underground"
            :label="$t('parameters.withunderground')"
            :disabled="loading"
            v-model="edited.with_underground"
          />
          <Textarea
            id="description"
            :label="$t('parameters.description')"
            placeholder="..."
            :disabled="loading"
            :attrs="{ rows: 7 }"
            v-model="edited['description_' + lang]"
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
import Entities from '@/components/page/admin/Entities.vue'
import Spinner from '@/components/app/Spinner.vue'
import LangSwitcher from '@/components/page/admin/LangSwitcher.vue'

const {
  $api, $toast, fullscreen, me, t, data, loading, error, lang, options,
  getOptions
} = useAdmin()

definePageMeta({
  middleware: ['05-admin'],
  layout: 'admin'
})

const initial = {
  id: null,
  is_active: true,
  name_en: null,
  name_ru: null,
  size_id: 1,
  players: 1,
  players_humans: 1,
  teams: 0,
  target_id: 1,
  version: 'HotA',
  author: me.name ?? null,
  download_file: null,
  description_en: null,
  description_ru: null,
  type_id: 2,
  with_underground: false
}

const edited = ref({ ...initial })
const selected = ref({})
const versions = ['HotA', 'HD', 'SoD', 'WoG']

onMounted(() => getData())
watch(() => ({...edited.value}), () => { error.value = null })

const getData = async () => {
  const [res1, err1] = await $api('maps')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('maps/options')
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }

  const result = res1.map(item => (
    {
      ...item,
      is_active: Boolean(+item.is_active),
      with_underground: Boolean(+item.with_underground)
    }
  ))

  data.value = result || []
  options.value = res2 || {}
}

const selectItem = (item) => {
  if (item === edited.value) return
  edited.value = item
}

const sizeOptions = computed(() => {
  const { sizes } = options.value
  if (!sizes || !sizes.length) return {}
  return sizes.reduce(
    (carry, item) => {
      carry[item.id] = `${item.abbr} ${item.size}`
      return carry
    }, {}
  )
})

const fileOptions = computed(() => {
  const files = options.value.files
  if (!files) return {}
  return files.reduce(
    (carry, item) => {
      carry[item] = item
      return carry
    }, {}
  )
})

const versionOptions = computed(() => versions.reduce(
  (carry, item) => {
    carry[item] = item
    return carry
  }, {}
))

const targetOptions = computed(() => getOptions(options.value.targets))
const typeOptions = computed(() => getOptions(options.value.types))

const imageUrl = computed(() => `/images/maps/screenshot/${edited.value.id}.jpg`)
const imgDefaultUrl = (event) => { event.target.src = '/images/maps/screenshot/plug.webp' }

const onSubmit = async () => {
  const newData = edited.value
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true
  const path = `admin/maps/${newData.id ? 'update' : 'create'}`
  newData.is_active = !newData.is_active ? 0 : 1
  newData.with_underground = !newData.with_underground ? 0 : 1

  const [res, err] = await $api(path, {
    token: me.token,
    data: newData
  })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  if (!newData.id && res.id) {
    newData.id = res.id
    data.value.push(newData)
  }

  $toast(t('success.saved'), 5, 'success')
  loading.value = false
}

const checkInput = (data) => {
  if (!data) return false
  if (data.players_humans > data.players) data.players_humans = data.players
  if (data.teams > data.players) data.teams = data.players
  if (
    !data.description_en ||
    !data.description_ru ||
    !data.name_en ||
    !data.name_ru
  ) {
    error.value = t('error.emptyfields')
    return false
  }
  return true
}

const reset = () => {
  edited.value = { ...initial }
  selected.value = {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.editor-image {
  width: 25rem;
  aspect-ratio: 2/1;
}

@include scrollbar;
</style>
