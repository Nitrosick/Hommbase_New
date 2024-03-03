<template>
  <div class="login single-page">
    <div class="login-hexes" />
    <form
      class="login-form"
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
        class="login-form-fields"
      >
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
          :label="$t('label.password')"
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
      <div class="login-form-control">
        <Button
          type="submit"
          :text="$t('label.login')"
          :disabled="loading"
        />
        <Button
          :text="$t('label.restore')"
          @click="restorePassword"
          :disabled="true"
        />
        <!-- :disabled="loading || !data.email" -->
      </div>
      <!-- <div
        v-if="links"
        class="login-oauth"
      >
        <a
          v-for="(link, key) in links"
          :key="key"
          :href="link"
          class="login-oauth-link"
        >
          <Icon :name="key" />
        </a>
      </div> -->
      <NuxtLink
        to="/auth/registration"
        class="login-to-registration"
        :disabled="loading"
      >
        {{ $t('menu.registration') }}
      </NuxtLink>
    </form>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'
import Spinner from '@/components/app/Spinner.vue';

definePageMeta({ middleware: ['02-guest'] })
const { $api, $toast } = useNuxtApp()

const { data: links } = await useAsyncData('oauth',
  async () => {
    const [res, err] = await $api('oauth')
    if (err) {
      console.error(err)
      return null
    }
    return res
  }
)

const { t, locale } = useI18n()
const { setUser } = useUserStore()
const error = ref(null)
const loading = ref(false)
const data = reactive({
  email: null,
  password: null
})

const { projectTitle } = useRuntimeConfig().public
useHead({ title: () => `${t('menu.auth')} | ${projectTitle}` })

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
  $toast(`${t('success.welcome')}, ${firstUpper(res.name)}`)
  navigateTo('/user/profile')
}

const restorePassword = async () => {
  if (!data.email) return

  loading.value = true
  const [res, err] = await $api('auth/passrestore', { ...data, lang: locale.value })

  if (err) {
    error.value = err
    loading.value = false
    return
  }

  $toast(t('success.restorelink'), 5, 'success')
}

const resetErrors = () => { error.value = null }
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

  &-oauth {
    display: flex;
    justify-content: space-around;
    border-top: $border-main;

    &-link {
      padding: 1.5rem;
      transition: background-color 0.3s;

      &:hover,
      &:focus {
        background-color: var(--color-grey-2);
      }

      @include breakpoint-sm {
        padding: 1rem;
      }
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
