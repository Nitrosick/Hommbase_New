<template>
  <div
    class="toast"
    :class="{ 'toast-opened': opened }"
  >
    {{ message }}
  </div>
</template>

<script setup>
const store = useMainStore()

const opened = computed(() => store.toastOpened)
const message = computed(() => store.toastMessage)
</script>

<style lang="scss" scoped>
.toast {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: fixed;
  right: 0;
  left: 0;
  bottom: 7rem;
  height: 6rem;
  padding: 0 1.5rem;
  border: $border-main;
  background-color: $color-background;
  transform: translateY(calc(100% + 8rem));
  transition: transform 0.5s;
  z-index: 15;
}

.toast-opened {
  transform: translateY(0);
}
</style>
