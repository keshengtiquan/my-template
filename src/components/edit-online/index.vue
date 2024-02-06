<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter()
const click = () => {
  router.push('/onlyoffice')
}
</script>
<template>
  <a-typography-link href="http://127.0.0.1:3500/#/onlyoffice" target="_blank">
    Ant Design Vue (Link)
  </a-typography-link>
</template>
<style scoped>

</style>