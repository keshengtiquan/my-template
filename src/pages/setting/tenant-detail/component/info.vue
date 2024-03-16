<script setup lang="ts">
import { UnwrapRef, onMounted, reactive, toRaw } from 'vue';
import { getUserListApi } from '@/api/setting/user/index'
import { getTenantInfoApi, saveTenantInfoApi } from '@/api/setting/tenant';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
interface FormState {
  companyName: string | null;
  projectName: string | null;
  projectAddress: string | null;
  manager: string | null;
  chiefEngineer: string | null;
  developmentOrganization: string | null;
  designOrganization: string | null;
  supervisorOrganization: string | null;
  tenantId: number
}
const route = useRoute()
const formState: UnwrapRef<FormState> = reactive({
  companyName: null,
  projectName: null,
  projectAddress: null,
  manager: null,
  chiefEngineer: null,
  developmentOrganization: null,
  designOrganization: null,
  supervisorOrganization: null,
  tenantId: Number(route.query.tenantId as string)
});
const onSubmit = async () => {
  console.log('submit!', toRaw(formState));

  const res = await saveTenantInfoApi(formState)
  if (res.code === 200) {
    message.success('保存成功')
  }
};
const labelCol = { span: 5 };
const wrapperCol = { span: 14 };
onMounted(async () => {

  const { data } = await getTenantInfoApi(Number(route.query.tenantId as string))
  Object.assign(formState, data)
  formState.companyName = data.tenant.companyName

}) 
</script>
<template>
  <a-form :model="formState" mt-16px :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="项目名称">
      <a-input disabled placeholder="请输入项目名称" v-model:value="formState.companyName" />
    </a-form-item>
    <a-form-item label="工程名称">
      <a-input placeholder="请输入工程名称" v-model:value="formState.projectName" />
    </a-form-item>
    <a-form-item label="项目地址">
      <a-input placeholder="请输入项目地址" v-model:value="formState.projectAddress" />
    </a-form-item>
    <a-form-item label="项目经理">
      <Select placeholder="请输入项目名" v-model="formState.manager" :limit="50"
        :fieldNames="{ label: 'nickName', value: 'id' }" extra="userName" :request="getUserListApi"></Select>
    </a-form-item>
    <a-form-item label="项目总工">
      <Select placeholder="请选择项目总工" v-model="formState.chiefEngineer" :limit="50"
        :fieldNames="{ label: 'nickName', value: 'id' }" extra="userName" :request="getUserListApi"></Select>
    </a-form-item>
    <a-form-item label="建设单位">
      <a-input placeholder="请输入建设单位" v-model:value="formState.developmentOrganization" />
    </a-form-item>
    <a-form-item label="设计单位">
      <a-input placeholder="请输入设计单位" v-model:value="formState.designOrganization" />
    </a-form-item>
    <a-form-item label="监理单位">
      <a-input placeholder="请输入监理单位" v-model:value="formState.supervisorOrganization" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 5 }">
      <a-button type="primary" @click="onSubmit">保存更改</a-button>
    </a-form-item>
  </a-form>
</template>
<style scoped></style>