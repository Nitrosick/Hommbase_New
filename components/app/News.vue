<template>
  <NuxtLink
    to="/towns"
    class="news"
  >
    <h3 class="news-title">
      {{ $t('menu.news') }}
    </h3>
  </NuxtLink>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.news {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: $border-main;
  min-height: 15rem;
  padding: 1rem;
  background: url(https://hommbase.ru/images/news/factory.webp) 0 0 / auto 100% no-repeat;
  animation: background 12s infinite;

  &-title {
    color: $color-text;
    text-align: center;
    text-shadow: 3px 3px 0 $color-background;
  }

  @include breakpoint-md {
    min-height: 20rem;
  }

  @include breakpoint-sm {
    min-height: 15rem;
  }
}

@keyframes background {
  0% { background-position: 0 0; }
  50% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
</style>
