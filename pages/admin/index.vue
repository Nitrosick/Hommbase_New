<template>
</template>

<script setup>
definePageMeta({
  middleware: [
    '05-admin',
    () => navigateTo('/admin/news')
  ]
})
</script>
