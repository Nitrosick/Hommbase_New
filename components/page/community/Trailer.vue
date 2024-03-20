<template>
  <div class="trailer">
    <div class="trailer-content">
      <ClientOnly>
        <iframe
          src="https://www.youtube.com/embed/vdJRKWfzpuA?autoplay=1&mute=1&loop=1?controls=0"
          class="trailer-frame"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.trailer {
  height: $height-window;
  padding: 5rem;

  &-content {
    border: $border-main;
    background-color: $color-background;
    width: 100%;
    height: 100%;

    @include breakpoint-lg {
      aspect-ratio: 16/9;
    }
  }

  &-frame {
    width: 100%;
    height: 100%;
    border: none;
  }

  @include breakpoint-xl {
    padding: 1.5rem;
  }

  @include breakpoint-lg {
    height: auto;
  }
}
</style>
