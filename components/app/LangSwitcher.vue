<template>
  <button
    @click.prevent="changeLanguage"
    class="lang-switcher"
  >
    <span class="lang-switcher-text">
      {{ $t('menu.language') }}:&nbsp;
    </span>
    <span class="lang-switcher-locale">
      {{ locale }}
    </span>
  </button>
</template>

<script setup>
const { locale } = useI18n()

onMounted(() => {
  const storageLang = localStorage.getItem('language')
  if (storageLang && ['ru', 'en'].includes(storageLang)) {
    locale.value = storageLang
  }
})

const changeLanguage = () => {
  const newLang = locale.value === 'ru' ? 'en' : 'ru'
  locale.value = newLang
  localStorage.setItem('language', newLang)
}
</script>

<style lang="scss" scoped>
.lang-switcher {
  &-text {
    display: none;

    @include breakpoint-sm {
      display: inline;
    }
  }

  &-locale {
    text-transform: uppercase;
    font-family: $font-title;
    transition: font-size 0.3s;
  }

  @include breakpoint-sm {
    text-align: left;
    width: 100%;
    padding: 1rem;
  }
}
</style>
