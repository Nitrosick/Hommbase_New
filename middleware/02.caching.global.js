export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return
  const { fetchCacheSettings, cacheSettings } = useCacheStore()
  if (Object.keys(cacheSettings).length > 0) return
  return await fetchCacheSettings()
})
