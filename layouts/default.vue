<template>
  <div
    class="layout"
    :class="{ 'layout-loaded': loaded }"
  >
    <div class="layout-content">
      <Loader :active="!loaded" />
      <Header />
      <main class="main">
        <slot />
      </main>
      <Footer />
      <UpButton />
      <Toast />
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/app/Loader.vue';
import Header from '~/components/app/header/Header.vue';
import Footer from '@/components/app/footer/Footer.vue';
import Toast from '@/components/app/Toast.vue';

const { t } = useI18n()
const { $toast } = useNuxtApp()
const loaded = ref(false)

onMounted(() => {
  loaded.value = true

  setTimeout(() => {
    $toast(t('global.dev'))
  }, 500);
})
</script>

<style lang="scss" scoped>
.layout {
  background: url(/images/common/hex-s.svg) 0 0 / 3rem auto repeat;
  max-height: 100vh;
  overflow: hidden;

  &-content {
    max-width: $max-content;
    min-height: 100vh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.layout-loaded {
  max-height: initial;
  overflow: visible;
}

.main {
  flex-grow: 1;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 15;
}
</style>
