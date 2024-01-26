<template>
  <div
    class="selector"
    :style="{ gridTemplateRows: `repeat(${sections.length}, 1fr)` }"
  >
    <button
      v-for="section in sections"
      :key="section.id"
      class="selector-item"
      :class="{ 'selector-item-selected': selected === section.id }"
      @click.prevent="$emit('select', section)"
    >
      <img
        :src="`/images/poster/section-tile/${section.title}.webp`"
        alt="section image"
        class="selector-item-img"
        loading="lazy"
      >
      <h3 class="selector-item-title">
        {{ $t('menu.' + section.title) }}
      </h3>
    </button>
  </div>
</template>

<script setup>
import { sections } from '@/const/sections'

const props = defineProps({
  selected: { type: Number, required: true },
})
</script>

<style lang="scss" scoped>
.selector {
  position: relative;
  display: grid;
  border: $border-main;
  min-width: 30rem;
  z-index: 1;

  &-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;

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

    @include breakpoint-md {
      height: 5rem;
    }
  }

  &-item:hover,
  &-item-selected {
    .selector-item-img {
      filter: brightness(1);
    }

    .selector-item-title {
      opacity: 0;
    }
  }

  &-item-selected:hover {
    cursor: default;
  }

  @include breakpoint-xl {
    min-width: 20rem;
  }

  @include breakpoint-lg {
    min-width: 15rem;
  }

  @include breakpoint-md {
    min-width: initial;
  }
}
</style>
