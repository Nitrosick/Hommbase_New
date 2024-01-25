<template>
  <form
    class="search"
    :class="{ 'search-minimized': minimized }"
    @submit.prevent="onSubmit"
  >
    <input
      type="text"
      class="search-input"
      :placeholder="$t('label.search') + '...'"
      :disabled="loading"
      v-model="input"
    >
    <button
      v-if="!loading"
      class="search-submit"
      type="submit"
    >
      <Icon
        name="search"
        :size="minimized ? 's' : 'm'"
      />
    </button>
    <div
      v-else
      class="search-spinner"
    >
      <img
        src="/images/common/hex-m.svg"
        alt="loader"
        class="search-spinner-img"
      >
    </div>
  </form>
</template>

<script setup>
import { associations } from '@/const/associations'

const props = defineProps({
  minimized: { type: Boolean, default: false }
})

const { t } = useI18n()
const { $api, $toast } = useNuxtApp()
const loading = ref(false)
const input = ref(null)

const onSubmit = async () => {
  if (!input.value) return

  loading.value = true

  for (const key in associations) {
    const coincidence = associations[key].find(el => prepareString(el) === prepareString(input.value))

    if (coincidence) {
      input.value = null
      loading.value = false
      return navigateTo({ path: `/${key}` })
    }
  }

  const [res, err] = await $api('all', null, true)

  if (err) {
    console.error(err)
    loading.value = false
    return
  }

  const str = prepareString(input.value)
  for (const item of res) {
    if (!item.ru || !item.en) continue
    if (prepareString(item.ru).includes(str) || prepareString(item.en).includes(str)) {
      input.value = null
      loading.value = false
      return navigateTo({ path: `/${item.section}`, query: { alias: item.en } })
    }
  }

  $toast(t('error.search'), 5, 'error')
  loading.value = false
}

const prepareString = (str) => {
  return str.toLowerCase().replaceAll(/[^а-яёА-ЯЁa-zA-Z]/g, '')
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  height: 100%;
  border-left: $border-main;
  transition: background-color 0.3s;

  &-input {
    height: 100%;
    padding-left: 1.5rem;
  }

  &-submit,
  &-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 1.5rem 0 0.5rem;
  }

  &-spinner-img {
    width: 2rem;
    animation: roll 3s infinite linear;
  }

  @keyframes roll {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  &:has(.search-submit:hover) {
    background-color: var(--color-grey-2);
  }

  @include breakpoint-md {
    border: none;

    &-input {
      width: 100%;
      padding: 1rem;
    }

    &-submit {
      padding: 0 2rem;
    }
  }
}
</style>
