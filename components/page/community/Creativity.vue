<template>
  <div class="creativity">
    <div class="creativity-title">
      {{ $t('social.creativity') }}
    </div>
    <!-- Вынести работы в отдельный файл -->
    <div class="creativity-description">
      Фанатские переводы официальных печатных карт мира Heroes of Might and Magic III
    </div>
    <div class="creativity-gallery">
      <a
        href="/images/creativity/enroth.webp"
        target="_blank"
        class="creativity-item"
      >
        <img
          src="/images/creativity/enroth.webp"
          alt="enroth map"
          loading="lazy"
        >
      </a>
      <a
        href="/images/creativity/antagarich.webp"
        target="_blank"
        class="creativity-item"
      >
        <img
          src="/images/creativity/antagarich.webp"
          alt="antagarich map"
          loading="lazy"
        >
      </a>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.creativity {
  background-color: $color-background;
  border: $border-main;
  border-bottom: none;
  display: flex;
  flex-direction: column;

  &-title {
    padding: 1.5rem;
  }

  &-description {
    padding: 1.5rem;
    padding-top: 0;
    font-size: $font-size-sm;
  }

  &-gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1.5rem;
    padding-top: 0;

    @include breakpoint-xl {
      grid-template-columns: 1fr;
    }

    @include breakpoint-sm {
      padding-left: 0;
      padding-right: 0;
      gap: 0.5rem;
    }
  }

  &-item {
    border: $border-main;
    background-color: var(--color-grey-1);

    img {
      width: 100%;
    }

    @include breakpoint-sm {
      border: none;
    }
  }
}
</style>
