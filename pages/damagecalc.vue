<template>
  <div
    v-if="data && data.length"
    class="calculator"
  >
    <ObjectsList
      ref="listL"
      :items="filteredLeft"
      v-model="left.selected"
    >
      <template #filters>
        <Input
          id="title-left"
          type="search"
          :label="$t('label.search')"
          placeholder="..."
          v-model="left.filter"
        />
      </template>
    </ObjectsList>

    <div class="calculator-content">
      <div class="calculator-header">
        <button
          class="mob-image"
          @click.prevent="listL.openList()"
        >
          <img
            v-if="left.selected"
            :src="getImageUrl(left.selected.name_en)"
            alt="mob image"
            loading="lazy"
          >
        </button>
        <div class="calculator-hexes">
          <Icon v-if="left.selected && right.selected" name="attack" />
          <Icon v-if="left.selected && right.selected" name="defense" />
        </div>
        <button
          class="mob-image right"
          @click.prevent="listR.openList()"
        >
          <img
            v-if="right.selected"
            :src="getImageUrl(right.selected.name_en)"
            alt="mob image"
            loading="lazy"
          >
        </button>
      </div>

      <Totals
        :results="results"
        :left="left"
        :right="right"
      />

      <div class="calculator-form">
        <Attacker v-model="left" />
        <Defender v-model="right" />
      </div>
    </div>

    <ObjectsList
      ref="listR"
      side="right"
      :items="filteredRight"
      v-model="right.selected"
    >
      <template #filters>
        <Input
          id="title-right"
          type="search"
          :label="$t('label.search')"
          placeholder="..."
          v-model="right.filter"
        />
      </template>
    </ObjectsList>
  </div>
</template>

<script setup>
import { seo } from '@/const/seo'
import ObjectsList from '@/components/app/panel/ObjectsList.vue'
import Attacker from '@/components/page/damagecalc/Attacker.vue'
import Defender from '@/components/page/damagecalc/Defender.vue'
import Totals from '@/components/page/damagecalc/Totals.vue'

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

const { calculate } = useCalculator()
const router = useRouter()
const { query } = useRoute()
const { t } = useI18n()
const { projectTitle } = useRuntimeConfig().public
const results = ref({})
const listL = ref(null)
const listR = ref(null)

const left = reactive({
  selected: null,
  filter: null,
  quantity: 1,
  withHero: false,
  heroLevel: 1,
  heroAttack: 1,
  offense: null,
  archery: null,
  offenseSpec: false,
  archerySpec: false,
  unitSpec: false,
  nativeLand: false,
  fines: null
})

const right = reactive({
  selected: null,
  filter: null,
  quantity: 1,
  withHero: false,
  heroLevel: 1,
  heroDefense: 1,
  armor: null,
  armorSpec: false,
  unitSpec: false,
  nativeLand: false,
  protectStand: false
})

useHead({ title: () => `${t('menu.damagecalc')} | ${projectTitle}` })
useSeoMeta(seo.damagecalc)

const handleSwitch = (e) => {
  if (e.key === 'Delete') {
    left.selected = null
    right.selected = null
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    [left.selected, right.selected] = [right.selected, left.selected]
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleSwitch)

  const queryL = query.left
  const queryR = query.right

  if (!queryL && !queryR) return
  if (queryL) left.selected = data.value.find(item => item.name_en === queryL) ?? null
  if (queryR) right.selected = data.value.find(item => item.name_en === queryR) ?? null
})
onUnmounted(() => { window.removeEventListener('keydown', handleSwitch) })

watch(() => [left.selected, right.selected], ([left, right]) => {
  const query = {}
  if (left) query.left = left.name_en
  if (right) query.right = right.name_en
  router.replace({ query })
})

watch([left, right], ([l, r]) => { results.value = calculate(l, r) })

const getItems = (array) => {
  const result = {}
  for (const item of array.filter(item => item.status_en !== 'combat vehicle')) {
    const key = `${item.town_en}/${item.town_ru}`
    if (!result[key]) result[key] = [item]
    else result[key].push(item)
  }
  return result
}

const filteredLeft = computed(() => {
  if (!left.filter) return getItems(data.value)
  const input = left.filter.toLowerCase().trim()
  return getItems(data.value.filter(item => item.name_en.includes(input) || item.name_ru.includes(input)))
})

const filteredRight = computed(() => {
  if (!right.filter) return getItems(data.value)
  const input = right.filter.toLowerCase().trim()
  return getItems(data.value.filter(item => item.name_en.includes(input) || item.name_ru.includes(input)))
})

const getImageUrl = (name) => {
  if (!name) return ''
  const fileName = name.replaceAll(' ', '')
  return `/images/mobs/${fileName}.webp`
}
</script>

<style lang="scss" scoped>
.calculator {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  height: calc(100vh - $height-header);
  border-left: $border-main;
  border-right: $border-main;
  background-color: $color-background;

  &-content {
    padding-top: $height-header;
    overflow-y: auto;
  }

  &-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    height: 16rem;
    padding: 1.5rem;
    border-bottom: $border-main;

    @include breakpoint-sm {
      gap: 0.5rem;
      padding: 1.5rem 0.5rem;
    }
  }

  &-hexes {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    height: 100%;
    background: url(/images/common/hex-s.svg) 0 0 / 2rem auto repeat;

    @include breakpoint-sm {
      display: none;
    }
  }

  &-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1rem 1.5rem;
    border-top: $border-main;

    @include breakpoint-sm {
      grid-template-columns: 1fr;
      padding: 0;
      gap: 0;
    }
  }

  @include breakpoint-lg {
    grid-template-columns: 1fr;
  }
}

.mob-image {
  display: flex;
  height: 100%;
  aspect-ratio: 3/4;
  border: $border-main;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.right {
    transform: scale(-1, 1);
  }

  @include breakpoint-lg {
    background: url(/images/icon/burger-dark.svg) center / 1.5rem auto no-repeat;
  }
}

@include scrollbar;
</style>
