<script setup lang="ts">
import {useAppStore} from '@/store'

const appStore = useAppStore()

</script>

<template>
  <a-config-provider
      :theme="appStore.theme"
  >
  <router-view/>
  </a-config-provider>
</template>

<style scoped>

</style>
