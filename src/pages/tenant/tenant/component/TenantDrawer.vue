<script setup lang="ts">
import {reactive, ref} from "vue";
import {ModalType} from "@/enums";
import {getPackageListApi} from "@/api/package";
import Select from '@/components/select/index.vue'
import {createTenantApi} from "@/api/tenant";
import {message} from "ant-design-vue";
import {useEdit} from "@/pages/tenant/tenant/component/useEdit.ts";


const emits = defineEmits(['submit'])
const open = ref(false)
const formRef = ref()
const formState = reactive({
  contactUserName: '',
  contactPhone: '',
  companyName: '',
  address: '',
  packageId: undefined,
  userName: '',
  password: '',
})

const title = ref('')
const currentType = ref('')
const { loading,getTenantById,updateTenant } = useEdit()
/**
 * 打开Drawer方法，提供给父组件
 * @param type ModalType.ADD TypeModel.Edit
 * @param id 编辑的ID
 */
const openDrawer = async (type: string, id?: number) => {
  open.value = !open.value
  type === ModalType.ADD ? title.value = '添加租户' : title.value = '编辑租户'
  currentType.value = type
  if (id && type === ModalType.Edit) {
    const data = await getTenantById(id)
    Object.assign(formState, data)
  }
}
/**
 * 提交方法
 */
const onSubmit = async () => {
  await formRef.value?.validateFields()
  let res = null
  if (currentType.value === ModalType.ADD) {
    res = await createTenantApi(formState)
  } else {
    res = await updateTenant(formState)
  }
  if (res!.code === 200) {
    message.success(res!.message)
    emits('submit')
    onClose()
  }

}
/**
 * 关闭Drawer方法
 */
const onClose = () => {
  formRef.value.resetFields();
  open.value = false
}

defineExpose({openDrawer})
</script>
<template>
  <a-drawer destroyOnClose v-model:open="open" width="30%" :footerStyle="{display: 'flex',justifyContent: 'flex-end'}"
            @close="onClose" :title="title">
    <template #footer>
      <a-space>
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSubmit">提交</a-button>
      </a-space>
    </template>
    <a-skeleton v-if="loading" active :paragraph="{ rows: 8 }"/>
    <a-form
        v-else
        ref="formRef"
        :model="formState"
        :label-col=" { style: { width: '120px', } }"
        :wrapper-col="{ span: 24 }"
    >
      <a-form-item label="联系人" name="contactUserName" :rules="[{ required: true, message: '请输入联系人' }]">
        <a-input v-model:value="formState.contactUserName" placeholder="联系人"></a-input>
      </a-form-item>
      <a-form-item label="联系电话" name="contactPhone" :rules="[{ required: true, message: '请输入联系电话' }]">
        <a-input v-model:value="formState.contactPhone" placeholder="联系电话"></a-input>
      </a-form-item>
      <a-form-item label="租户名称" name="companyName" :rules="[{ required: true, message: '请输入租户名称' }]">
        <a-input v-model:value="formState.companyName" placeholder="租户名称"></a-input>
      </a-form-item>
      <a-form-item label="租户地址" name="address" :rules="[{ required: true, message: '请输入租户地址' }]">
        <a-input v-model:value="formState.address" placeholder="租户地址"></a-input>
      </a-form-item>
      <a-form-item v-if="currentType === 'add'" label="租户管理员账号" name="userName"
                   :rules="[{ required: true, message: '请输入租户管理员账号' }]">
        <a-input v-model:value="formState.userName" placeholder="租户管理员账号"></a-input>
      </a-form-item>
      <a-form-item v-if="currentType === 'add'" label="租户管理员密码" name="password"
                   :rules="[{ required: true, message: '请输入租户管理员账号' }]">
        <a-input v-model:value="formState.password" placeholder="租户管理员账号"></a-input>
      </a-form-item>
      <a-form-item label="租户套餐" name="packageId" :rules="[{ required: true, message: '请选择租户套餐' }]">
        <Select  mode="tag" placeholder="租户套餐" v-model="formState.packageId"  :limit="50" :fieldNames="{label: 'packageName', value: 'id'}" :request="getPackageListApi" ></Select>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>


<style scoped>

</style>