<template>
  <div class="registration single-page">
    <div class="registration-hexes" />
    <form
      class="registration-form"
      @submit.prevent="onSubmit"
    >
      <div
        v-if="loading"
        class="login-form-fields"
      >
        <Spinner />
      </div>
      <div
        v-show="!loading"
        class="registration-form-fields"
      >
        <Input
          id="name"
          :label="$t('input.name')"
          placeholder="..."
          :required="true"
          v-model="data.name"
        />
        <Input
          id="email"
          type="email"
          label="E-mail"
          placeholder="example@gmail.com"
          :required="true"
          v-model="data.email"
        />
        <Input
          id="password"
          type="password"
          :label="$t('input.password')"
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
      <div class="registration-form-control">
        <Button
          type="submit"
          :text="$t('auth.registrate')"
          :disabled="loading"
        />
      </div>
      <NuxtLink
        to="/auth/login"
        class="registration-to-login"
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

const { t } = useI18n()
const { $api, $toast } = useNuxtApp()
const error = ref(null)
const loading = ref(false)
const data = reactive({
  name: null,
  email: null,
  password: null,
  repeat: null
})

const { projectTitle } = useRuntimeConfig().public
useHead({ title: () => `${t('menu.registration')} | ${projectTitle}` })

watch(data, () => { resetErrors() })

const onSubmit = async () => {
  if (data.password !== data.repeat) {
    error.value = { message: t('error.passrepeat') }
    return
  }

  loading.value = true
  const [, err] = await $api('auth/registration', data)

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  $toast(t('auth.regsuccess'), 5, 'success')
  navigateTo({ path: '/auth/login' })
}

const resetErrors = () => { error.value = null }
</script>

<style lang="scss" scoped>
.registration {
  display: flex;
  justify-content: flex-end;
  padding: calc($height-header + 4rem) 4rem 4rem 4rem;

  &-hexes {
    position: absolute;
    top: calc($height-header + 4rem);
    bottom: 4rem;
    left: 4rem;
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
