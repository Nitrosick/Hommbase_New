<template>
  <div class="community">
    <div
      class="channels"
      :class="{ 'channels-expanded': scroll > 0 }"
    >
      <nav
        v-if="data && data.length"
        class="channels-list"
        :class="{ 'channels-list-opened': listOpened }"
      >
        <div class="channels-header">
          <div>{{ $t('social.youtubechannels') }}</div>
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
            alt="channel logo"
            class="channels-logo"
            loading="lazy"
          >
          <span v-html="getTitle(item)" />
        </button>

        <div class="channels-header">
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
import { firstUpper } from '@/utils/string'
import { youtubeChannels, twitchChannels, parts, links, soft } from '@/const/communities'
import ChannelInfo from '@/components/page/community/ChannelInfo.vue'
import Trailer from '@/components/page/community/Trailer.vue'
import Links from '@/components/page/community/Links.vue'

const { projectTitle, youtubeApi, googleApiKey, twitchClientId, twitchAuthToken } = useRuntimeConfig().public
const ids = computed(() => youtubeChannels.join(','))
const part = computed(() => parts.join(','))
const logins = computed(() => twitchChannels.map(item => `login=${item}`).join('&'))

const { data, pending } = await useAsyncData('channels',
  async () => {
    try {
      const youtube = await $fetch(`${youtubeApi}?part=${part.value}&key=${googleApiKey}&id=${ids.value}`)
      const twitch = await $fetch(`https://api.twitch.tv/helix/users?${logins.value}`, {
        headers: {
          Authorization: `Bearer ${twitchAuthToken}`,
          'client-id': twitchClientId
        }
      })

      const { items } = youtube
      const { data } = twitch

      let youtubeData = []
      let twitchData = []

      if (items && items.length) {
        youtubeData = items.map(item => ({
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
          banner: item.brandingSettings?.image?.bannerExternalUrl || null
        }))
      }

      if (data && data.length) {
        twitchData = data.map(item => ({
          source: 'twitch',
          id: item.id,
          login: item.login,
          title: item.display_name || null,
          description: item.description || null,
          url: `https://www.twitch.tv/${item.login || '#'}`,
          date: item.created_at || null,
          avatar: item.profile_image_url || null,
          views: +item.view_count || 0
        }))
      }

      return [
        ...youtubeData.sort((a, b) => b.subscribers - a.subscribers),
        ...twitchData
      ]
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
  if (!data.value || !data.value.length) return
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
  height: 100vh;
  border: $border-main;
  background-color: $color-background;
  overflow: hidden;

  &-list {
    border-right: $border-main;
    padding-top: $height-header;
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

  @include breakpoint-lg {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
  }
}

.channels-expanded {
  .channels-list {
    padding-top: $height-header-m;
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
