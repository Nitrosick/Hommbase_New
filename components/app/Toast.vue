<template>
  <div
    class="toast"
    :class="{ 'toast-opened': opened }"
  >
    <span>{{ message }}</span>
    <Icon
      v-if="mark === 'error'"
      name="stop"
      class="toast-error"
    />
    <Icon
      v-else-if="mark === 'success'"
      name="check"
      class="toast-success"
    />
  </div>
</template>

<script setup>
const store = useMainStore()

const opened = computed(() => store.toast.opened)
const message = computed(() => store.toast.message)
const mark = computed(() => store.toast.mark)
</script>

<style lang="scss" scoped>
.toast {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.7rem;
  position: fixed;
  right: 0;
  left: 0;
  bottom: calc($height-header + 1rem);
  height: 6rem;
  padding: 0 1.5rem;
  border: $border-main;
  background-color: $color-background;
  font-weight: 600;
  transform: translateY(calc(100% + 8rem));
  transition: transform 0.5s;
  z-index: 15;

  &-error {
    filter: drop-shadow(3px 3px 0 $color-alarm-d);
  }

  &-success {
    filter: drop-shadow(3px 3px 0 $color-success-d);
  }
}

.toast-opened {
  transform: translateY(0);
}
</style>
