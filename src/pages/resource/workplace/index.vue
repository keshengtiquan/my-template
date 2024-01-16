<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {ref} from "vue";
import WorkPlaceList from './component/WorkPlaceList.vue'
import WorkPlaceList2 from "./component/WorkPlaceList2.vue";

const activeKey = ref('1');

</script>
<template>
  <PageContainer>
    <template #content>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="工点列表"></a-tab-pane>
        <a-tab-pane key="2" tab="工点清单汇总" force-render></a-tab-pane>
      </a-tabs>
    </template>
    <WorkPlaceList class="animate__animated animate__fadeIn animate__faster w-full" v-if="activeKey === '1'"></WorkPlaceList>
    <WorkPlaceList2 class="animate__animated animate__fadeIn animate__faster w-full" v-else></WorkPlaceList2>
  </PageContainer>
</template>


<style scoped>

</style>