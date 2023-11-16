<script setup lang="ts">
import PageContainer from "@/components/page-container/index.vue";
import {ref} from "vue";
const value1 = ref();
</script>
<template>
  <PageContainer>
    <a-date-picker v-model:value="value1" />
  </PageContainer>

</template>



<style scoped>

</style>