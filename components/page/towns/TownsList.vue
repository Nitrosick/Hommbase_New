<template>
  <div
    class="towns-list"
    :class="{
      'towns-list-opened': opened,
      'towns-list-expanded': scroll > 0
    }"
  >
    <div
      class="towns-list-content"
      :style="{ gridTemplateRows: `repeat(${data.length}, 1fr)` }"
    >
      <button
        v-for="item in data"
        :key="item.id"
        class="towns-list-item"
        :class="{ 'towns-list-item-selected': selected.id === item.id }"
        @click.prevent="onSelect(item)"
      >
        <img
          :src="`/images/towns/tile/${item.name_en}.webp`"
          alt="town image"
          class="towns-list-item-img"
          loading="lazy"
        >
        <h4 class="towns-list-item-title">
          {{ firstUpper(item['name_' + locale]) }}
        </h4>
      </button>
    </div>
  </div>
  <button
    v-if="!opened"
    class="towns-list-open pop-button"
    @click.prevent="opened = true"
  >
    <Icon name="town" />
  </button>
</template>

<script setup>
import { firstUpper } from '@/utils/string'

const props = defineProps({
  data: { type: Array, required: true },
  selected: { type: Object, default: null }
})

const emit = defineEmits(['select'])
const { locale } = useI18n()
const scroll = useScroll()
const opened = ref(false)

const onSelect = (item) => {
  opened.value = false
  emit('select', item)
}
</script>

<style lang="scss" scoped>
.towns-list {
  height: 100%;
  padding-top: $height-header;
  border-right: $border-main;
  background-color: $color-background;
  transition: padding-top 0.3s;

  &-content {
    display: grid;
    position: sticky;
    top: $height-header;
    height: 100%;
    max-height: calc(100vh - $height-header);
    overflow-y: auto;
    transition: top 0.3s;
  }

  &-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    filter: grayscale(1);
    transition: filter 0.3s;

    &-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.5);
      transition: filter 0.3s;
    }

    &-title {
      position: relative;
      text-shadow: $shadow-offset $shadow-offset 0 $color-background;
      z-index: 2;
      transition: opacity 0.3s;
    }

    @include breakpoint-xxl {
      filter: none;
    }
  }

  &:hover {
    .towns-list-item {
      filter: grayscale(0);
    }
  }

  &-item:hover,
  &-item:focus,
  &-item-selected {
    filter: grayscale(0);

    .towns-list-item-img {
      filter: brightness(1);
    }

    .towns-list-item-title {
      opacity: 0;
    }
  }

  &-item-selected:hover {
    cursor: default;
  }

  @include breakpoint-xxl {
    position: fixed;
    left: 0;
    top: 0;
    width: 15rem;
    transform: translateX(-100%);
    transition: transform 0.5s;
    border: $border-main;
    z-index: 2;
  }

  @include breakpoint-sm {
    width: 50vw;
  }
}

.towns-list-opened {
  @include breakpoint-xxl {
    transform: translateX(0);
  }
}

.towns-list-open {
  left: 0;

  @include breakpoint-xxl {
    display: block;
  }
}

.towns-list-expanded {
  padding-top: $height-header-m;

  .towns-list-content {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }
}

@include scrollbar;
</style>
