<template>
  <div class="parameter">
    <Icon
      :name="title"
      size="s"
    />
    <span class="parameter-title">
      {{ $t(`parameters.${title}`) }}
    </span>
    <div class="plug" />
    <span
      class="parameter-value"
      :class="{ 'parameter-value-small': small && value }"
      v-html="firstUpper(value) || '·'"
    />
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  small: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
.parameter {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1.5rem;

  &::before {
    position: absolute;
    content: '';
    top: calc(50% - 1px);
    left: 2rem;
    right: 2rem;
    height: 2px;
    background-color: var(--color-grey-1);
    z-index: -1;
  }

  &-title {
    color: var(--color-grey-1);
    font-size: $font-size-sm;
    font-weight: 600;
    background-color: $color-background;
    padding: 0 0.15rem;
  }

  &-value {
    background-color: $color-background;
    padding-left: 0.15rem;
    white-space: nowrap;
  }

  &-value-small {
    font-size: $font-size-xsm;
  }
}
</style>
