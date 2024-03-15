<template>
  <div
    class="textarea"
    :class="{ 'textarea-disabled': disabled }"
  >
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
    >

    </textarea>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, required: true},
  placeholder: { type: String, default: ''},
  required: { type: Boolean, default: false},
  disabled: { type: Boolean, default: false},
  attrs: { type: Object, default: () => {}}
})

const model = defineModel({ required: true })
</script>

<style lang="scss" scoped>
.textarea {
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
