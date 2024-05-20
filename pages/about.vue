<template>
  <div class="about">
    <div class="about-hexes" />
    <div class="about-info">
      <div class="about-info-title">
        <h2 data-aos="title">
          {{ `${$t('menu.about')} ${projectTitle}` }}
        </h2>
      </div>
      <div
        class="about-info-description"
        data-aos="text"
        v-html="$t('info.about')"
      />
    </div>
    <div class="about-pillars">
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
import { seo } from '@/const/seo'
import Pillar from '@/components/app/Pillar.vue'

const { projectTitle } = useRuntimeConfig().public
const { t } = useI18n()

useHead({ title: () => `${t('menu.about')} | ${projectTitle}` })
useSeoMeta(seo.about)
</script>

<style lang="scss" scoped>
.about {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 0 8rem;
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
      overflow: hidden;
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
          color: $color-primary;
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
    top: 0;
    height: 100vh;
    display: flex;
    gap: 1rem;

    @include breakpoint-sm {
      display: none;
    }
  }

  @include breakpoint-xl {
    padding: 0 1.5rem;
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

/* Animations */
[data-aos="title"] {
  transform: translateY(200%);
  transition-property: transform;

  &.aos-animate {
    transform: translateY(0);
  }
}

[data-aos="text"] {
  transform: translateX(2rem);
  opacity: 0;
  transition-property: transform, opacity;

  &.aos-animate {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
