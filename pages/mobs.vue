<template>
  <div
    v-if="data && data.length"
    class="mobs objects-page"
  >
    <Spinner v-if="pending" />
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
          :label="$t('label.town')"
          :options="townOptions"
          v-model="filters.town"
        />
        <Select
          id="level"
          :label="$t('label.level')"
          :options="levelOptions"
          v-model="filters.level"
        />
      </template>
      <template #sorters>
        <Select
          id="level"
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
        v-for="(value, group) in filteredMobs"
        :key="group"
        :summary="group"
      >
        <TilesItem
          v-for="mob in value"
          :key="`item:${mob.id}`"
          :height="12"
          :image="getImageUrl(mob.name_en)"
          :title="mob[`name_${locale}`]"
          :selected="mob.id === selectedId"
          @click="selectItem(mob)"
        />
      </TilesGroup>
    </Tiles>
    <Parameters
      :image="getImageUrl(selectedMob.name_en)"
      :title="selectedMob[`name_${locale}`]"
    >
      <ParametersItem
        v-for="p in parameters"
        :key="`param:${p.id}`"
        :title="p.name"
        :value="getParameterValue(p)"
      />
      <ParametersText
        title="ability"
        :value="translatable('ability')"
      />
    </Parameters>
  </div>
</template>

<script setup>
import { makeCostString } from '@/utils/common'
import Spinner from '@/components/app/Spinner.vue';
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

const router = useRouter()
const { query } = useRoute()
const { t, locale } = useI18n()
const selectedMob = ref({})
const selectedId = ref(null)
const filters = reactive({
  title: null,
  keyword: null,
  town: null,
  level: null,
  sort: null,
})
const order = ref('ascending')
const hasFilters = computed(() => filters.title || filters.keyword || filters.town || filters.level || filters.sort)

const { projectTitle } = useRuntimeConfig().public
useHead({ title: () => `${t('menu.mobs')} | ${projectTitle}` })

const handleSwitch = (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      switchItem('prev')
      break
    case 'ArrowRight':
      switchItem()
      break
    case 'Delete':
      resetFilters()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleSwitch)

  if (!query.alias) return
  for (const mob of data.value) {
    if (mob.name_en === query.alias) {
      selectItem(mob)
      return
    }
  }
})
onUnmounted(() => { window.removeEventListener('keydown', handleSwitch) })

const filteredMobs = computed(() => {
  const result = {}

  if (hasFilters.value) {
    const section = 'filtered/отфильтрованные'
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
    if (filters.sort) result[section] = result[section].sort((a, b) => {
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

  for (const mob of data.value.sort((a, b) => a.id - b.id)) {
    const key = `${mob.town_en}/${mob.town_ru}`
    if (!result[key]) result[key] = [mob]
    else result[key].push(mob)
  }

  return result
})

/* Parameters block */
const selectItem = (item) => {
  selectedMob.value = item
  selectedId.value = item.id
  router.replace({ query: { alias: item.name_en } })
}

const switchItem = (direction = 'next') => {
  if (!selectedId.value) return

  for (const group in filteredMobs.value) {
    const array = filteredMobs.value[group]
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === selectedId.value) {
        if (direction === 'next') {
          if (i + 1 === array.length) selectItem(array[0])
          else selectItem(array[i+1])
          return
        } else {
          if (i === 0) selectItem(array[array.length-1])
          else selectItem(array[i-1])
          return
        }
      }
    }
  }
}

const getImageUrl = (name) => {
  if (!name) return ''
  const fileName = name.replaceAll(' ', '')
  return `/images/mobs/${fileName}.webp`
}

const getParameterValue = (param) => {
  if (!selectedMob.value.id) return ''
  if (param.func) return param.func(param.value)
  return selectedMob.value[param.value] ?? ''
}

const translatable = (val) => {
  if (!selectedMob.value.id) return ''
  return selectedMob.value[`${val}_${locale.value}`] ?? ''
}

const getDamage = () => `${selectedMob.value.min_damage}-${selectedMob.value.max_damage}`
const getCostString = () => makeCostString(selectedMob.value.cost)
const avgDamage = (min, max) => (min + max) / 2
const shootsCount = (value) => value === '-' ? 0 : value
const getCost = (value) => JSON.parse(value)[0] ?? 0

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
  selectedMob.value = {}
  selectedId.value = null
  router.replace({ query: {} })
}

const townOptions = computed(() => {
  const result = {}
  for (const mob of data.value) { result[mob.town_en] = mob.town_ru }
  return result
})

const levelOptions = computed(() => {
  const result = {}
  for (const mob of data.value) { result[mob.level.replaceAll('+', '')] = mob.level.replaceAll('+', '') }
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

const orderOptions = {
  ascending: 'по возрастанию',
  descending: 'по убыванию'
}
</script>
