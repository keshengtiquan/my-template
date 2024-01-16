<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {ref} from "vue";
import Gantt from './ganttChart.vue'
import GanttData from "@/pages/plan/gantt/ganttData.vue";
const activeKey = ref('2');
</script>
<template>
  <PageContainer>
    <template #content>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="数据管理"></a-tab-pane>
        <a-tab-pane key="2" tab="甘特图" force-render></a-tab-pane>
      </a-tabs>
    </template>
    <GanttData  v-if="activeKey === '1'"></GanttData>
    <Gantt  v-else></Gantt>
  </PageContainer>
</template>
<style lang="scss">

</style>