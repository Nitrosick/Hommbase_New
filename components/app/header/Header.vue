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
      class="header-search"
    />
    <LangSwitcher
      class="header-button header-language"
    />
    <NuxtLink
      :to="isLogged ? '/user/profile' : '/auth/login'"
      class="header-button header-auth"
    >
      <Icon
        name="auth"
        :size="scroll > 0 ? 's' : 'm'"
      />
    </NuxtLink>
    <button
      v-if="isLogged"
      class="header-button header-auth"
      @click.prevent="logout"
    >
      <Icon
        name="exit"
        :size="scroll > 0 ? 's' : 'm'"
      />
    </button>
    <button
      class="header-button header-burger"
      @click.prevent="menuClosed = !menuClosed"
    >
      <Icon
        :name="menuClosed ? 'burger' : 'close'"
        :size="scroll > 0 ? 's' : 'm'"
      />
    </button>
  </header>
  <Menu
    :minimized="scroll > 0"
    :closed="menuClosed"
    @close="menuClosed = true"
  />
</template>

<script setup>
import LangSwitcher from '@/components/app/header/LangSwitcher.vue';
import Search from '@/components/app/header/Search.vue';
import Menu from '@/components/app/header/Menu.vue';

const store = useUserStore()
const { isLogged } = storeToRefs(store)
const scroll = ref(0)
const menuClosed = ref(true)
const handleScroll = () => { scroll.value = window.scrollY }

onMounted(() => { window.addEventListener('scroll', handleScroll) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })

const logout = () => { store.logout() }
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  background-color: $color-background;
  border: $border-main;
  height: $height-header;
  width: 100%;
  max-width: $max-content;
  transition: height 0.3s;
  z-index: 10;

  &-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: $height-header;
    height: 100%;
    transition: background-color 0.3s;

    &:hover,
    &:focus,
    &:active {
      background-color: var(--color-grey-2);
    }
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

  &-auth,
  &-language {
    @include breakpoint-sm {
      display: none;
    }
  }

  &-search {
    @include breakpoint-md {
      display: none;
    }
  }
}

.header-minimized {
  height: $height-header-m;

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
