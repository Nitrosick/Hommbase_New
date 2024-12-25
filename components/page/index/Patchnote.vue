<template>
  <div class="patchnote">
    <Spinner v-if="loading" />
    <p
      v-else-if="!error"
      class="patchnote-content"
      v-html="prepare(patchnote[locale])"
    />
    <div
      v-else
      class="patchnote-error"
    >
      {{ $t('error.updates') }}
    </div>
  </div>
</template>

<script setup>
import Spinner from '@/components/app/Spinner.vue';

const { locale } = useI18n()
const { $api } = useNuxtApp()

const patchnote = ref('')
const error = ref(false)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  const [res, err] = await $api('updates', null, true)
  if (err) error.value = true
  else patchnote.value = res
  loading.value = false
})

const prepare = (raw) => {
  if (!raw) return ''
  return raw
    .replaceAll('\r\n\r\n\r\n\r\n', '<hr>')
    .replaceAll('\n', '<br>')
    .replace(/(\d{1}\.\d{1}.*->.*\(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{4}\))/g, '<b>$1</b>')
    .replaceAll('[+]', '<mark class="added">+</mark>')
    .replaceAll('[-]', '<mark class="removed">-</mark>')
    .replaceAll('[!]', '<mark class="alert">!</mark>')
    .replaceAll('[ ]', '<mark></mark>')
    .substring(0, 5000) + '...'
}
</script>

<style lang="scss" scoped>
.patchnote {
  position: relative;
  border: $border-main;
  border-right: none;
  width: 100%;
  max-height: 80vh;
  flex-grow: 1;
  background-color: $color-background;
  margin-bottom: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;

  &-content,
  &-error {
    padding: 4rem;
    padding-right: 8rem;

    ::v-deep() {
      mark {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        height: 1rem;
        aspect-ratio: 1/1;
        background-color: var(--color-grey-1);
      }

      .added {
        background-color: $color-success;
        color: $color-success-d;
      }

      .removed {
        background-color: $color-alarm;
        color: $color-alarm-d;
      }

      .alert {
        background-color: $color-primary;
        color: var(--color-gold-3);
      }
    }

    @include breakpoint-xl {
      padding: 1.5rem;
    }

    @include breakpoint-md {
      font-size: $font-size-sm;
    }

    @include breakpoint-sm {
      word-break: break-all;
    }
  }

  &-error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
  }
}
</style>
