<template>
  <header
    class="header"
    :class="{ 'header-minimized': scroll > 0 }"
  >
    <NuxtLink
      to="/"
      class="header-logo"
    >
      <img
        src="/images/common/logo.png"
        alt="logo"
        loading="lazy"
        class="header-logo-img"
      >
    </NuxtLink>
    <!-- <div class="header-submenu">
      <div class="header-submenu-content wrapper">
        <NuxtLink
          v-for="item in submenu"
          :key="item.id"
          :to="item.to"
          class="header-submenu-link"
        >
          {{ item.title[ln] }}
        </NuxtLink>
      </div>
    </div>
    <div class="header-menu wrapper">
      <NuxtLink to="/">
        <img
          src="@/assets/images/logo.png"
          alt="logo"
          class="header-logo"
        >
      </NuxtLink>
      <Menu />
    </div> -->
  </header>
</template>

<script setup>
import { ref } from 'vue'

const store = useMainStore()
const ln = computed(() => store.language)
const scroll = ref(0)
const handleScroll = () => { scroll.value = window.scrollY }

onMounted(() => { window.addEventListener('scroll', handleScroll) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })
</script>

<style lang="scss" scoped>
.header {
  background-color: $color-background;
  border: $border-main;
  height: 6rem;
  transition: height 0.3s;

  &-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: $border-main;
    width: 6rem;
    height: 100%;
    transition: background-color 0.3s;

    &-img {
      width: 3rem;
    }

    &:hover {
      background-color: var(--color-grey-2);
    }
  }
}

.header-minimized {
  height: 4rem;
}
</style>
