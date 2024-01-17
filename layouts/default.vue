<template>
  <div class="layout">
    <div class="layout-content">
      <Header />
      <main class="main">
        <slot />
      </main>
      <!-- <Footer /> -->
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/app/Header.vue';
// import Footer from '@/components/app/Footer.vue';
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
</style>
