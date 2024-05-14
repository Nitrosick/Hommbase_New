<template>
  <Spinner v-if="!data" />
  <div
    v-else
    class="admin"
    :class="{ 'admin-fullscreen': fullscreen }"
  >
    <Entities
      v-if="!fullscreen"
      :title="$t('editor.list')"
      :data="data"
      :selected="edited"
      agregator="category"
      @select="selectItem"
    />
    <div class="editor">
      <Spinner v-if="loading" />
      <form
        v-if="edited.id"
        @submit.prevent="onSubmit"
      >
        <div class="editor-main">
          <span
            class="editor-id"
            v-html="edited.id"
          />
          <LangSwitcher v-model="lang" />
          <div class="editor-image">
            <img
              :src="imageUrl"
              alt="object image"
              loading="lazy"
            >
          </div>

          <div class="editor-grid">
            <Input
              id="name"
              :label="$t('label.title')"
              placeholder="..."
              :required="true"
              :disabled="true"
              v-model="edited['name_' + lang]"
            />
            <Select
              id="category"
              :label="$t('parameters.category')"
              :options="categoryOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.category_id"
            />
            <Checkbox
              id="guarded"
              :label="$t('parameters.guarded')"
              :disabled="loading"
              v-model="edited.is_guarded"
            />
            <Checkbox
              id="tunable"
              :label="$t('parameters.tunable')"
              :disabled="loading"
              v-model="edited.is_tunable"
            />
          </div>

          <Textarea
            id="description"
            :label="$t('parameters.description')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 10 }"
            v-model="edited['description_' + lang]"
          />
        </div>

        <details class="editor-group">
          <summary class="editor-group-summary">
            {{ $t('label.schemes') }}
          </summary>
          <div class="schemes">
            <button
              v-for="item in options.schemes"
              :key="item.id"
              class="schemes-item"
              :class="{ 'schemes-item-selected': edited.scheme_id === item.id }"
              @click.prevent="edited.scheme_id = item.id"
            >
              <img
                v-if="item.name !== 'no-scheme'"
                :src="`/images/objects/scheme/${item.name}.png`"
                alt="object scheme"
                loading="lazy"
                class="schemes-item-img"
              >
              <Icon
                name="check"
                size="s"
                class="schemes-item-icon"
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
import Entities from '@/components/page/admin/Entities.vue'
import LangSwitcher from '@/components/page/admin/LangSwitcher.vue'

const {
  $api, $toast, fullscreen, me, t, data, loading, error, lang, edited, options,
  selectItem, getOptions
} = useAdmin()

definePageMeta({
  middleware: ['05-admin'],
  layout: 'admin'
})

onMounted(() => getData())

const getData = async () => {
  const [res1, err1] = await $api('objects')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('objects/options', null, true)
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }

  if (!res1.length) return

  const result = res1.map(item => ({
    ...item,
    is_guarded: Boolean(+item.is_guarded),
    is_tunable: Boolean(+item.is_tunable)
  }))

  data.value = result || null
  edited.value = result[0]
  options.value = res2 || null
}

const categoryOptions = computed(() => getOptions(options.value.categories))

const imageUrl = computed(() => {
  const fileName = edited.value.name_en.replace(/[\s?_-]/g, '')
  return `/images/objects/picture/${fileName}.${+edited.value.is_gif ? 'gif' : 'webp'}`
})

const onSubmit = async () => {
  const newData = { ...edited.value }
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true
  newData.is_guarded = !newData.is_guarded ? 0 : 1
  newData.is_tunable = !newData.is_tunable ? 0 : 1

  const [, err] = await $api('admin/objects/update', {
    token: me.token,
    data: newData
  })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  $toast(t('success.saved'), 5, 'success')
  loading.value = false
}

const checkInput = (data) => {
  if (!data) return false
  if (!data.description_en || !data.description_ru) {
    error.value = t('error.emptyfields')
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.editor-image {
  aspect-ratio: 1/1;
}

.schemes {
  border-top: 1px solid var(--color-grey-1);
  background-color: $color-outcontent;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1px;

  &-item {
    position: relative;
    aspect-ratio: 39/15;
    clip-path: $clip-path-tile;
    background-color: $color-background;
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
      top: 1rem;
      right: 1rem;
      filter: drop-shadow($shadow-offset $shadow-offset 0 $color-success-d);
    }
  }

  &-item-selected {
    pointer-events: none;
    filter: brightness(1.1);

    .schemes-item-icon {
      display: block;
    }
  }
}

@include scrollbar;
</style>
