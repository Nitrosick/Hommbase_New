<template>
  <div
    v-if="data && data.length"
    class="comparator"
  >
    <ObjectsList
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

    <div class="comparator-content">
      <div class="comparator-header">
        <span
          v-if="left.selected && right.selected"
          class="comparator-vs"
        >
          VS
        </span>
        <div class="mob-image">
          <img
            v-if="left.selected"
            :src="getImageUrl(left.selected.name_en)"
            alt="mob image"
            loading="lazy"
          >
        </div>
        <div class="comparator-hexes" />
        <div class="mob-image right">
          <img
            v-if="right.selected"
            :src="getImageUrl(right.selected.name_en)"
            alt="mob image"
            loading="lazy"
          >
        </div>
      </div>

      <ParamsList
        :left="left.selected"
        :right="right.selected"
      />
    </div>

    <ObjectsList
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
import ObjectsList from '@/components/app/panel/ObjectsList.vue';
import ParamsList from '~/components/page/comparator/ParamsList.vue';

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
const { t } = useI18n()
const { projectTitle } = useRuntimeConfig().public

const left = reactive({
  selected: null,
  filter: null
})

const right = reactive({
  selected: null,
  filter: null
})

useHead({ title: () => `${t('menu.comparator')} | ${projectTitle}` })

const handleSwitch = (e) => {
  if (e.key === 'Delete') {
    left.selected = null
    right.selected = null
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

const getItems = (array) => {
  const result = {}
  for (const item of array) {
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
.comparator {
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
    border-bottom: $border-main;
    padding: 1.5rem;

    @include breakpoint-sm {
      gap: 0.5rem;
      padding: 1.5rem 0.5rem;
    }
  }

  &-hexes {
    flex-grow: 1;
    height: 100%;
    background: url(/images/common/hex-s.svg) 0 0 / 2rem auto repeat;

    @include breakpoint-sm {
      display: none;
    }
  }

  &-vs {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: $font-title;
    font-size: $font-size-xxl;
    font-weight: 600;
    -webkit-text-stroke: 1px var(--color-grey-1);
    color: $color-background;
    cursor: default;

    @include breakpoint-sm {
      display: none;
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
}

@include scrollbar;
</style>
