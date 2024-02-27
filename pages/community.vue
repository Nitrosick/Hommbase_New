<template>
  <div class="community">
    <div
      class="youtube"
      :class="{ 'youtube-expanded': scroll > 0 }"
    >
      <Spinner v-if="!data" />
      <nav
        v-else
        class="youtube-channels"
        :class="{ 'youtube-channels-opened': listOpened }"
      >
        <div class="youtube-channels-header">
          <div>{{ $t('social.channels') }}</div>
          <button
            class="youtube-channels-close"
            @click.prevent="listOpened = false"
          >
            <Icon name="close" />
          </button>
        </div>

        <button
          v-for="item in data"
          :key="item.id"
          class="list-item"
          :class="{ 'list-item-selected': item === selected }"
          @click.prevent="onSelect(item)"
        >
          <img
            :src="item.snippet.thumbnails.default.url"
            alt="channel logo"
            class="youtube-channels-logo"
            loading="lazy"
          >
          <span v-html="getTitle(item)" />
        </button>
      </nav>

      <ChannelInfo
        :title="getTitle(selected)"
        :data="selected"
        @open="listOpened = true"
      />
    </div>

    <Trailer />

    <div class="links">
      <Links
        :title="$t('social.external')"
        :list="links"
      />
      <Links
        :title="$t('social.soft')"
        :list="soft"
      />
    </div>
  </div>
</template>

<script setup>
import { channels, parts, links, soft } from '@/const/communities'
import Spinner from '@/components/app/Spinner.vue'
import ChannelInfo from '@/components/page/community/ChannelInfo.vue'
import Trailer from '@/components/page/community/Trailer.vue'
import Links from '@/components/page/community/Links.vue'

const { projectTitle, youtubeApi, apiKey } = useRuntimeConfig().public
const ids = computed(() => channels.join(','))
const part = computed(() => parts.join(','))

const { data, pending } = await useAsyncData('youtube',
  async () => {
    try {
      const result = await $fetch(`${youtubeApi}?part=${part.value}&key=${apiKey}&id=${ids.value}`)
      const { items } = result
      if (items && items.length) return items.sort((a, b) => b.statistics.subscriberCount - a.statistics.subscriberCount)
    } catch (error) {
      console.error(error)
      return null
    }
  }
)

const router = useRouter()
const { query } = useRoute()
const { t } = useI18n()
const scroll = useScroll()
const selected = ref(null)
const listOpened = ref(false)

useHead({ title: () => `${t('menu.community')} | ${projectTitle}` })

onMounted(async () => {
  if (!data.value) return
  if (query.id) {
    for (const item of data.value) {
      if (item.id === query.id) {
        onSelect(item)
        return
      }
    }
  } else {
    onSelect(data.value[0])
  }
})

const onSelect = (item) => {
  selected.value = item
  listOpened.value = false
  router.replace({ query: { id: item.id } })
}

const getTitle = (item) => {
  if (!item) return ''
  const text = item.snippet?.title || null
  if (!text) return ''
  return text
    .replaceAll('_', ' ')
    .replace('VOODOOSH HIGHLIGHTS', 'Voodoosh Highlights')
    .replace('GOMUNGULS HEROES III (v.3)', 'Gomunguls Heroes III')
}
</script>

<style lang="scss" scoped>
.youtube {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  min-height: 50vh;
  border: $border-main;
  padding-top: calc($height-header - $width-border);
  background-color: $color-background;
  transition: padding-top 0.3s;

  &-channels {
    border-right: $border-main;
    padding-bottom: 1.5rem;
    background-color: $color-background;
    overflow-y: auto;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
    }

    &-logo {
      width: 3.5rem;
      clip-path: $clip-path-tile;
    }

    &-close {
      display: none;

      @include breakpoint-md {
        display: block;
      }
    }

    @include breakpoint-md {
      position: absolute;
      height: 100%;
      width: 50%;
      padding-top: calc($height-header - $width-border);
      z-index: 2;
      transform: translateX(-100%);
      transition: padding-top 0.3s, transform 0.5s;
    }
  }

  &-channels-opened {
    transform: translateX(0);
  }

  @include breakpoint-md {
    grid-template-columns: 1fr;
  }
}

.youtube-expanded {
  padding-top: calc($height-header-m - $width-border);

  .youtube-channels {
    @include breakpoint-md {
      padding-top: calc($height-header-m - $width-border);
    }
  }
}

.links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $width-border;
  min-height: 50vh;
  border: $border-main;
  border-bottom: none;
  background-color: var(--color-grey-1);

  @include breakpoint-lg {
    grid-template-columns: 1fr;
  }
}

.list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: $font-size-md;
  padding: 1px 1.5rem;
}

@include scrollbar;
</style>
