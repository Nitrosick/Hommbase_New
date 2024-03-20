<template>
  <div
    class="objects-list"
    :class="{
      'objects-list-opened': opened,
      'objects-list-expanded': scroll > 0,
      'objects-list-left': side === 'left',
      'objects-list-right': side !== 'left'
    }"
  >
    <div class="objects-list-content">
      <button
        class="objects-list-close"
        @click.prevent="opened = false"
      >
        <Icon name="close" />
      </button>
      <div class="objects-list-filters">
        <slot name="filters" />
      </div>
      <div class="objects-list-slider">
        <details
          v-for="(value, key) in items"
          :key="key"
          open
        >
          <summary class="list-summary">
            {{ getGroupTitle(key) }}
          </summary>
          <div
            v-if="value.length"
            class="list-items"
          >
            <button
              v-for="item in value"
              :key="item.id"
              class="list-item"
              :class="{ 'list-item-selected': model && model.name_en === item.name_en }"
              @click.prevent="model = item; opened = false"
            >
              {{ firstUpper(item['name_' + locale]) }}
            </button>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'

const props = defineProps({
  side: { type: String, default: 'left' },
  items: { type: Object, required: true },
})

const { locale } = useI18n()
const scroll = useScroll()
const opened = ref(false)
const model = defineModel({ required: true })
const openList = () => { opened.value = true }

const getGroupTitle = (title) => {
  const splitted = title.split('/')
  return locale.value === 'ru' ? firstUpper(splitted[1]) : firstUpper(splitted[0])
}

defineExpose({ openList })
</script>

<style lang="scss" scoped>
.objects-list {
  height: 100%;
  background-color: $color-background;
  transition: padding-top 0.3s;

  &-content {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: $height-header;
    padding-top: 0;
    max-height: calc(100vh - $height-header * 2);
    transition: top 0.3s;

    @include breakpoint-lg {
      position: absolute;
      left: 0;
      width: 100%;
      max-height: calc(100vh - $height-header);
    }
  }

  &-filters {
    padding: 1.5rem;

    @include breakpoint-lg {
      padding-top: 2.5rem;
    }
  }

  &-slider {
    flex-grow: 1;
    overflow-y: auto;
  }

  &-close {
    display: none;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 1;

    @include breakpoint-lg {
      display: block;
    }
  }

  @include breakpoint-lg {
    position: fixed;
    top: 0;
    width: 50%;
    transition: transform 0.5s;
    border: $border-main;
    z-index: 9;
  }

  @include breakpoint-sm {
    width: 100%;
  }
}

.objects-list-left {
  border-right: $border-main;

  @include breakpoint-lg {
    left: 0;
    transform: translateX(-100%);
  }
}

.objects-list-right {
  border-left: $border-main;

  @include breakpoint-lg {
    right: 0;
    transform: translateX(100%);
  }
}

.objects-list-expanded {
  .objects-list-content {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }
}

.objects-list-opened {
  @include breakpoint-lg {
    transform: translateX(0);
  }
}

@include scrollbar;
</style>
