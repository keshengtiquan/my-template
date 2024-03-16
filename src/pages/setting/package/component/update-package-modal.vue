<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import PackageForm from './package-form.vue';
import { reactive, ref } from 'vue';
import { updatePackageApi, getPackageByIdApi } from '@/api/setting/package';
import { extractChildrenIdList } from '@/utils';
import { message } from 'ant-design-vue';

const emit = defineEmits(['submit'])
const open = ref(false)
const loading = ref(false)
const packageFormRef = ref()
const formState = reactive({
  packageName: '',
  remark: '',
  menuIds: ''
})
const showModal = async (id: number) => {
  open.value = true
  loading.value = true
  const { data } = await getPackageByIdApi(id)
  loading.value = false
  Object.assign(formState, data)
  const checkedChildId = await getChildNode(data.menuIds)
  packageFormRef.value.checkedKeys = checkedChildId
}
/**
 * 获取树形组件的所有选中的子节点ID
 * @param menuIds
 */
const getChildNode = async (menuIds: string) => {
  const treeData = await packageFormRef.value.getTreeData()
  //所有的子节点id（不包含父级节点）
  const menuChildId = extractChildrenIdList(treeData ? treeData : [])

  //后台返回的节点ID（包含父级节点）
  const menuIdsList = menuIds.split(',').map(item => Number(item))

  //取交集
  return menuChildId.filter(value => menuIdsList.includes(value));
}
const submit = async () => {
  formState.menuIds = packageFormRef.value.getMenuAllCheckedKeys().join()
  console.log(formState);
  const res = await updatePackageApi(formState)
  if (res.code === 200) {
    message.success(res.message)
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
    <a-skeleton :loading="loading" />
    <PackageForm v-model:modal-value="formState" ref="packageFormRef" />
  </Modal>
</template>
<style scoped></style>