<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();
const back = () => {
  router.replace({
    path: '/',
  })
}
</script>

<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="back">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>
