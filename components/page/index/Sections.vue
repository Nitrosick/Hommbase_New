<template>
  <section class="sections">
    <div
      v-if="sections.length"
      class="sections-content"
    >
      <img
        :src="`/images/poster/section/${selected.title}.webp`"
        alt="section background"
        class="sections-background"
        :class="{ 'sections-background-blured': blured }"
        loading="lazy"
      >
      <SectionSelector
        :selected="selected.id"
        @select="selectSection"
      />
      <div class="sections-info">
        <div class="sections-info-title">
          <h2 data-aos="title">
            {{ $t('menu.' + selected.title) }}
          </h2>
        </div>
        <ClientOnly>
          <p
            class="sections-info-description"
            data-aos="text"
            v-html="$t('info.' + selected.title)"
          />
        </ClientOnly>
        <Button
          :text="$t('label.topage')"
          :to="selected.link"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { sections } from '@/const/sections'
import SectionSelector from '@/components/page/index/SectionSelector.vue';

const selected = ref(sections[0])
const blured = ref(false)

const selectSection = (section) => {
  selected.value = section
  blured.value = true
  setTimeout(() => { blured.value = false }, 1000)
}
</script>

<style lang="scss" scoped>
.sections {
  height: $height-window;
  padding: 5rem;

  &-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(-1, 1);
    filter: brightness(0.3);
  }

  &-background-blured {
    filter: blur(50px) brightness(0.3);
  }

  &-content {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    border: $border-main;
    background-color: $color-background;
    width: 100%;
    height: 100%;
    padding: 5rem;
    overflow: hidden;

    @include breakpoint-xxl {
      padding: 3rem;
    }

    @include breakpoint-md {
      flex-direction: column;
    }

    @include breakpoint-sm {
      padding: 1.5rem;
    }
  }

  &-info {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    z-index: 1;

    &-title {
      text-align: right;
      line-height: 1;
      padding-bottom: 1.5rem;
      border-bottom: $border-main;
      overflow: hidden;
    }

    &-description {
      text-align: justify;
      max-width: 35rem;
      text-indent: 2rem;
      line-height: 1.2;
    }

    @include breakpoint-md {
      align-items: center;
      gap: 1.5rem;
    }
  }

  @include breakpoint-xxl {
    padding: 3rem;
    padding-top: 4rem;
  }

  @include breakpoint-xl {
    padding: 1.5rem;
  }

  @include breakpoint-md {
    height: auto;
  }
}

/* Animations */
[data-aos="title"] {
  transform: translateY(200%);
  transition-property: transform;

  &.aos-animate {
    transform: translateY(0);
  }
}

[data-aos="text"] {
  transform: translateX(-2rem);
  opacity: 0;
  transition-property: transform, opacity;

  &.aos-animate {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
