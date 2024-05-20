<template>
  <div class="channel">
    <div
      v-if="data"
      class="channel-banner"
    >
      <img
        v-if="data.banner"
        :src="data.banner"
        alt="channel banner"
        class="channel-banner-img"
        loading="lazy"
      >
      <div class="channel-banner-overlay" />
      <button
        class="channel-open"
        @click.prevent="$emit('open')"
      >
        <Icon
          name="burger"
          class="channel-icon"
        />
        <h2
          class="channel-banner-title"
          v-html="title"
        />
      </button>
      <h3
        v-if="data.lang"
        class="channel-banner-lang"
        v-html="data.lang"
      />
    </div>

    <div
      v-if="data"
      class="channel-info"
    >
      <div>
        <div
          v-if="data.subscribers"
          class="channel-info-row"
        >
          <span
            class="channel-info-title"
            v-html="$t('social.subscribers') + ': '"
          />
          <span
            v-html="data.subscribers.toLocaleString('ru')"
          />
        </div>
        <div
          v-if="data.videos"
          class="channel-info-row"
        >
          <span
            class="channel-info-title"
            v-html="$t('social.videoscount') + ': '"
          />
          <span
            v-html="data.videos.toLocaleString('ru')"
          />
        </div>
        <div
          v-if="data.views"
          class="channel-info-row"
        >
          <span
            class="channel-info-title"
            v-html="$t('social.views') + ': '"
          />
          <span v-html="data.views.toLocaleString('ru')" />
        </div>
        <div
          v-if="data.date"
          class="channel-info-row"
        >
          <span
            class="channel-info-title"
            v-html="$t('social.channeldate') + ': '"
          />
          <span v-html="$dayjs(data.date).format('DD.MM.YYYY')" />
        </div>
      </div>

      <Button
        :text="$t('label.tochannel')"
        :href="data.url"
        target="_blank"
      />
    </div>

    <div class="channel-groups">
      <InfoGroup
        :title="$t('social.videos')"
        :open="true"
      >
        <div
          v-if="videos.length"
          class="channel-videos"
        >
          <a
            v-for="video in videos"
            :key="video.id"
            :href="video.url"
            target="_blank"
            data-aos="video"
            data-aos-duration="700"
            class="channel-videos-item"
          >
            <img
              :src="video.banner"
              alt="video banner"
              loading="lazy"
            >
            <span
              class="channel-videos-title"
              v-html="video.title"
            />
          </a>
        </div>
      </InfoGroup>

      <InfoGroup
        :title="$t('menu.description')"
        :disabled="!description"
      >
        <p
          v-if="description"
          class="channel-description"
          v-html="description"
        />
      </InfoGroup>

      <InfoGroup
        v-if="data"
        :title="$t('social.broadcast')"
        :disabled="!data.live"
        :open="data.live"
      >
        <a
          v-if="data.live"
          :href="data.url"
          target="_blank"
          class="channel-stream"
        >
          <img
            :src="data.streamBanner"
            alt="stream poster"
            class="channel-stream-image"
            loading="lazy"
          >
          <Icon
            name="play"
            size="l"
            class="channel-stream-icon"
          />
        </a>
      </InfoGroup>
    </div>
  </div>
</template>

<script setup>
import InfoGroup from '@/components/page/community/InfoGroup.vue'

const props = defineProps({
  title: { type: String, default: null },
  data: { type: Object, default: null }
})

const { youtubeApi, googleApiKey, twitchClientId, twitchAuthToken } = useRuntimeConfig().public
const videos = ref([])

onMounted(() => {
  const { data } = props
  if (!data) return
  else getVideos(data.id)
})

watch(() => props.data, (val) => { getVideos(val.id) })

const description = computed(() => {
  const { data } = props
  if (!data || !data.description) return null
  return data.description
    .replaceAll('\n', ' <br> ')
    .replace(/(https?:\/\/([\w-]{1,32}\.[\w-]{1,32})[^\s@\(\)]*)/g, '<a href="$1" target="_blank">$1</a>')
    .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, '<a href="mailto:$1">$1</a>')
})

const getVideos = async (id) => {
  const { source } = props.data
  let items = []

  try {
    if (source === 'youtube') {
      const result = await $fetch(`${youtubeApi}/search?key=${googleApiKey}&channelId=${id}&part=snippet,id&order=date&maxResults=3`)
      if (result) items = result.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet?.title || null,
        banner: item.snippet?.thumbnails?.medium?.url || null,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }))
    }
    if (source === 'twitch') {
      const result = await $fetch(`https://api.twitch.tv/helix/videos?user_id=${id}&first=3`, {
        headers: {
          Authorization: `Bearer ${twitchAuthToken}`,
          'client-id': twitchClientId
        }
      })
      if (result) items = result.data.map(item => ({
        id: item.id,
        title: item.title || null,
        banner: item.thumbnail_url
          .replace('%{width}', 1280)
          .replace('%{height}', 720),
        url: item.url
      }))
    }
  } catch (error) {
    console.error(error)
  }

  videos.value = items
}
</script>

<style lang="scss" scoped>
.channel {
  display: flex;
  flex-direction: column;
  position: relative;
  transition: padding-top 0.3s;
  overflow: hidden;

  &-banner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    aspect-ratio: 25/4;
    border-bottom: $border-main;

    &-img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.6);
    }

    &-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(/images/common/overlay-line.png);
    }

    &-lang {
      position: relative;
      z-index: 1;
      margin: 1.5rem;
    }
  }

  &-open {
    position: relative;
    z-index: 1;
    margin: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;
    border-bottom: $border-main;

    &-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      line-height: 1.3;
    }

    &-title {
      font-weight: 600;
      color: var(--color-grey-1);
      font-size: $font-size-sm;
    }

    @include breakpoint-lg {
      flex-direction: column;
    }
  }

  &-groups {
    overflow-y: auto;
  }

  &-icon {
    display: none;

    @include breakpoint-lg {
      display: block;
    }
  }

  &-videos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
    border-top: 1px solid var(--color-grey-1);
    background-color: $color-outcontent;

    &-item {
      img {
        display: block;
        width: 100%;
        aspect-ratio: 16/9;
        background-color: var(--color-grey-1);
        clip-path: $clip-path-tile;
      }
    }

    &-title {
      display: block;
      font-size: $font-size-sm;
      text-align: center;
      margin-top: 0.5rem;
    }

    @include breakpoint-sm {
      grid-template-columns: 1fr;
    }
  }

  &-stream {
    display: block;
    position: relative;
    border-top: 1px solid var(--color-grey-1);
    background-color: $color-outcontent;
    height: 30rem;

    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    @include breakpoint-md {
      height: 20rem;
    }
  }

  &-description {
    line-height: 1;
    padding: 1.5rem;
    padding-top: 0;
    font-size: $font-size-sm;
    word-wrap: break-word;

    & ::v-deep(a) {
      color: $color-primary;
      word-break: break-all;
    }
  }

  &-broadcast {
    color: $color-primary;
  }

  &-no-broadcast {
    color: var(--color-grey-1);
    font-size: $font-size-sm;
    font-weight: 600;
  }
}

/* Animations */
[data-aos="video"] {
  transform: scale(0.9);
  opacity: 0;
  transition-property: transform, opacity;

  &.aos-animate {
    transform: scale(1);
    opacity: 1;
  }
}

@include scrollbar;
</style>
