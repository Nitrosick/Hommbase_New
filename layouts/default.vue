<template>
  <div class="layout">
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

const { autologon } = useUserStore()
const { t } = useI18n()
const { $toast } = useNuxtApp()
const loaded = ref(false)

onBeforeMount(() => { autologon() })
onMounted(() => {
  loaded.value = true
  $toast(t('global.dev'))
})
</script>

<style lang="scss" scoped>
.layout {
  background: url(/images/common/hex-s.svg) 0 0 / 3rem auto repeat;

  &-content {
    max-width: $max-content;
    min-height: 100vh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
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
