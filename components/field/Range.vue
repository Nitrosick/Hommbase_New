<template>
  <div
    class="range"
    :class="{ 'range-disabled': disabled }"
  >
    <div
      v-if="label"
      class="range-label"
    >
      {{ label }}
      <span class="range-value">
        {{ model }}
      </span>
    </div>
    <div class="range-wrapper">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        class="range-field"
        v-model="model"
        v-bind="attrs"
      />
      <div
        class="range-progress-bar"
        :style="{ width: `${100 / (max - min) * (model - min)}%` }"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, default: '' },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
  attrs: { type: Object, default: () => { } }
})

const model = defineModel({ required: true })
</script>

<style lang="scss" scoped>
.range {
  &-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-value {
    font-weight: 600;
    color: var(--color-grey-1);
  }

  &-wrapper {
    position: relative;
    height: 2.5rem;
  }

  &-field {
    width: 100%;
    height: 100%;
    -webkit-appearance: none;
    cursor: pointer;

    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 0.5rem;
      background-color: var(--color-grey-1);
    }

    &::-webkit-slider-thumb {
      position: relative;
      border: $width-border solid var(--color-grey-1);
      height: 2.5rem;
      width: 1rem;
      background-color: $color-background;
      -webkit-appearance: none;
      margin-top: -1rem;
      z-index: 1;
    }

    &::-moz-range-track {
      width: 100%;
      height: 0.5rem;
      background-color: var(--color-grey-1);
    }

    &::-moz-range-thumb {
      position: relative;
      border: $width-border solid var(--color-grey-1);
      height: 2.5rem;
      width: 1rem;
      background-color: $color-background;
      margin-top: -1rem;
      transition: background-color 0.2s;
      z-index: 1;
    }
  }

  &-progress-bar {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 0.5rem;
    background-color: $color-text;
  }
}

.range-disabled {
  .range-label {
    color: var(--color-grey-1);
  }

  .range-field {
    cursor: default;
  }
}
</style>
