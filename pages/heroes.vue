<template>
  <div
    v-if="data && data.length"
    class="heroes objects-page"
  >
    <Filters @reset="resetFilters">
      <template #filters>
        <Input
          id="title"
          type="search"
          :label="$t('label.name')"
          placeholder="..."
          v-model="filters.title"
        />
        <Input
          id="keyword"
          type="search"
          :label="$t('label.keyword')"
          :placeholder="$t('label.heroeskeywords')"
          v-model="filters.keyword"
        />
        <Select
          id="town"
          :label="$t('parameters.town')"
          :options="townOptions"
          v-model="filters.town"
        />
        <Select
          id="race"
          :label="$t('parameters.race')"
          :options="raceOptions"
          v-model="filters.race"
        />
        <Select
          id="rank"
          :label="$t('parameters.rank')"
          :options="{
            warrior: 'воин',
            mage: 'маг'
          }"
          v-model="filters.rank"
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
        :width="7"
      >
        <TilesItem
          v-for="item in value"
          :key="`item:${item.id}`"
          :height="9"
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
      image-ratio="1/1"
      :image-extra="getSpecImageUrl(selectedItem.spec_image)"
      @reset="resetParams"
    >
      <ParametersItem
        v-for="p in parameters"
        :key="`param:${p.id}`"
        :title="p.name"
        :value="getParameterValue(p)"
        :icon="p.icon"
      />
      <ParametersText
        title="secondary"
        :value="getSecondary"
      />
      <ParametersText
        title="army"
        :value="getArmy"
      />
      <ParametersText
        title="specialization"
        :value="translatable('specialization')"
      />
      <ParametersText
        title="biography"
        :value="translatable('biography')"
      />
    </Parameters>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'
import Filters from '@/components/app/panel/Filters.vue';
import Tiles from '@/components/app/panel/Tiles.vue';
import TilesGroup from '@/components/app/panel/TilesGroup.vue';
import TilesItem from '@/components/app/panel/TilesItem.vue';
import Parameters from '@/components/app/panel/Parameters.vue';
import ParametersItem from '@/components/app/panel/ParametersItem.vue';
import ParametersText from '@/components/app/panel/ParametersText.vue';

const { $api } = useNuxtApp()

const { data, pending } = await useAsyncData('heroes',
  async () => {
    const [res, err] = await $api('heroes', null, true)
    if (err) {
      console.error(err)
      throw showError(err)
    }
    return res || []
  }
)

const {
  projectTitle, selectedItem, selectedId, order, filteredStr, orderOptions,
  selectItem, switchItem, resetParams, getParameterValue, translatable, getOptions
} = useObjects()

const { query } = useRoute()
const { t, locale } = useI18n()
const filters = reactive({
  title: null,
  town: null,
  race: null,
  rank: null,
  keyword: null,
  sort: null
})
const hasFilters = computed(() => filters.title || filters.town || filters.race || filters.rank || filters.keyword || filters.sort)

useHead({ title: () => `${t('menu.heroes')} | ${projectTitle}` })

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
        item.sex_en.includes(input) || item.sex_ru.includes(input) ||
        (item.spell_en && (item.spell_en.includes(input) || item.spell_ru.includes(input))) ||
        item.secondary_1_en.includes(input) || item.secondary_1_ru.includes(input) ||
        (item.specialization_ru && (item.specialization_ru.includes(input) || item.specialization_ru.includes(input))) ||
        item.specialization_ru.split(':')[0].toLowerCase().includes(input)
        // item.specialization_en.split(':')[0].toLowerCase().includes(input)
      )
    })
    if (filters.town) result[section] = result[section].filter(item => item.town_en === filters.town)
    if (filters.race) result[section] = result[section].filter(item => item.race_en === filters.race)
    if (filters.rank) result[section] = result[section].filter(item => filters.rank === 'mage' ? !!+item.is_mage : !+item.is_mage)
    if (filters.sort) result[section] = result[section].sort((a, b) => {
      switch (filters.sort) {
        case 'attack':
          const aAtk = a.primary.split('/')[0]
          const bAtk = b.primary.split('/')[0]
          return asc ? aAtk - bAtk : bAtk - aAtk
        case 'defense':
          const aDfs = a.primary.split('/')[1]
          const bDfs = b.primary.split('/')[1]
          return asc ? aDfs - bDfs : bDfs - aDfs
        case 'power':
          const aPow = a.primary.split('/')[2]
          const bPow = b.primary.split('/')[2]
          return asc ? aPow - bPow : bPow - aPow
        case 'knoledge':
          const aKnl = a.primary.split('/')[3]
          const bKnl = b.primary.split('/')[3]
          return asc ? aKnl - bKnl : bKnl - aKnl
        case 'movement points': return asc ? a.movement_points - b.movement_points : b.movement_points - a.movement_points
      }
    })
    return result
  }

  for (const item of data.value.sort((a, b) => a.id - b.id)) {
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
  return `/images/heroes/portrait/${fileName}.webp`
}

const getSpecImageUrl = (name) => {
  if (!name) return ''
  return `/images/specialization/${name}.png`
}

const getPrimary = () => selectedItem.value.primary.split('/').join(' | ')

const getSecondary = computed(() => {
  if (!selectedId.value) return ''
  const skills = []
  if (selectedItem.value.secondary_1_en) skills.push(`<li>${firstUpper(selectedItem.value['secondary_1_' + locale.value])}</li>`)
  if (selectedItem.value.secondary_2_en) skills.push(`<li>${firstUpper(selectedItem.value['secondary_2_' + locale.value])}</li>`)
  return `<ul>${skills.join('')}</ul>`
})

const getArmy = computed(() => {
  if (!selectedId.value) return ''
  const field = selectedItem.value['army_' + locale.value]
  return `<ul><li>${field.split('/').join('</li><li>')}</li></ul>`
})

const parameters = [
  { id: 1, name: 'race', func: translatable, value: 'race', icon: 'status' },
  { id: 2, name: 'sex', func: translatable, value: 'sex' },
  { id: 3, name: 'rank', func: translatable, value: 'rank' },
  { id: 4, name: 'spell', func: translatable, value: 'spell', icon: 'bonus' },
  { id: 5, name: 'mp', value: 'movement_points', icon: 'speed' },
  { id: 6, name: 'primary', func: getPrimary, value: '' }
]

/* Filters block */
const resetFilters = () => {
  filters.title = null
  filters.town = null
  filters.race = null
  filters.rank = null
  filters.keyword = null
  filters.sort = null

  order.value = 'ascending'
  resetParams()
}

const townOptions = computed(() => getOptions('town', data))
const raceOptions = computed(() => getOptions('race', data))

const sortOptions = {
  attack: 'атака',
  defense: 'защита',
  power: 'сила магии',
  knoledge: 'знания',
  'movement points': 'очки передвижения'
}
</script>
