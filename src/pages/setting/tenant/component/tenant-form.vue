<script setup lang="ts">
import { ref } from 'vue';
import { useVModel } from '@vueuse/core';
import { getPackageListApi } from '@/api/setting/package/index'
type FormState = {
  contactUserName: string,
  contactPhone: string,
  companyName: string,
  tenantPackageId?: undefined,
  userName?: string,
  password?: string,
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
  <a-form ref="formRef" :model="formState" :label-col="{ style: { width: '120px', } }" :wrapper-col="{ span: 24 }">
    <a-form-item label="联系人" name="contactUserName" :rules="[{ required: true, message: '请输入联系人' }]">
      <a-input v-model:value="formState.contactUserName" placeholder="联系人"></a-input>
    </a-form-item>
    <a-form-item label="联系电话" name="contactPhone" :rules="[{ required: true, message: '请输入联系电话' }]">
      <a-input v-model:value="formState.contactPhone" placeholder="联系电话"></a-input>
    </a-form-item>
    <a-form-item label="项目名称" name="companyName" :rules="[{ required: true, message: '请输入项目名称' }]">
      <a-input v-model:value="formState.companyName" placeholder="项目名称"></a-input>
    </a-form-item>
    <a-form-item label="项目管理员账号" name="userName" :rules="[{ required: true, message: '请输入项目管理员账号' }]">
      <a-input v-model:value="formState.userName" placeholder="项目管理员账号"></a-input>
    </a-form-item>
    <a-form-item label="项目管理员密码" name="password" :rules="[{ required: true, message: '请输入项目管理员账号' }]">
      <a-input v-model:value="formState.password" placeholder="项目管理员账号"></a-input>
    </a-form-item>
    <a-form-item label="项目套餐" name="tenantPackageId" :rules="[{ required: true, message: '请选择项目套餐' }]">
      <Select mode="tag" placeholder="项目套餐" v-model="formState.tenantPackageId" :limit="50"
        :fieldNames="{ label: 'packageName', value: 'id' }" :request="getPackageListApi"></Select>
    </a-form-item>
  </a-form>
</template>
<style scoped></style>