<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { useStorage } from '@vueuse/core'
const calendarValue = ref(dayjs())

type ScheduleType = {
  scheduleTime: string, scheduleContent: string, date: string
}
const scheduleList = useStorage<ScheduleType[]>('scheduleList', [])
const open = ref(false)
const showModal = () => {
  formState.scheduleTime = '09:00:00'
  open.value = true;
};
const onPanelSelect = (date: Dayjs) => {
  calendarValue.value = date
}

const handleOk = async () => {
  const values = await formRef.value.validate()
  if (!values) return
  scheduleList.value.push({ ...formState, date: calendarValue.value.format('YYYY-MM-DD') })
  formState.scheduleContent = ''
  open.value = false;
};
const deleteSchedules = (schedule: ScheduleType) => {
  const index = scheduleList.value.findIndex((item: ScheduleType) => item.date === schedule.date 
    && item.scheduleTime === schedule.scheduleTime && item.scheduleContent === schedule.scheduleContent)
  scheduleList.value.splice(index, 1)
}
const formRef = ref()
const formState = reactive({
  scheduleTime: '',
  scheduleContent: ''
})
const onClose = () => {
  open.value = false
  formState.scheduleContent = ''
}
const timeData = computed(() => {
  return scheduleList.value.filter((item: any) => item.date === calendarValue.value.format('YYYY-MM-DD'))
})

</script>
<template>
  <div>
    <a-calendar v-model:value="calendarValue" :fullscreen="false" @select="onPanelSelect" />
    <div class="p-y-10px p-x-24px bg-[var(--bg-page-container)]">
      <a-timeline>
        <a-timeline-item  v-for="(schedule, index) in timeData" :key="index">
          {{ schedule.scheduleTime }} {{ schedule.scheduleContent }}
          <a style="float: right">
            <delete-outlined cursor-pointer @click="deleteSchedules(schedule)" /></a>
        </a-timeline-item>
      </a-timeline>
      <div class="add-schedule cursor-pointer" @click="showModal"><plus-circle-two-tone /> 新增日程</div>
    </div>
    <a-modal v-model:open="open" :destroy-on-close="true" title="Basic Modal" @ok="handleOk" @cancel="onClose">
      <a-form ref="formRef" :model="formState" layout="vertical">
        <a-form-item label="时间：" :rules="[{ required: true, message: '请选择时间' }]" name="scheduleTime">
          <a-time-picker v-model:value="formState.scheduleTime" value-format="HH:mm:ss" />
        </a-form-item>
        <a-form-item label="日程描述：" :rules="[{ required: true, message: '请输入日程备注' }]" name="scheduleContent">
          <a-textarea v-model:value="formState.scheduleContent" placeholder="请输入日程描述" :maxlength="18"
            :auto-size="{ minRows: 3, maxRows: 3 }" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<style scoped>
.add-schedule {
  cursor: pointer;
  /* margin-top: -10px; */
}

.ant-timeline .ant-timeline-item {
  padding-bottom: 0;
}
</style>