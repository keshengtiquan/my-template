<script setup lang="ts">
import {reactive, ref} from "vue";
import {ModalType} from "@/enums";
import {createDeptApi, getDeptListApi} from "@/api/dept";
import {message} from "ant-design-vue";
import {getUserListApi} from "@/api/user";
import Select from '@/components/select/index.vue'
import TreeSelect from "@/components/tree-select/index.vue";
import {useEdit} from "@/pages/setting/dept/component/useEdit.ts";

const emits = defineEmits(['submit'])
const open = ref(false)
const formRef = ref()
const formState = reactive({
  parentId: 0,
  deptName: '',
  leader: undefined,
  deptType: undefined,
  phone: '',
  email: '',
  remarks: ''
})
const title = ref('')
const currentType = ref('')
const { loading,getDeptById,updateDept } = useEdit()
/**
 * 打开Drawer方法，提供给父组件
 * @param type ModalType.ADD TypeModel.Edit
 * @param id 编辑的ID
 */
const openDrawer = async (type: string, id?: number) => {
  open.value = !open.value
  type === ModalType.ADD ? title.value = '添加部门' : title.value = '编辑部门'
  currentType.value = type
  if (id && type === ModalType.Edit) {
    const data = await getDeptById(id)
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
    res = await createDeptApi(formState)
  } else {
    res = await updateDept(formState)
  }
  if (res.code === 200) {
    message.success(res.message)
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
        :label-col=" { style: { width: '100px', } }"
        :wrapper-col="{ span: 24 }"
    >
      <a-form-item label="上级部门" name="parentId" >
        <TreeSelect :field-names="{children: 'children',label: 'deptName',value: 'id',}" v-model="formState.parentId"
                    :request="getDeptListApi" allowClear/>
      </a-form-item>
      <a-form-item label="部门名称" name="deptName" :rules="[{ required: true, message: '请输入部门名称' }]">
        <a-input v-model:value="formState.deptName" placeholder="部门名称"></a-input>
      </a-form-item>
      <a-form-item label="部门类型" name="deptType" :rules="[{ required: true, message: '请输入部门名称' }]">
        <a-select class="w-full" v-model:value="formState.deptType" placeholder="部门类型">
          <a-select-option value="0">项目部</a-select-option>
          <a-select-option value="1">部门</a-select-option>
          <a-select-option value="2">作业队</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="部门领导人" name="leader" :rules="[{ required: true, message: '请输入部门领导人' }]">
        <Select placeholder="用户角色" v-model="formState.leader" :limit="50"
                :fieldNames="{label: 'nickName', value: 'id'}" :request="getUserListApi"></Select>
      </a-form-item>
      <a-form-item label="联系电话" name="phone" >
        <a-input v-model:value="formState.phone" placeholder="联系电话"></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email" >
        <a-input v-model:value="formState.email" placeholder="邮箱"></a-input>
      </a-form-item>
      <a-form-item label="备注" name="remarks" >
        <a-textarea v-model:value="formState.remarks" :rows="4" placeholder="备注"></a-textarea>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>


<style lang="scss" scoped>
.checked {
  &:deep(.ant-form-item){
    margin-bottom: 5px;
  }
}
</style>@/api/setting/dept@/api/setting/user