<template>
  <div class="restore single-page">
    <div class="restore-hexes" />
    <form
      class="restore-form"
      @submit.prevent="onSubmit"
    >
      <div
        v-if="loading"
        class="restore-form-fields"
      >
        <Spinner />
      </div>
      <div
        v-show="!loading"
        class="restore-form-fields"
      >
        <Input
          id="name"
          :label="$t('input.name')"
          :disabled="true"
          v-model="data.name"
        />
        <Input
          id="password"
          type="password"
          :label="$t('input.newpass')"
          placeholder="..."
          :required="true"
          :attrs="{ minlength: 5 }"
          v-model="data.password"
        />
        <Input
          id="repeat"
          type="password"
          :label="$t('input.passrepeat')"
          placeholder="..."
          :required="true"
          :attrs="{ minlength: 5 }"
          v-model="data.repeat"
        />
        <Error
          v-if="error"
          :data="error"
        />
      </div>
      <div class="restore-form-control">
        <Button
          type="submit"
          :text="$t('auth.changepass')"
          :disabled="loading"
        />
      </div>
      <NuxtLink
        to="/auth/login"
        class="restore-to-login"
        :disabled="loading"
      >
        {{ $t('menu.auth') }}
      </NuxtLink>
    </form>
  </div>
</template>

<script setup>
import Spinner from '@/components/app/Spinner.vue';

definePageMeta({ middleware: 'guest' })

const { query } = useRoute()
const { t } = useI18n()
const { $api, $toast } = useNuxtApp()
const error = ref(null)
const loading = ref(false)
const token = ref(null)
const data = reactive({
  name: null,
  password: null,
  repeat: null
})

const { projectTitle } = useRuntimeConfig().public
useHead({ title: () => `${t('menu.passrestore')} | ${projectTitle}` })

onBeforeMount(() => {
  const tk = query.token
  if (!tk) return navigateTo({ path: '/auth/login' })
  token.value = tk
  data.name = tk.split('_')[0] ?? null
})

watch(data, () => { resetErrors() })

const onSubmit = async () => {
  if (data.password !== data.repeat) {
    error.value = { message: t('error.passrepeat') }
    return
  }

  loading.value = true
  const [, err] = await $api('auth/passrestore', { ...data, token: token.value })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  $toast(t('auth.passchanged'), 5, 'success')
  navigateTo({ path: '/auth/login' })
}

const resetErrors = () => { error.value = null }
</script>

<style lang="scss" scoped>
.restore {
  padding: calc($height-header + 4rem) 4rem 4rem 4rem;

  &-hexes {
    position: absolute;
    top: calc($height-header + 4rem);
    bottom: 4rem;
    right: 4rem;
    width: 35vw;
    background: url(/images/common/hex-s.svg) 0 0 / 3.3rem auto repeat;

    @include breakpoint-sm {
      display: none;
    }
  }

  &-to-login {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: $border-main;
    padding: 1.5rem;
    transition: background-color 0.3s;

    &:hover,
    &:focus {
      background-color: var(--color-grey-2);
    }
  }

  &-form {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    border: $border-main;
    background-color: $color-background;
    height: 100%;
    max-width: 30rem;
    z-index: 1;
    overflow-y: auto;

    &-fields,
    &-control {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
    }

    &-fields {
      flex-grow: 1;
    }

    &-control {
      padding-top: 0;
    }

    @include breakpoint-sm {
      width: 100%;
      max-width: none;
      border: none;
    }
  }

  @include breakpoint-md {
    padding: calc($height-header + 1.5rem) 1.5rem 1.5rem 1.5rem;
  }

  @include breakpoint-sm {
    padding: 0;
    padding-top: $height-header;
  }
}
</style>
