<script setup lang="ts">
import { ref } from 'vue';

const visLogList = ref([
  { category: 'LOGIN', name: '用户登录', opTime: '2023-03-21 10:00:00', opIp: '127.0.0.1', opAddress: '内网IP' },
])


const getTimelineColor = (value: string) => {
  if (value === 'LOGIN') {
    return 'red'
  }
  if (value === 'LOGOUT') {
    return 'gray'
  }
}
</script>
<template>
  <a-card title="访问记录" :bordered="false">
    <template #extra><a @click="">更多</a></template>
    <div class="timeline-div">
      <a-timeline>
        <a-timeline-item v-for="visLog in visLogList" :color="getTimelineColor(visLog.category)">{{
    visLog.opTime }} {{ visLog.name }}
          <p class="timeline-item-p">{{ visLog.opIp }} {{ visLog.opAddress }}</p>
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

.timeline-item-p {
  margin-bottom: 0px;
  color: rgb(188, 189, 190);
}

.timeline-div {
  height: 300px;
  overflow: auto;
}
</style>