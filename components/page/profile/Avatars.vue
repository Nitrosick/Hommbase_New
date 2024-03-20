<template>
  <div
    class="avatars"
    :class="{ 'avatars-opened': opened }"
  >
    <div class="avatars-title">
      <span>
        {{ isFree ? $t('user.selectavatar') : $t('user.changeavatar') }}
      </span>
      <button
        class="avatars-close"
        @click.prevent="$emit('close')"
      >
        <Icon name="close" />
      </button>
    </div>
    <div class="avatars-list">
      <TilesItem
        v-for="item in list"
        :key="item.id"
        :height="9"
        :image="getImageUrl(item.name_en)"
        :inactive="getActivity(item)"
        :title="getCost(item)"
        :selected="me.avatar === item.name_en"
        @click="onSelect(item)"
      />
      <Spinner v-if="loading" />
    </div>
  </div>
</template>

<script setup>
import Spinner from '@/components/app/Spinner.vue';
import TilesItem from '@/components/app/panel/TilesItem.vue';

const emit = defineEmits(['select', 'buy', 'close'])
const props = defineProps({
  opened: { type: Boolean, default: false },
  isFree: { type: Boolean, default: false },
  list: { type: Array, default: [] },
  loading: { type: Boolean, default: false }
})

const { me } = useUserStore()
const { t } = useI18n()

const purchased = computed(() => me.avatars.map(item => item.id))

const getImageUrl = (name) => {
  if (!name) return ''
  const fileName = name.replaceAll(' ', '')
  return `/images/heroes/portrait/${fileName}.webp`
}

const getCost = (item) => {
  if (
    props.isFree ||
    !item.site_cost ||
    +item.site_cost === 0 ||
    purchased.value.includes(item.id)
  ) return ''
  return item.site_cost
}

const getActivity = (item) => {
  return (
    props.loading ||
    (+item.site_cost > +me.balance && !purchased.value.includes(item.id))
  )
}

const onSelect = (item) => {
  if (item.name_en === me.avatar) return

  if (
    props.isFree ||
    !+item.site_cost ||
    purchased.value.includes(item.id)
  ) {
    if (confirm(t('confirm.avatar'))) emit('select', item)
  } else {
    if (confirm(t('user.buyavatar'))) emit('buy', item)
  }
}
</script>

<style lang="scss" scoped>
.avatars {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 40rem;
  border: $border-main;
  background-color: $color-background;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.5s, opacity 0.5s;
  overflow: hidden;

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: $border-main;
  }

  &-close {
    display: none;

    @include breakpoint-md {
      display: block;
    }
  }

  &-list {
    position: relative;
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
    gap: 1px;
    padding: 1px;
    background-color: $color-outcontent;
    overflow-y: auto;
  }

  @include breakpoint-md {
    position: absolute;
    top: 1.5rem;
    bottom: 1.5rem;
    left: 1.5rem;
    right: 1.5rem;
    width: auto;
    height: auto;
    max-width: initial;
    transform-origin: 80% 20%;
    z-index: 8;
  }

  @include breakpoint-sm {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: none;
  }
}

.avatars-opened {
  transform: scale(100%);
  opacity: 1;
}

@include scrollbar;
</style>
