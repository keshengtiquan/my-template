<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import { reactive, ref } from 'vue';
import TenantForm from './tenant-form.vue';
import { createTenantApi } from '@/api/setting/tenant';
import { message } from 'ant-design-vue';

const emit = defineEmits(['submit'])
const open = ref(false)
const tenantFormRef = ref()
const formState = reactive({
  contactUserName: '',
  contactPhone: '',
  companyName: '',
  tenantPackageId: undefined,
  userName: '',
  password: '',
})
const showModal = () => {
  open.value = true
}
const submit = async () => {
  const res = await createTenantApi(formState)
  if (res.code === 200) {
    message.success(res.message)
    emit('submit')
    close()
  }

}

const close = () => {
  tenantFormRef.value.formRef.resetFields()
  open.value = false
}
defineExpose({ showModal })
</script>
<template>
  <Modal v-model="open" title="创建项目" @ok="submit" @cancel="close">
    <TenantForm v-model:modal-value="formState" ref="tenantFormRef" />
  </Modal>
</template>
<style scoped></style>