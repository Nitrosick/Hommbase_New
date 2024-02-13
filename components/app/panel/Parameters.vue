<template>
  <div
    class="parameters"
    :class="{
      'parameters-opened': title,
      'parameters-expanded': scroll > 0
    }"
  >
    <div class="parameters-content">
      <div class="parameters-header">
        <button
          class="parameters-close"
          @click.prevent="$emit('reset')"
        >
          <Icon
            name="close"
            class="parameters-close-icon"
          />
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
            class="parameters-image-main"
          >
          <div
            v-if="imageExtra"
            class="parameters-image-extra"
            :style="{ backgroundImage: `url(${imageExtra})` }"
          />
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
  imageExtra: { type: String, default: null },
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
  transition: padding-top 0.3s;

  &-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    top: $height-header;
    padding-top: 0;
    padding-bottom: 1.5rem;
    max-height: calc(100vh - $height-header);
    overflow-y: auto;
    transition: top 0.3s;

    @include breakpoint-md {
      position: absolute;
      right: 0;
      width: 100%;
    }
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
    z-index: 1;

    &-icon {
      filter: drop-shadow($shadow-offset $shadow-offset 0 $color-background);
    }

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
    position: relative;
    height: 100%;
    border: $border-main;
    border-top: none;

    &-main {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(-1, 1);
    }

    &-extra {
      position: absolute;
      left: -1.5rem;
      bottom: -1.5rem;
      width: 3rem;
      height: 3rem;
      border: $border-main;
      background: $color-background 85% center / auto 100% no-repeat;
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

.parameters-expanded {
  padding-top: $height-header-m;

  .parameters-content {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }
}

.parameters-opened {
  @include breakpoint-md {
    transform: translateX(0);
  }
}

@include scrollbar;
</style>
