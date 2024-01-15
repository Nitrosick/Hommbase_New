// Страница будет доступна только авторизованным пользователям
// Остальных редиректим на страницу входа

export default defineNuxtRouteMiddleware((to) => {
  // const { loggedIn } = useUserStore()
  // if (!loggedIn) return navigateTo(useNuxtApp().$localePath({
  //   path: "/login",
  //   // Отправляем на желаемую страницу после входа
  //   query: { to: to.fullPath },
  // }))
})
