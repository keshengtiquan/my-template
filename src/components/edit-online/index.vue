<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter()
const editOnline = () => {
  router.push({path: '/onlyoffice'})
}
</script>
<template>
  <a-button type="primary" @click="editOnline">在线编辑</a-button>
</template>
<style scoped>

</style>