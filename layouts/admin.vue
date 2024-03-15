<template>
  <div class="layout">
    <Loader :active="!loaded" />
    <Header />
    <main class="content">
      <div
        class="menu"
        :class="{ 'menu-opened': menuOpened }"
      >
        <div class="menu-title">
          <span>{{ $t('menu.admin') }}</span>
          <button
            class="menu-close"
            @click.prevent="menuOpened = false"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav class="menu-list">
          <NuxtLink
            v-for="item in admin"
            :key="item.id"
            :to="`/admin/${item.title}`"
            class="list-item"
            @click="menuOpened = false"
          >
            {{ $t('menu.' + item.title) }}
          </NuxtLink>
        </nav>
      </div>
      <slot />
    </main>
    <button
      v-if="!menuOpened"
      class="menu-open pop-button"
      @click.prevent="menuOpened = true"
    >
      <Icon name="settings" />
    </button>
    <UpButton />
    <Toast />
  </div>
</template>

<script setup>
import { admin } from '@/const/menu'
import Loader from '@/components/app/Loader.vue'
import Header from '@/components/app/header/Header.vue'
import Toast from '@/components/app/Toast.vue'

const loaded = ref(false)
const menuOpened = ref(true)

onMounted(() => { loaded.value = true })
</script>

<style lang="scss" scoped>
.layout {
  background: url(/images/common/hex-s.svg) 0 0 / 3rem auto repeat;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.content {
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr 3fr;
  padding-top: $height-header;
  border: $border-main;
  border-top: none;
  overflow: hidden;

  @include breakpoint-xl {
    grid-template-columns: auto 1fr 2fr;
  }

  @include breakpoint-lg {
    grid-template-columns: 1fr;
  }
}

.menu {
  background-color: $color-background;
  border-right: $border-main;
  height: 100%;

  &-title {
    position: relative;
    padding: 1.5rem;
    border-bottom: $border-main;
  }

  &-list {
    display: flex;
    flex-direction: column;
  }

  &-close {
    display: none;
    position: absolute;
    top: 1rem;
    right: 1.5rem;

    @include breakpoint-lg {
      display: block;
    }
  }

  @include breakpoint-lg {
    position: fixed;
    left: 0;
    top: 0;
    width: 50vw;
    padding-top: $height-header;
    transform: translateX(-100%);
    transition: transform 0.5s;
    border: $border-main;
    z-index: 2;
  }

  @include breakpoint-md {
    width: 100%;
  }

  @include scrollbar;
}

.menu-opened {
  @include breakpoint-lg {
    transform: translateX(0);
  }
}

.menu-open {
  left: 0;
  bottom: calc(25vh - 6rem);

  @include breakpoint-lg {
    display: block;
  }
}

.list-item {
  font-size: $font-size-md;
  padding: 1rem 1.5rem;
}
</style>
