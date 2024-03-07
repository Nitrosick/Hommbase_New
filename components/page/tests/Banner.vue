<template>
  <div class="banner">
    <img
      :src="image"
      alt="test poster"
      loading="lazy"
      class="banner-image"
    >
    <div class="banner-overlay" />
    <div
      class="records"
      :class="{ 'records-opened': blured.result || blured.result === null }"
    >
      <span>
        {{ $t('label.record') }}
      </span>
      <span
        class="records-value"
        :class="{ 'records-value-inactive': !blured.result }"
      >
        {{ blured.result ?? 0 }} / 12
      </span>
      <span
        class="records-value"
        :class="{ 'records-value-inactive': !blured.time }"
      >
        {{ blured.time ? $dayjs(blured.time * 1000).format('mm:ss') : '00:00' }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  image: { type: String, required: true },
  blured: { type: Object, required: true }
})
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
  width: 30vw;
  min-width: 30vw;
  border: $border-main;

  &-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7);
  }

  &-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(/images/common/overlay-line.png);
  }

  @include breakpoint-md {
    width: 100%;
    height: 25rem;
    min-width: initial;
  }
}

.records {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-black-o-1);
  opacity: 0;
  transition: opacity 0.3s;

  &-value {
    font-weight: 600;
  }

  &-value-inactive {
    color: var(--color-grey-1);
  }
}

.records-opened {
  opacity: 1;
}
</style>
