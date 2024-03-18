<template>
  <div
    v-if="text"
    class="error"
  >
    {{ text }}
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: [Object, String], required: true }
})

const { locale } = useI18n()

const text = computed(() => {
  const { data } = props
  if (typeof data === 'object') {
    if (!data.message) return null
    if (data.message[locale.value]) return data.message[locale.value]
    return data.message
  } else {
    if (!data) return null
    return data
  }
})
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  background-color: $color-alarm-d;
  color: $color-alarm;
  padding: 0.7rem;
}
</style>
