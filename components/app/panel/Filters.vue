<template>
  <div
    class="filters"
    :class="{
      'filters-opened': opened,
      'filters-expanded': scroll > 0
    }"
  >
    <div class="filters-content">
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
          @btn-click="$emit('reset')"
        />
        <slot name="control" />
      </div>
    </div>
  </div>
  <button
    v-if="!opened"
    class="filters-open pop-button"
    @click.prevent="opened = true"
  >
    <Icon name="filters" />
  </button>
</template>

<script setup>
const emit = defineEmits(['reset'])
const scroll = useScroll()
const opened = ref(false)
</script>

<style lang="scss" scoped>
.filters {
  height: 100%;
  padding-top: $height-header;
  border-right: $border-main;
  background-color: $color-background;
  transition: padding-top 0.3s;

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

.filters-expanded {
  padding-top: $height-header-m;

  .filters-content {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
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
  left: 0;

  @include breakpoint-lg {
    display: block;
  }
}

@include scrollbar;
</style>
