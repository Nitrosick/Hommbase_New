<template>
  <div
    v-if="data.message"
    class="error"
  >
    {{ text }}
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, required: true }
})

const { locale } = useI18n()

const text = computed(() => {
  const { data } = props
  if (data.message[locale.value]) return data.message[locale.value]
  return data.message
})
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  background-color: $color-alarm-d;
  color: $color-alarm;
  padding: 0.7rem;
}
</style>
