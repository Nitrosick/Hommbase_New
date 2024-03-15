<template>
</template>

<script setup>
definePageMeta({
  middleware: [
    '04-admin',
    () => navigateTo('/admin/titles')
  ]
})
</script>
