<template>
  <section class="main">
    <div class="main-title">
      <div
        class="main-title-hexes"
        data-aos="hexes"
        data-aos-delay="0"
        data-aos-duration="400"
      />
      <div class="main-title-site">
        <h1 data-aos="title">
          {{ projectTitle }}
        </h1>
      </div>
      <div class="main-title-split" />
      <ClientOnly>
        <div class="main-title-game">
          <div
            data-aos="subtitle"
            v-html="$t('global.game')"
          />
        </div>
      </ClientOnly>
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
  height: calc(100vh - $height-header);
  padding: 0 8rem;
  border: $border-main;
  border-top: none;
  background-color: $color-background;
  overflow: hidden;

  &-title {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
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
      padding: 1rem 0;
      text-transform: uppercase;
      text-align: center;
      z-index: 3;
      overflow: hidden;

      @include breakpoint-sm {
        width: 100%;
        border-top: $border-main;
        background-color: $color-background;
        padding: 0.5rem 1rem 0 1rem;
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
      padding-top: 1rem;
      font-weight: 600;
      font-size: $font-size-lg;
      color: $color-primary;
      text-shadow: $shadow-offset $shadow-offset 0 var(--color-gold-3);
      text-align: center;
      line-height: 2;
      z-index: 3;
      overflow: hidden;

      @include breakpoint-sm {
        width: 100%;
        border-bottom: $border-main;
        background-color: $color-background;
        padding: 0 1rem 0.5rem 1rem;
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
    padding: 0 1.5rem;
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

/* Animations */
[data-aos="hexes"] {
  transform: scale(0.98);
  transition-property: transform;

  &.aos-animate {
    transform: scale(1);
  }
}

[data-aos="title"] {
  transform: translateY(200%);
  transition-property: transform;

  &.aos-animate {
    transform: translateY(0);
  }
}

[data-aos="subtitle"] {
  transform: translateY(-200%);
  transition-property: transform;

  &.aos-animate {
    transform: translateY(0);
  }
}
</style>
