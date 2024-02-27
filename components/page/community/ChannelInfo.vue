<template>
  <div class="channel">
    <div
      v-if="data"
      class="channel-banner"
    >
      <img
        :src="data.brandingSettings.image.bannerExternalUrl"
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
        class="channel-banner-lang"
        v-html="data.snippet.country"
      />
    </div>

    <div
      v-if="data"
      class="channel-info"
    >
      <div>
        <div class="channel-info-row">
          <span
            class="channel-info-title"
            v-html="$t('social.subscribers') + ': '"
          />
          <span
            v-html="(+data.statistics.subscriberCount).toLocaleString('ru')"
          />
        </div>
        <div class="channel-info-row">
          <span
            class="channel-info-title"
            v-html="$t('social.videoscount') + ': '"
          />
          <span
            v-html="(+data.statistics.videoCount).toLocaleString('ru')"
          />
        </div>
        <div class="channel-info-row">
          <span
            class="channel-info-title"
            v-html="$t('social.views') + ': '"
          />
          <span v-html="(+data.statistics.viewCount).toLocaleString('ru')" />
        </div>
        <div class="channel-info-row">
          <span
            class="channel-info-title"
            v-html="$t('social.channeldate') + ': '"
          />
          <span v-html="$dayjs(data.snippet.publishedAt).format('DD.MM.YYYY')" />
        </div>
      </div>

      <Button
        :text="$t('label.tochannel')"
        :href="`https://www.youtube.com/${data.snippet.customUrl}/featured`"
        target="_blank"
      />
    </div>

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

const description = computed(() => {
  if (!props.data) return ''
  const text = props.data.snippet?.description || null
  if (!text) return ''
  return text
    .replaceAll('\n', ' <br> ')
    .replace(/((https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@\(\)]*)/g, '<a href="$1" target="_blank">$1</a>')
})
</script>

<style lang="scss" scoped>
.channel {
  display: flex;
  flex-direction: column;
  position: relative;

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

    @include breakpoint-md {
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

  &-description {
    padding: 1.5rem;
    font-size: $font-size-sm;
    border-top: $border-main;
    word-wrap: break-word;

    & ::v-deep(a) {
      color: $color-primary;
      word-break: break-all;
    }
  }
}
</style>
