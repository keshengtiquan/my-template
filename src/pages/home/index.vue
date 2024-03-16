<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import UserInfo from './component/userInfo.vue'
import ProjectList from './component/projectList.vue'
import QuickStart from './component/quickStart.vue';
import Schedule from './component/schedule.vue'
import OpLog from './component/opLog.vue'
import VisLog from './component/visLog.vue';
</script>
<template>
  <PageContainer>
    <a-row :gutter="10">
      <a-col :span="17">
        <UserInfo />
        <ProjectList />
        <a-row :gutter="10">
          <a-col :span="12" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <visLog class="mb-2" />
          </a-col>
          <a-col :span="12" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <OpLog class="mb-2" />
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="7">
        <QuickStart />
        <Schedule />
      </a-col>
    </a-row>
  </PageContainer>
</template>
<style scoped>
.aa {
  position: absolute;
}
</style>