<template>
  <div class="login single-page">
    <div class="login-hexes" />
    <form
      class="login-form"
      @submit.prevent="onSubmit"
    >
      <div class="login-form-fields">
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
        <Error
          v-if="error"
          :data="error"
        />
      </div>
      <div class="plug" />
      <div class="login-form-control">
        <Button
          type="submit"
          :text="$t('auth.login')"
          :disabled="loading"
        />
        <Button
          :text="$t('auth.restore')"
          @click="restorePassword"
          :disabled="true"
        />
      </div>
      <NuxtLink
        to="/auth/registration"
        class="login-to-registration"
        :disabled="loading"
      >
        {{ $t('auth.registration') }}
      </NuxtLink>
    </form>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/common'

definePageMeta({ middleware: 'guest' })

const localize = useLocalize()
const { t } = useI18n()
const { $api, $toast } = useNuxtApp()
const { setUser } = useUserStore()
const error = ref(null)
const loading = ref(false)
const data = reactive({
  email: null,
  password: null
})

useHead({ title: () => t('menu.auth') })

watch(data, () => { resetErrors() })

const onSubmit = async () => {
  loading.value = true
  const [res, err] = await $api('auth/login', data)

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  setUser(res)
  $toast(`${t('auth.welcome')}, ${firstUpper(res.name)}`)
  navigateTo({ path: '/' })
}

const restorePassword = () => {}

const resetErrors = () => {
  error.value = null
}
</script>

<style lang="scss" scoped>
.login {
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

  &-to-registration {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: $border-main;
    padding: 1.5rem;
    transition: background-color 0.3s;

    &:hover,
    &:focus,
    &:active {
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

    &-fields,
    &-control {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
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
