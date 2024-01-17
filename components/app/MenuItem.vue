<template>
  <details
    v-if="data.subitems"
    class="menu-details"
  >
    <summary class="menu-item">{{ $t('menu.' + data.title) }}</summary>
    <div class="menu-details-list">
      <MenuItem
        v-for="item in data.subitems"
        :key="item.id"
        :data="item"
      />
    </div>
  </details>
  <NuxtLink
    v-else
    :to="data.link"
    class="menu-item"
  >
    <span>{{ $t('menu.' + data.title) }}</span>
  </NuxtLink>
</template>

<script setup>
import MenuItem from '@/components/app/MenuItem.vue';

const props = defineProps({
  data: { type: Object, required: true }
})
</script>

<style lang="scss" scoped>
.menu-details {
  &-list {
    background-color: var(--color-black-o-3);
    display: flex;
    flex-direction: column;
    font-size: $font-size-sm;
  }
}

.menu-item {
  padding: 1rem;
  transition: background-color 0.3s;
  color: $color-text;
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-2);
  }
}
</style>
