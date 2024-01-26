<template>
  <div
    class="tiles"
    :class="{ 'tiles-expanded': scroll > 0 }"
  >
    <slot />
  </div>
</template>

<script setup>
const scroll = useScroll()
</script>

<style lang="scss" scoped>
.tiles {
  display: flex;
  flex-direction: column;
  gap: 1px;
  height: 100%;
  padding-top: calc($height-header - $width-border);
  background-color: $color-outcontent;
  transition: top 0.3s;
}

.tiles-expanded {
  padding-top: calc($height-header-m - $width-border);
}
</style>
