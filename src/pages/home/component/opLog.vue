<script setup lang="ts">
import { ref } from 'vue';

const opLogList = ref([
  { exeStatus: 'SUCCESS', opTime: '2023-03-21 10:00:00', name: '执行成功' },
])
const getTimelineColor = (value: string) => {
  if (value === 'SUCCESS') {
    return 'blue'
  } else {
    return 'red'
  }
}
</script>
<template>
  <a-card title="操作记录" :bordered="false">
    <template #extra><a>更多</a></template>
    <div class="timeline-div">
      <a-timeline>
        <a-timeline-item v-for="opLog in opLogList" :color="getTimelineColor(opLog.exeStatus)">{{
    opLog.opTime }} {{ opLog.name }}
        </a-timeline-item>
      </a-timeline>
    </div>
  </a-card>
</template>
<style scoped>
.ant-timeline-item {
  padding-top: 5px;
  padding-bottom: 10px !important;
}

.timeline-div {
  height: 300px;
  overflow: auto;
}
</style>