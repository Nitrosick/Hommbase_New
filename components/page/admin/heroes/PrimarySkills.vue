<template>
  <div
    v-if="data.length"
    class="primary"
  >
    <span class="primary-label">
      {{ $t('parameters.primary') }}
    </span>
    <div class="primary-fields">
      <div
        v-for="(value, i) in data"
        :key="i"
        class="primary-item"
      >
        <label :for="skills[i]">
          <img
            :src="`/images/titles/header/${skills[i]}.png`"
            alt="primary skill"
            loading="lazy"
            class="primary-image"
          >
        </label>
        <Input
          :id="skills[i]"
          type="number"
          :required="true"
          :disabled="disabled"
          :attrs="{ min: 0, max: 10, step: 1 }"
          class="primary-input"
          v-model="data[i]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update'])
const props = defineProps({
  value: { type: String, required: true },
  disabled: { type: Boolean, default: false }
})

const data = ref([])
const skills = ['attack', 'defense', 'spellpower', 'knowledge']

onMounted(() => update())
watch(() => props.value, () => update())

watch(() => [...data.value] , (val) => {
  emit('update', val.join('/'))
})

const update = () => {
  if (!props.value) return
  const array = props.value.split('/')
  if (!array || array.length !== 4) data.value = []
  else data.value = array
}
</script>

<style lang="scss" scoped>
.primary {
  &-label {
    display: block;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-fields {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    border: $border-main;
    background-color: var(--color-grey-1);

    @include breakpoint-sm {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &-item {
    display: flex;
    align-items: center;
    padding: 0.7rem;
    background-color: $color-background;
  }

  &-image {
    height: 2.5rem;
  }

  ::v-deep(.input-field) {
    border: none;
  }
}
</style>
