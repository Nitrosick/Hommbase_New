<template>
  <div
    class="channel"
    :class="{ 'channel-expanded': scroll > 0 }"
  >
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
        <div
          v-if="data.source === 'twitch'"
          class="channel-info-row"
        >
          <span
            v-if="streamUrl"
            class="channel-broadcast"
            v-html="$t('social.broadcast')"
          />
          <span
            v-else
            class="channel-no-broadcast"
            v-html="$t('social.nobroadcast')"
          />
        </div>
      </div>

      <Button
        :text="$t('label.tochannel')"
        :href="data.url"
        target="_blank"
      />
    </div>

    <a
      v-if="streamUrl"
      :href="data.url"
      target="_blank"
      class="channel-stream"
    >
      <img
        :src="streamUrl"
        alt="stream poster"
        loading="lazy"
      >
    </a>

    <p
      v-if="data"
      class="channel-description"
      v-html="description"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: null },
  data: { type: Object, default: null }
})

const { twitchClientId, twitchAuthToken } = useRuntimeConfig().public
const { t } = useI18n()
const scroll = useScroll()
const streamUrl = ref(null)

onMounted(() => {
  const { data } = props
  if (data && data.source === 'twitch') getStream(data.login)
})

watch(() => props.data, (val) => {
  if (val.source === 'twitch') getStream(val.login)
  else streamUrl.value = null
})

const description = computed(() => {
  const { data } = props
  if (!data || !data.description) return t('social.nodesc')
  return data.description
    .replaceAll('\n', ' <br> ')
    .replace(/(https?:\/\/([\w-]{1,32}\.[\w-]{1,32})[^\s@\(\)]*)/g, '<a href="$1" target="_blank">$1</a>')
    .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, '<a href="mailto:$1">$1</a>')
})

const getStream = async (login) => {
  try {
    const stream = await $fetch(`https://api.twitch.tv/helix/streams?user_login=${login}`, {
      headers: {
        Authorization: `Bearer ${twitchAuthToken}`,
        'client-id': twitchClientId
      }
    })

    const { data } = stream
    if (data.length) streamUrl.value = data[0].thumbnail_url
      .replace('{width}', 1280)
      .replace('{height}', 720)
    else streamUrl.value = null
  } catch (error) {
    console.error(error)
    streamUrl.value = null
  }
}
</script>

<style lang="scss" scoped>
.channel {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: $height-header;
  transition: padding-top 0.3s;

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

  &-icon {
    display: none;

    @include breakpoint-lg {
      display: block;
    }
  }

  &-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;

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

  &-stream {
    border-top: $border-main;
    background-color: $color-outcontent;
    height: 25rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-description {
    line-height: 1;
    padding: 1.5rem;
    font-size: $font-size-sm;
    border-top: $border-main;
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

.channel-expanded {
  padding-top: $height-header-m;
}
</style>
