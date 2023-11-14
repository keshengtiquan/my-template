<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const params = route.params
const path = params?.path ? decodeURIComponent(params.path as string) : ''
if (path) router.replace(path)
else router.replace('/')
defineOptions({
  name: 'LayouBasicRedirect',
})
</script>

<template>
  <div>

  </div>
</template>