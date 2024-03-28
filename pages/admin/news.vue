<template>
  <Spinner v-if="!data" />
  <div
    v-else
    class="admin"
    :class="{ 'admin-fullscreen': fullscreen }"
  >
    <div class="editor">
      <Spinner v-if="loading" />
      <form @submit.prevent="onSubmit">
        <div class="editor-main">
          <Input
            id="title-en"
            :label="$t('label.header') + ' EN'"
            placeholder="..."
            :required="true"
            :disabled="loading"
            v-model="data.title_en"
          />
          <Input
            id="title-ru"
            :label="$t('label.header') + ' RU'"
            placeholder="..."
            :required="true"
            :disabled="loading"
            v-model="data.title_ru"
          />
        </div>

        <details
          v-if="images"
          class="editor-group"
          open
        >
          <summary class="editor-group-summary">
            {{ $t('label.images') }}
          </summary>
          <div class="images">
            <button
              v-for="item in images"
              :key="item"
              class="images-item"
              :class="{ 'images-item-selected': data.image === item }"
              @click.prevent="data.image = item"
            >
              <img
                :src="`/images/news/${item}`"
                alt="news picture"
                loading="lazy"
                class="images-item-img"
              >
              <Icon
                name="check"
                class="images-item-icon"
              />
            </button>
          </div>
        </details>

        <div
          v-if="error"
          class="editor-error"
        >
          <Error :data="error" />
        </div>

        <div class="editor-control">
          <Button
            :text="$t('label.save')"
            type="submit"
            :disabled="loading"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import Spinner from '@/components/app/Spinner.vue'

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

const { $api, $toast } = useNuxtApp()
const fullscreen = useFullscreen()
const { projectTitle } = useRuntimeConfig().public
const { me } = useUserStore()
const { t } = useI18n()
const images = ref(null)
const loading = ref(false)
const error = ref(null)

const data = reactive({
  title_en: null,
  title_ru: null,
  image: null
})

useHead({ title: () => `${t('menu.admin')} | ${projectTitle}` })
onMounted(() => getData())
watch(data, () => { error.value = null })

const getData = async () => {
  const [res1, err1] = await $api('news')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('news/images')
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }

  data.title_en = res1.title_en
  data.title_ru = res1.title_ru
  data.image = res1.image
  images.value = res2 || null
}

const onSubmit = async () => {
  error.value = null
  loading.value = true

  const [, err] = await $api('admin/news/update', {
    token: me.token,
    ...data
  })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  $toast(t('success.saved'), 5, 'success')
  loading.value = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.editor {
  grid-column: 1/-1;
}

.images {
  border-top: 1px solid var(--color-grey-1);
  background-color: $color-outcontent;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1px;
  padding: 1px;

  &-item {
    position: relative;
    aspect-ratio: 2/1;
    clip-path: $clip-path-tile;
    filter: brightness(0.9);
    cursor: pointer;
    transition: filter 0.3s;

    &:hover {
      filter: brightness(1.1);
    }

    &-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-icon {
      display: none;
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      filter: drop-shadow($shadow-offset $shadow-offset 0 $color-success-d);
    }
  }

  &-item-selected {
    pointer-events: none;
    filter: brightness(1.1);

    .images-item-icon {
      display: block;
    }
  }
}

@include scrollbar;
</style>
