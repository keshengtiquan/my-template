<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'

const columns = [
  { title: '日期', dataIndex: 'fillDate', width: 100, align: 'center', sorter: true },
  {}
]
</script>
<template>
  <PageContainer>
    <pro-table :columns="columns"></pro-table>
  </PageContainer>
</template>
<style scoped></style>