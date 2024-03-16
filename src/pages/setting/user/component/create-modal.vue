<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import UserForm from './user-form.vue'
import { reactive, ref } from 'vue';
import { createUserApi } from '@/api/setting/user';

const emit = defineEmits(['submit'])
const open = ref(false)
const userFormRef = ref()
const formState = reactive({
  userName: '',
  password: '',
  nickName: '',
  email: '',
  phoneNumber: '',
  gender: '0',
  avatar: '',
  remark: '',
  companyDeptId: undefined
})
const showModal = () => {
  open.value = true
}
const submit = async () => {
  const values = await userFormRef.value.formRef.validate()
  if (!values) return
  const res = await createUserApi(formState)
  if (res.code === 200) {
    emit('submit')
    close()
  }
}

const close = () => {
  userFormRef.value.formRef.resetFields()
  open.value = false
}
defineExpose({ showModal })
</script>
<template>
  <Modal v-model="open" title="添加用户" @ok="submit" @cancel="close">
    <UserForm v-model:form-state="formState" ref="userFormRef" />
  </Modal>
</template>
<style scoped></style>