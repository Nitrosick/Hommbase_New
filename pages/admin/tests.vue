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
      agregator="theme"
      @select="selectItem"
    />
    <div class="editor">
      <Spinner v-if="loading" />
      <form @submit.prevent="onSubmit">
        <div class="editor-main">
          <span
            v-if="edited.id"
            class="editor-id"
            v-html="edited.id"
          />
          <LangSwitcher v-model="lang" />
          <Checkbox
            v-if="edited.id"
            id="activity"
            :label="$t('label.activity')"
            :disabled="loading"
            v-model="edited.is_active"
          />
          <Textarea
            id="question"
            :label="$t('label.question')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 5 }"
            v-model="edited['question_' + lang]"
          />

          <div class="editor-grid">
            <Input
              id="var-1"
              :label="$t('label.variant') + ' 1'"
              placeholder="..."
              :required="true"
              :disabled="loading"
              v-model="edited['var_1_' + lang]"
            />
            <Input
              id="var-2"
              :label="$t('label.variant') + ' 2'"
              placeholder="..."
              :required="true"
              :disabled="loading"
              v-model="edited['var_2_' + lang]"
            />
            <Input
              id="var-3"
              :label="$t('label.variant') + ' 3'"
              placeholder="..."
              :required="true"
              :disabled="loading"
              v-model="edited['var_3_' + lang]"
            />
            <Input
              id="var-4"
              :label="$t('label.variant') + ' 4'"
              placeholder="..."
              :required="true"
              :disabled="loading"
              v-model="edited['var_4_' + lang]"
            />
            <Select
              id="test"
              :label="$t('label.test')"
              :options="testOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.test_id"
            />
            <Select
              id="theme"
              :label="$t('label.theme')"
              :options="themeOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.theme_id"
            />
            <Select
              id="answer"
              :label="$t('label.rightanswer')"
              :options="{ 1: 1, 2: 2, 3: 3, 4: 4 }"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.right_var"
            />
          </div>
        </div>

        <div
          v-if="error"
          class="editor-error"
        >
          <Error :data="error" />
        </div>

        <div class="editor-control">
          <Button
            :text="edited.id ? $t('label.save') : $t('label.create')"
            type="submit"
            :disabled="loading"
          />
          <Button
            :text="$t('label.cancel')"
            :disabled="loading"
            @btn-click="reset"
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
  $api, $toast, fullscreen, me, t, data, loading, error, lang, options,
  getOptions
} = useAdmin()

definePageMeta({
  middleware: ['05-admin'],
  layout: 'admin'
})

const initial = {
  id: null,
  is_active: true,
  question_en: null,
  question_ru: null,
  test_id: 1,
  theme_id: 1,
  var_1_en: null,
  var_2_en: null,
  var_3_en: null,
  var_4_en: null,
  var_1_ru: null,
  var_2_ru: null,
  var_3_ru: null,
  var_4_ru: null,
  right_var: 1
}

const edited = ref({ ...initial })
const selected = ref({})

onMounted(() => getData())

const getData = async () => {
  const [res1, err1] = await $api('tests/all-questions', { token: me.token })
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('tests/options')
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }

  const result = res1.map(item => (
    { ...item, is_active: Boolean(+item.is_active) }
  ))

  data.value = result || []
  options.value = res2 || {}
}

const selectItem = (item) => {
  if (item === edited.value) return
  edited.value = item
}

const testOptions = computed(() => getOptions(options.value.tests))
const themeOptions = computed(() => getOptions(options.value.themes))

const onSubmit = async () => {
  const newData = { ...edited.value }
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true
  const path = `admin/tests/${newData.id ? 'update' : 'create'}`
  newData.is_active = !newData.is_active ? 0 : 1

  const [res, err] = await $api(path, {
    token: me.token,
    data: newData
  })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  if (!newData.id && res.id) {
    newData.id = res.id
    data.value.push(newData)
  }

  $toast(t('success.saved'), 5, 'success')
  loading.value = false
}

const checkInput = (data) => {
  if (!data) return false
  if (
    !data.question_en ||
    !data.question_ru ||
    !data.var_1_en ||
    !data.var_2_en ||
    !data.var_3_en ||
    !data.var_4_en ||
    !data.var_1_ru ||
    !data.var_2_ru ||
    !data.var_3_ru ||
    !data.var_4_ru
  ) {
    error.value = t('error.emptyfields')
    return false
  }
  return true
}

const reset = () => {
  edited.value = { ...initial }
  selected.value = {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';
@include scrollbar;

.admin {
  grid-template-columns: 1fr 2fr;

  @include breakpoint-xl {
    grid-template-columns: 2fr 3fr;
  }

  @include breakpoint-lg {
    grid-template-columns: 1fr;
  }
}
</style>
