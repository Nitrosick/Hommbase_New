<template>
  <div
    class="preview"
    v-html="prepareHtml(data)"
  />
</template>

<script setup>
const props = defineProps({
  data: { type: String, required: true}
})

const prepareHtml = (raw) => {
  return raw
    .replaceAll('[m]', '<mark>')
    .replaceAll('[/m]', '</mark>')
    .replaceAll('[s]', '<b>')
    .replaceAll('[/s]', '</b>')
}
</script>

<style lang="scss" scoped>
.preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
  background-color: $color-text;
  color: $color-background;

  & ::v-deep() {
    p {
      text-indent: 2rem;
      padding: 0 1.5rem;
    }

    a, mark {
      font-weight: 600;
      color: var(--color-gold-2);
      background-color: transparent;
      text-shadow: 1px 1px 0 var(--color-gold-3);
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin: 0;
      padding: 0 1.5rem;
    }
  }
}
</style>
