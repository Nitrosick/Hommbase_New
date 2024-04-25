export const useAdmin = () => {
  const { $api, $toast } = useNuxtApp()
  const fullscreen = useFullscreen()
  const { projectTitle } = useRuntimeConfig().public
  const { me } = useUserStore()
  const { t, locale } = useI18n()
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lang = ref('ru')
  const edited = ref({})
  const options = ref(null)

  useHead({ title: () => `${t('menu.admin')} | ${projectTitle}` })
  watch(() => ({...edited.value}), () => { error.value = null })

  const selectItem = (item) => {
    if (item === edited.value) return
    edited.value = item
  }

  const getOptions = (array) => {
    if (!array || !array.length) return {}
    return array.reduce(
      (carry, item) => {
        carry[item.id] = item['name_' + locale.value]
        return carry
      }, {}
    )
  }

  return {
    $api,
    $toast,
    fullscreen,
    me,
    t,
    locale,
    data,
    loading,
    error,
    lang,
    edited,
    options,

    selectItem,
    getOptions
  }
}
