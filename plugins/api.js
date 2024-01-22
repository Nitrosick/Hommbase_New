export const api = async (path, body) => {
  const { backendUrl } = useRuntimeConfig().public

  try {
    const result = await $fetch(backendUrl + path, {
      method: body ? 'POST' : 'GET',
      body: body ? JSON.stringify(body) : null,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const data = JSON.parse(result)

    if (data.statusCode === 200) {
      return [data.data, null]
    } else {
      return [null, data]
    }
  } catch (error) {
    return [null, {
      statusCode: 500,
      message: error.toString()
    }]
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
