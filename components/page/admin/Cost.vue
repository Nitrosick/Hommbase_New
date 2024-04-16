<template>
  <div
    v-if="data.length"
    class="cost"
  >
    <span class="cost-label">
      {{ title }}
    </span>
    <div
      v-if="units"
      class="cost-fields"
      :class="{ 'cost-fields-trade': units === 3 }"
    >
      <div
        v-for="(value, i) in data"
        :key="i"
        class="cost-item"
      >
        <label
          :for="unitsArray[i]"
          class="cost-string"
        >
          <mark :class="unitsArray[i]" />
        </label>
        <Input
          :id="unitsArray[i]"
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
import { resources, trade } from '@/utils/string'

const emit = defineEmits(['update'])
const props = defineProps({
  value: { type: String, required: true },
  title: { type: String, required: true },
  disabled: { type: Boolean, default: false }
})

const data = ref([])
const units = ref(null)
const unitsArray = ref([])

onMounted(() => update())
watch(() => props.value, () => update())

watch(() => [...data.value] , (val) => {
  emit('update', JSON.stringify(val))
})

const update = () => {
  if (!props.value) return
  const array = JSON.parse(props.value)
  if (!array) data.value = []
  units.value = array.length
  if (array.length === 7) unitsArray.value = [...resources]
  else unitsArray.value = [...trade]
  data.value = array
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
    grid-template-columns: 1.5fr repeat(6, 1fr);
    gap: 1px;
    border: $border-main;
    background-color: var(--color-grey-1);

    @include breakpoint-sm {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &-fields-trade {
    grid-template-columns: 1.5fr repeat(2, 1fr);

    @include breakpoint-sm {
      grid-template-columns: repeat(2, 1fr);
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
