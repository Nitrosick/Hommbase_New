<template>
  <div
    class="color"
    :class="{ 'color-disabled': disabled }"
  >
    <label
      v-if="label"
      :for="id"
      class="color-label"
    >
      {{ label }}
    </label>
    <input
      type="color"
      :name="id"
      :id="id"
      :disabled="disabled"
      class="color-field"
      v-model="model"
      v-bind="attrs"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, required: true},
  label: { type: String, default: ''},
  disabled: { type: Boolean, default: false},
  attrs: { type: Object, default: () => {}}
})

const model = defineModel({ required: true })
</script>

<style lang="scss" scoped>
.color {
  &-label {
    display: block;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-field {
    width: 100%;
    height: 50px;
    border: $border-main;
    transition: background-color 0.3s;

    &:hover,
    &:focus {
      background-color: $color-outcontent;
    }
  }

  &-field::-webkit-color-swatch-wrapper {
    padding: 0.7rem;
  }

  &-field::-webkit-color-swatch {
    border: none;
  }
}

.color-disabled {
  .color-label {
    color: var(--color-grey-1);
  }

  .color-field {
    color: var(--color-grey-1);

    &:hover,
    &:focus {
      background-color: transparent;
    }
  }
}
</style>
