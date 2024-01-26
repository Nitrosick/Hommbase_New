<template>
  <div
    class="pillar"
    :class="{
      'pillar-top': side === 'top',
      'pillar-bottom': side === 'bottom'
    }"
  >
    <div :class="['pillar-image', direction]"
      :style="{
        backgroundImage: `url(${background})`,
        backgroundSize: `${scale}% auto`
      }"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  side: { type: String, default: 'no' },
  background: { type: String, required: true },
  direction: { type: String, default: 'top-bottom' },
  scale: { type: Number, default: 100 }
})
</script>

<style lang="scss" scoped>
.pillar {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 10rem;
  padding: 0 calc($width-border * 2);
  background-color: var(--color-grey-1);
  z-index: 2;

  &-image {
    background-color: var(--color-black-1);
    height: 100%;

    &.top-bottom {
      animation: tb 600s infinite linear;
    }

    &.bottom-top {
      animation: bt 600s infinite linear;
    }
  }

  @keyframes tb {
    0% { background-position: 50% 0; }
    100% { background-position: 50% 5000%; }
  }

  @keyframes bt {
    0% { background-position: 50% 5000%; }
    100% { background-position: 50% 0; }
  }
}

.pillar-top {
  height: 80%;
  top: 20%;
  padding-top: $width-border;
  clip-path: $clip-path-top;

  .pillar-image {
    clip-path: $clip-path-top;
  }
}

.pillar-bottom {
  height: 80%;
  padding-bottom: $width-border;
  clip-path: $clip-path-bottom;

  .pillar-image {
    clip-path: $clip-path-bottom;
  }
}
</style>
