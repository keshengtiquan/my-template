<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {ref} from "vue";
const activeKey = ref('1');
</script>
<template>
  <PageContainer title="测试">
    <template #content>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Tab 1"></a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" force-render></a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3"></a-tab-pane>
      </a-tabs>
    </template>
    <div>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
      ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>ex4...<br/>
    </div>
  </PageContainer>

</template>



<style scoped>
.ant-tabs-top >:deep(.ant-tabs-nav) {
  margin: 0;
}
.ant-tabs-top >:deep(.ant-tabs-nav::before) {
  border-bottom: none;
}
</style>