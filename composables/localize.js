export const useLocalize = () => {
  const { locale } = useI18n()

  return onMounted(() => {
    const storageLang = localStorage.getItem('language')
    if (storageLang && ['ru', 'en'].includes(storageLang)) {
      locale.value = storageLang
    }
  })
}
