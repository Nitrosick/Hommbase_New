<template>
  <section class="mechanics">
    <div class="mechanics-hexes" />
    <div class="mechanics-info">
      <div class="mechanics-info-title">
        <h2 data-aos="title">
          {{ $t('menu.mechanics') }}
        </h2>
      </div>
      <ClientOnly>
        <span
          class="mechanics-info-description"
          data-aos="text"
          v-html="$t('info.mechanics')"
        />
      </ClientOnly>
      <Button
        :text="$t('label.topage')"
        to="/mechanics"
      />
    </div>
    <div class="mechanics-pillars">
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
  </section>
</template>

<script setup>
import Pillar from '@/components/app/Pillar.vue';
</script>

<style lang="scss" scoped>
.mechanics {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  height: $height-window;
  padding: 0 8rem;
  background-color: $color-background;
  border: $border-main;
  overflow: hidden;

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
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
      line-height: 1.7;

      @include breakpoint-lg {
        line-height: 1.3;
      }
    }

    @include breakpoint-sm {
      align-items: center;
      gap: 1.5rem;
    }
  }

  &-pillars {
    height: 100%;
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
