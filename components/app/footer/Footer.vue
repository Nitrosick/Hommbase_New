<template>
  <footer class="footer">
    <a
      :href="`mailto:${email}`"
      class="footer-message"
    >
      <Icon name="message" />
    </a>
    <div class="footer-text">
      From Nitrosick & Karisol with love since&nbsp;2020
    </div>
  </footer>
</template>

<script setup>
const { email } = useRuntimeConfig().public
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  height: $height-header;
  border: $border-main;
  background-color: $color-background;

  &-message {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 6rem;
    border-right: $border-main;
    transition: background-color 0.3s;

    &:hover,
    &:focus {
      background-color: var(--color-grey-2);
    }
  }

  &-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1.5rem;
    height: 100%;
    color: var(--color-grey-1);
    font-weight: 600;
    font-size: $font-size-sm;
    text-align: right;
    line-height: 1;
  }
}
</style>
