<template>
  <aside
    class="sidebar"
    :class="{
      'sidebar-opened': opened,
      'sidebar-expanded': scroll > 0,
      'sidebar-left': side === 'left',
      'sidebar-right': side === 'right'
    }"
  >
    <div class="sidebar-content">
      <button
        class="sidebar-close"
        @click.prevent="opened = false"
      >
        <Icon name="close" />
      </button>
      <slot />
    </div>
  </aside>
  <button
    v-if="!opened && openIcon"
    class="sidebar-open pop-button"
    @click.prevent="opened = true"
  >
    <Icon :name="openIcon" />
  </button>
</template>

<script setup>
const props = defineProps({
  side: { type: String, default: 'left' },
  openIcon: { type: String, default: 'burger' }
})

const scroll = useScroll()
const opened = ref(false)
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
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

.sidebar-left {
  border-right: $border-main;
}

.sidebar-right {
  border-left: $border-main;
}

.sidebar-expanded {
  .sidebar-content {
    top: $height-header-m;
    max-height: calc(100vh - $height-header-m);
  }
}

.sidebar-opened {
  @include breakpoint-lg {
    transform: translateX(0);
  }
}

.sidebar-open {
  left: 0;

  @include breakpoint-lg {
    display: block;
  }
}

@include scrollbar;
</style>
