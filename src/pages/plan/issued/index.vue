<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {ref} from "vue";
import PlanList from './component/planList.vue'
const activeKey = ref('year');
</script>
<template>
  <PageContainer>
    <template #content>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="year" tab="年度计划"></a-tab-pane>
        <a-tab-pane key="quarter" tab="季度计划" force-render></a-tab-pane>
        <a-tab-pane key="month" tab="月度计划" force-render></a-tab-pane>
        <a-tab-pane key="week" tab="周计划" force-render></a-tab-pane>
      </a-tabs>
    </template>
    <PlanList :plan-type="activeKey"></PlanList>
  </PageContainer>
</template>
<style scoped>
.ant-tabs-top >:deep(.ant-tabs-nav::before) {
  border-bottom: none;
}
</style>