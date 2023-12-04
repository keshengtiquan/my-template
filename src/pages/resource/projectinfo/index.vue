<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import HeaderInfo from "@/pages/resource/projectinfo/component/HeaderInfo.vue";
import {message} from "ant-design-vue";
const onCopy = () => {
  message.success('复制成功')
}
const data = [
  {
    id: 1,
    title: '建设单位',
    table: [
      {label: "单位全称", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "单位地址", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "联系人", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "联系电话", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
    ]
  },
  {
    id: 2,
    title: '监理单位',
    table: [
      {label: "单位全称", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "单位地址", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "联系人", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "联系电话", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
    ]
  },
  {
    id: 3,
    title: '设计单位',
    table: [
      {label: "单位全称", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "单位地址", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "联系人", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
      {label: "联系电话", value: 'XXXXXXXXXXXXXXXXXXXXXXXXX'},
    ]
  }
]
</script>
<template>
  <PageContainer>
    <template #content>
      <HeaderInfo/>
    </template>
    <a-card v-for="item in data" :key="item.id" :title="item.title" class="w-full mt-10px">
      <template #extra><a href="#">更多</a><a href="#">编辑</a></template>
      <a-descriptions  :column="2">
        <a-descriptions-item v-for="(ele,index) in item.table" :key="index" :label="ele.label">
          <a-typography-paragraph :copyable="{ onCopy: onCopy, tooltip: false, }">
            {{ele.value}}
          </a-typography-paragraph>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </PageContainer>
</template>
<style scoped>
.ant-typography {
  margin-bottom: 0;
}
</style>