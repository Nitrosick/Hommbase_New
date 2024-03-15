<template>
  <div
    v-if="data && data.length"
    class="objects objects-page"
  >
    <Filters @reset="resetFilters">
      <template #filters>
        <Input
          id="title"
          type="search"
          :label="$t('label.title')"
          placeholder="..."
          v-model="filters.title"
        />
        <Select
          id="category"
          :label="$t('parameters.category')"
          :options="categoryOptions"
          v-model="filters.category"
        />
        <Select
          id="guarded"
          :label="$t('parameters.guarded')"
          :options="{
            yes: 'да',
            no: 'нет'
          }"
          v-model="filters.guarded"
        />
        <Select
          id="tunable"
          :label="$t('parameters.tunable')"
          :options="{
            yes: 'да',
            no: 'нет'
          }"
          v-model="filters.tunable"
        />
      </template>
    </Filters>
    <Tiles>
      <TilesGroup
        v-for="(value, group) in filteredItems"
        :key="group"
        :summary="group"
        :width="8"
      >
        <TilesItem
          v-for="item in value"
          :key="`item:${item.id}`"
          :height="9"
          :image="getImageUrl(item)"
          :title="item[`name_${locale}`]"
          :selected="item.id === selectedId"
          @click="selectItem(item)"
        />
      </TilesGroup>
    </Tiles>
    <Parameters
      :image="getImageUrl(selectedItem)"
      image-ratio="1/1"
      :title="selectedItem[`name_${locale}`]"
      @reset="resetParams"
    >
      <ParametersItem
        v-for="p in parameters"
        :key="`param:${p.id}`"
        :title="p.name"
        :value="getParameterValue(p)"
        :icon="p.icon"
      />
      <div class="objects-scheme">
        <img
          src="/images/objects/scheme/grid.png"
          alt="grid"
          loading="lazy"
          class="objects-scheme-base"
        >
        <img
          v-if="selectedId && selectedItem.scheme !== 'no-scheme'"
          :src="getSchemeUrl"
          alt="object scheme"
          loading="lazy"
          class="objects-scheme-img"
        >
      </div>
      <ParametersText
        title="description"
        icon="info"
        :value="translatable('description')"
      />
    </Parameters>
  </div>
</template>

<script setup>
import { seo } from '@/const/seo'
import Filters from '@/components/app/panel/Filters.vue'
import Tiles from '@/components/app/panel/Tiles.vue'
import TilesGroup from '@/components/app/panel/TilesGroup.vue'
import TilesItem from '@/components/app/panel/TilesItem.vue'
import Parameters from '@/components/app/panel/Parameters.vue'
import ParametersItem from '@/components/app/panel/ParametersItem.vue'
import ParametersText from '@/components/app/panel/ParametersText.vue'

const { $api } = useNuxtApp()

const { data, pending } = await useAsyncData('objects',
  async () => {
    const [res, err] = await $api('objects', null, true)
    if (err) {
      console.error(err)
      throw showError(err)
    }
    return res || []
  }
)

const {
  projectTitle, selectedItem, selectedId, order, filteredStr,
  selectItem, switchItem, resetParams, getParameterValue, translatable, getOptions
} = useObjects()

const { query } = useRoute()
const { t, locale } = useI18n()
const filters = reactive({
  title: null,
  category: null,
  guarded: null,
  tunable: null
})
const hasFilters = computed(() => filters.title || filters.category || filters.guarded || filters.tunable)

useHead({ title: () => `${t('menu.objects')} | ${projectTitle}` })
useSeoMeta(seo.objects)

const handleSwitch = (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      switchItem('prev', filteredItems.value)
      break
    case 'ArrowRight':
      switchItem('next', filteredItems.value)
      break
    case 'Delete':
      resetFilters()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleSwitch)

  if (!query.alias) return
  for (const item of data.value) {
    if (item.name_en === query.alias) return selectItem(item)
  }
})
onUnmounted(() => { window.removeEventListener('keydown', handleSwitch) })

const filteredItems = computed(() => {
  const result = {}

  if (hasFilters.value) {
    const section = filteredStr
    const asc = order.value === 'ascending'

    result[section] = data.value
    if (filters.title) result[section] = result[section].filter(item => {
      const input = filters.title.toLowerCase()
      return item.name_en.includes(input) || item.name_ru.includes(input)
    })
    if (filters.category) result[section] = result[section].filter(item => item.category_en === filters.category)
    if (filters.guarded) result[section] = result[section].filter(item => filters.guarded === 'no' ? !+item.is_guarded : !!+item.is_guarded)
    if (filters.tunable) result[section] = result[section].filter(item => filters.tunable === 'no' ? !+item.is_tunable : !!+item.is_tunable)
    return result
  }

  for (const item of [...data.value].sort((a, b) => a.id - b.id)) {
    const key = `${item.category_en}/${item.category_ru}`
    if (!result[key]) result[key] = [item]
    else result[key].push(item)
  }

  return result
})

/* Parameters block */
const getImageUrl = (item) => {
  if (!item || !item.name_en) return ''
  const fileName = item.name_en.replace(/[\s?_-]/g, '')
  return `/images/objects/picture/${fileName}.${+item.is_gif ? 'gif' : 'webp'}`
}

const getGuarded = () => +selectedItem.value.is_guarded ? t('label.yes') : t('label.no')
const getTunable = () => +selectedItem.value.is_tunable ? t('label.yes') : t('label.no')
const getSchemeUrl = computed(() => `/images/objects/scheme/${selectedItem.value.scheme}.png`)

const parameters = [
  { id: 1, name: 'guarded', func: getGuarded, value: '', icon: 'defense' },
  { id: 2, name: 'tunable', func: getTunable, value: '', icon: 'settings' }
]

/* Filters block */
const resetFilters = () => {
  filters.title = null
  filters.category = null
  filters.guarded = null
  filters.tunable = null

  order.value = 'ascending'
  resetParams()
}

const categoryOptions = computed(() => getOptions('category', data))
</script>

<style lang="scss" scoped>
.objects {
  &-scheme {
    position: relative;
    display: flex;
    border-top: $border-main;
    border-bottom: $border-main;
    overflow: hidden;
  }

  &-scheme-base {
    width: 100%;
  }

  &-scheme-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
