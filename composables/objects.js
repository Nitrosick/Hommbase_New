export const useObjects = () => {
  const router = useRouter()
  const { locale } = useI18n()

  const { projectTitle } = useRuntimeConfig().public

  const selectedItem = ref({})
  const selectedId = ref(null)
  const order = ref('ascending')
  const filteredStr = 'filtered/отфильтрованные'

  const orderOptions = {
    ascending: 'по возрастанию',
    descending: 'по убыванию'
  }

  const selectItem = (item) => {
    selectedItem.value = item
    selectedId.value = item.id
    router.replace({ query: { alias: item.name_en } })
  }

  const switchItem = (direction, items) => {
    if (!selectedId.value) return

    for (const group in items) {
      const array = items[group]

      for (let i = 0; i < array.length; i++) {
        if (array[i].id === selectedId.value) {
          if (direction === 'next') {
            if (i + 1 === array.length) selectItem(array[0])
            else selectItem(array[i+1])
            return
          } else {
            if (i === 0) selectItem(array[array.length-1])
            else selectItem(array[i-1])
            return
          }
        }
      }
    }
  }

  const resetParams = () => {
    selectedItem.value = {}
    selectedId.value = null
    router.replace({ query: {} })
  }

  const getParameterValue = (param) => {
    if (!selectedItem.value.id) return ''
    if (param.func) return param.func(param.value)
    return selectedItem.value[param.value] ?? ''
  }

  const translatable = (val) => {
    if (!selectedItem.value.id) return ''
    return selectedItem.value[`${val}_${locale.value}`] ?? ''
  }

  const getCost = (value) => JSON.parse(value)[0] ?? 0

  const getOptions = (field, data) => {
    const result = {}
    for (const item of data.value) { result[item[`${field}_en`]] = item[`${field}_ru`] }
    return result
  }

  return {
    projectTitle,
    selectedItem,
    selectedId,
    order,
    filteredStr,
    orderOptions,

    selectItem,
    switchItem,
    resetParams,
    getParameterValue,
    translatable,
    getCost,
    getOptions
  }
}
