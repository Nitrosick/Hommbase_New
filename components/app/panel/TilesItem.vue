<template>
  <div
    class="tiles-item"
    :class="{ 'tiles-item-selected': selected }"
    :style="{ height: height + 'rem' }"
  >
    <img
      :src="image"
      alt="object image"
      loading="lazy"
      class="tiles-item-image"
    >
    <span class="tiles-item-title">
      {{ firstUpper(title.replaceAll('_', '`')) }}
    </span>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'

const props = defineProps({
  height: { type: Number, default: 10 },
  image: { type: String, required: true },
  title: { type: String, required: true },
  selected: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
.tiles-item {
  position: relative;
  clip-path: $clip-path-tile;
  filter: brightness(0.95);
  cursor: pointer;
  transition: filter 0.3s;

  &:hover {
    filter: brightness(1.05);
  }

  &-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &-title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0.5rem 0.2rem;
    text-align: center;
    background: linear-gradient(transparent, var(--color-black-o-1) 60%);
    font-size: $font-size-sm;
    font-weight: 600;
    text-shadow: 1px 1px 0 var(--color-black-1);
  }
}

.tiles-item-selected {
  filter: brightness(1.05);
  cursor: default;

  .tiles-item-title {
    display: none;
  }
}
</style>
