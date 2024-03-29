<template>
  <NuxtLink
    v-if="data"
    :to="data.link"
    class="news"
    :style="{ backgroundImage: `url(/images/news/${data.image})` }"
    @click="$emit('close')"
  >
    <div class="news-overlay" />
    <h3 class="news-title">
      {{ data['title_' + locale] }}
    </h3>
  </NuxtLink>
</template>

<script setup>
const { locale } = useI18n()
const { $api } = useNuxtApp()

const data = ref(null)

onMounted(async () => {
  const [res, err] = await $api('news', null, true)
  if (err) console.error(err)
  else data.value = res || null
})
</script>

<style lang="scss" scoped>
.news {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: $border-main;
  min-height: 15rem;
  padding: 1rem;
  background-position: 0 0;
  background-size: auto 100%;
  background-repeat: no-repeat;
  animation: background 12s infinite;

  &-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-black-o-2);
  }

  &-title {
    position: relative;
    color: $color-text;
    text-align: center;
    text-shadow: $shadow-offset $shadow-offset 0 $color-background;
    z-index: 1;
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
