<script lang="ts" setup>
import { ref, toRaw} from 'vue';
import type {Rule} from 'ant-design-vue/es/form';
import {useRouter} from "vue-router";

export interface FormState {
  serialNumber: number | undefined;
  listCode: string;
  listName: string;
  listCharacteristic: string;
  unit: string;
  quantities: number | undefined;
  unitPrice: number | undefined;
  combinedPrice: number | undefined;
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
  serialNumber: [
    {required: true, message: 'Please input Activity name', trigger: 'change'},
  ],
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
      <a-form-item label="序号" name="serialNumber">
        <a-input-number class="w-full" v-model:value="formState.serialNumber" placeholder="请填入序号"/>
      </a-form-item>
      <a-form-item label="项目编码" name="listCode">
        <a-input v-model:value="formState.listCode" placeholder="请填入项目编码"/>
      </a-form-item>
      <a-form-item label="项目名称" name="listName">
        <a-input v-model:value="formState.listName" placeholder="请填入项目名称"/>
      </a-form-item>
      <a-form-item label="项目特征" name="listCharacteristic">
        <a-textarea :rows="4" v-model:value="formState.listCharacteristic" placeholder="请填入项目特征"/>
      </a-form-item>
      <a-form-item label="单位" name="unit">
        <a-input v-model:value="formState.unit" placeholder="请填入单位"/>
      </a-form-item>
      <a-form-item label="工程量" name="quantities">
        <a-input-number min="0" class="w-full" v-model:value="formState.quantities" placeholder="请填入工程量"/>
      </a-form-item>
      <a-form-item label="单价" name="unitPrice">
        <a-input-number min="0" class="w-full" v-model:value="formState.unitPrice" placeholder="请填入单价"/>
      </a-form-item>
      <a-form-item label="合价" name="combinedPrice">
        <a-input-number min="0" class="w-full" v-model:value="formState.combinedPrice" placeholder="请填入合价"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary" style="margin-left: 8px" @click="onSubmit">提交</a-button>
      </a-form-item>
    </a-form>

  </a-card>
</template>


