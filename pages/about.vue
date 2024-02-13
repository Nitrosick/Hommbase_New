<template>
  <div class="about">
    <div class="about-hexes" />
    <div class="about-info">
      <h2 class="about-info-title">
        {{ `${$t('menu.about')} ${projectTitle}` }}
      </h2>
      <div
        class="about-info-description"
        v-html="$t('info.about')"
      />
    </div>
    <div
      class="about-pillars"
      :class="{ 'about-pillars-expanded': scroll > 0 }"
    >
      <Pillar
        side="bottom"
        background="/images/poster/pillar/4.png"
        class="side-pillar"
        :scale="80"
      />
      <Pillar
        background="/images/poster/pillar/4.png"
        direction="bottom-top"
        :scale="80"
      />
    </div>
  </div>
</template>

<script setup>
import Pillar from '@/components/app/Pillar.vue';

const { projectTitle } = useRuntimeConfig().public
const scroll = useScroll()
</script>

<style lang="scss" scoped>
.about {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  min-height: 100vh;
  padding: $height-header-m 8rem 0 8rem;
  background-color: $color-background;
  border-left: $border-main;
  border-right: $border-main;

  &-hexes {
    position: absolute;
    top: 8rem;
    bottom: 8rem;
    right: 4rem;
    width: 35vw;
    background: url(/images/common/hex-s.svg) 0 0 / 3.3rem auto repeat;

    @include breakpoint-sm {
      display: none;
    }
  }

  &-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 5rem 0;
    z-index: 1;

    &-title {
      text-align: center;
      line-height: 1;
      padding-bottom: 1.5rem;
      border-bottom: $border-main;
    }

    &-description {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      text-indent: 2rem;
      line-height: 1.7;

      & ::v-deep() {
        a, mark {
          font-weight: 600;
          color: var(--color-gold-1);
          background-color: transparent;
          text-shadow: 1px 1px 0 var(--color-gold-3);
        }
      }

      @include breakpoint-lg {
        line-height: 1.3;
      }

      @include breakpoint-md {
        text-align: justify;
      }
    }

    @include breakpoint-sm {
      align-items: center;
      gap: 1.5rem;
    }
  }

  &-pillars {
    position: sticky;
    top: $height-header;
    height: 100vh;
    display: flex;
    gap: 1rem;
    transition: top 0.3s;

    @include breakpoint-sm {
      display: none;
    }
  }

  &-pillars-expanded {
    top: $height-header-m;
  }

  @include breakpoint-xl {
    padding: $height-header-m 1.5rem 0 1.5rem;
  }

  @include breakpoint-sm {
    height: auto;
  }
}

.side-pillar {
  @include breakpoint-lg {
    display: none;
  }
}
</style>
