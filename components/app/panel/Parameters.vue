<template>
  <div class="parameters">
    <div
      class="parameters-content"
      :class="{ 'parameters-content-expanded': scroll > 0 }"
    >
      <div class="parameters-header">
        <div class="parameters-hexes" />
        <div
          class="parameters-image"
          :style="{ aspectRatio: imageRatio }"
        >
          <img
            v-if="image"
            :src="image"
            alt="object image"
            loading="lazy"
          >
        </div>
      </div>
      <div class="parameters-list">
        <h3 v-if="title">
          {{ firstUpper(title) }}
        </h3>
        <h3
          v-else
          class="parameters-list-empty"
        >
          {{ $t('parameters.empty') }}
        </h3>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/common'

const props = defineProps({
  image: { type: String, default: '' },
  imageRatio: { type: String, default: '3/4' },
  title: { type: String, default: '' }
})

const scroll = useScroll()
</script>

<style lang="scss" scoped>
.parameters {
  height: 100%;
  padding-top: $height-header;
  border-left: $border-main;

  &-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    top: $height-header;
    padding-top: 0;
    max-height: calc(100vh - $height-header);
    overflow-y: auto;
    transition: top 0.3s;
  }

  &-content-expanded {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }

  &-header {
    display: flex;
    justify-content: space-between;
    min-height: 10rem;
    height: 10rem;
    padding-right: 1.5rem;
  }

  &-hexes {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 2rem);
    margin: 1rem;
    background: url(/images/common/hex-s.svg) 0 0 / 2rem auto repeat;
  }

  &-image {
    height: 100%;
    border: $border-main;
    border-top: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(-1, 1);
    }
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h3 {
      margin: 0 1.5rem 0.5rem 1.5rem;
    }

    &-empty {
      color: var(--color-grey-1);
    }
  }

  ::-webkit-scrollbar {
    width: 0.2rem;
    height: 0.2rem;
    background-color: $color-background;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-1);
    border: none;
  }
}
</style>
