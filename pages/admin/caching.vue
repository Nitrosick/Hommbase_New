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
          <Checkbox
            v-for="(value, key) in data"
            :key="key"
            :id="key"
            :label="$t('menu.' + key)"
            :disabled="loading"
            v-model="data[key]"
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

const { $api, $toast, fullscreen, me, t, loading, error, data } = useAdmin()
const { setCacheSettings } = useCacheStore()

definePageMeta({
  middleware: ['05-admin'],
  layout: 'admin'
})

onMounted(() => getData())
watch(data, () => { error.value = null })

const getData = async () => {
  const [res, err] = await $api('caching')
  if (err) {
    console.error(err)
    throw showError(err)
  }
  if (!res.length) return

  data.value = res.reduce(
    (carry, item) => {
      carry[item.section] = Boolean(+item.enabled)
      return carry
    }, {}
  )
}

const onSubmit = async () => {
  error.value = null
  loading.value = true

  const newData = { ...data.value }
  for (const key in newData) {
    newData[key] = !newData[key] ? 0 : 1
  }

  const [, err] = await $api('admin/caching', {
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
  setCacheSettings(data.value)
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.editor {
  grid-column: 1/-1;
}

@include scrollbar;
</style>
