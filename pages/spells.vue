<template>
  <div
    v-if="data && data.length"
    class="spells objects-page"
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
          id="element"
          :label="$t('parameters.element')"
          :options="elementOptions"
          v-model="filters.element"
        />
        <Select
          id="level"
          :label="$t('parameters.level')"
          :options="levelOptions"
          v-model="filters.level"
        />
        <Select
          id="class"
          :label="$t('parameters.class')"
          :options="classOptions"
          v-model="filters.class"
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
        :width="8.5"
      >
        <TilesItem
          v-for="item in value"
          :key="`item:${item.id}`"
          :height="6.5"
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
      image-ratio="4/3"
      @reset="resetParams"
    >
      <ParametersItem
        v-for="p in parameters"
        :key="`param:${p.id}`"
        :title="p.name"
        :value="getParameterValue(p)"
        :icon="p.icon"
        :small="p.small"
      />
      <ParametersText
        title="manacost"
        icon="mana"
        :value="getCost"
      />
      <ParametersText
        title="value"
        :value="getValue"
      />
      <ParametersText
        title="effect"
        icon="bonus"
        :value="getEffect"
      />
    </Parameters>
  </div>
</template>

<script setup>
import Filters from '@/components/app/panel/Filters.vue';
import Tiles from '@/components/app/panel/Tiles.vue';
import TilesGroup from '@/components/app/panel/TilesGroup.vue';
import TilesItem from '@/components/app/panel/TilesItem.vue';
import Parameters from '@/components/app/panel/Parameters.vue';
import ParametersItem from '@/components/app/panel/ParametersItem.vue';
import ParametersText from '@/components/app/panel/ParametersText.vue';

const { $api } = useNuxtApp()

const { data, pending } = await useAsyncData('spells',
  async () => {
    const [res, err] = await $api('spells', null, true)
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
  element: null,
  level: null,
  class: null,
  sort: null
})
const hasFilters = computed(() => filters.title || filters.element || filters.level || filters.class || filters.sort)

useHead({ title: () => `${t('menu.spells')} | ${projectTitle}` })

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
    if (filters.element) result[section] = result[section].filter(item => item.element_en === filters.element)
    if (filters.level) result[section] = result[section].filter(item => item.level === filters.level)
    if (filters.class) result[section] = result[section].filter(item => item.class_en === filters.class)
    if (filters.sort) result[section] = [...result[section]].sort((a, b) => {
      switch (filters.sort) {
        case 'level': return asc ? a.level - b.level : b.level - a.level
        case 'cost (mana)':
          const aCost = a.cost.split('/')[0]
          const bCost = b.cost.split('/')[0]
          return asc ? aCost - bCost : bCost - aCost
        case 'value':
          const aValue = a.value.split('/')[0]
          const bValue = b.value.split('/')[0]
          return asc ? aValue - bValue : bValue - aValue
      }
    })
    return result
  }

  for (const item of [...data.value].sort((a, b) => a.id - b.id)) {
    const key = `${item.element_en}/${item.element_ru}`
    if (!result[key]) result[key] = [item]
    else result[key].push(item)
  }

  return result
})

/* Parameters block */
const getImageUrl = (name) => {
  if (!name) return ''
  const fileName = name.replace(/[\s?_-]/g, '')
  return `/images/spells/${fileName}.png`
}

const getCost = computed(() => {
  if (!selectedId.value) return ''
  const cost = selectedItem.value.cost.split('/')
  return `
    <ul>
      <li>${t('label.noskill')}: <b>${cost[0]}</b></li>
      <li>${t('label.withskill')}: <b>${cost[1]}</b></li>
    </ul>
  `
})

const getValue = computed(() => {
  if (!selectedId.value) return ''
  const value = selectedItem.value.value.split('/')
  return `
    <ul>
      <li>${t('parameters.basic')}: <b>${value[0]}</b></li>
      <li>${t('parameters.advanced')}: <b>${value[1]}</b></li>
      <li>${t('parameters.expert')}: <b>${value[2]}</b></li>
    </ul>
  `
})

const getEffect = computed(() => {
  if (!selectedId.value) return ''
  const spell = selectedItem.value
  return `
    <ul>
      <li><b>${t('parameters.basic')}</b>: ${spell['basic_' + locale.value]}<br><br></li>
      <li><b>${t('parameters.advanced')}</b>: ${spell['advance_' + locale.value]}<br><br></li>
      <li><b>${t('parameters.expert')}</b>: ${spell['expert_' + locale.value]}</li>
    </ul>
  `
})

const parameters = [
  { id: 1, name: 'element', func: translatable, value: 'element' },
  { id: 2, name: 'level', value: 'level', icon: 'arrow-up' },
  { id: 3, name: 'class', func: translatable, value: 'class', icon: 'spell-class' },
  { id: 4, name: 'duration', func: translatable, value: 'duration', icon: 'time', small: true }
]

/* Filters block */
const resetFilters = () => {
  filters.title = null
  filters.element = null
  filters.level = null
  filters.class = null
  filters.sort = null

  order.value = 'ascending'
  resetParams()
}

const elementOptions = computed(() => getOptions('element', data))
const classOptions = computed(() => getOptions('class', data))

const levelOptions = computed(() => {
  const result = {}
  for (const item of data.value) { result[item.level] = item.level }
  return result
})

const sortOptions = {
  level: 'уровень',
  'cost (mana)': 'стоимость (мана)',
  value: 'ценность'
}
</script>
