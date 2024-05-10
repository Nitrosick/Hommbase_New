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
          <div class="images">
            <img
              :src="portraitImageUrl"
              alt="hero image"
              loading="lazy"
              class="images-portrait"
            >
            <img
              :src="specImageUrl"
              alt="specialization image"
              loading="lazy"
              class="images-spec"
            >
          </div>

          <div class="editor-grid">
            <Input
              id="name"
              :label="$t('label.name')"
              placeholder="..."
              :required="true"
              :disabled="true"
              v-model="edited['name_' + lang]"
            />
            <Select
              id="town"
              :label="$t('parameters.town')"
              :options="townOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.town_id"
            />
            <Select
              id="race"
              :label="$t('parameters.race')"
              :options="raceOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.race_id"
            />
            <Select
              id="sex"
              :label="$t('parameters.sex')"
              :options="sexOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.sex_id"
            />
            <Select
              id="rank"
              :label="$t('parameters.rank')"
              :options="rankOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.rank_id"
            />
            <Select
              id="spell"
              :label="$t('parameters.spell')"
              :options="spellOptions"
              :required="true"
              :disabled="loading"
              v-model="edited.spell_id"
            />
            <Select
              id="secondary-1"
              :label="$t('parameters.secondary') + ' (1)'"
              :options="secondaryOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.secondary_1_id"
            />
            <Select
              id="secondary-2"
              label="(2)"
              :options="secondaryOptions"
              :required="true"
              :disabled="loading"
              v-model="edited.secondary_2_id"
            />
            <Select
              id="spec-image"
              :label="$t('parameters.specimage')"
              :options="specImgOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.spec_image"
            />
            <Input
              id="mp"
              type="number"
              :label="$t('parameters.mp')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 500, max: 5000, step: 1 }"
              v-model="edited.movement_points"
            />
            <Input
              id="site-cost"
              type="number"
              :label="$t('user.avatarcost')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, max: 5000, step: 1 }"
              v-model="edited.site_cost"
            />
          </div>

          <PrimarySkills
            :value="edited.primary"
            :disabled="loading"
            @update="value => edited.primary = value"
          />

          <Textarea
            id="army"
            :label="$t('parameters.army')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 3 }"
            v-model="edited['army_' + lang]"
          />
          <Textarea
            id="specialization"
            :label="$t('parameters.specialization')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 7 }"
            v-model="edited['specialization_' + lang]"
          />
          <Textarea
            id="biography"
            :label="$t('parameters.biography')"
            placeholder="..."
            :required="true"
            :disabled="loading"
            :attrs="{ rows: 7 }"
            v-model="edited['biography_' + lang]"
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
import PrimarySkills from '@/components/page/admin/heroes/PrimarySkills.vue'

const {
  $api, $toast, fullscreen, me, t, data, loading, error, lang, edited, options,
  selectItem, getOptions
} = useAdmin()

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

const towns = ref(null)
const spells = ref(null)
const specImages = ref(null)

const sexes = [
  { id: 1, name_en: 'male', name_ru: 'мужчина' },
  { id: 2, name_en: 'female', name_ru: 'женщина' }
]

onMounted(() => getData())

const getData = async () => {
  const [res1, err1] = await $api('heroes')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('towns/list', null, true)
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }
  const [res3, err3] = await $api('spells/list', null, true)
  if (err3) {
    console.error(err3)
    throw showError(err3)
  }
  const [res4, err4] = await $api('heroes/options', null, true)
  if (err4) {
    console.error(err4)
    throw showError(err4)
  }
  const [res5, err5] = await $api('heroes/spec-images', null, true)
  if (err5) {
    console.error(err5)
    throw showError(err5)
  }

  if (!res1.length) return
  data.value = res1 || null
  edited.value = res1[0]
  towns.value = res2 || null
  spells.value = res3 || null
  options.value = res4 || null
  specImages.value = res5 || null
}

const townOptions = computed(() => getOptions(towns.value))
const spellOptions = computed(() => getOptions(spells.value))
const sexOptions = computed(() => getOptions(sexes))
const raceOptions = computed(() => getOptions(options.value.races))
const rankOptions = computed(() => getOptions(options.value.ranks))
const secondaryOptions = computed(() => getOptions(options.value.secondary))

const specImgOptions = computed(() => specImages.value.reduce(
  (carry, item) => {
    const key = item.replace('.webp', '')
    carry[key] = item
    return carry
  }, {}
))

const portraitImageUrl = computed(() => {
  const fileName = edited.value.name_en.replaceAll(' ', '')
  return `/images/heroes/portrait/${fileName}.webp`
})

const specImageUrl = computed(() => `/images/specialization/${edited.value.spec_image}.webp`)

const onSubmit = async () => {
  const newData = { ...edited.value }
  error.value = null

  if (!checkInput(newData)) return

  loading.value = true
  newData.is_mage = !newData.spell_id ? 0 : 1

  const [, err] = await $api('admin/heroes/update', {
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
    !data.army_en ||
    !data.army_ru ||
    !data.specialization_en ||
    !data.specialization_ru ||
    !data.biography_en ||
    !data.biography_ru
  ) {
    error.value = t('error.emptyfields')
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.images {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  &-portrait {
    width: 10rem;
    aspect-ratio: 12/13;
    border: $border-main;
  }

  &-spec {
    width: 4.5rem;
    aspect-ratio: 1/1;
    border: $border-main;
  }
}

@include scrollbar;
</style>
