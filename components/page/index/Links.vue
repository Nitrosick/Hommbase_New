<template>
  <div class="links">
    <section class="links-section">
      <span>{{ $t('social.share') }}</span>
      <div
        class="ya-share2"
        data-size="l"
        data-lang="en"
        data-color-scheme="blackwhite"
        data-copy="extraItem"
        data-services="vkontakte,telegram,twitter,whatsapp,linkedin"
        :data-title="$t('social.title')"
      />
    </section>
    <section class="links-section">
      <span>{{ $t('social.email') }}</span>
      <a
        :href="`mailto:${email}`"
        class="links-email"
      >
        hommbase@gmail.com
      </a>
    </section>
    <section class="links-section">
      <Button
        :text="$t('social.community')"
        to="/community"
      />
    </section>
  </div>
</template>

<script setup>
useHead({
  script: [
    {
      src: 'https://yastatic.net/share2/share.js',
      type: "text/javascript"
    }
  ]
})

const { email } = useRuntimeConfig().public
</script>

<style lang="scss" scoped>
.links {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  height: 100%;
  width: 100%;
  padding: 1.5rem 0;

  &-email {
    display: block;
    font-weight: 600;
    color: $color-primary;
    text-shadow: $shadow-offset $shadow-offset 0 var(--color-gold-3);
    margin-top: 1rem;
  }

  @include breakpoint-xl {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @include breakpoint-lg {
    display: flex;
    gap: 1rem;
  }
}

.ya-share2 {
  margin-top: 1rem;

  & ::v-deep(.ya-share2__item::before) {
    display: none;
  }

  & ::v-deep(.ya-share2__link) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & ::v-deep(.ya-share2__list) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  & ::v-deep(.ya-share2__badge) {
    background-color: transparent !important;
  }
}
</style>
