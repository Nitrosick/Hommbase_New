<template>
  <section class="main">
    <div class="main-title">
      <div class="main-title-hexes" />
      <h1 class="main-title-site">{{ projectTitle }}</h1>
      <div class="main-title-split" />
      <span
        class="main-title-game"
        v-html="$t('global.game')"
      />
    </div>
    <div class="main-pillars">
      <Pillar
        side="top"
        background="/images/poster/pillar/1.png"
        direction="bottom-top"
        :scale="75"
        class="side-pillar"
      />
      <Pillar
        background="/images/poster/pillar/2.png"
      />
      <Pillar
        side="bottom"
        background="/images/poster/pillar/3.png"
        direction="bottom-top"
        :scale="75"
        class="side-pillar"
      />
    </div>
  </section>
</template>

<script setup>
import Pillar from '@/components/app/Pillar.vue';

const { projectTitle } = useRuntimeConfig().public
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  height: 100vh;
  padding: $height-header-m 8rem 0 8rem;
  border: $border-main;
  background-color: $color-background;
  overflow: hidden;

  &-title {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 7rem 0 5rem 0;

    &-hexes {
      background: url(/images/common/hex-s.svg) 0 0 / 3.3rem auto repeat;
      flex-grow: 1;
      width: 100%;

      @include breakpoint-sm {
        background-size: 2.5rem;
        width: calc(100% - 2rem);
        margin-bottom: 1.5rem;
      }
    }

    &-site {
      text-transform: uppercase;
      text-align: center;
      z-index: 3;

      @include breakpoint-sm {
        width: 100%;
        border-top: $border-main;
        background-color: $color-background;
        padding: 0.5rem 1rem;
        font-size: $font-size-xl;
      }
    }

    &-split {
      width: 100%;
      height: $width-border;
      background-color: var(--color-grey-1);

      @include breakpoint-sm {
        display: none;
      }
    }

    &-game {
      font-weight: 600;
      font-size: $font-size-lg;
      color: $color-primary;
      text-shadow: $shadow-offset $shadow-offset 0 var(--color-gold-3);
      text-align: center;
      line-height: 2;
      z-index: 3;

      @include breakpoint-sm {
        width: 100%;
        border-bottom: $border-main;
        background-color: $color-background;
        padding: 0.5rem 1rem;
        font-size: $font-size-md;
      }
    }

    @include breakpoint-md {
      position: absolute;
      bottom: 0;
      left: 1.5rem;
    }

    @include breakpoint-sm {
      gap: 0;
      left: 0;
      width: 100%;
    }
  }

  &-pillars {
    height: 100%;
    display: flex;
    gap: 1rem;
  }

  @include breakpoint-xl {
    padding: $height-header-m 1.5rem 0 1.5rem;
  }

  @include breakpoint-md {
    justify-content: flex-end;
  }
}

.side-pillar {
  @include breakpoint-lg {
    display: none;
  }
}
</style>
