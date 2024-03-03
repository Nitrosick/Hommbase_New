<template>
  <div
    class="avatars"
    :class="{ 'avatars-opened': opened }"
  >
    <div class="avatars-title">
      {{ isFree ? $t('user.selectavatar') : $t('user.changeavatar') }}
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

const emit = defineEmits(['select', 'buy'])
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
    if (confirm(t('user.confirmavatar'))) emit('select', item)
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
    padding: 1.5rem;
    border-bottom: $border-main;
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
}

.avatars-opened {
  transform: scale(100%);
  opacity: 1;
}

@include scrollbar;
</style>
