<template>
  <button
    class="up-button"
    :class="{ 'up-button-opened': scroll > 700 }"
    @click.prevent="scrollUp"
  >
    <Icon
      name="arrow-up"
      size="s"
    />
  </button>
</template>

<script setup>
const scroll = useScroll()

const scrollUp = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.up-button {
  position: fixed;
  left: calc(6rem + $width-border);
  top: $width-border;
  height: calc($height-header-m - ($width-border * 2));
  width: 6rem;
  transform: translateY(-110%);
  transition: background-color 0.3s, transform 0.5s;
  z-index: 10;

  &:hover,
  &:focus {
    background-color: var(--color-grey-2);
  }
}

.up-button-opened {
  transform: translateX(0);
}
</style>
