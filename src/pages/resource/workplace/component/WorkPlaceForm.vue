<script lang="ts" setup>
import { ref, toRaw} from 'vue';
import type {Rule} from 'ant-design-vue/es/form';
import {useRouter} from "vue-router";

export interface FormState {
  sortNumber: number | undefined,
  workPlaceCode: string,
  workPlaceName: string,
  workPlaceType: string | undefined
}
const props = withDefaults(defineProps<{
  formState: FormState
}>(),{})
const emits = defineEmits(['submit'])
const formRef = ref();
const labelCol = {lg: { span: 8 }, sm: { span: 3 }};
const wrapperCol = {lg: { span: 10 }, sm: { span: 21 }};
const router = useRouter();

const rules: Record<string, Rule[]> = {
  sortNumber: [{required: true, message: '请输入工点排序', trigger: 'blur'},],
  workPlaceCode: [{required: true, message: '请输入工点编码', trigger: 'blur'},],
  workPlaceName: [{required: true, message: '请输入工点名称', trigger: 'blur'},],
  workPlaceType: [{required: true, message: '请选择工点类型', trigger: 'blur'},],
};
const onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        emits('submit', toRaw(props.formState))
      })
      .catch(error => {
        console.log('error', error);
      });
};
const resetForm = () => {
  formRef.value.resetFields();
};
const onCancel = () => {
  resetForm()
  router.go(-1)
}
</script>
<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
    >
      <a-form-item label="排序" name="sortNumber">
        <a-input-number class="w-full" v-model:value="formState.sortNumber" placeholder="请填入排序"/>
      </a-form-item>
      <a-form-item label="工点编码" name="workPlaceCode">
        <a-input v-model:value="formState.workPlaceCode" placeholder="请填入序号"/>
      </a-form-item>
      <a-form-item label="工点名称" name="workPlaceName">
        <a-input v-model:value="formState.workPlaceName" placeholder="请填入项目编码"/>
      </a-form-item>
      <a-form-item label="工点类型" name="workPlaceType">
        <a-select v-model:value="formState.workPlaceType" placeholder="请填入项目名称">
          <a-select-option value="station">车站</a-select-option>
          <a-select-option value="section">区间</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary" style="margin-left: 8px" @click="onSubmit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>


