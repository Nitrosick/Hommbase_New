<template>
  <details
    class="tiles-group"
    open
  >
    <summary class="tiles-group-title">
      <span>{{ getTitle }}</span>
      <Icon
        name="arrow-up"
        size="s"
        class="tiles-group-icon"
      />
    </summary>
    <div
      class="tiles-group-list"
      :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(${width}rem, 1fr))` }"
    >
      <slot />
    </div>
  </details>
</template>

<script setup>
import { firstUpper } from '@/utils/string'

const props = defineProps({
  summary: { type: String, required: true },
  width: { type: Number, default: 8 },
})

const { locale } = useI18n()

const getTitle = computed(() => {
  const titles = props.summary.split('/')
  return firstUpper(locale.value === 'ru' ? titles[1] : titles[0])
})
</script>

<style lang="scss" scoped>
.tiles-group {
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: $border-main;
    border-bottom: $border-main;
    background-color: $color-background;
    padding: 1.5rem;
    font-weight: 600;
    cursor: pointer;
  }

  &-icon {
    transform: rotate(180deg);
    transition: transform 0.3s;
  }

  &-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: 1px;
    padding: 1px 1px 0 1px;
  }
}

details[open] {
  .tiles-group-icon {
    transform: rotate(0);
  }
}
</style>
