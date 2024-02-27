<template>
  <nav
    class="toc"
    :class="{
      'toc-opened': opened,
      'toc-expanded': scroll > 0
    }"
  >
    <div class="toc-content">
      <button
        class="toc-close"
        @click.prevent="opened = false"
      >
        <Icon name="close" />
      </button>
      <details
        class="toc-settings"
      >
        <summary class="toc-title">
          {{ $t('label.settings') }}
        </summary>
        <div class="toc-settings-content">
          <slot name="settings" />
        </div>
      </details>
      <details
        v-if="titles.length"
        class="toc-items"
        open
      >
        <summary class="toc-title">
          {{ $t('label.toc') }}
        </summary>
        <div class="toc-items-search">
          <slot name="toc" />
        </div>
        <div
          v-for="title in titles"
          :key="`title:${title.id}`"
        >
          <details
            v-if="title.sub.length > 1"
            :open="title.open"
          >
            <summary class="list-summary">
              {{ title[locale] }}
              <span class="toc-count">
                {{ title.sub.length }}
              </span>
            </summary>
            <div class="list-items">
              <button
                v-for="subtitle in title.sub"
                :key="`subtitle:${subtitle.id}`"
                class="list-item"
                :class="{ 'list-item-selected': selected.alias === subtitle.alias }"
                @click.prevent="onSelect(subtitle)"
              >
                {{ subtitle['title_' + locale] }}
              </button>
            </div>
          </details>
          <button
            v-else
            class="list-summary"
            :class="{ 'list-item-selected': selected.alias === title.sub[0].alias }"
            @click.prevent="onSelect(title.sub[0])"
          >
            {{ title.sub[0]['title_' + locale] }}
          </button>
        </div>
      </details>
    </div>
  </nav>
  <button
    v-if="!opened"
    class="toc-open pop-button"
    @click.prevent="opened = true"
  >
    <Icon name="burger" />
  </button>
</template>

<script setup>
const props = defineProps({
  titles: { type: Array, required: true },
  selected: { type: Object, required: true }
})

const emit = defineEmits(['select'])
const { locale } = useI18n()
const scroll = useScroll()
const opened = ref(true)

const onSelect = (item) => {
  emit('select', item)
  opened.value = false
}
</script>

<style lang="scss" scoped>
.toc {
  height: 100%;
  padding-top: $height-header;
  border-right: $border-main;
  background-color: $color-background;
  transition: padding-top 0.3s;
  direction: rtl;

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
    padding: 1.5rem;
  }

  &-settings,
  &-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-bottom: $border-main;
    direction: ltr;

    &-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.5rem;
      padding-top: 0;
    }

    &-search {
      padding: 0 1.5rem 0.5rem 1.5rem;
    }
  }

  &-count {
    font-weight: 600;
    font-size: $font-size-sm;
    color: var(--color-grey-1);
  }

  &-close {
    display: none;
    position: absolute;
    top: 1rem;
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
    z-index: 2;
  }

  @include breakpoint-md {
    width: 100%;
  }
}

.toc-expanded {
  padding-top: $height-header-m;

  .toc-content {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }
}

.toc-opened {
  @include breakpoint-lg {
    transform: translateX(0);
  }
}

.toc-open {
  left: 0;

  @include breakpoint-lg {
    display: block;
  }
}

.list-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

@include scrollbar;
</style>
