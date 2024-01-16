<script setup lang="ts">
import {computed, ref} from "vue";
import TreeSelect from "@/components/tree-select/index.vue";
import {getGanttTree} from "@/api/gantt";

interface FormStateType {
  text: string
  startDate: string | undefined | Date
  duration: number | undefined
  endDate: string | undefined | Date
  parent: string
}
const formRef = ref()
const props = defineProps<{
  formState: FormStateType
}>()
const emits = defineEmits(['durationChange','startDateChange','update:formState'])
const formStateComputed = computed({
  set(value: FormStateType) {
    emits("update:formState", value)
  },
  get(): FormStateType {
    return props.formState
  },
})
const durationChange = (value: number) => {
  emits('durationChange', value)
}
const startDateChange = (date: string, dateString: string) => {
  emits('startDateChange', date)
}
const validate = async () => {
 return await formRef.value.validate()
}
const resetForm = () => {
  formRef.value.resetFields();
};
defineExpose({validate,resetForm})
</script>
<template>
  <a-form
      ref="formRef"
      :model="formStateComputed"
      :label-col="{lg: { span: 7 }, sm: { span: 3 }}"
      :wrapper-col="{lg: { span: 10 }, sm: { span: 21 }}"
  >
    <a-form-item label="上级任务" name="parent" :rules="[{ required: true, message: '请输入任务名称' }]">
      <TreeSelect :field-names="{children: 'children',label: 'text',value: 'id',}" v-model="formState.parent"
                  :request="getGanttTree" allowClear/>
    </a-form-item>
    <a-form-item label="任务名称" name="text" :rules="[{ required: true, message: '请输入任务名称' }]">
      <a-input v-model:value="formStateComputed.text" placeholder="任务名称"></a-input>
    </a-form-item>
    <a-form-item label="开始时间" name="startDate" :rules="[{ required: true, message: '请选择开始时间' }]">
      <a-date-picker @change="startDateChange" valueFormat="YYYY-MM-DD" v-model:value="formStateComputed.startDate" placeholder="开始时间"/>
    </a-form-item>
    <a-form-item label="持续时间" name="duration" :rules="[{ required: true, message: '请填写持续时间' }]">
      <a-input-number @change="durationChange" :formatter="(value: number) => value + ' 天'" :min="1" v-model:value="formStateComputed.duration"
                      placeholder="持续时间"></a-input-number>
    </a-form-item>
    <a-form-item label="结束时间" name="endDate">
      <a-date-picker disabled valueFormat="YYYY-MM-DD" v-model:value="formStateComputed.endDate"/>
    </a-form-item>
  </a-form>
</template>
<style scoped>

</style>