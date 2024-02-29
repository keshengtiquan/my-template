<script setup lang="ts">
import {reactive, ref} from "vue";
import {ModalType} from "@/enums";
import {message} from "ant-design-vue";
import {useTreeSelect} from "@/composables/useTreeSelect.ts";
import {getMenuListApi} from "@/api/menu";
import {createRoleApi} from "@/api/role";
import {useEdit} from "@/pages/setting/role/component/useEdit.ts";
import {extractChildrenIdList} from "@/utils";

const emits = defineEmits(['submit'])
const open = ref(false)
const formRef = ref()
const menuTreeRef = ref()
const formState = reactive({
  roleName: '',
  roleKey: '',
  roleSort: '',
  remark: '',
  menuIds: []
})
const checkedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const expandedKeys = ref<string[]>()
const allChecked = ref(false)
const allExpend = ref(false)
const {treeData} = useTreeSelect(getMenuListApi)
const title = ref('')
const currentType = ref('')
const { loading,getRoleById,updateRole } = useEdit()
/**
 * 打开Drawer方法，提供给父组件
 * @param type ModalType.ADD TypeModel.Edit
 * @param id 编辑的ID
 */
const openDrawer = async (type: string, id?: number) => {
  open.value = !open.value
  type === ModalType.ADD ? title.value = '添加角色' : title.value = '编辑角色'
  currentType.value = type
  if (id && type === ModalType.Edit) {
    const data = await getRoleById(id)
    const checkedChildId = getChildNode(data.menus)
    console.log(checkedChildId)
    Object.assign(formState, data)
    checkedKeys.value = checkedChildId
  }
}
/**
 * 全选/全不选
 */
const selectAllChange = () => {
  if (allChecked.value) {
    const arr = treeData.value!.map(item => {
      return item.id
    })
    checkedKeys.value = arr
  } else {
    checkedKeys.value = []
  }
}
/**
 * 展开/折叠方法
 */
const expandOrSelectAllChange = () => {
  console.log(allExpend.value)
  if (allExpend.value) {
    const arr = treeData.value!.map(item => {
      return item.id
    })
    expandedKeys.value = arr
  } else {
    expandedKeys.value = []
  }
}
/**
 * 获取半选全选的节点
 */
const getMenuAllCheckedKeys = () => {
  // 目前被选中的菜单节点
  let checkedKeys = menuTreeRef.value.checkedKeys;
  // 半选中的菜单节点
  let halfCheckedKeys = menuTreeRef.value.halfCheckedKeys;
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/**
 * 获取树形组件的所有选中的子节点ID
 * @param menuIds
 */
const getChildNode = (menuIds: any[]) => {
  //所有的子节点id（不包含父级节点）
  const menuChildId = extractChildrenIdList(treeData.value ? treeData.value : [])
  console.log(menuChildId)
  //后台返回的节点ID（包含父级绩点）
  const menuIdsList = menuIds.map(item => item.id)
  console.log(menuIdsList)
  //所有父级节点
  const parentIdArr = treeData.value!.map(item => {
    return item.id
  })
  const difference = parentIdArr.filter((x) => menuIdsList.includes(x));
  expandedKeys.value = difference
  //取交集
  return menuChildId.filter(value => menuIdsList.includes(value));
}
/**
 * 提交方法
 */
const onSubmit = async () => {
  await formRef.value?.validateFields()
  formState.menuIds = getMenuAllCheckedKeys()
  let res = null
  if (currentType.value === ModalType.ADD) {
    res = await createRoleApi(formState)
  } else {
    res = await updateRole(formState)
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
  checkedKeys.value = []
  allChecked.value = false
  allExpend.value = false
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
      <a-form-item label="角色名称" name="roleName" :rules="[{ required: true, message: '请输入角色名称' }]">
        <a-input v-model:value="formState.roleName" placeholder="角色名称"></a-input>
      </a-form-item>
      <a-form-item label="角色字符" name="roleKey" :rules="[{ required: true, message: '请输入角色字符' }]">
        <a-input v-model:value="formState.roleKey" placeholder="角色字符"></a-input>
      </a-form-item>
      <a-form-item label="角色排序" name="roleSort" :rules="[{ required: true, message: '请输入角色排序' }]">
        <a-input-number class="w-full" v-model:value="formState.roleSort" placeholder="角色排序"></a-input-number>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formState.remark" placeholder="备注" :rows="4"/>
      </a-form-item>
      <a-form-item label="关联菜单" name="remark">
        <div class="flex checked">
          <a-form-item>
            <a-checkbox v-model:checked="allChecked" @change="selectAllChange">全选/全不选</a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-checkbox v-model:checked="allExpend" @change="expandOrSelectAllChange">展开/折叠</a-checkbox>
          </a-form-item>
        </div>
        <a-tree class="border b-solid b-gray-200" ref="menuTreeRef"
                :autoExpandParent="allExpend"
                v-model:expandedKeys="expandedKeys"
                v-model:checkedKeys="checkedKeys"
                v-model:selectedKeys="selectedKeys" checkable
                :tree-data="treeData"
                :field-names="{children: 'children',title: 'title',key: 'id',}"></a-tree>
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
</style>