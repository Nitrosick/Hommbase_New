<template>
  <div
    v-if="data && data.length"
    class="maps objects-page"
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
          id="size"
          :label="$t('parameters.size')"
          :options="sizeOptions"
          v-model="filters.size"
        />
        <Select
          id="players"
          :label="$t('parameters.players')"
          :options="playersOptions"
          v-model="filters.players"
        />
        <Select
          id="target"
          :label="$t('parameters.target')"
          :options="targetOptions"
          v-model="filters.target"
        />
        <Select
          id="type"
          :label="$t('parameters.type')"
          :options="typeOptions"
          v-model="filters.type"
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
          :text="$t('label.moremaps')"
          href="https://heroesportal.net/maps"
          target="_blank"
        />
      </template>
    </Filters>
    <Tiles>
      <TilesGroup
        v-for="(value, group) in filteredItems"
        :key="group"
        :summary="group"
        :width="16"
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
      image-ratio="5/3"
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
      <div
        v-if="selectedId"
        class="minimaps"
      >
        <img
          :src="`/images/maps/minimap/${selectedId}_up.jpg`"
          alt="minimap"
          loading="lazy"
          class="minimaps-item"
        >
        <img
          v-if="+selectedItem.with_underground"
          :src="`/images/maps/minimap/${selectedId}_down.jpg`"
          alt="minimap"
          loading="lazy"
          class="minimaps-item"
        >
        <div
          v-else
          class="minimaps-item"
        />
      </div>
      <ParametersText
        title="description"
        :value="translatable('description')"
        icon="info"
      />
      <Button
        v-if="selectedId"
        :text="$t('label.download')"
        :href="'/downloads/' + selectedItem.download_file ?? '#'"
        :download="true"
        class="download-button"
        @btn-click="addDownload"
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
const { cacheSettings } = useCacheStore()

const { data, pending } = await useAsyncData('maps',
  async () => {
    const [res, err] = await $api('maps', null, cacheSettings['maps'] ?? false)
    if (err) {
      console.error(err)
      throw showError(err)
    }
    return res || []
  },
  { initialCache: false }
)

const {
  projectTitle, selectedItem, selectedId, order, orderOptions,
  selectItem, switchItem, resetParams, getParameterValue, translatable, getOptions
} = useObjects()

const { query } = useRoute()
const { t, locale } = useI18n()
const filters = reactive({
  title: null,
  size: null,
  players: null,
  target: null,
  type: null,
  sort: null
})
const hasFilters = computed(() => filters.title || filters.size || filters.players || filters.target || filters.type || filters.sort)

useHead({ title: () => `${t('menu.maps')} | ${projectTitle}` })
useSeoMeta(seo.maps)

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
  const section = 'maps/карты'

  if (hasFilters.value) {
    const asc = order.value === 'ascending'

    result[section] = data.value
    if (filters.title) result[section] = result[section].filter(item => {
      const input = filters.title.toLowerCase()
      return item.name_en.includes(input) || item.name_ru.includes(input)
    })
    if (filters.size) result[section] = result[section].filter(item => item.size_abbr === filters.size)
    if (filters.players) result[section] = result[section].filter(item => item.players === filters.players)
    if (filters.target) result[section] = result[section].filter(item => item.map_target_en === filters.target)
    if (filters.type) result[section] = result[section].filter(item => item.map_type_en === filters.type)
    if (filters.sort) result[section] = [...result[section]].sort((a, b) => {
      switch (filters.sort) {
        case 'players': return asc ? a.players - b.players : b.players - a.players
        case 'teams count': return asc ? a.teams - b.teams : b.teams - a.teams
        case 'file size': return asc ? a.file_size - b.file_size : b.file_size - a.file_size
        case 'downloads': return asc ? a.downloads_count - b.downloads_count : b.downloads_count - a.downloads_count
      }
    })
    return result
  }

  result[section] = [...data.value].sort((a, b) => a.id - b.id)

  return result
})

/* Parameters block */
const getImageUrl = (item) => {
  if (!item || !item.id) return ''
  return `/images/maps/screenshot/${item.id}.jpg`
}

const getSize = () => `${selectedItem.value.size_abbr} ${selectedItem.value.size}`
const getFileSize = () => `${selectedItem.value.file_size} Kb`

const parameters = [
  { id: 1, name: 'size', func: getSize, value: '' },
  { id: 2, name: 'players', value: 'players', icon: 'hero' },
  { id: 3, name: 'playershumans', value: 'players_humans', icon: 'auth' },
  { id: 4, name: 'teams', value: 'teams', icon: 'flag' },
  { id: 5, name: 'target', func: translatable, value: 'map_target', icon: 'victory' },
  { id: 6, name: 'type', func: translatable, value: 'map_type', icon: 'level' },
  { id: 7, name: 'version', value: 'version', icon: 'info' },
  { id: 8, name: 'author', value: 'author', icon: 'biography' },
  { id: 9, name: 'filesize', func: getFileSize, value: '', icon: 'file' },
  { id: 10, name: 'downloads', value: 'downloads_count', icon: 'download' }
]

/* Filters block */
const resetFilters = () => {
  filters.title = null
  filters.size = null
  filters.players = null
  filters.target = null
  filters.type = null
  filters.sort = null

  order.value = 'ascending'
  resetParams()
}

const sizeOptions = computed(() => {
  const result = {}
  for (const item of data.value) { result[item.size_abbr] = item.size_abbr }
  return result
})

const playersOptions = computed(() => {
  const result = {}
  for (const item of data.value) { result[item.players] = item.players }
  return result
})

const targetOptions = computed(() => getOptions('map_target', data))
const typeOptions = computed(() => getOptions('map_type', data))

const sortOptions = {
  players: 'игроки',
  'teams count': 'кол-во команд',
  'file size': 'размер файла',
  downloads: 'скачивания'
}

const addDownload = async () => {
  if (!selectedId.value) return
  const [, err] = await $api('maps/add-download', { id: selectedId.value })
  if (err) console.error(err)
  else selectedItem.value.downloads_count++
}
</script>

<style lang="scss" scoped>
.minimaps {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  border-top: $border-main;
  border-bottom: $border-main;
  padding: 1.5rem;

  &-item {
    aspect-ratio: 1/1;
    background-color: var(--color-grey-1);
    width: 100%;
  }
}

.download-button {
  margin: 1.5rem;
  margin-bottom: 0;
}
</style>
