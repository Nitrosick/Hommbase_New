<template>
  <div>
    <Main />
    <Sections />
    <Mechanics />
    <Team />
    <Updates />
  </div>
</template>

<script setup>
import { seo } from '@/const/seo'
import Main from '@/components/page/index/Main.vue'
import Sections from '@/components/page/index/Sections.vue'
import Mechanics from '@/components/page/index/Mechanics.vue'
import Team from '@/components/page/index/Team.vue'
import Updates from '@/components/page/index/Updates.vue'

const { projectTitle } = useRuntimeConfig().public
useHead({ title: () => projectTitle })
useSeoMeta(seo.index)
</script>
