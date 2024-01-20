<template>
  <div
    class="search"
    :class="{ 'search-minimized': minimized }"
  >
    <input
      type="text"
      class="search-input"
      :placeholder="$t('placeholder.search') + '...'"
    >
    <button
      class="search-submit"
      type="submit"
    >
      <Icon
        name="search"
        :size="minimized ? 's' : 'm'"
      />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  minimized: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  height: 100%;
  border-left: $border-main;
  transition: background-color 0.3s;

  &-input {
    height: 100%;
    padding-left: 1.5rem;
  }

  &-submit {
    height: 100%;
    padding: 0 1.5rem 0 0.5rem;
  }

  &:has(.search-submit:hover) {
    background-color: var(--color-grey-2);
  }

  @include breakpoint-md {
    border: none;

    &-input {
      width: 100%;
      padding: 1rem;
    }

    &-submit {
      padding: 0 2rem;
    }
  }
}
</style>
