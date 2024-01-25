<template>
  <div class="filters">
    <div
      class="filters-content"
      :class="{ 'filters-content-expanded': scroll > 0 }"
    >
      <div class="filters-items">
        <span class="filters-title">
          {{ $t('label.filters') }}
        </span>
        <slot name="filters" />
      </div>
      <div class="sorters-items">
        <span class="filters-title">
          {{ $t('label.sort') }}
        </span>
        <slot name="sorters" />
      </div>
      <div class="filters-control">
        <Button
          :text="$t('label.reset')"
          @click="$emit('reset')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const scroll = useScroll()
</script>

<style lang="scss" scoped>
.filters {
  height: 100%;
  padding-top: $height-header;
  border-right: $border-main;

  &-content {
    position: sticky;
    top: $height-header;
    max-height: calc(100vh - $height-header);
    overflow-y: auto;
    transition: top 0.3s;
  }

  &-content-expanded {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }

  &-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
}

.filters-items,
.filters-control,
.sorters-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
}

.sorters-items {
  border-top: $border-main;
  border-bottom: $border-main;
}
</style>
