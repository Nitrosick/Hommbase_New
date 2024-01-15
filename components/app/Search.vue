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
      <img
        src="/images/icon/search.svg"
        alt="search"
        loading="lazy"
        class="search-icon"
      >
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  minimized: { type: Boolean, required: true},
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

  &-icon {
    width: 2rem;
    transition: width 0.3s;
  }

  &:has(.search-submit:hover) {
    background-color: var(--color-grey-2);
  }

  @include breakpoint-md {
    display: none;
  }
}

.search-minimized {
  .search-icon {
    width: 1.5rem;
  }
}
</style>
