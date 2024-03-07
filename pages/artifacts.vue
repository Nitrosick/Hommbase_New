<template>
  <div
    v-if="data && data.length"
    class="artifacts objects-page"
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
          id="level"
          :label="$t('parameters.level')"
          :options="levelOptions"
          v-model="filters.level"
        />
        <Select
          id="slot"
          :label="$t('parameters.slot')"
          :options="slotOptions"
          v-model="filters.slot"
        />
      </template>
      <template #sorters>
        <Select
          id="sort"
          :label="$t('label.parameter')"
          :options="sortOptions"
          v-model="filters.sort"
        />
        <Select
          id="order"
          :label="$t('label.order')"
          :options="orderOptions"
          :default-value="false"
          v-model="order"
        />
      </template>
      <template #control>
        <Button
          :text="$t('label.showset')"
          :disabled="!selectedId || !+selectedItem.set_id || !!filters.set"
          @btn-click="filters.set = selectedItem.set_id"
        />
      </template>
    </Filters>
    <Tiles>
      <TilesGroup
        v-for="(value, group) in filteredItems"
        :key="group"
        :summary="group"
        :width="7"
      >
        <TilesItem
          v-for="item in value"
          :key="`item:${item.id}`"
          :height="8"
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
        :small="p.small"
      />
      <ParametersText
        title="bonus"
        :value="translatable('bonus')"
      />
      <ParametersText
        title="set"
        :value="getSetList"
      />
    </Parameters>
  </div>
</template>

<script setup>
import { firstUpper, makeCostString } from '@/utils/string'
import Filters from '@/components/app/panel/Filters.vue';
import Tiles from '@/components/app/panel/Tiles.vue';
import TilesGroup from '@/components/app/panel/TilesGroup.vue';
import TilesItem from '@/components/app/panel/TilesItem.vue';
import Parameters from '@/components/app/panel/Parameters.vue';
import ParametersItem from '@/components/app/panel/ParametersItem.vue';
import ParametersText from '@/components/app/panel/ParametersText.vue';

const { $api } = useNuxtApp()

const { data, pending } = await useAsyncData('artifacts',
  async () => {
    const [res, err] = await $api('artifacts', null, true)
    if (err) {
      console.error(err)
      throw showError(err)
    }
    return res || []
  }
)

const {
  projectTitle, selectedItem, selectedId, order, filteredStr, orderOptions,
  selectItem, switchItem, resetParams, getParameterValue, translatable, getCost, getOptions
} = useObjects()

const { query } = useRoute()
const { t, locale } = useI18n()
const filters = reactive({
  title: null,
  category: null,
  level: null,
  slot: null,
  set: null,
  sort: null
})
const hasFilters = computed(() => filters.title || filters.category || filters.level || filters.slot || filters.set || filters.sort)

useHead({ title: () => `${t('menu.artifacts')} | ${projectTitle}` })

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
    if (filters.level) result[section] = result[section].filter(item => item.level_en === filters.level)
    if (filters.slot) result[section] = result[section].filter(item => item.slot_en === filters.slot)
    if (filters.set) result[section] = result[section].filter(item => item.set_id === filters.set)
    if (filters.sort) result[section] = result[section].sort((a, b) => {
      switch (filters.sort) {
        case 'value': return asc ? a.value - b.value : b.value - a.value
        case 'cost': return asc
          ? getCost(a.cost)  - getCost(b.cost)
          : getCost(b.cost) - getCost(a.cost)
        case 'sale': return asc
          ? getCost(a.sale)  - getCost(b.sale)
          : getCost(b.sale) - getCost(a.sale)
        default: return a.id - b.id
      }
    })
    return result
  }

  for (const item of data.value.sort((a, b) => a.id - b.id)) {
    const key = `${item.slot_en}/${item.slot_ru}`
    if (!result[key]) result[key] = [item]
    else result[key].push(item)
  }

  return result
})

/* Parameters block */
const getImageUrl = (item) => {
  if (!item || !item.picture) return ''
  return `/images/artifacts/${item.picture}.webp`
}

const getCostString = () => makeCostString(selectedItem.value.cost)
const getSaleString = () => makeCostString(selectedItem.value.sale)

const getSetList = computed(() => {
  const set = selectedItem.value.set_id
  if (!+set) return ''
  const result = []

  for (const item of data.value) {
    if (item.set_id === set) {
      const name = firstUpper(item['name_' + locale.value])
      if (item.level_en === 'combined') result.push(`<li><b>[ ${name} ]</b></li>`)
      else if (item.id === selectedId.value) result.push(`<li>${name}&nbsp;&#9668;</li>`)
      else result.push(`<li>${name}</li>`)
    }
  }

  return `<ul>${result.join('')}</ul>`
})

const parameters = [
  { id: 1, name: 'level', func: translatable, value: 'level' },
  { id: 2, name: 'slot', func: translatable, value: 'slot' },
  { id: 3, name: 'value', value: 'value' },
  { id: 4, name: 'cost', func: getCostString, value: '', small: true },
  { id: 5, name: 'sale', func: getSaleString, value: '', small: true }
]

/* Filters block */
const resetFilters = () => {
  filters.title = null
  filters.category = null
  filters.level = null
  filters.slot = null
  filters.set = null
  filters.sort = null

  order.value = 'ascending'
  resetParams()
}

const categoryOptions = computed(() => getOptions('category', data))
const levelOptions = computed(() => getOptions('level', data))
const slotOptions = computed(() => getOptions('slot', data))

const sortOptions = {
  value: 'ценность',
  cost: 'стоимость',
  sale: 'продажа'
}
</script>
