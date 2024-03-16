<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import UserForm from './user-form.vue'
import { reactive, ref } from 'vue';
import { getUserByIdAPi, updateUserApi } from '@/api/setting/user';

const emit = defineEmits(['submit'])
const loading = ref(false)
const open = ref(false)
const userFormRef = ref()
const formState = reactive({
  userName: '',
  nickName: '',
  email: '',
  phoneNumber: '',
  gender: '0',
  remark: '',
  companyDeptId: undefined
})
const showModal = async (id: number) => {
  open.value = true
  loading.value = true
  const { data: user } = await getUserByIdAPi(id)
  Object.assign(formState, user)
  // formState.userName = user.userName
  // formState.nickName = user.nickName
  // formState.email = user.email
  // formState.phoneNumber = user.phoneNumber
  // formState.gender = user.gender
  // formState.remark = user.remark
  loading.value = false
}
const submit = async () => {
  const res = await updateUserApi(formState)
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
  <Modal v-model="open" title="修改用户" @ok="submit" @cancel="close">
    <a-skeleton :loading="loading" />
    <UserForm v-model:form-state="formState" ref="userFormRef" />
  </Modal>
</template>
<style scoped></style>