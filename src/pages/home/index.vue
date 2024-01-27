<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import IntroduceRow from "@/pages/home/introduce-row.vue";
import OutputValue from "@/pages/home/output-value.vue";
import FollowList from "@/pages/home/follow-list.vue";
import Proportion from "@/pages/home/proportion.vue";
</script>
<template>
  <PageContainer>
    <IntroduceRow/>
    <OutputValue/>
    <a-row
        :gutter="24"
        :style="{ marginTop: '24px' }"
    >
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <Suspense :fallback="null">
          <FollowList/>
        </Suspense>
      </a-col>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
        <Suspense :fallback="null">
          <Proportion/>
        </Suspense>
      </a-col>
    </a-row>
  </PageContainer>
</template>
<style scoped>

</style>