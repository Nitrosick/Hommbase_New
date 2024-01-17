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
  minimized: { type: Boolean, required: true },
  closed: { type: Boolean, default: true }
})
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
    height: calc(100vh - $height-header);
    overflow-y: auto;

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
