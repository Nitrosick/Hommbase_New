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
      <MenuItem
        v-for="item in menu"
        :key="item.id"
        :data="item"
      />
      <div class="plug" />
      <News />
    </div>
  </div>
</template>

<script setup>
import { menu } from '@/const/menu'
import MenuItem from '@/components/app/MenuItem.vue';
import News from '@/components/app/News.vue';

const props = defineProps({
  minimized: { type: Boolean, required: true},
  closed: { type: Boolean, default: true},
})
</script>

<style lang="scss" scoped>
.menu {
  position: sticky;
  top: 6rem;
  height: calc(100vh - 6rem);
  transition: top 0.3s, height 0.3s;

  &-overlay {
    height: 100%;
    background-color: var(--color-black-o-1);

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
    height: calc(100vh - 6rem);
    overflow-y: auto;
    transition: height 0.3s;

    @include breakpoint-md {
      width: 100%;
      min-width: initial;
    }
  }
}

.menu-minimized {
  top: 3rem;
  height: calc(100vh - 3rem);

  .menu-content {
    height: calc(100vh - 3rem);
  }
}

.menu-closed {
  .menu-overlay {
    display: none;
  }

  .menu-content {
    height: 0;
    border-bottom: none;
  }
}
</style>
