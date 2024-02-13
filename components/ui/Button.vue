<template>
  <a
    v-if="href && download"
    :href="href"
    download
    class="button button-download"
  >
    {{ text }}
  </a>
  <a
    v-else-if="href"
    :href="href"
    :target="target"
    class="button button-link"
  >
    {{ text }}
  </a>
  <NuxtLink
    v-else-if="to"
    :to="to"
    :disabled="disabled"
    class="button button-link"
  >
    {{ text }}
  </NuxtLink>
  <button
    v-else
    class="button"
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'button' },
  text: { type: String, default: '...' },
  to: { type: String, default: null },
  href: { type: String, default: null },
  view: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  download: { type: Boolean, default: false },
  target: { type: String, default: '_self' }
})
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: calc($shadow-offset * -1);
  left: calc($shadow-offset * -1);
  border: $width-border solid $color-text;
  min-height: 3.5rem;
  font-weight: 600;
  color: $color-text;
  padding: 0 2rem;
  overflow: hidden;
  white-space: nowrap;
  box-shadow: $shadow-offset $shadow-offset 0 0 $color-text;
  transition: background-color 0.3s;

  &:hover:not(&:disabled),
  &:focus:not(&:disabled),
  &:active:not(&:disabled) {
    background-color: var(--color-grey-1);
  }

  &:active,
  &:disabled {
    box-shadow: none;
    top: 0;
    left: 0;
  }

  &:disabled {
    color: var(--color-grey-1);
    cursor: default;
  }

  @include breakpoint-sm {
    padding: 0 1rem;
  }
}

.button-link::after {
  position: absolute;
  content: '';
  right: $width-border;
  top: $width-border;
  border-top: 0.4rem solid $color-text;
  border-right: 0.4rem solid $color-text;
  border-left: 0.4rem solid transparent;
  border-bottom: 0.4rem solid transparent;
}

.button-download::after {
  position: absolute;
  content: '';
  left: $width-border;
  bottom: $width-border;
  border-bottom: 0.4rem solid $color-text;
  border-left: 0.4rem solid $color-text;
  border-right: 0.4rem solid transparent;
  border-top: 0.4rem solid transparent;
}
</style>
