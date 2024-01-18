<template>
  <div
    class="loader"
    :class="{ 'loader-hidden': !active }"
  >
    <Spinner />
  </div>
</template>

<script setup>
import Spinner from '@/components/app/Spinner.vue';

const props = defineProps({
  active: { type: Boolean, default: true }
})
</script>

<style lang="scss" scoped>
.loader {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: $color-outcontent;
  opacity: 1;
  transition: opacity 0.5s, transform 0s 0.5s;
  z-index: 15;
}

.loader-hidden {
  opacity: 0;
  transform: scale(0, 0);
}
</style>
