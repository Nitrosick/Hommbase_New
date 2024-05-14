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
      agregator="element"
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
              alt="spell image"
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
              id="element"
              :label="$t('parameters.element')"
              :options="elementOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.element_id"
            />
            <Input
              id="level"
              type="number"
              :label="$t('parameters.level')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 1, max: 5, step: 1 }"
              v-model="edited.level"
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
            <Input
              id="cost-noskill"
              type="number"
              :label="`${$t('parameters.cost')} (${$t('label.noskill')})`"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 1 }"
              v-model="edited.cost[0]"
            />
            <Input
              id="cost-skill"
              type="number"
              :label="`${$t('parameters.cost')} (${$t('label.withskill')})`"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 1 }"
              v-model="edited.cost[1]"
            />
            <Input
              id="duration"
              :label="$t('parameters.duration')"
              placeholder="..."
              :disabled="loading"
              v-model="edited['duration_' + lang]"
            />
          </div>

          <div class="value">
            <span class="value-label">
              {{ $t('parameters.value') }}
            </span>
            <div class="value-fields">
              <div class="value-item">
                <label for="value-basic">
                  {{ $t('parameters.basic') }}
                </label>
                <Input
                  id="value-basic"
                  type="number"
                  :required="true"
                  :disabled="loading"
                  :attrs="{ min: 0, step: 1 }"
                  v-model="edited.value[0]"
                />
              </div>
              <div class="value-item">
                <label for="value-advanced">
                  {{ $t('parameters.advanced') }}
                </label>
                <Input
                  id="value-advanced"
                  type="number"
                  :required="true"
                  :disabled="loading"
                  :attrs="{ min: 0, step: 1 }"
                  v-model="edited.value[1]"
                />
              </div>
              <div class="value-item">
                <label for="value-expert">
                  {{ $t('parameters.expert') }}
                </label>
                <Input
                  id="value-expert"
                  type="number"
                  :required="true"
                  :disabled="loading"
                  :attrs="{ min: 0, step: 1 }"
                  v-model="edited.value[2]"
                />
              </div>
            </div>
          </div>

          <Textarea
            id="basic"
            :label="$t('parameters.basic')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 7 }"
            v-model="edited['basic_' + lang]"
          />
          <Textarea
            id="advanced"
            :label="$t('parameters.advanced')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 7 }"
            v-model="edited['advance_' + lang]"
          />
          <Textarea
            id="expert"
            :label="$t('parameters.expert')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 7 }"
            v-model="edited['expert_' + lang]"
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
  const [res1, err1] = await $api('spells')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('spells/options', null, true)
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }

  if (!res1.length) return

  const result = res1.map(item => {
    const cost = item.cost.split('/')
    const value = item.value.split('/')
    return { ...item, cost, value }
  })

  data.value = result || null
  edited.value = result[0]
  options.value = res2 || null
}

const elementOptions = computed(() => getOptions(options.value.elements))
const classOptions = computed(() => getOptions(options.value.classes))

const imageUrl = computed(() => {
  const fileName = edited.value.name_en.replace(/[\s?_-]/g, '')
  return `/images/spells/${fileName}.png`
})

const onSubmit = async () => {
  const newData = { ...edited.value }
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true
  newData.cost = newData.cost.join('/')
  newData.value = newData.value.join('/')

  const [, err] = await $api('admin/spells/update', {
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
  if (
    !data.duration_en ||
    !data.duration_ru ||
    !data.basic_en ||
    !data.basic_ru ||
    !data.advance_en ||
    !data.advance_ru ||
    !data.expert_en ||
    !data.expert_ru
  ) {
    error.value = t('error.emptyfields')
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.editor-image {
  aspect-ratio: 4/3;
}

.value {
  &-label {
    display: block;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;
  }

  &-fields {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    border: $border-main;
    background-color: var(--color-grey-1);

    @include breakpoint-xl {
      grid-template-columns: 1fr;
    }
  }

  &-item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: $font-size-sm;
    color: var(--color-grey-1);
    font-weight: 600;
    background-color: $color-background;
    padding-left: 0.7rem;

    @include breakpoint-xl {
      font-size: inherit;
      color: $color-text;
      font-weight: 400;
    }
  }

  ::v-deep(.input-field) {
    border: none;
  }
}

@include scrollbar;
</style>
