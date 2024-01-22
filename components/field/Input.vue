<template>
  <div
    class="input"
    :class="{ 'input-disabled': disabled }"
  >
    <label
      v-if="label"
      :for="id"
      class="input-label"
    >
      {{ label }}
    </label>
    <input
      :type="type"
      :name="id"
      :id="id"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="input-field"
      v-model="model"
      v-bind="attrs"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, required: true},
  type: { type: String, default: 'text'},
  label: { type: String, default: ''},
  placeholder: { type: String, default: ''},
  required: { type: Boolean, default: false},
  disabled: { type: Boolean, default: false},
  attrs: { type: Object, default: () => {}}
})

const model = defineModel({ required: true })
</script>

<style lang="scss" scoped>
.input {
  &-label {
    display: block;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-field {
    width: 100%;
    border: $border-main;
    padding: 0.7rem;
    transition: background-color 0.3s;

    &:hover,
    &:focus {
      background-color: $color-outcontent;
    }

    &::placeholder {
      font-size: $font-size-sm;
    }
  }
}

.input-disabled {
  .input-label {
    color: var(--color-grey-1);
  }

  .input-field {
    color: var(--color-grey-1);

    &:hover,
    &:focus {
      background-color: transparent;
    }
  }
}
</style>
