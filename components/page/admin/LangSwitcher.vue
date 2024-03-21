<template>
  <div class="lang-switcher">
    <div class="lang-switcher-label">
      {{ $t('menu.language') }}
    </div>
    <div class="lang-switcher-buttons">
      <button
        class="lang-switcher-button"
        :class="{ 'lang-switcher-button-active': model === 'ru' }"
        @click.prevent="model = 'ru'"
      >
        RU
      </button>
      <button
        class="lang-switcher-button"
        :class="{ 'lang-switcher-button-active': model === 'en' }"
        @click.prevent="model = 'en'"
      >
        EN
      </button>
    </div>
  </div>
</template>

<script setup>
const model = defineModel({ required: true })
</script>

<style lang="scss" scoped>
.lang-switcher {
  &-label {
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-buttons {
    display: inline-flex;
    border: $border-main;
  }

  &-button {
    padding: 0.7rem 1.5rem;
    font-family: $font-title;
    transition: background-color 0.3s;

    &:hover:not(&:disabled),
    &:focus:not(&:disabled) {
      background-color: var(--color-grey-2);
    }
  }

  &-button-active {
    pointer-events: none;
    color: var(--color-grey-1);
  }
}
</style>
