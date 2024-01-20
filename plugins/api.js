export const api = async (path) => {
  const { backendUrl } = useRuntimeConfig().public

  try {
    const result = await $fetch(backendUrl + path)
    const data = JSON.parse(result)

    if (data.code === 200) {
      return [data.data, null]
    } else {
      return [null, { error: {
        statusCode: data.code,
        message: data.error
      } }]
    }
  } catch (error) {
    return [null, error]
  }
}

export default defineNuxtPlugin({
  parallel: true,

  setup () {
    return {
      provide: { api }
    }
  }
})
