<script lang="ts" setup>
import {computed, ref} from 'vue';
import type {Rule} from 'ant-design-vue/es/form';
import {useRouter} from "vue-router";
import TreeSelect from '@/components/tree-select/index.vue'
import {getDivisionTree} from "@/api/division";

export interface FormState {
  parentId: string,
  divisionName: string,
  divisionType: string | undefined
}
const props = withDefaults(defineProps<{
  formState: FormState
}>(),{})
const emits = defineEmits(['submit','update:formState'])
const formRef = ref();
const labelCol = {lg: { span: 7 }, sm: { span: 3 }};
const wrapperCol = {lg: { span: 10 }, sm: { span: 21 }};
const router = useRouter();

const rules: Record<string, Rule[]> = {
  divisionName: [
    {required: true, message: 'Please input Activity name', trigger: 'change'},
  ],
  divisionType: [
    {required: true, message: 'Please input Activity name', trigger: 'change'},
  ],
};
const formStateComputed = computed({
  set(value: FormState) {
    emits("update:formState", value)
  },
  get(): FormState {
    return props.formState
  },
})
const onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        emits('submit')
      })
      .catch((error: any) => {
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
        :model="formStateComputed"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
    >
      <a-form-item label="上级" name="parentId">
        <TreeSelect :field-names="{children: 'children',label: 'divisionName',value: 'id',}" v-model="formState.parentId"
                    :request="getDivisionTree" allowClear/>
      </a-form-item>
      <a-form-item label="分部分项名称" name="divisionName">
        <a-input class="w-full" v-model:value="formStateComputed.divisionName" placeholder="请填入分部分项名称"/>
      </a-form-item>
      <a-form-item label="分部分项类型" name="divisionType">
        <a-select class="w-full" v-model:value="formStateComputed.divisionType" placeholder="请选择分部分项类型">
          <a-select-option value="单位工程">单位工程</a-select-option>
          <a-select-option value="子单位工程">子单位工程</a-select-option>
          <a-select-option value="分部工程">分部工程</a-select-option>
          <a-select-option value="子分部工程">子分部工程</a-select-option>
          <a-select-option value="分项工程">分项工程</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 23 }" style="text-align: center">
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary" style="margin-left: 8px" @click="onSubmit">提交</a-button>
      </a-form-item>
    </a-form>

  </a-card>
</template>


