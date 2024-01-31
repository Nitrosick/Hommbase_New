<template>
  <div class="towns-tabs">
    <button
      v-for="t in tabs"
      :key="t"
      class="towns-tabs-item"
      :class="{ 'towns-tabs-item-selected': selected === t }"
      @click.prevent="$emit('tab', t)"
    >
      {{ $t('menu.' + t) }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  selected: { type: String, required: true }
})

const tabs = ['description', 'structures', 'mobs', 'heroes', 'mosaic']
</script>

<style lang="scss" scoped>
.towns-tabs {
  display: flex;
  gap: $width-border;
  background-color: var(--color-grey-1);

  &-item {
    flex-grow: 1;
    padding: 1.5rem;
    background-color: $color-background;
    border-bottom: $border-main;
    transition: background-color 0.3s;

    &:hover:not(.towns-tabs-item-selected) {
      background-color: var(--color-grey-2);
    }
  }

  &-item-selected {
    cursor: default;
    color: var(--color-grey-1);
    border-color: transparent;
  }
}
</style>
