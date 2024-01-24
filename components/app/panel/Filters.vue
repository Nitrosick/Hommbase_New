<template>
  <div class="filters">
    <div
      class="filters-content"
      :class="{ 'filters-content-expanded': scroll > 0 }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
const scroll = useScroll()
</script>

<style lang="scss" scoped>
.filters {
  height: 100%;
  padding-top: $height-header;
  border-right: $border-main;

  &-content {
    position: sticky;
    top: $height-header;
    padding: 1.5rem;
    max-height: calc(100vh - $height-header);
    overflow-y: auto;
    transition: top 0.3s;
  }

  &-content-expanded {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }
}
</style>
