<script setup lang="ts">
import { ref } from 'vue';
import { useVModel } from '@vueuse/core';
import { getCompanyDeptListApi } from '@/api/setting/company-dept/index'
type FormState = {
  userName: string,
  password?: string,
  nickName: string,
  email: string,
  phoneNumber: string,
  gender: string,
  remark: string,
  companyDeptId: number | undefined
}
const formRef = ref()
const props = defineProps<{
  formState: FormState
}>()
const emit = defineEmits(['update:formState'])
const data = useVModel(props, 'formState', emit)
defineExpose({ formRef })
</script>
<template>
  <a-form ref="formRef" :model="data" :label-col="{ style: { width: '80px', } }" :wrapper-col="{ span: 24 }">
    <a-form-item label="登录账号" name="userName" :rules="[{ required: true, message: '请输入登录账号' }]">
      <a-input v-model:value="data.userName" placeholder="角色名称"></a-input>
    </a-form-item>
    <a-form-item v-if="Object.keys(formState).includes('password')" label="登录密码" name="password" :rules="[{ required: true, message: '请输入登录密码' }]">
      <a-input-password v-model:value="data.password" placeholder="登录密码"></a-input-password>
    </a-form-item>
    <a-form-item label="用户昵称" name="nickName">
      <a-input v-model:value="data.nickName" placeholder="用户昵称"></a-input>
    </a-form-item>
    <a-form-item label="所属机构" name="parentId" >
      <TreeSelect :field-names="{ children: 'children', label: 'deptName', value: 'id', }" placeholder="请选择所属机构" v-model="formState.companyDeptId"
        :request="getCompanyDeptListApi" allowClear />
    </a-form-item>
    <a-form-item label="用户邮箱" name="email">
      <a-input v-model:value="data.email" placeholder="用户邮箱"></a-input>
    </a-form-item>
    <a-form-item label="用户电话" name="phoneNumber">
      <a-input v-model:value="data.phoneNumber" placeholder="用户电话"></a-input>
    </a-form-item>
    <a-form-item label="用户性别" name="gender">
      <a-select v-model:value="data.gender" placeholder="用户性别">
        <a-select-option value="0">未知</a-select-option>
        <a-select-option value="1">男</a-select-option>
        <a-select-option value="2">女</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="备注" name="remark">
      <a-textarea v-model:value="data.remark" placeholder="备注" :rows="4"></a-textarea>
    </a-form-item>
  </a-form>
</template>


<style scoped></style>