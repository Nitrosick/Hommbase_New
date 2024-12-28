<template>
  <div class="community">
    <div
      v-if="data"
      class="channels"
      :class="{ 'channels-expanded': scroll > 0 }"
    >
      <nav
        v-if="data.length"
        class="channels-list"
        :class="{ 'channels-list-opened': listOpened }"
      >
        <div class="channels-header">
          <div v-if="youtube.length">
            {{ $t('social.youtubechannels') }}
          </div>
          <button
            class="channels-close"
            @click.prevent="listOpened = false"
          >
            <Icon name="close" />
          </button>
        </div>

        <button
          v-for="item in youtube"
          :key="item.id"
          class="list-item"
          :class="{ 'list-item-selected': item === selected }"
          @click.prevent="onSelect(item)"
        >
          <img
            v-if="item.avatar"
            :src="item.avatar"
            onerror="this.src='/images/team/unknown.webp'"
            alt="channel logo"
            class="channels-logo"
            loading="lazy"
          >
          <span v-html="getTitle(item)" />
        </button>

        <div
          v-if="twitch.length"
          class="channels-header"
        >
          <div>{{ $t('social.twitchchannels') }}</div>
        </div>

        <button
          v-for="item in twitch"
          :key="item.id"
          class="list-item"
          :class="{ 'list-item-selected': item === selected }"
          @click.prevent="onSelect(item)"
        >
          <img
            v-if="item.avatar"
            :src="item.avatar"
            alt="channel logo"
            class="channels-logo"
            loading="lazy"
          >
          <span
            class="list-item-value"
            v-html="getTitle(item)"
          />
          <div
            v-if="item.live"
            class="channels-rec"
          />
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

    <Creativity />
  </div>
</template>

<script setup>
import { seo } from '@/const/seo'
import { firstUpper } from '@/utils/string'
import { youtubeChannels, twitchChannels, parts, links, soft } from '@/const/communities'
import ChannelInfo from '@/components/page/community/ChannelInfo.vue'
import Trailer from '@/components/page/community/Trailer.vue'
import Links from '@/components/page/community/Links.vue'
import Creativity from '@/components/page/community/Creativity.vue'

const { projectTitle, youtubeApi, googleApiKey, twitchClientId, twitchAuthToken } = useRuntimeConfig().public
const youtubeIds = computed(() => youtubeChannels.join(','))
const twitchIds = computed(() => twitchChannels.map(item => `id=${item}`).join('&'))
const streamIds = computed(() => twitchChannels.map(item => `user_id=${item}`).join('&'))
const part = computed(() => parts.join(','))

const { data, pending } = await useAsyncData('channels',
  async () => {
    const headers = {
      Authorization: `Bearer ${twitchAuthToken}`,
      'client-id': twitchClientId
    }

    const result = []

    try {
      const youtube = await $fetch(`${youtubeApi}/channels?part=${part.value}&key=${googleApiKey}&id=${youtubeIds.value}`)
      const streams = await $fetch(`${youtubeApi}/search?part=snippet&key=${googleApiKey}&channelId=${youtubeIds.value}&type=video&eventType=live`)

      const { items } = youtube
      let youtubeData = []

      if (items && items.length) {
        youtubeData = items.map(item => {
          let stream = null
          let banner = null
          if (streams.items && streams.items.length) stream = streams.items.find(s => s.snippet.channelId === item.id)
          if (stream) banner = stream.snippet.thumbnails.high.url

          return {
            source: 'youtube',
            id: item.id,
            title: item.snippet?.title || null,
            description: item.snippet?.description || null,
            url: `https://www.youtube.com/${item.snippet?.customUrl || '#'}/featured`,
            date: item.snippet?.publishedAt || null,
            avatar: item.snippet?.thumbnails?.default?.url || null,
            lang: item.snippet?.country || null,
            views: +item.statistics?.viewCount || 0,
            subscribers: +item.statistics?.subscriberCount || 0,
            videos: +item.statistics?.videoCount || 0,
            banner: item.brandingSettings?.image?.bannerExternalUrl || null,
            live: !!stream,
            streamBanner: banner
          }
        })
      }

      result.push(...youtubeData.sort((a, b) => b.subscribers - a.subscribers))
    } catch (error) {
      console.error(error)
    }

    try {
      const twitch = await $fetch(`https://api.twitch.tv/helix/users?${twitchIds.value}`, { headers })
      const streams = await $fetch(`https://api.twitch.tv/helix/streams?${streamIds.value}`, { headers })

      const { data } = twitch
      let twitchData = []

      if (data && data.length) {
        twitchData = data.map(item => {
          let stream = null
          let banner = null
          if (streams.data && streams.data.length) stream = streams.data.find(s => s.user_id === item.id)
          if (stream) banner = stream.thumbnail_url
            .replace('{width}', 1280)
            .replace('{height}', 720)

          return {
            source: 'twitch',
            id: item.id,
            title: item.display_name || null,
            description: item.description || null,
            url: `https://www.twitch.tv/${item.login || '#'}`,
            date: item.created_at || null,
            avatar: item.profile_image_url || null,
            views: +item.view_count || 0,
            banner: item.offline_image_url || null,
            live: !!stream,
            streamBanner: banner
          }
        })
      }

      result.push(...twitchData)
    } catch (error) {
      console.error(error)
    }

    return result
  },
  { initialCache: false }
)

const router = useRouter()
const { query } = useRoute()
const { t } = useI18n()
const scroll = useScroll()
const selected = ref(null)
const listOpened = ref(false)

useHead({ title: () => `${t('menu.community')} | ${projectTitle}` })
useSeoMeta(seo.community)

onMounted(async () => {
  if (!data.value || !data.value.length) return
  if (query.id) {
    for (const item of data.value) {
      if (item.id === query.id) return onSelect(item)
    }
  } else {
    onSelect(data.value[0])
  }
})

const youtube = computed(() => data.value.filter(item => item.source === 'youtube'))
const twitch = computed(() => data.value.filter(item => item.source === 'twitch'))

const onSelect = (item) => {
  selected.value = item
  listOpened.value = false
  router.replace({ query: { id: item.id } })
}

const getTitle = (item) => {
  if (!item || !item.title) return ''
  return firstUpper(
    item.title
      .replaceAll('_', ' ')
      .replace('VOODOOSH HIGHLIGHTS', 'Voodoosh Highlights')
      .replace('GOMUNGULS HEROES III (v.3)', 'Gomunguls Heroes III')
  )
}
</script>

<style lang="scss" scoped>
.channels {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  height: calc(100vh - $height-header);
  border: $border-main;
  border-top: none;
  background-color: $color-background;
  overflow: hidden;

  &-list {
    border-right: $border-main;
    padding-bottom: 1.5rem;
    height: 100%;
    background-color: $color-background;
    transition: padding-top 0.3s, transform 0.5s;
    overflow-y: auto;

    @include breakpoint-lg {
      position: absolute;
      bottom: 0;
      width: 50%;
      z-index: 2;
      transform: translateX(-100%);
    }

    @include breakpoint-md {
      width: 100%;
    }
  }

  &-list-opened {
    transform: translateX(0);
  }

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

    @include breakpoint-lg {
      display: block;
    }
  }

  &-rec {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: $color-alarm;
  }

  @include breakpoint-lg {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
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

  &-value {
    flex-grow: 1;
  }
}

@include scrollbar;
</style>
