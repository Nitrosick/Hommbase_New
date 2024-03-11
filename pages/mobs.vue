<template>
  <div
    v-if="data && data.length"
    class="mobs objects-page"
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
        <Input
          id="keyword"
          type="search"
          :label="$t('label.keyword')"
          :placeholder="$t('label.mobskeywords')"
          v-model="filters.keyword"
        />
        <Select
          id="town"
          :label="$t('parameters.town')"
          :options="townOptions"
          v-model="filters.town"
        />
        <Select
          id="level"
          :label="$t('parameters.level')"
          :options="levelOptions"
          v-model="filters.level"
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
    </Filters>
    <Tiles>
      <TilesGroup
        v-for="(value, group) in filteredItems"
        :key="group"
        :summary="group"
      >
        <TilesItem
          v-for="item in value"
          :key="`item:${item.id}`"
          :height="12"
          :image="getImageUrl(item.name_en)"
          :title="item[`name_${locale}`]"
          :selected="item.id === selectedId"
          @click="selectItem(item)"
        />
      </TilesGroup>
    </Tiles>
    <Parameters
      :image="getImageUrl(selectedItem.name_en)"
      :title="selectedItem[`name_${locale}`]"
      @reset="resetParams"
    >
      <ParametersItem
        v-for="p in parameters"
        :key="`param:${p.id}`"
        :title="p.name"
        :value="getParameterValue(p)"
      />
      <ParametersText
        title="ability"
        icon="bonus"
        :value="translatable('ability')"
      />
    </Parameters>
  </div>
</template>

<script setup>
import { makeCostString } from '@/utils/string'
import Filters from '@/components/app/panel/Filters.vue';
import Tiles from '@/components/app/panel/Tiles.vue';
import TilesGroup from '@/components/app/panel/TilesGroup.vue';
import TilesItem from '@/components/app/panel/TilesItem.vue';
import Parameters from '@/components/app/panel/Parameters.vue';
import ParametersItem from '@/components/app/panel/ParametersItem.vue';
import ParametersText from '@/components/app/panel/ParametersText.vue';

const { $api } = useNuxtApp()

const { data, pending } = await useAsyncData('mobs',
  async () => {
    const [res, err] = await $api('mobs', null, true)
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
  keyword: null,
  town: null,
  level: null,
  sort: null
})
const hasFilters = computed(() => filters.title || filters.keyword || filters.town || filters.level || filters.sort)

useHead({ title: () => `${t('menu.mobs')} | ${projectTitle}` })

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
    if (filters.keyword) result[section] = result[section].filter(item => {
      const input = filters.keyword.toLowerCase()
      return (
        item.move_en.includes(input) || item.move_ru.includes(input) ||
        item.status_en.includes(input) || item.status_ru.includes(input) ||
        item.land_en.includes(input) || item.land_ru.includes(input)
      )
    })
    if (filters.town) result[section] = result[section].filter(item => item.town_en === filters.town)
    if (filters.level) result[section] = result[section].filter(item => item.level.replaceAll('+', '') === filters.level)
    if (filters.sort) result[section] = [...result[section]].sort((a, b) => {
      switch (filters.sort) {
        case 'attack': return asc ? a.attack - b.attack : b.attack - a.attack
        case 'defense': return asc ? a.defense - b.defense : b.defense - a.defense
        case 'damage': return asc
          ? avgDamage(a.min_damage, a.max_damage) - avgDamage(b.min_damage, b.max_damage)
          : avgDamage(b.min_damage, b.max_damage) - avgDamage(a.min_damage, a.max_damage)
        case 'shoots': return asc
          ? shootsCount(a.shoots) - shootsCount(b.shoots)
          : shootsCount(b.shoots) - shootsCount(a.shoots)
        case 'health': return asc ? a.health - b.health : b.health - a.health
        case 'speed': return asc ? a.speed - b.speed : b.speed - a.speed
        case 'value': return asc ? a.value - b.value : b.value - a.value
        case 'cost': return asc
          ? getCost(a.cost)  - getCost(b.cost)
          : getCost(b.cost) - getCost(a.cost)
        case 'growth': return asc ? a.growth - b.growth : b.growth - a.growth
        default: return a.id - b.id
      }
    })
    return result
  }

  for (const item of [...data.value].sort((a, b) => a.id - b.id)) {
    const key = `${item.town_en}/${item.town_ru}`
    if (!result[key]) result[key] = [item]
    else result[key].push(item)
  }

  return result
})

/* Parameters block */
const getImageUrl = (name) => {
  if (!name) return ''
  const fileName = name.replaceAll(' ', '')
  return `/images/mobs/${fileName}.webp`
}

const getDamage = () => `${selectedItem.value.min_damage}-${selectedItem.value.max_damage}`
const getCostString = () => makeCostString(selectedItem.value.cost)
const avgDamage = (min, max) => (min + max) / 2
const shootsCount = (value) => value === '-' ? 0 : value

const parameters = [
  { id: 1, name: 'attack', value: 'attack' },
  { id: 2, name: 'defense', value: 'defense' },
  { id: 3, name: 'damage', func: getDamage, value: '' },
  { id: 4, name: 'shoots', value: 'shoots' },
  { id: 5, name: 'health', value: 'health' },
  { id: 6, name: 'speed', value: 'speed' },
  { id: 7, name: 'movement', func: translatable, value: 'move' },
  { id: 8, name: 'value', value: 'value' },
  { id: 9, name: 'cost', func: getCostString, value: '' },
  { id: 10, name: 'growth', value: 'growth' },
  { id: 11, name: 'status', func: translatable, value: 'status' },
  { id: 12, name: 'land', func: translatable, value: 'land' },
  { id: 13, name: 'size', value: 'size' }
]

/* Filters block */
const resetFilters = () => {
  filters.title = null
  filters.town = null
  filters.level = null
  filters.sort = null
  filters.keyword = null

  order.value = 'ascending'
  resetParams()
}

const townOptions = computed(() => getOptions('town', data))

const levelOptions = computed(() => {
  const result = {}
  for (const item of data.value) { result[item.level.replaceAll('+', '')] = item.level.replaceAll('+', '') }
  return result
})

const sortOptions = {
  attack: 'атака',
  defense: 'защита',
  damage: 'урон',
  shoots: 'кол-во выстрелов',
  health: 'здоровье',
  speed: 'скорость',
  value: 'ценность',
  cost: 'стоимость',
  growth: 'прирост'
}
</script>
