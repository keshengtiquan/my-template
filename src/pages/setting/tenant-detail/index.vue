<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import { ref } from 'vue';
import Info from './component/info.vue'
import Personnel from './component/personnel.vue';
const activeKey = ref('1');
</script>
<template>
  <PageContainer>
    <template #content>
      <a-tabs v-model:activeKey="activeKey"  destroyInactiveTabPane>
        <a-tab-pane key="1" tab="项目信息">
          <Info/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目人员" force-render>
          <Personnel/>
        </a-tab-pane>
      </a-tabs>
    </template>
  </PageContainer>
</template>
<style scoped>
.ant-tabs-top> :deep(.ant-tabs-nav) {
  margin: 0;
}
</style>