<template>
  <button
    class="towns-view"
    @click.prevent="marks = !marks"
  >
    <img
      :src="`/images/towns/view/${name}.webp`"
      alt="town view"
      class="towns-view-img"
      :class="{ 'towns-view-blured': blured }"
      loading="lazy"
    >
    <img
      :src="`/images/towns/mark/${locale}/${name}.png`"
      alt="town view marks"
      class="towns-view-marks"
      :class="{
        'towns-view-blured': blured,
        'towns-view-marks-opened': marks
      }"
      loading="lazy"
    >
  </button>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true }
})

const { locale } = useI18n()
const blured = ref(false)
const marks = ref(false)

watch(() => props.name, () => {
  blured.value = true
  setTimeout(() => { blured.value = false }, 1000)
})
</script>

<style lang="scss" scoped>
.towns-view {
  position: relative;
  display: flex;
  border-bottom: $border-main;
  overflow: hidden;
  aspect-ratio: 13/6;

  &-img {
    width: 100%;
  }

  &-marks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0;
    transition: opacity 0.5s;
  }

  &-marks-opened {
    opacity: 1;
  }

  &-blured {
    filter: blur(50px);
  }
}
</style>
