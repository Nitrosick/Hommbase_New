<template>
  <div
    class="checkbox"
    :class="{ 'checkbox-disabled': disabled }"
  >
    <label
      v-if="label"
      :for="id"
      class="checkbox-label"
    >
      {{ label }}
    </label>
    <div class="checkbox-line" />
    <label class="checkbox-custom">
      <input
        type="checkbox"
        :name="id"
        :id="id"
        :disabled="disabled"
        class="checkbox-field"
        v-model="model"
        v-bind="attrs"
      />
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, required: true},
  label: { type: String, required: true},
  disabled: { type: Boolean, default: false},
  attrs: { type: Object, default: () => {}}
})

const model = defineModel({ required: true })
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.3rem;
  width: 100%;
  padding: 0.5rem 0;

  &:hover,
  &:focus {
    .checkbox-custom {
      background-color: $color-background;
    }

    &:has(.checkbox-field:checked) {
      .checkbox-custom {
        background-color: var(--color-gold-2);
      }
    }
  }

  &-custom {
    display: block;
    min-width: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border: $border-main;
    background-color: $color-outcontent;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  &-custom:has(.checkbox-field:checked) {
    border-color: var(--color-gold-3);
    background-color: $color-primary;
  }

  &-field {
    transform: scale(0);
  }

  &-label {
    text-align: left;
    line-height: 1;
    cursor: pointer;
  }

  &-line {
    flex-grow: 1;
    height: 2px;
    background-color: var(--color-grey-1);
  }
}

.checkbox-disabled {
  pointer-events: none;
  filter: grayscale(1);

  .checkbox-custom {
    cursor: default;
  }

  .checkbox-label {
    color: var(--color-grey-1);
    cursor: default;
  }
}
</style>
