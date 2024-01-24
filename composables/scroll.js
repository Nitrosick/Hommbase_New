export const useScroll = () => {
  const scroll = ref(0)
  const handleScroll = () => { scroll.value = window.scrollY }

  onMounted(() => { window.addEventListener('scroll', handleScroll) })
  onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })

  return scroll
}
