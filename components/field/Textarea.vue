<template>
  <div
    class="textarea"
    :class="{ 'textarea-disabled': disabled }"
  >
    <label
      v-if="label"
      :for="id"
      class="textarea-label"
    >
      {{ label }}
    </label>
    <textarea
      :name="id"
      :id="id"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="textarea-field"
      v-model="model"
      v-bind="attrs"
      :rows="attrs.rows ?? 10"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, required: true},
  label: { type: String, default: ''},
  placeholder: { type: String, default: ''},
  required: { type: Boolean, default: false},
  disabled: { type: Boolean, default: false},
  attrs: { type: Object, default: () => {}}
})

const model = defineModel({ required: true })
</script>

<style lang="scss" scoped>
.textarea {
  &-label {
    display: block;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-field {
    width: 100%;
    border: $border-main;
    padding: 0.7rem;
    resize: vertical;
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

.textarea-disabled {
  .textarea-field {
    color: var(--color-grey-1);

    &:hover,
    &:focus {
      background-color: transparent;
    }
  }
}

::-webkit-resizer {
  background-color: var(--color-grey-1);
}

::-webkit-scrollbar {
  width: 0.5rem !important;
  height: 0.5rem !important;
}
</style>
