<template>
  <button
    class="lang-switcher"
    @click.prevent="changeLanguage"
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
const { locale, setLocale } = useI18n()

const changeLanguage = () => {
  const newLang = locale.value === 'ru' ? 'en' : 'ru'
  setLocale(newLang)
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
