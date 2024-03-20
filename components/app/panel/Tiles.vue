<template>
  <div class="tiles">
    <slot />
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.tiles {
  display: flex;
  flex-direction: column;
  gap: 1px;
  height: 100%;
  margin-top: calc($width-border * -1);
  background-color: $color-outcontent;
}
</style>
