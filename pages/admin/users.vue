<template>
  <Spinner v-if="!data" />
  <div
    v-else
    class="admin"
    :class="{ 'admin-fullscreen': fullscreen }"
  >
    <div class="editor">
      <Spinner v-if="loading" />
      <div class="editor-main">
        <Input
          id="filter"
          :label="$t('label.search')"
          type="search"
          placeholder="..."
          v-model="sorter.filter"
        />
        <table class="users-list">
          <thead>
            <tr>
              <th></th>
              <th
                v-for="item in header"
                :key="item.id"
              >
                <button
                  class="sorter"
                  :class="{
                    'sorter-asc': sorter.value === item.value && sorter.order === 'asc',
                    'sorter-desc': sorter.value === item.value && sorter.order === 'desc'
                  }"
                  @click.prevent="sort(item.value)"
                >
                  {{ item.static ? item.title : $t(item.title) }}
                </button>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in sorted"
              :key="item.id"
            >
              <td>
                <img
                  :src="getAvatarUrl(item.avatar)"
                  alt="user avatar"
                  loading="lazy"
                  class="avatar"
                >
              </td>
              <td>{{ item.id }}</td>
              <td class="marked">{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td
                class="marked"
                :class="{ 'inactive': !+item.balance }"
              >
                {{ item.balance }}
              </td>
              <td>{{ item.registered_at ? $dayjs(item.registered_at).format('DD.MM.YYYY') : '-' }}</td>
              <td>{{ item.last_login ? $dayjs(item.last_login).format('DD.MM.YYYY HH:mm') : '-' }}</td>
              <td>
                <div
                  v-if="!+item.is_admin"
                  class="control"
                >
                  <button
                    :title="$t('user.spy')"
                    @click.prevent="spy(item)"
                  >
                    <Icon name="spy" size="s" />
                  </button>
                  <button
                    v-if="item.avatar"
                    :title="$t('user.resetavatar')"
                    @click.prevent="resetAvatar(item)"
                  >
                    <Icon name="reset" size="s" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import Spinner from '@/components/app/Spinner.vue'

definePageMeta({
  middleware: ['04-admin'],
  layout: 'admin'
})

const { $api, $toast } = useNuxtApp()
const fullscreen = useFullscreen()
const { projectTitle } = useRuntimeConfig().public
const { me } = useUserStore()
const { t } = useI18n()
const data = ref(null)
const loading = ref(false)

const sorter = reactive({
  value: null,
  order: 'asc',
  filter: null
})

const header = [
  { id: 1, value: 'id', title: 'ID', static: true },
  { id: 2, value: 'name', title: 'label.name' },
  { id: 3, value: 'email', title: 'email', static: true },
  { id: 4, value: 'balance', title: 'user.balance' },
  { id: 5, value: 'registered_at', title: 'user.registered' },
  { id: 6, value: 'last_login', title: 'user.lastlogin' }
]

useHead({ title: () => `${t('menu.admin')} | ${projectTitle}` })
onMounted(() => getData())

const sorted = computed(() => {
  const { value, order, filter } = sorter
  let result = []

  if (!data.value || !data.value.length) return result

  if (filter) result = [...data.value].filter(item => {
    const keyword = filter.toLowerCase()
    return item.name.toLowerCase().includes(keyword) || item.email.toLowerCase().includes(keyword)
  })
  else result = [...data.value]

  if (!value) return result.sort((a, b) => a.id - b.id)

  return result.sort((a, b) => {
    if (['id', 'balance'].includes(value)) return order === 'asc' ? (a[value] - b[value]) : (b[value] - a[value])
    return order === 'asc' ? a[value].localeCompare(b[value]) : b[value].localeCompare(a[value])
  })
})

const getData = async () => {
  const [res, err] = await $api('admin/users', { token: me.token })
  if (err) {
    console.error(err)
    throw showError(err)
  }
  data.value = res || null
}

const sort = (val) => {
  const { value, order } = sorter
  if (value === val) sorter.order = order === 'asc' ? 'desc' : 'asc'
  else {
    sorter.value = val
    sorter.order = 'asc'
  }
}

const getAvatarUrl = (name) => {
  if (!name) return '/images/team/unknown.webp'
  const fileName = name.replaceAll(' ', '')
  return `/images/heroes/portrait/${fileName}.webp`
}

const resetAvatar = async (user) => {
  if (!confirm(t('user.confresetavatar'))) return
  loading.value = true

  const [, err] = await $api('user/avatars/reset', {
    token: me.token,
    id: user.id
  })

  if (err) {
    console.error(err)
    loading.value = false
    return
  }

  user.avatar = null
  $toast(t('success.resetavatar'), 5, 'success')
  loading.value = false
}

const spy = (user) => {
  if (!confirm(t('user.confirmspy'))) return
  if (!user.token) return

  localStorage.setItem('token', user.token)
  reloadNuxtApp({ path: '/user/profile', ttl: 1000 })
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/admin.scss';

.editor {
  grid-column: 1/-1;
}

.users-list {
  font-size: $font-size-sm;

  th, td {
    border: none;
    border-bottom: 1px solid var(--color-grey-1);
  }

  th {
    padding: 1rem 0.5rem;
  }

  td {
    padding: 0;
    height: 3.5rem;
  }

  .sorter {
    color: var(--color-grey-1);
    font-weight: 600;
    white-space: nowrap;
  }

  .sorter-asc::after {
    content: '▼';
  }

  .sorter-desc::after {
    content: '▲';
  }

  .avatar {
    display: block;
    width: 3rem;
    height: 100%;
    padding: 1px;
    clip-path: $clip-path-tile;
  }

  .marked {
    font-weight: 600;
  }

  .inactive {
    color: var(--color-grey-1);
  }

  .control {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 0.5rem;
  }
}

@include scrollbar;
</style>
