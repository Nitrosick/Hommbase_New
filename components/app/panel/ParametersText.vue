<template>
  <div class="parameter-text">
    <div class="parameter-text-header">
      <Icon
        :name="icon ?? title"
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
  icon: { type: String, default: null },
  value: { type: String, required: true }
})
</script>

<style lang="scss" scoped>
.parameter-text {
  position: relative;
  border-top: $border-main;
  padding: 1rem 1.5rem 0.5rem 1.5rem;
  margin-top: 0.8rem;

  &-header {
    display: flex;
    align-items: center;
    position: absolute;
    top: -1rem;
    left: 1.35rem;
    background-color: $color-background;
    padding: 0 0.15rem;
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

    & ::v-deep(ul) {
      padding: 0;
      margin: 0;
    }

    & ::v-deep(img) {
      width: 100%;
      margin: 0.5rem 0;
    }
  }
}
</style>
