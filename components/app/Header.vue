<template>
  <header
    class="header"
    :class="{ 'header-minimized': scroll > 0 }"
  >
    <NuxtLink
      to="/"
      class="header-button header-logo"
    >
      <img
        src="/images/common/logo.png"
        alt="logo"
        loading="lazy"
        class="header-logo-img"
      >
    </NuxtLink>
    <div class="plug" />
    <Search
      :minimized="scroll > 0"
    />
    <LangSwitcher
      class="header-button header-language"
    />
    <NuxtLink
      to="/"
      class="header-button header-auth"
    >
      <img
        src="/images/icon/auth.svg"
        alt="auth"
        loading="lazy"
        class="header-icon"
      >
    </NuxtLink>
    <button
      class="header-button header-burger"
    >
      <img
        src="/images/icon/burger.svg"
        alt="burger"
        loading="lazy"
        class="header-icon"
      >
    </button>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import LangSwitcher from '@/components/app/LangSwitcher.vue';
import Search from '@/components/app/Search.vue';

const scroll = ref(0)
const handleScroll = () => { scroll.value = window.scrollY }

onMounted(() => { window.addEventListener('scroll', handleScroll) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  background-color: $color-background;
  border: $border-main;
  height: 6rem;
  transition: height 0.3s;

  &-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 6rem;
    height: 100%;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--color-grey-2);
    }
  }

  &-icon {
    width: 2rem;
    transition: width 0.3s;
  }

  &-logo {
    border-right: $border-main;

    &-img {
      width: 3rem;
      transition: width 0.3s;
    }
  }

  &-burger,
  &-language {
    border-left: $border-main;
  }

  &-auth {
    @include breakpoint-sm {
      display: none;
    }
  }

  &-language {
    text-transform: uppercase;
    font-family: $font-title;
    transition: font-size 0.3s;

    @include breakpoint-sm {
      display: none;
    }
  }
}

.header-minimized {
  height: 3rem;

  .header-icon {
    width: 1.5rem;
  }

  .header-logo {
    &-img {
      width: 1.5rem;
    }
  }

  .header-language {
    font-size: $font-size-sm;
  }
}
</style>
