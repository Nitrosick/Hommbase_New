<template>
  <div
    v-if="data"
    class="statistics"
  >
    <section
      v-if="data.tests"
      class="statistics-section statistics-tests"
    >
      <div class="statistics-title">
        <div class="statistics-title-wrapper">
          <h2 data-aos="title">
            {{ $t('label.records') }}
          </h2>
        </div>
      </div>
      <Records
        :title="data.tests.easy[0]['test_name_' + locale]"
        :list="data.tests.easy"
      />
      <Records
        :title="data.tests.medium[0]['test_name_' + locale]"
        :list="data.tests.medium"
      />
      <Records
        :title="data.tests.hard[0]['test_name_' + locale]"
        :list="data.tests.hard"
      />
    </section>
    <section
      v-if="data.users"
      class="statistics-section statistics-users"
    >
      <div class="statistics-title">
        <div class="statistics-title-wrapper">
          <h2 data-aos="title">
            {{ $t('menu.users') }}
          </h2>
        </div>
      </div>
      <Factions
        :title="$t('label.factions')"
        :list="data.users.factions"
        :total="data.users.total"
      />
      <Records
        :title="$t('label.gold')"
        :list="data.users.gold"
      />
    </section>
  </div>
</template>

<script setup>
import { seo } from '@/const/seo'
import Records from '@/components/page/statistics/Records.vue'
import Factions from '@/components/page/statistics/Factions.vue'

const { $api } = useNuxtApp()

const { data, pending } = await useAsyncData('records',
  async () => {
    const [res, err] = await $api('records')
    if (err) {
      console.error(err)
      throw showError(err)
    }
    return res || null
  },
  { initialCache: false }
)

const { projectTitle } = useRuntimeConfig().public
const { t, locale } = useI18n()

useHead({ title: () => `${t('menu.statistics')} | ${projectTitle}` })
useSeoMeta(seo.statistics)
</script>

<style lang="scss" scoped>
.statistics {
  background-color: $color-background;
  border-right: $border-main;
  border-left: $border-main;

  &-title {
    grid-column: 1/-1;
    padding: 1.5rem;
    border-bottom: $border-main;

    &-wrapper {
      display: inline-block;
      border-right: $border-main;
      padding-right: 1.5rem;
      overflow: hidden;
    }
  }

  &-section {
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 1fr;
    overflow: hidden;

    @include breakpoint-xl {
      height: auto;
      grid-template-columns: 1fr;
    }
  }

  &-tests {
    border-bottom: $border-main;
  }
}

/* Animations */
[data-aos="title"] {
  transform: translateX(150%);
  transition-property: transform;

  &.aos-animate {
    transform: translateX(0);
  }
}
</style>
