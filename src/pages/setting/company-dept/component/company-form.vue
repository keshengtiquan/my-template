<script setup lang="ts">
import { ref } from 'vue';
import { useVModel } from '@vueuse/core';
import { getCompanyDeptListApi } from '@/api/setting/company-dept/index'
import TreeSelect from '@/components/tree-select/index.vue'
import {CompanyDeptTypeEnum} from '@/enums/index'
import { getUserListApi } from '@/api/setting/user/index'
import Select from '@/components/select/index.vue'

type FormState = {
  parentId: number;
  deptName: string;
  deptType: string | undefined;
  sortNumber: number | undefined;
  leaderId: number | undefined;
}
const formRef = ref()
const props = defineProps<{
  modalValue: FormState
}>()
const emit = defineEmits(['update:modalValue'])
const formState = useVModel(props, 'modalValue', emit)
defineExpose({ formRef })
</script>
<template>
  <a-form ref="formRef" :model="formState" :label-col="{ style: { width: '80px', } }" :wrapper-col="{ span: 24 }">
    <a-form-item label="上级组织" name="parentId" :rules="[{ required: true, message: '请选择上级组织' }]">
      <TreeSelect :field-names="{ children: 'children', label: 'deptName', value: 'id', }" v-model="formState.parentId"
        :request="getCompanyDeptListApi" allowClear />
    </a-form-item>
    <a-form-item label="组织名称" name="deptName" :rules="[{ required: true, message: '请输入组织名称' }]">
      <a-input v-model:value="formState.deptName" placeholder="组织名称"></a-input>
    </a-form-item>
    <a-form-item label="组织分类" name="deptType" :rules="[{ required: true, message: '请输入组组织分类' }]">
      <a-select v-model:value="formState.deptType"  style="width: 100%" placeholder="组织分类">
        <a-select-option :value="CompanyDeptTypeEnum.COMPANY">公司</a-select-option>
        <a-select-option :value="CompanyDeptTypeEnum.DEPT">部门</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="排序" name="sortNumber" :rules="[{ required: true, message: '请输入排序' }]">
      <a-input-number v-model:value="formState.sortNumber" style="width: 100%" :min="1" placeholder="排序"></a-input-number>
    </a-form-item>
    <a-form-item label="负责人">
      <Select placeholder="请输入负责人" v-model="formState.leaderId" :limit="50"
        :fieldNames="{ label: 'nickName', value: 'id' }" extra="userName" :request="getUserListApi"></Select>
    </a-form-item>
  </a-form>
</template>


<style scoped></style>