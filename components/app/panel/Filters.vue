<template>
  <div
    class="filters"
    :class="{ 'filters-opened': opened }"
  >
    <div
      class="filters-content"
      :class="{ 'filters-content-expanded': scroll > 0 }"
    >
      <button
        class="filters-close"
        @click.prevent="opened = false"
      >
        <Icon name="close" />
      </button>
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
        <slot name="control" />
      </div>
    </div>
  </div>
  <button
    v-if="!opened"
    class="filters-open"
    @click.prevent="opened = true"
  >
    <Icon name="filters" />
  </button>
</template>

<script setup>
const emits = defineEmits(['reset'])
const scroll = useScroll()
const opened = ref(false)
</script>

<style lang="scss" scoped>
.filters {
  height: 100%;
  padding-top: $height-header;
  border-right: $border-main;
  background-color: $color-background;

  &-content {
    position: sticky;
    top: $height-header;
    max-height: calc(100vh - $height-header);
    overflow-y: auto;
    transition: top 0.3s;

    @include breakpoint-lg {
      position: absolute;
      left: 0;
      width: 100%;
    }
  }

  &-content-expanded {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }

  &-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &-close {
    display: none;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;

    @include breakpoint-lg {
      display: block;
    }
  }

  ::-webkit-scrollbar {
    width: 0.2rem;
    height: 0.2rem;
    background-color: $color-background;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-1);
    border: none;
  }

  @include breakpoint-lg {
    position: fixed;
    left: 0;
    top: 0;
    width: 50vw;
    transform: translateX(-100%);
    transition: transform 0.5s;
    border: $border-main;
    z-index: 1;
  }

  @include breakpoint-md {
    width: 100%;
  }
}

.filters-opened {
  @include breakpoint-lg {
    transform: translateX(0);
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

.filters-control {
  gap: 1rem;
}

.sorters-items {
  border-top: $border-main;
  border-bottom: $border-main;
}

.filters-open {
  display: none;
  position: fixed;
  left: 0;
  bottom: 25vh;
  height: 5rem;
  width: 5rem;
  border: $border-main;
  background-color: $color-background;
  transition: background-color 0.3s, transform 0.5s;
  z-index: 8;

  &:hover,
  &:focus {
    background-color: var(--color-grey-2);
  }

  @include breakpoint-lg {
    display: block;
  }
}
</style>
