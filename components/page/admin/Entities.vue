<template>
  <div
    class="entities"
    :class="{ 'entities-opened': opened }"
  >
    <button
      class="entities-close"
      @click.prevent="opened = false"
    >
      <Icon name="close" />
    </button>
    <div class="entities-title">
      {{ title }}
    </div>
    <div
      v-if="data && data.length"
      class="entities-list"
    >
      <button
        v-for="item in data"
        :key="item.id"
        class="list-summary"
        :class="{ 'list-item-selected': selected.id === item.id }"
        @click.prevent="onSelect(item)"
      >
        {{ item['title_' + locale] ?? item.title }}
      </button>
    </div>
  </div>
  <button
    v-if="!opened"
    class="entities-open pop-button"
    @click.prevent="opened = true"
  >
    <Icon name="burger" />
  </button>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  data: { type: Array, required: true },
  selected: { type: Object, required: true }
})

const emit = defineEmits(['select'])
const { locale } = useI18n()
const opened = ref(true)

const onSelect = (item) => {
  emit('select', item)
  opened.value = false
}
</script>

<style lang="scss" scoped>
.entities {
  background-color: $color-background;
  border-right: $border-main;
  overflow-y: auto;

  &-title {
    padding: 1.5rem;
    font-weight: 600;
  }

  &-close {
    display: none;
    position: absolute;
    top: calc($height-header + 1rem);
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
    max-height: 100%;
    padding-top: $height-header;
    transform: translateX(-100%);
    transition: transform 0.5s;
    border: $border-main;
    z-index: 2;
  }

  @include breakpoint-md {
    width: 100%;
  }
}

.entities-opened {
  @include breakpoint-lg {
    transform: translateX(0);
  }
}

.entities-open {
  left: 0;

  @include breakpoint-lg {
    display: block;
  }
}

@include scrollbar;
</style>
