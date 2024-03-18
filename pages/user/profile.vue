<template>
  <div class="profile single-page">
    <div class="profile-hexes" />

    <Avatars
      :opened="avatarsPanel"
      :is-free="!!freeAvatars.length"
      :list="me.avatar ? paidAvatars : freeAvatars"
      :loading="loading"
      @select="item => changeAvatar(item)"
      @buy="item => changeAvatar(item, 'buy')"
      @close="avatarsPanel = false"
    />

    <div
      v-if="me"
      class="profile-info"
    >
      <div class="profile-header">
        <div class="profile-info-hexes">
          <span class="profile-id">
            ID: {{ me.id }}
          </span>
        </div>
        <button
          class="profile-avatar"
          @click.prevent="avatarsPanel = !avatarsPanel"
        >
          <img
            :src="avatar"
            alt="user avatar"
            loading="lazy"
          >
        </button>
      </div>

      <div class="profile-data">
        <div class="profile-data-row">
          <span
            class="profile-data-title"
            v-html="$t('label.name')"
          />
          <span
            class="profile-data-value"
            v-html="firstUpper(me.name)"
          />
        </div>
        <div class="profile-data-row">
          <span class="profile-data-title">
            E-mail
          </span>
          <span
            class="profile-data-value"
            v-html="me.email"
          />
        </div>
        <div class="profile-data-row">
          <span
            class="profile-data-title"
            v-html="$t('parameters.status')"
          />
          <span
            class="profile-data-value"
            v-html="status"
          />
        </div>
        <div class="profile-data-row">
          <span
            class="profile-data-title"
            v-html="$t('user.registered')"
          />
          <span
            class="profile-data-value"
            v-html="$dayjs(me.registered_at).format('DD.MM.YYYY')"
          />
        </div>
        <div class="profile-data-row">
          <span
            class="profile-data-title"
            v-html="$t('user.balance')"
          />
          <div class="profile-data-value">
            <div
              class="cost-string"
              :class="{ 'cost-string-zero': !+me.balance }"
            >
              {{ me.balance }}
              <mark class="gold" />
            </div>
          </div>
        </div>
      </div>

      <div class="profile-control">
        <Button
          v-if="isAdmin"
          :text="$t('menu.admin')"
          to="/admin"
          :disabled="loading"
        />
        <Button
          :text="$t('label.resetpass')"
          :disabled="loading"
          @btn-click="resetPassword"
        />
        <Button
          :text="$t('label.logout')"
          @btn-click="logout"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'
import Avatars from '@/components/page/profile/Avatars.vue';

definePageMeta({ middleware: ['03-auth'] })

const { t, locale } = useI18n()
const { me, setAvatar, setAvatarsList, setBalance, logout, isAdmin } = useUserStore()
const { $api, $toast } = useNuxtApp()
const loading = ref(false)
const avatarsPanel = ref(false)
const freeAvatars = ref([])
const paidAvatars = ref([])

const { projectTitle } = useRuntimeConfig().public
useHead({ title: () => `${t('menu.profile')} | ${projectTitle}` })

onMounted(async () => {
  if (me.avatar) getAvatars()
  else getAvatars('free')
})

const avatar = computed(() => {
  if (me.avatar) return `/images/heroes/portrait/${me.avatar.replaceAll(' ', '')}.webp`
  return '/images/team/unknown.webp'
})

const status = computed(() => +me.is_admin ? t('user.admin') : t('user.simple'))

const getAvatars = async (collection = 'paid') => {
  if (collection === 'free') {
    const [res, err] = await $api('user/avatars/free', null, true)
    if (err) console.error(err)
    else {
      freeAvatars.value = res
      avatarsPanel.value = true
    }
  } else {
    const [res, err] = await $api('user/avatars', { token: me.token })
    if (err) console.error(err)
    else {
      setAvatarsList(res.purchased ?? null)
      freeAvatars.value = []
      paidAvatars.value = res.all ?? []
    }
  }
}

const changeAvatar = async (item, action = 'change') => {
  loading.value = true

  const [, err] = await $api('user/avatars/change', {
    id: item.id, token: me.token
  })

  if (err) console.error(err)
  else {
    if (!me.avatar) getAvatars()
    if (action === 'buy') {
      setAvatarsList([...me.avatars, item])
      setBalance(me.balance - item.site_cost)
    }

    setAvatar(item.name_en)
    avatarsPanel.value = false
    $toast(t('success.avatar'), 5, 'success')
  }

  loading.value = false
}

const resetPassword = async () => {
  if (!confirm(t('confirm.resetpass'))) return

  loading.value = true
  const [, err] = await $api('auth/passrestore', { email: me.email, lang: locale.value })

  if (err) {
    loading.value = false
    return
  }

  $toast(t('success.restorelink'), 5, 'success')
  logout()
}
</script>

<style lang="scss" scoped>
.profile {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
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

  &-info {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    border: $border-main;
    background-color: $color-background;
    height: 100%;
    min-width: 25rem;
    max-width: 30rem;
    z-index: 1;
    overflow-y: auto;

    &-hexes {
      flex-grow: 1;
      height: calc(100% - 1.5rem);
      margin-top: 1.5rem;
      background: url(/images/common/hex-s.svg) 0 0 / 2rem auto repeat;
    }

    @include breakpoint-sm {
      width: 100%;
      min-width: initial;
      max-width: initial;
      border: none;
    }
  }

  &-header {
    display: flex;
    gap: 1.5rem;
    padding: 0 1.5rem;
  }

  &-id {
    font-size: $font-size-sm;
    font-weight: 600;
    color: var(--color-grey-1);
    background-color: $color-background;
    padding: 0.5rem;
    white-space: nowrap;
  }

  &-avatar {
    display: flex;
    border: $border-main;
    border-top: none;
    width: 10rem;
    aspect-ratio: 12/13;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-data {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
    padding: 1.5rem;

    &-row {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &::before {
        position: absolute;
        content: '';
        top: calc(50% - 1px);
        left: 2rem;
        right: 2rem;
        height: 2px;
        background-color: var(--color-grey-1);
        z-index: 0;
      }
    }

    &-title {
      position: relative;
      color: var(--color-grey-1);
      font-size: $font-size-sm;
      font-weight: 600;
      background-color: $color-background;
      padding: 0 0.15rem;
      z-index: 1;
    }

    &-value {
      position: relative;
      background-color: $color-background;
      padding-left: 0.15rem;
      z-index: 1;
    }
  }

  &-control {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    padding-top: 0;
  }

  @include breakpoint-md {
    justify-content: flex-end;
    padding: calc($height-header + 1.5rem) 1.5rem 1.5rem 1.5rem;
  }

  @include breakpoint-sm {
    padding: 0;
    padding-top: $height-header;
  }
}

.cost-string-zero {
  color: var(--color-grey-1);
}
</style>
