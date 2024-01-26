<template>
  <div
    class="parameters"
    :class="{ 'parameters-opened': title }"
  >
    <div
      class="parameters-content"
      :class="{ 'parameters-content-expanded': scroll > 0 }"
    >
      <div class="parameters-header">
        <button
          class="parameters-close"
          @click.prevent="$emit('reset')"
        >
          <Icon name="close" />
        </button>
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
          {{ $t('label.empty') }}
        </h3>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'

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
  background-color: $color-background;

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

    @include breakpoint-md {
      position: absolute;
      right: 0;
      width: 100%;
    }
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

  &-close {
    display: none;
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;

    @include breakpoint-md {
      display: block;
    }
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

  @include breakpoint-md {
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    transform: translateX(100%);
    transition: transform 0.5s;
    border: $border-main;
    z-index: 9;
  }
}

.parameters-opened {
  @include breakpoint-md {
    transform: translateX(0);
  }
}
</style>
