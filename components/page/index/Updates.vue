<template>
  <section class="updates">
    <div class="updates-hexes" />
    <div class="updates-pillars">
      <Pillar
        background="/images/poster/pillar/5.png"
        direction="bottom-top"
        :scale="90"
      />
      <Pillar
        side="bottom"
        background="/images/poster/pillar/5.png"
        class="side-pillar"
        :scale="90"
      />
    </div>
    <div class="updates-content">
      <h2 class="updates-content-title">
        {{ $t('menu.updates') }}
      </h2>
      <Patchnote />
      <Button
        :text="$t('label.fulllist')"
        :href="source"
        target="_blank"
        class="updates-content-button"
      />
    </div>
  </section>
</template>

<script setup>
import Pillar from '@/components/app/Pillar.vue';
import Patchnote from '@/components/page/index/Patchnote.vue';

const { locale } = useI18n()
const source = ref(`http://h3hota.com/HD/Update/changelog_${locale.value}.txt`)

watch(locale, () => {
  source.value = `http://h3hota.com/HD/Update/changelog_${locale.value}.txt`
})
</script>

<style lang="scss" scoped>
.updates {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  height: 100vh;
  padding-left: 8rem;
  background-color: $color-background;
  border-left: $border-main;
  border-right: $border-main;

  &-hexes {
    position: absolute;
    top: 8rem;
    bottom: 8rem;
    left: 4rem;
    width: 35vw;
    background: url(/images/common/hex-s.svg) 0 0 / 3.3rem auto repeat;

    @include breakpoint-sm {
      display: none;
    }
  }

  &-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    padding: 5rem 0;
    z-index: 1;

    &-title {
      text-align: center;
      line-height: 1;
      margin-right: 8rem;

      @include breakpoint-xl {
        margin-right: 1.5rem;
      }
    }

    &-button {
      margin-right: 8rem;

      @include breakpoint-xl {
        margin-right: 1.5rem;
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
    padding-left: 1.5rem;
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
