<template>
  <div class="requirements">
    <span class="requirements-label">
      {{ $t('parameters.requirements') }}
    </span>
    <ul
      v-if="data.length"
      class="requirements-list"
    >
      <li
        v-for="item in list"
        :key="item.id"
        class="requirements-item"
        @click="remove(item.id)"
      >
        {{ firstUpper(item['name_' + locale]) }}
      </li>
    </ul>
    <Select
      id="add"
      :label="$t('label.add')"
      :options="requirementOptions"
      :disabled="disabled"
      v-model="newValue"
    />
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'

const emit = defineEmits(['update'])
const props = defineProps({
  value: { type: String, required: true },
  options: { type: Array, required: true },
  disabled: { type: Boolean, default: false }
})

const { locale } = useI18n()
const data = ref([])
const newValue = ref(null)

const list = computed(() => [...props.options].filter(item => data.value.includes(+item.id)))

const requirementOptions = computed(() => {
  return props.options.reduce(
    (carry, item) => {
      carry[item.id] = item['name_' + locale.value]
      return carry
    }, {}
  )
})

onMounted(() => update())
watch(() => props.value, () => update())

watch(() => [...data.value] , (val) => {
  const sorted = val.sort((a, b) => a - b)
  emit('update', JSON.stringify(sorted))
})

watch(() => newValue.value, async (val) => {
  if (!data.value.includes(+val) && val !== null) data.value.push(+val)
  await nextTick()
  newValue.value = null
})

const update = () => {
  if (!props.value) return
  const array = JSON.parse(props.value)
  if (!array) data.value = []
  data.value = array
}

const remove = (id) => {
  data.value = data.value.filter(item => item !== +id)
}
</script>

<style lang="scss" scoped>
.requirements {
  margin: 1rem 0;

  &-label {
    display: block;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0;
    margin: 0.5rem 0 1rem 0;
  }

  &-item {
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--color-grey-1);
    }
  }
}
</style>
