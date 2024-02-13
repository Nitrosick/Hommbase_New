const cache = {}

export const api = async (path, body, useCache = false) => {
  const key = path.replace(/[^a-zA-Z]/g, '')
  if (useCache && cache[key]) return [cache[key], null]

  const { backendUrl } = useRuntimeConfig().public

  try {
    const result = await $fetch(backendUrl + path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : null,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = JSON.parse(result)

    if (data.statusCode === 200) {
      if (useCache) cache[key] = data.data
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
