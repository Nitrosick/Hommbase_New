<template>
  <div
    class="select"
    :class="{ 'select-disabled': disabled }"
  >
    <label
      v-if="label"
      :for="id"
      class="select-label"
    >
      {{ label }}
    </label>
    <select
      :name="id"
      :id="id"
      :disabled="disabled"
      class="select-field"
      v-model="model"
      v-bind="attrs"
    >
      <option
        v-if="defaultValue"
        :value="null"
      >
        -
      </option>
      <option
        v-for="(value, key) in options"
        :key="key"
        :value="key"
      >
        {{ firstUpper(locale === 'ru' ? value : key) }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'

const props = defineProps({
  id: { type: String, required: true},
  label: { type: String, default: ''},
  options: { type: Object, required: true},
  disabled: { type: Boolean, default: false},
  defaultValue: { type: Boolean, default: true},
  attrs: { type: Object, default: () => {}}
})

const { locale } = useI18n()
const model = defineModel({ required: true })
</script>

<style lang="scss" scoped>
.select {
  &-label {
    display: block;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-field {
    position: relative;
    width: 100%;
    border: $border-main;
    padding: 0.7rem;
    background-color: $color-background;
    color: $color-text;
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

.select-disabled {
  .select-label {
    color: var(--color-grey-1);
  }

  .select-field {
    color: var(--color-grey-1);

    &:hover,
    &:focus {
      background-color: transparent;
    }
  }
}
</style>
