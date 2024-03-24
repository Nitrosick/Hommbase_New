<template>
  <div class="layout">
    <Loader :active="!loaded" />
    <Header />
    <main
      class="content"
      :class="{ 'content-fullscreen': fullscreen }"
    >
      <div
        v-if="!fullscreen"
        class="menu"
        :class="{ 'menu-opened': menuOpened }"
      >
        <button
          class="menu-close"
          @click.prevent="menuOpened = false"
        >
          <Icon name="close" />
        </button>
        <div class="menu-list">
          <MenuItem
            v-for="item in admin"
            :key="item.id"
            :data="item"
            :opened="true"
          />
        </div>
        <span class="menu-tip">
          {{ $t('info.fullscreen') }}
        </span>
      </div>
      <slot :fullscreen="fullscreen" />
    </main>
    <button
      v-if="!menuOpened && !fullscreen"
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
import MenuItem from '@/components/app/header/MenuItem.vue'
import Loader from '@/components/app/Loader.vue'
import Header from '@/components/app/header/Header.vue'
import Toast from '@/components/app/Toast.vue'

const fullscreen = useFullscreen()
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
  grid-template-columns: auto 1fr;
  padding-top: $height-header;
  border: $border-main;
  border-top: none;
  overflow: hidden;

  @include breakpoint-lg {
    grid-template-columns: 1fr;
  }
}

.content-fullscreen {
  grid-template-columns: 1fr;
}

.menu {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: $color-background;
  border-right: $border-main;
  height: 100%;

  &-list {
    flex-grow: 1;
  }

  &-tip {
    padding: 1.5rem;
    color: var(--color-grey-1);
    font-weight: 600;
    font-size: $font-size-xsm;
  }

  &-close {
    display: none;
    position: absolute;
    top: calc($height-header + 0.5rem);
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
    z-index: 3;
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
