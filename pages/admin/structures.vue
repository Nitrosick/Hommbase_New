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
      agregator="town"
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
              alt="structure image"
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
              id="class"
              :label="$t('parameters.class')"
              :options="classOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.class_id"
            />
          </div>

          <Requirements
            :value="edited.requirements"
            :options="requirementOptions"
            :disabled="loading"
            @update="value => edited.requirements = value"
          />

          <Cost
            :value="edited.cost"
            :title="$t('parameters.cost')"
            :disabled="loading"
            @update="value => edited.cost = value"
          />

          <Textarea
            id="description"
            :label="$t('parameters.description')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 7 }"
            v-model="edited['description_' + lang]"
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
import Requirements from '@/components/page/admin/towns/Requirements.vue'

const {
  $api, $toast, fullscreen, me, t, locale, data, loading, error, lang, edited, options,
  selectItem, getOptions
} = useAdmin()

definePageMeta({
  middleware: ['05-admin'],
  layout: 'admin'
})

onMounted(() => getData())

const getData = async () => {
  const [res1, err1] = await $api('towns/structures')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('towns/options', null, true)
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }

  if (!res1.length) return

  data.value = res1 || null
  edited.value = res1[0]
  options.value = res2 || null
}

const classOptions = computed(() => getOptions(options.value.structure_classes))

const requirementOptions = computed(() => {
  const result = [...data.value].filter(item => {
    const val = edited.value
    return (val.town_id === item.town_id || item.town_id === '0') && val.id !== item.id
  })
  result.push({ id: 0, name_en: 'Water near the city', name_ru: 'Вода рядом с городом' })
  return result
})

const imageUrl = computed(() => {
  const current = edited.value
  const fileName = current.name_en.replace(/[^0-9a-zA-Z]/g, '')
  const town = current.town_id === '0' ? 'castle' : current.town_en
  return `/images/towns/structure/${town}/${fileName}.webp`
})

const onSubmit = async () => {
  const newData = { ...edited.value }
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true

  const [, err] = await $api('admin/structures/update', {
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
  aspect-ratio: 250/117;
}

@include scrollbar;
</style>
