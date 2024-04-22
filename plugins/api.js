export const api = async (path, data, useCache = false, upload = false) => {
  const { writeCache, readCache } = useCacheStore()

  const key = path.replace(/[^a-zA-Z]/g, '')
  let body = null

  if (upload) body = data
  else if (data) body = JSON.stringify(data)

  if (useCache) {
    const cacheData = readCache(key)
    if (cacheData) return [cacheData, null]
  }

  const { backendUrl } = useRuntimeConfig().public

  try {
    const result = await $fetch(backendUrl + path, {
      method: 'POST', body
    })

    const data = JSON.parse(result)

    if (data.statusCode === 200) {
      if (useCache) writeCache(data.data, key)
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
