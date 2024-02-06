<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {ref} from "vue"
import {getSectionalApi} from "@/api/division";
const activeKey = ref('year')
const dynamicSectional = ref()
getSectionalApi({divisionType: '分部工程'}).then(res => {
  dynamicSectional.value = res.data
})
</script>
<template>
  <PageContainer>
    <template #content>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="year" tab="总体进度"></a-tab-pane>
        <a-tab-pane :key="item.id" v-for="item in dynamicSectional" :tab="item.divisionName"></a-tab-pane>
      </a-tabs>
    </template>
  </PageContainer>
</template>
<style scoped>

</style>