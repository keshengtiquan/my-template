<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import PackageForm from './package-form.vue';
import { reactive, ref } from 'vue';
import { createPackageApi } from '@/api/setting/package';

const emit = defineEmits(['submit'])
const open = ref(false)
const packageFormRef = ref()
const formState = reactive({
  packageName: '',
  remark: '',
  menuIds: ''
})
const showModal = () => {
  open.value = true
}
const submit = async () => {
  formState.menuIds = packageFormRef.value.getMenuAllCheckedKeys().join()
  const res = await createPackageApi(formState)
  if (res.code === 200) {
    emit('submit')
    close()
  }
}

const close = () => {
  packageFormRef.value.formRef.resetFields()
  packageFormRef.value.checkedKeys = []
  open.value = false
}
defineExpose({ showModal })
</script>
<template>
  <Modal v-model="open" title="添加套餐" @ok="submit" @cancel="close">
    <PackageForm v-model:modal-value="formState" ref="packageFormRef" />
  </Modal>
</template>
<style scoped></style>