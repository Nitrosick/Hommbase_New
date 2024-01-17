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
  top: -3px;
  left: -3px;
  border: 3px solid $color-text;
  min-height: 3.5rem;
  font-weight: 600;
  color: $color-text;
  padding: 0 2rem;
  overflow: hidden;
  white-space: nowrap;
  box-shadow: 3px 3px 0 0 $color-text;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--color-grey-1);
  }

  &:active {
    box-shadow: none;
    top: 0;
    left: 0;
  }

  @include breakpoint-sm {
    padding: 0 1rem;
  }
}

.button-link::after {
  position: absolute;
  content: '';
  right: 3px;
  top: 3px;
  border-top: 0.4rem solid $color-text;
  border-right: 0.4rem solid $color-text;
  border-left: 0.4rem solid transparent;
  border-bottom: 0.4rem solid transparent;
}

.button-download::after {
  position: absolute;
  content: '';
  left: 3px;
  bottom: 3px;
  border-bottom: 0.4rem solid $color-text;
  border-left: 0.4rem solid $color-text;
  border-right: 0.4rem solid transparent;
  border-top: 0.4rem solid transparent;
}
</style>
