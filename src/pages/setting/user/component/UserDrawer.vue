<script setup lang="ts">
import {reactive, ref} from "vue";
import {ModalType} from "@/enums";
import {createUserApi} from "@/api/user";
import {message} from "ant-design-vue";
import TreeSelect from "@/components/tree-select/index.vue";
import {getDeptListApi} from "@/api/dept";
import Select from "@/components/select/index.vue";
import {getRoleListApi} from "@/api/role";
import {useEdit} from "@/pages/setting/user/component/useEdit.ts";

const emits = defineEmits(['submit'])
const open = ref(false)
const formRef = ref()
const formState = reactive({
  userName: '',
  password: '',
  nickName: '',
  email: '',
  phoneNumber: '',
  gender: '0',
  avatar: '',
  remark: '',
  deptId: undefined,
  roleIds: []
})
const title = ref('')
const currentType = ref('')
const { loading,getUserById,updateUser } = useEdit()
/**
 * 打开Drawer方法，提供给父组件
 * @param type ModalType.ADD TypeModel.Edit
 * @param id 编辑的ID
 */
const openDrawer = async (type: string, id?: number) => {
  open.value = !open.value
  type === ModalType.ADD ? title.value = '添加用户' : title.value = '编辑用户'
  currentType.value = type
  if (id && type === ModalType.Edit) {
    const data = await getUserById(id)
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
    res = await createUserApi(formState)
  } else {
    res = await updateUser(formState)
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
        :label-col=" { style: { width: '80px', } }"
        :wrapper-col="{ span: 24 }"
    >
      <a-form-item label="登录账号" name="userName" :rules="[{ required: true, message: '请输入登录账号' }]">
        <a-input v-model:value="formState.userName" placeholder="角色名称"></a-input>
      </a-form-item>
      <a-form-item label="登录密码" v-if="currentType === ModalType.ADD" name="password" :rules="[{ required: true, message: '请输入登录密码' }]">
        <a-input-password v-model:value="formState.password" placeholder="登录密码"></a-input-password>
      </a-form-item>
      <a-form-item label="用户昵称" name="nickName">
        <a-input v-model:value="formState.nickName" placeholder="用户昵称"></a-input>
      </a-form-item>
      <a-form-item label="所属部门" name="deptId">
        <TreeSelect :field-names="{children: 'children',label: 'deptName',value: 'id',}" v-model="formState.deptId"
                    placeholder="所属部门" :request="getDeptListApi" allowClear/>
      </a-form-item>
      <a-form-item label="用户角色" name="roleIds">
        <Select mode="multiple" placeholder="用户角色" v-model="formState.roleIds" :limit="50"
                :fieldNames="{label: 'roleName', value: 'id'}" :request="getRoleListApi"></Select>
      </a-form-item>
      <a-form-item label="用户邮箱" name="email">
        <a-input v-model:value="formState.email" placeholder="用户邮箱"></a-input>
      </a-form-item>
      <a-form-item label="用户电话" name="phoneNumber">
        <a-input v-model:value="formState.phoneNumber" placeholder="用户电话"></a-input>
      </a-form-item>
      <a-form-item label="用户性别" name="gender">
        <a-select v-model:value="formState.gender" placeholder="用户性别">
          <a-select-option value="0">未知</a-select-option>
          <a-select-option value="1">男</a-select-option>
          <a-select-option value="2">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formState.remark" placeholder="备注" :rows="4"></a-textarea>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>


<style lang="scss" scoped>
.checked {
  &:deep(.ant-form-item) {
    margin-bottom: 5px;
  }
}
</style>