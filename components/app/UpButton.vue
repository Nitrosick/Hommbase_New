<template>
  <button
    class="up-button"
    :class="{ 'up-button-opened': scroll > 700 }"
    @click.prevent="scrollUp"
  >
    <Icon name="arrow-up" />
  </button>
</template>

<script setup>
const scroll = ref(0)
const handleScroll = () => { scroll.value = window.scrollY }

onMounted(() => { window.addEventListener('scroll', handleScroll) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })

const scrollUp = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.up-button {
  position: fixed;
  right: 0;
  bottom: 7rem;
  height: 6rem;
  width: 6rem;
  border: $border-main;
  background-color: $color-background;
  transform: translateX(100%);
  transition: background-color 0.3s, transform 0.5s;
  z-index: 15;

  &:hover {
    background-color: var(--color-grey-2);
  }
}

.up-button-opened {
  transform: translateX(0);
}
</style>
