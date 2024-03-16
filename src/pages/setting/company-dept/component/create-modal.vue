<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import CompanyForm from './company-form.vue'
import { reactive, ref } from 'vue';
import { createCompanyDeptApi } from '@/api/setting/company-dept';

const emit = defineEmits(['submit'])
const open = ref(false)
const companyFormRef = ref()
const formState = reactive({
  parentId: 0,
  deptName: '',
  deptType: undefined,
  sortNumber: 10,
  leaderId: undefined
})
const showModal = (parentId: number) => {
  if (parentId) {
    formState.parentId = parentId
  }
  open.value = true
}
const submit = async () => {
  const res = await createCompanyDeptApi(formState)
  if (res.code === 200) {
    emit('submit')
    close()
  }
}

const close = () => {
  companyFormRef.value.formRef.resetFields()
  open.value = false
}
defineExpose({ showModal })
</script>
<template>
  <Modal v-model="open" title="添加组织" @ok="submit" @cancel="close">
    <CompanyForm v-model:modal-value="formState" ref="companyFormRef" />
  </Modal>
</template>
<style scoped></style>