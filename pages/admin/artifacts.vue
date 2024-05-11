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
      agregator="slot"
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
              alt="artifact image"
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
            <Select
              id="level"
              :label="$t('parameters.level')"
              :options="levelOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.level_id"
            />
            <Select
              id="slot"
              :label="$t('parameters.slot')"
              :options="slotOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.slot_id"
            />
            <Input
              id="value"
              type="number"
              :label="$t('parameters.value')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 0.5 }"
              v-model="edited.value"
            />
            <Input
              id="set"
              type="number"
              :label="$t('parameters.set') + ' (ID)'"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, max: data.length, step: 1 }"
              v-model="edited.set_id"
            />
          </div>

          <Cost
            :value="edited.cost"
            :title="$t('parameters.cost')"
            :disabled="loading"
            @update="value => edited.cost = value"
          />
          <Cost
            :value="edited.sale"
            :title="$t('parameters.sale')"
            :disabled="loading"
            @update="value => edited.sale = value"
          />

          <Textarea
            id="bonus"
            :label="$t('parameters.bonus')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 5 }"
            v-model="edited['bonus_' + lang]"
          />
        </div>

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
import Cost from '@/components/page/admin/Cost.vue'

const {
  $api, $toast, fullscreen, me, t, data, loading, error, lang, edited, options,
  selectItem, getOptions
} = useAdmin()

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

onMounted(() => getData())

const getData = async () => {
  const [res1, err1] = await $api('artifacts')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('artifacts/options', null, true)
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }

  if (!res1.length) return
  data.value = res1 || null
  edited.value = res1[0]
  options.value = res2 || null
}

const categoryOptions = computed(() => getOptions(options.value.categories))
const levelOptions = computed(() => getOptions(options.value.levels))
const slotOptions = computed(() => getOptions(options.value.slots))
const imageUrl = computed(() => `/images/artifacts/${edited.value.picture}.webp`)

const onSubmit = async () => {
  const newData = { ...edited.value }
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true

  const [, err] = await $api('admin/artifacts/update', {
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
  if (!data.bonus_en || !data.bonus_ru) {
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

@include scrollbar;
</style>
