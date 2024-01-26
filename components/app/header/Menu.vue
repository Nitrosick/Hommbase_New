<template>
  <div
    class="menu"
    :class="{
      'menu-minimized': minimized,
      'menu-closed': closed
    }"
  >
    <div class="menu-overlay"
      @click.self="$emit('close')"
    />
    <div class="menu-content">
      <div class="menu-content-laptop">
        <Search />
      </div>
      <MenuItem
        v-for="item in menu"
        :key="item.id"
        :data="item"
        @close="$emit('close')"
      />
      <div class="plug" />
      <div class="menu-content-mobile">
        <MenuItem
          :data="isLogged
            ? { id: 0, title: 'profile', link: '/user/profile' }
            : { id: 0, title: 'auth', link: '/auth/login' }
          "
          class="menu-content-auth"
          @click="$emit('close')"
        />
        <button
          v-if="isLogged"
          class="menu-content-auth"
          @click.prevent="logout"
        >
          {{ $t('label.logout') }}
        </button>
        <LangSwitcher />
      </div>
      <News />
    </div>
  </div>
</template>

<script setup>
import { menu } from '@/const/menu'
import MenuItem from '@/components/app/header/MenuItem.vue';
import News from '@/components/app/header/News.vue';
import Search from '@/components/app/header/Search.vue';
import LangSwitcher from '@/components/app/header/LangSwitcher.vue';

const props = defineProps({
  minimized: { type: Boolean, required: true },
  closed: { type: Boolean, default: true }
})

const store = useUserStore()
const { isLogged } = storeToRefs(store)

const logout = () => { store.logout() }
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  top: $height-header;
  height: calc(100vh - $height-header);
  width: 100%;
  max-width: $max-content;
  overflow: hidden;
  transition: top 0.3s, height 0.3s;
  z-index: 10;

  &-overlay {
    height: 100%;
    background: linear-gradient(var(--color-black-o-1) 35%, transparent);

    @include breakpoint-md {
      display: none;
    }
  }

  &-content {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: $color-background;
    border: $border-main;
    border-top: none;
    min-width: 25rem;
    height: calc(100vh - $height-header);
    overflow-y: auto;

    &-laptop {
      display: none;
      border-bottom: $border-main;

      @include breakpoint-md {
        display: block;
      }
    }

    &-mobile {
      display: none;
      border-top: $border-main;

      @include breakpoint-sm {
        display: block;
      }
    }

    &-auth {
      display: block;
      padding: 1rem;
      width: 100%;
      text-align: left;
    }

    // &-logout {
    //   padding: 1rem;
    //   width: 100%;
    //   text-align: left;
    // }

    @include breakpoint-md {
      width: 100%;
      min-width: initial;
    }
  }
}

.menu-minimized {
  top: $height-header-m;
  height: calc(100vh - $height-header-m);

  .menu-content {
    height: calc(100vh - $height-header-m);
  }
}

.menu-closed {
  height: 0;

  .menu-overlay {
    display: none;
  }
}
</style>
