<script setup lang="ts">
import Form from './form.vue'
import {onMounted, reactive, ref} from "vue";
import { getGanttById, updateGanttApi} from "@/api/gantt";
import {message} from "ant-design-vue";
import * as dayjs from "dayjs";

const open = ref<boolean>(false);

interface FormStateType {
  text: string
  startDate: string
  duration: number
  endDate: string
  parent: string
}

const formRef1 = ref()
const emits = defineEmits(['submit'])
const formState = reactive<FormStateType>({
  text: '',
  startDate: dayjs(new Date()).format('YYYY-MM-DD'),
  duration: 1,
  endDate: '',
  parent: '0',
})
const showModal = async (id: string) => {
  const {data} = await getGanttById(id)
  Object.assign(formState, data)
  open.value = true;
};

const handleOk = async () => {
  await formRef1.value.validate()
  const res = await updateGanttApi(formState)
  if (res.code === 200) {
    message.success(res.message)
    emits('submit')
  }
  formRef1.value.resetForm()
  open.value = false;
};
const durationChange = (value: number) => {
  formState.endDate = calcEndDate(formState.startDate, value);
}
const startDateChange = (value: string) => {
  formState.endDate = calcEndDate(value, formState.duration);
}
const calcEndDate = (startDate: string, duration: number) => {
  const endDate = dayjs(startDate).add(duration - 1, 'day').format('YYYY-MM-DD');
  return endDate;
}
onMounted(async () => {

})

defineExpose({showModal})
</script>
<template>
  <a-modal v-model:open="open" destroy-on-close title="创建" @ok="handleOk">
    <Form ref="formRef1" v-model:form-state="formState" @durationChange="durationChange" @start-date-change="startDateChange"></Form>
  </a-modal>
</template>
<style scoped>

</style>