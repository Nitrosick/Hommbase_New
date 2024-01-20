<template>
  <img
    :src="`/images/icon/${name}.svg`"
    :alt="`${name} icon`"
    loading="lazy"
    :class="`icon icon-${size}`"
  >
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'm' }
})
</script>

<style lang="scss" scoped>
.icon {
  transition: width 0.3s;
}

.icon-s {
  width: 1.5rem;
}

.icon-m {
  width: 2rem;
}

.icon-l {
  width: 3rem;
}
</style>
