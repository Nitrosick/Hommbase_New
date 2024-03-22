<template>
  <details
    v-if="data.subitems"
    :open="opened"
  >
    <summary class="list-summary">
      {{ $t('menu.' + data.title) }}
    </summary>
    <div class="list-items">
      <MenuItem
        v-for="item in data.subitems"
        :key="item.id"
        :data="item"
        @close="$emit('close')"
      />
    </div>
  </details>
  <NuxtLink
    v-else
    :to="data.link"
    class="list-item"
    @click="$emit('close')"
  >
    <span>{{ $t('menu.' + data.title) }}</span>
  </NuxtLink>
</template>

<script setup>
import MenuItem from '@/components/app/header/MenuItem.vue'

const props = defineProps({
  data: { type: Object, required: true },
  opened: { type: Boolean, default: undefined }
})
</script>

<style lang="scss" scoped>
.list-summary,
.list-item {
  padding: 1rem 1.5rem;
  font-size: $font-size-md;
}
</style>
