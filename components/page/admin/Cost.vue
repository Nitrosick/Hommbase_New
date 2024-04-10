<template>
  <div
    v-if="data.length"
    class="cost"
  >
    <span class="cost-label">
      {{ $t('parameters.cost') }}
    </span>
    <div
      class="cost-fields"
      :style="{ '--units': units - 1 }"
    >
      <div
        v-for="(value, i) in data"
        :key="i"
        class="cost-item"
      >
        <label
          :for="resources[i]"
          class="cost-string"
        >
          <mark :class="resources[i]" />
        </label>
        <Input
          :id="resources[i]"
          type="number"
          :required="true"
          :disabled="disabled"
          :attrs="{ min: 0, step: 1 }"
          class="cost-input"
          v-model="data[i]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { resources } from '@/utils/string'

const emit = defineEmits(['update'])
const props = defineProps({
  value: { type: String, required: true },
  disabled: { type: Boolean, default: false }
})

const data = ref([])
const units = 7

onMounted(() => update())
watch(() => props.value, () => update())

watch(() => [...data.value] , (val) => {
  emit('update', JSON.stringify(val))
})

const update = () => {
  if (!props.value) return
  const array = JSON.parse(props.value)
  if (!array || array.length !== units) data.value = []
  else data.value = array
}
</script>

<style lang="scss" scoped>
.cost {
  &-label {
    display: block;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-fields {
    display: grid;
    grid-template-columns: 1.5fr repeat(var(--units), 1fr);
    gap: 1px;
    border: $border-main;
    background-color: var(--color-grey-1);

    @include breakpoint-sm {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: $color-background;
  }

  &-item:first-child {
    @include breakpoint-sm {
      grid-column: 1/-1;
    }
  }

  &-string {
    padding-top: 0.7rem;
    padding-right: 0.7rem;
  }

  ::v-deep(.input-field) {
    border: none;
    text-align: center;
  }
}
</style>
