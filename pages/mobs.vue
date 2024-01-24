<template>
  <div class="mobs objects-page">
    <Spinner v-if="pending" />
    <Filters>
      Filters
    </Filters>
    <Tiles>
      <TilesGroup
        v-for="(value, group) in groupedMobs"
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
      return []
    }
    return res || []
  }
)

const router = useRouter()
const { query } = useRoute()
const { t, locale } = useI18n()
const selectedMob = ref({})
const selectedId = ref(null)

const groupedMobs = computed(() => {
  const result = {}
  for (const mob of data.value) {
    const key = `${mob.town_en}/${mob.town_ru}`
    if (!result[key]) result[key] = [mob]
    else result[key].push(mob)
  }
  return result
})

const { projectTitle } = useRuntimeConfig().public
useHead({ title: () => `${t('menu.mobs')} | ${projectTitle}` })

onMounted(() => {
  if (!query.alias) return
  for (const mob of data.value) {
    if (mob.name_en === query.alias) {
      selectItem(mob)
      return
    }
  }
})

const selectItem = (item) => {
  selectedMob.value = item
  selectedId.value = item.id
  router.replace({ query: { alias: item.name_en } })
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
const getCost = () => makeCostString(selectedMob.value.cost)

const parameters = [
  { id: 1, name: 'attack', value: 'attack' },
  { id: 2, name: 'defense', value: 'defense' },
  { id: 3, name: 'damage', func: getDamage, value: '' },
  { id: 4, name: 'shoots', value: 'shoots' },
  { id: 5, name: 'health', value: 'health' },
  { id: 6, name: 'speed', value: 'speed' },
  { id: 7, name: 'movement', func: translatable, value: 'move' },
  { id: 8, name: 'value', value: 'value' },
  { id: 9, name: 'cost', func: getCost, value: '' },
  { id: 10, name: 'growth', value: 'growth' },
  { id: 11, name: 'status', func: translatable, value: 'status' },
  { id: 12, name: 'land', func: translatable, value: 'land' },
  { id: 13, name: 'size', value: 'size' }
]
</script>
