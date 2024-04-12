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
      @select="selectMob"
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
              alt="mob image"
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
              id="town"
              :label="$t('parameters.town')"
              :options="townOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.town_id"
            />
            <Input
              id="level"
              type="number"
              :label="$t('parameters.level')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 1, max: 7, step: 1 }"
              v-model="edited.level"
            />
            <Select
              id="upgraded"
              :label="$t('parameters.upgrade')"
              :options="{
                0: '0',
                1: '1',
                2: '2'
              }"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.upgraded"
            />
            <Input
              id="attack"
              type="number"
              :label="$t('parameters.attack')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 1 }"
              v-model="edited.attack"
            />
            <Input
              id="defense"
              type="number"
              :label="$t('parameters.defense')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 1, step: 1 }"
              v-model="edited.defense"
            />
            <Input
              id="min-damage"
              type="number"
              :label="$t('parameters.mindamage')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 1 }"
              v-model="edited.min_damage"
            />
            <Input
              id="max-damage"
              type="number"
              :label="$t('parameters.maxdamage')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 1 }"
              v-model="edited.max_damage"
            />
            <Input
              id="shoots"
              type="number"
              :label="$t('parameters.shoots')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 1 }"
              v-model="edited.shoots"
            />
            <Checkbox
              id="double-attack"
              :label="$t('parameters.doubleattack')"
              :disabled="loading"
              v-model="edited.double_strike"
            />
            <Input
              id="health"
              type="number"
              :label="$t('parameters.health')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 1, step: 1 }"
              v-model="edited.health"
            />
            <Input
              id="speed"
              type="number"
              :label="$t('parameters.speed')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 1 }"
              v-model="edited.speed"
            />
            <Input
              id="value"
              type="number"
              :label="$t('parameters.value')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 1, step: 1 }"
              v-model="edited.value"
            />
            <Input
              id="growth"
              type="number"
              :label="$t('parameters.growth')"
              :required="true"
              :disabled="loading"
              :attrs="{ min: 0, step: 1 }"
              v-model="edited.growth"
            />
            <Select
              id="status"
              :label="$t('parameters.status')"
              :options="statusOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.status_id"
            />
            <Select
              id="land"
              :label="$t('parameters.land')"
              :options="landOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.land_id"
            />
            <Select
              id="movement"
              :label="$t('parameters.movement')"
              :options="movementOptions"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.move_id"
            />
            <Select
              id="size"
              :label="$t('parameters.size')"
              :options="{
                1: '1',
                2: '2'
              }"
              :required="true"
              :disabled="loading"
              :default-value="false"
              v-model="edited.size"
            />
          </div>

          <Cost
            :value="edited.cost"
            :disabled="loading"
            @update="value => edited.cost = value"
          />

          <Textarea
            id="ability"
            :label="$t('parameters.ability')"
            placeholder="..."
            :disabled="loading"
            :attrs="{ rows: 10 }"
            v-model="edited['ability_' + lang]"
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

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

const { $api, $toast } = useNuxtApp()
const fullscreen = useFullscreen()
const { projectTitle } = useRuntimeConfig().public
const { me } = useUserStore()
const { t, locale } = useI18n()
const data = ref(null)
const loading = ref(false)
const error = ref(null)
const lang = ref('ru')
const edited = ref({})
const towns = ref(null)
const options = ref(null)

useHead({ title: () => `${t('menu.admin')} | ${projectTitle}` })
onMounted(() => getData())
watch(() => ({...edited.value}), () => { error.value = null })

const getData = async () => {
  const [res1, err1] = await $api('mobs')
  if (err1) {
    console.error(err1)
    throw showError(err1)
  }
  const [res2, err2] = await $api('towns/list', null, true)
  if (err2) {
    console.error(err2)
    throw showError(err2)
  }
  const [res3, err3] = await $api('mobs/options', null, true)
  if (err3) {
    console.error(err3)
    throw showError(err3)
  }

  if (!res1.length) return

  const result = res1.map(item => {
    let upgraded = 0
    if (item.level.includes('++')) upgraded = 2
    else if (item.level.includes('+')) upgraded = 1

    return {
      ...item,
      level: item.level.substring(0, 1),
      upgraded,
      shoots: item.shoots === '-' ? 0 : item.shoots,
      double_strike: Boolean(+item.double_strike)
    }
  })

  data.value = result || null
  edited.value = result[0]
  towns.value = res2 || null
  options.value = res3 || null
}

const selectMob = (item) => {
  if (item === edited.value) return
  edited.value = item
}

const getOptions = (array) => {
  if (!array || !array.length) return {}
  return array.reduce(
    (carry, item) => {
      carry[item.id] = item['name_' + locale.value]
      return carry
    }, {}
  )
}

const townOptions = computed(() => getOptions(towns.value))
const statusOptions = computed(() => getOptions(options.value.statuses))
const landOptions = computed(() => getOptions(options.value.lands))
const movementOptions = computed(() => getOptions(options.value.movement))

const imageUrl = computed(() => {
  const fileName = edited.value.name_en.replaceAll(' ', '')
  return `/images/mobs/${fileName}.webp`
})

const onSubmit = async () => {
  const newData = { ...edited.value }
  error.value = null
  loading.value = true

  if (newData.upgraded === 1) newData.level += '+'
  else if (newData.upgraded === 2) newData.level += '++'
  newData.shoots = !newData.shoots ? '-' : newData.shoots
  newData.double_strike = !newData.double_strike ? 0 : 1

  const [, err] = await $api('admin/mobs/update', {
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
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.editor-image {
  aspect-ratio: 3/4;
}

@include scrollbar;
</style>
