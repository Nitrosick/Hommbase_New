<template>
  <ul
    v-if="list.length"
    class="links-items"
  >
    <span class="links-title">
      {{ title }}
    </span>
    <li
      v-for="link in list"
      :key="link.id"
      class="links-item"
    >
      <a
        :href="link.url"
        target="_blank"
      >
        <span>{{ link.title[locale] }}</span>
        <div class="links-subtitle">
          {{ link.site }}
        </div>
      </a>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  list: { type: Array, required: true }
})

const { locale } = useI18n()
</script>

<style lang="scss" scoped>
.links-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  margin: 0;
  background-color: $color-background;
  height: 100%;
}

.links-title {
  margin-bottom: 1rem;
}

.links-subtitle {
  font-size: $font-size-sm;
  color: var(--color-grey-1);
  font-weight: 600;
  padding-left: 1.5rem;
}
</style>
