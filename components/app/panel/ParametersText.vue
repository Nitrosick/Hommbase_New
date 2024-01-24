<template>
  <div class="parameter-text">
    <div class="parameter-text-header">
      <Icon
        :name="title"
        size="s"
      />
      <span class="parameter-text-title">
        {{ $t(`parameters.${title}`) }}
      </span>
    </div>
    <p
      v-if="value"
      class="parameter-text-content"
      v-html="value"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true }
})
</script>

<style lang="scss" scoped>
.parameter-text {
  position: relative;
  border-top: $border-main;
  border-bottom: $border-main;
  padding: 1rem 1.5rem;
  margin-top: 0.8rem;

  &-header {
    display: flex;
    align-items: center;
    position: absolute;
    top: -1rem;
    left: calc(1.5rem - 3px);
    background-color: $color-background;
    padding: 0 3px;
  }

  &-title {
    color: var(--color-grey-1);
    font-size: $font-size-sm;
    font-weight: 600;
  }

  &-content {
    font-size: $font-size-sm;

    & ::v-deep(a) {
      color: var(--color-gold-1);
    }
  }
}
</style>
