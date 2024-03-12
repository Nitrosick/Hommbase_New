<template>
  <div
    v-if="data"
    class="towns"
  >
    <TownsList
      :data="data.towns"
      :selected="selectedTown"
      @select="selectTown"
    />
    <div
      v-if="selectedTown.id"
      class="towns-content"
      :class="{ 'towns-content-expanded': scroll > 0 }"
    >
      <TownsView :name="selectedTown.name_en" />
      <div class="towns-title">
        <h2>{{ firstUpper(selectedTown['name_' + locale]) }}</h2>
        <div class="towns-title-parameters">
          <ParametersItem
            title="worldview"
            icon="status"
            :value="selectedTown['worldview_' + locale]"
            class="parameters-item"
          />
          <ParametersItem
            title="land"
            :value="selectedTown['land_' + locale]"
            class="parameters-item"
          />
          <audio
            :key="audioKey"
            controls
            class="towns-audio"
          >
            <source
              :src="`/audio/towns/${selectedTown.name_en}.mp3`"
              type="audio/mp3"
            />
            <source
              :src="`/audio/towns/${selectedTown.name_en}.ogg`"
              type="audio/ogg"
            />
            <span>{{ $t('error.audio') }}</span>
          </audio>
        </div>
      </div>
      <TownsTabs
        :selected="tab"
        @tab="t => selectTab(t)"
      />
      <div v-if="tab === 'description'">
        <div
          class="towns-description"
          v-html="selectedTown['info_' + locale]"
        />
        <div class="towns-on-map">
          <img
            v-for="i in 4"
            :key="i"
            :src="`/images/towns/on-map/${selectedTown.name_en}/${i}.png`"
            alt="town on map"
            class="towns-on-map-item"
            loading="lazy"
          >
        </div>
      </div>
      <div v-else-if="tab === 'structures'">
        <div class="towns-total-cost">
          <span
            class="towns-total-cost-title"
            v-html="$t('label.totalcost')"
          />
          &nbsp;
          <span
            class="towns-total-cost-value"
            v-html="makeCostString(selectedTown.total_cost)"
          />
        </div>
        <div class="towns-structures">
          <TilesItem
            v-for="item in structures"
            :key="item.id"
            :height="7"
            :image="getStructureImageUrl(item.name_en)"
            :title="item[`name_${locale}`]"
            :selected="item.id === selectedItem.id"
            @click="selectedItem = item"
          />
        </div>
      </div>
      <div v-else-if="tab === 'mobs'">
        <div
          class="towns-description"
          v-html="$t('info.mobsbrief')"
        />
        <div class="towns-mobs">
          <TilesItem
            v-for="item in mobs"
            :key="item.id"
            :height="12"
            :image="getMobImageUrl(item.name_en)"
            :title="item[`name_${locale}`]"
            @click="redirect('mobs', item.name_en)"
          />
        </div>
      </div>
      <div v-else-if="tab === 'heroes'">
        <div
          class="towns-description"
          v-html="$t('info.heroesbrief')"
        />
        <div class="towns-heroes">
          <TilesItem
            v-for="item in heroes"
            :key="item.id"
            :height="9"
            :image="getHeroImageUrl(item.name_en)"
            :title="item[`name_${locale}`]"
            @click="redirect('heroes', item.name_en)"
          />
        </div>
      </div>
      <div v-else-if="tab === 'mosaic'">
        <div
          class="towns-description"
          v-html="$t('info.grailmap')"
        />
        <div class="towns-mosaic">
          <img
            v-for="i in 2"
            :key="i"
            :src="`/images/towns/grail/${selectedTown.name_en}/${i}.webp`"
            alt="grail mosaic"
            class="towns-mosaic-item"
            loading="lazy"
          >
        </div>
      </div>
    </div>
    <Parameters
      :image="getStructureImageUrl(selectedItem.name_en)"
      :title="selectedItem[`name_${locale}`]"
      image-ratio="5/3"
      @reset="selectedItem = {}"
    >
      <ParametersItem
        v-for="p in parameters"
        :key="`${p.id}`"
        :title="p.name"
        :value="getParameterValue(p)"
        :small="p.small"
        :icon="p.icon"
      />
      <ParametersText
        title="requirements"
        icon="complete"
        value=""
      >
        <template #parameter>
          <ul
            v-if="requirements.length"
            class="requirements"
          >
            <li
              v-for="(r, i) in requirements"
              :key="i"
            >
              <span v-if="r === 'water'">
                {{ $t('parameters.water') }}
              </span>
              <button
                v-else
                @click.prevent="selectedItem = r"
              >
                {{ firstUpper(r['name_' + locale]) }}
              </button>
            </li>
          </ul>
        </template>
      </ParametersText>
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
import { firstUpper, makeCostString } from '@/utils/string'
import TownsList from '@/components/page/towns/TownsList.vue'
import TownsView from '@/components/page/towns/TownsView.vue'
import TownsTabs from '@/components/page/towns/TownsTabs.vue'
import TilesItem from '@/components/app/panel/TilesItem.vue'
import Parameters from '@/components/app/panel/Parameters.vue'
import ParametersItem from '@/components/app/panel/ParametersItem.vue'
import ParametersText from '@/components/app/panel/ParametersText.vue'

const { $api } = useNuxtApp()

const { data, pending } = await useAsyncData('towns',
  async () => {
    const [res, err] = await $api('towns', null, true)
    if (err) {
      console.error(err)
      throw showError(err)
    }
    return res || null
  }
)

const { projectTitle, selectedItem, getParameterValue, translatable } = useObjects()

const router = useRouter()
const { query } = useRoute()
const { t, locale } = useI18n()
const scroll = useScroll()
const selectedTown = ref({})
const tab = ref('description')
const audioKey = ref(1)

useHead({ title: () => `${t('menu.towns')} | ${projectTitle}` })
useSeoMeta(seo.towns)

const handleSwitch = (e) => {
  switch (e.key) {
    case 'Delete':
      selectedItem.value = {}
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleSwitch)

  const lsTab = localStorage.getItem('towns-tab')
  if (lsTab) tab.value = lsTab

  if (!data.value || !data.value.towns) return
  const { alias } = query
  const { towns } = data.value
  if (!alias) return selectTown(towns[0])
  const town = towns.find(item => item.name_en === alias)
  if (town) selectTown(town)
})
onUnmounted(() => { window.removeEventListener('keydown', handleSwitch) })

const structures = computed(() => {
  return data.value.structures
    .filter(item => item.town_id === selectedTown.value.id || +item.town_id === 0)
})

const mobs = computed(() => {
  return data.value.mobs
    .filter(item => item.town_id === selectedTown.value.id)
})

const heroes = computed(() => {
  return data.value.heroes
    .filter(item => item.town_id === selectedTown.value.id)
})

const selectTown = (item) => {
  selectedItem.value = {}
  selectedTown.value = item
  selectAudio()
  router.replace({ query: { alias: item.name_en } })
}

const selectTab = (t) => {
  selectedItem.value = {}
  tab.value = t
  localStorage.setItem('towns-tab', t)
}

const selectAudio = () => {
  audioKey.value++
}

const redirect = (page, alias) => {
  router.push({ path: `/${page}`, query: { alias } })
}

const getStructureImageUrl = (name) => {
  if (!name) return ''
  return `/images/towns/structure/${selectedTown.value.name_en}/${name.replace(/[^0-9a-zA-Z]/g, '')}.webp`
}

const getMobImageUrl = (name) => {
  if (!name) return ''
  return `/images/mobs/${name.replaceAll(' ', '')}.webp`
}

const getHeroImageUrl = (name) => {
  if (!name) return ''
  return `/images/heroes/portrait/${name.replaceAll(' ', '')}.webp`
}

const getCostString = () => makeCostString(selectedItem.value.cost)

const requirements = computed(() => {
  if (!selectedItem.value.requirements) return []
  const result = []
  const reqArray = JSON.parse(selectedItem.value.requirements)
  for (const req of reqArray) {
    if (req === 'water') {
      result.push(req)
      continue
    }
    const s = structures.value.find(item => +item.id === req)
    if (s) result.push(s)
  }
  return result
})

const parameters = [
  { id: 1, name: 'cost', func: getCostString, value: '', small: true },
  { id: 2, name: 'class', func: translatable, value: 'class', icon: 'house' }
]
</script>

<style lang="scss" scoped>
.towns {
  display: grid;
  grid-template-columns: 1fr 5fr 2fr;
  min-height: calc(100vh - $height-header);
  border-left: $border-main;
  border-right: $border-main;
  background-color: $color-background;

  &-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-top: $height-header;
    transition: padding-top 0.3s;
  }

  &-content-expanded {
    padding-top: $height-header-m;
  }

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    border-bottom: $border-main;
    padding: 1.5rem;

    .parameters-item {
      margin: 0;
    }

    &-parameters {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 20rem;

      @include breakpoint-sm {
        min-width: initial;
        width: 100%;
      }
    }

    @include breakpoint-lg {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &-description {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-indent: 2rem;
    padding: 1.5rem;
    text-align: justify;
  }

  &-total-cost {
    padding: 1.5rem;

    &-title {
      color: var(--color-grey-1);
      font-weight: 600;
      font-size: $font-size-sm;
    }
  }

  &-structures,
  &-mobs,
  &-heroes {
    border-top: $border-main;
    background-color: $color-outcontent;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 1px;
    padding: 1px;
  }

  &-mobs {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  }

  &-heroes {
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  }

  &-on-map {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    align-items: center;
    padding: 1.5rem;
    border-top: $border-main;
    background-color: $color-outcontent;

    &-item {
      width: 100%;
      background: radial-gradient(var(--color-grey-1), transparent 75%);
    }

    @include breakpoint-lg {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &-mosaic {
    display: flex;
    border-top: $border-main;

    &-item {
      width: 50%;

      @include breakpoint-lg {
        width: 100%;
      }
    }

    @include breakpoint-lg {
      flex-direction: column;
    }
  }

  &-audio {
    width: 100%;
    height: 2.5rem;
  }

  @include breakpoint-xxl {
    grid-template-columns: 5fr 2fr;
  }

  @include breakpoint-md {
    grid-template-columns: 1fr;
  }
}

.requirements {
  padding: 0;
  margin: 0;
  font-size: $font-size-sm;
}
</style>
