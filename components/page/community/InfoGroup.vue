<template>
  <details
    class="info-group"
    :open="open"
  >
    <summary
      class="info-group-title"
      :class="{ 'info-group-inactive': disabled }"
    >
      <span>{{ title }}</span>
      <Icon
        name="arrow-up"
        size="s"
        class="info-group-icon"
      />
    </summary>
    <slot />
  </details>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  open: { type: Boolean, default: undefined }
})
</script>

<style lang="scss" scoped>
.info-group {
  border-bottom: $border-main;

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $color-background;
    padding: 1.5rem;
    font-weight: 600;
    cursor: pointer;
  }

  &-icon {
    transform: rotate(180deg);
    transition: transform 0.3s;
  }

  &-inactive {
    color: var(--color-grey-1);
  }
}

details[open] {
  .info-group-icon {
    transform: rotate(0);
  }
}
</style>
