<template>
  <button
    @click.prevent="changeLanguage"
  >
    <span>{{ locale }}</span>
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
