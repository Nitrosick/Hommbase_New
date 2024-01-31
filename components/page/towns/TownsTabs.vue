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
  max-width: 100%;
  overflow: hidden;

  &-item {
    flex-grow: 1;
    padding: 1.5rem;
    background-color: $color-background;
    border-bottom: $border-main;
    transition: background-color 0.3s;

    &:hover:not(.towns-tabs-item-selected) {
      background-color: var(--color-grey-2);
    }

    @include breakpoint-xxl {
      padding: 1rem 0.2rem;
    }

    @include breakpoint-lg {
      font-size: $font-size-sm;
    }

    @include breakpoint-sm {
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      padding: 0.5rem;
    }
  }

  &-item-selected {
    cursor: default;
    color: var(--color-grey-1);
    border-color: transparent;
  }
}
</style>
