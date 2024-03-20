export const useFullscreen = () => {
  const fullscreen = ref(false)

  const handleClick = (e) => {
    if (e.key === 'f') fullscreen.value = !fullscreen.value
  }

  onMounted(() => { window.addEventListener('keydown', handleClick) })
  onUnmounted(() => { window.removeEventListener('keydown', handleClick) })

  return fullscreen
}
