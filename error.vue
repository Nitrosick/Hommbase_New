<template>
  <div class="error">
    <div
      v-if="error && loaded"
      class="error-content"
    >
      <div
        class="error-hexes"
        :style="{ 'top': '1.5rem' }"
      />
      <div
        class="error-hexes"
        :style="{ 'bottom': '1.5rem' }"
      />
      <span
        v-if="error.statusCode"
        class="error-message"
      >
        {{ codesMap[error.statusCode] || error.message || t('error.unknown') }}
      </span>
      <span
        v-if="error.statusCode"
        class="error-code"
      >
        {{ error.statusCode }}
      </span>
      <Button
        :text="t('button.tomain')"
        @click="handleError"
      />
    </div>
  </div>
</template>

<script setup>
const error = useError();
const loaded = ref(false)
const i18n = useI18n()
const { t } = i18n
let codesMap = {}

onMounted(() => {
  const storageLang = localStorage.getItem('language')
  if (storageLang) i18n.locale.value = storageLang

  codesMap = {
    403: t('error.access'),
    404: t('error.notfound'),
    500: t('error.server'),
  }

  loaded.value = true
})

const handleError = () => {
  clearError({
    redirect: '/',
  });
};
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background-color: $color-outcontent;
  }

  &-hexes {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 30rem;
    height: 25vh;
    background: url(/images/common/hex-s.svg) 0 0 / 3.3rem auto repeat;

    @include breakpoint-sm {
      width: calc(100% - 3rem);
    }
  }

  &-code {
    font-family: $font-title;
    font-size: clamp(8rem, 24vw, 20rem);
    font-weight: 600;
    -webkit-text-stroke: 1px $color-background;
    color: $color-outcontent;
    line-height: 1;
  }

  &-message {
    font-weight: 600;
    text-align: center;
  }
}
</style>