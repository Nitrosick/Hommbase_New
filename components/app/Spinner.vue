<template>
  <div class="spinner">
    <div class="spinner-img">
      <div class="spinner-img-center" />
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10rem;
  height: 10rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(var(--color-grey-1), transparent 50%);

  &-img {
    width: 4.2rem;
    height: 5rem;
    background-color: $color-text;
    padding: 3px;
    clip-path: $clip-path-full;
    animation: roll 3s infinite linear;

    &-center {
      width: 100%;
      height: 100%;
      background-color: $color-background;
      clip-path: $clip-path-full;
    }
  }

  @keyframes roll {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}
</style>
