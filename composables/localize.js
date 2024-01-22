export const useLocalize = () => {
  const { setLocale } = useI18n()

  return onBeforeMount(() => {
    const storageLang = localStorage.getItem('language')
    if (storageLang && ['ru', 'en'].includes(storageLang)) {
      setLocale(storageLang)
    }
  })
}
