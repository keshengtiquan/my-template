<script setup lang="ts">
import {reactive, ref} from "vue";
import {getMenuDataApi} from "@/api/menu";
import {useTreeSelect} from "@/composables/useTreeSelect.ts";
import {ModalType} from "@/enums";
import {createPackageApi} from "@/api/package";
import {message} from "ant-design-vue";
import {useEdit} from "./useEdit.ts";
import {extractChildrenIdList} from "@/utils";

const emits = defineEmits(['submit'])
const open = ref(false)
const formRef = ref()
const formState = reactive({
  packageName: '',
  remark: '',
  menuIds: ''
})
const expandedKeys = ref<string[]>([])
const checkedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const packageTreeRef = ref()
const title = ref('')
const {treeData} = useTreeSelect(getMenuDataApi)
const currentType = ref('')
const {loading, getPackageById, updatePackage} = useEdit()
/**
 * 打开Drawer方法，提供给父组件
 * @param type ModalType.ADD TypeModel.Edit
 * @param id 编辑的ID
 */
const openDrawer = async (type: string, id?: string) => {
  open.value = !open.value
  type === ModalType.ADD ? title.value = '添加套餐' : title.value = '编辑套餐'
  currentType.value = type
  if (id && type === ModalType.Edit) {
    const data = await getPackageById(id)
    const checkedChildId = getChildNode(data.menuIds)
    Object.assign(formState, data)
    checkedKeys.value = checkedChildId
  }
}
/**
 * 获取树形组件的所有选中的子节点ID
 * @param menuIds
 */
const getChildNode = (menuIds: string) => {
  //所有的子节点id（不包含父级节点）
  const menuChildId = extractChildrenIdList(treeData.value ? treeData.value : [])
  //后台返回的节点ID（包含父级绩点）
  const menuIdsList = menuIds.split(',')
  //取交集
  return menuChildId.filter(value => menuIdsList.includes(value));
}

/**
 * 展开/折叠方法 全选/全不选
 * @param type expend | all
 * @param isTrue 是否展开/全选
 */
const expandOrSelectAllChange = (type: string, isTrue: boolean) => {
  if (isTrue) {
    const arr = treeData.value!.map(item => {
      return item.id
    })
    if (type === 'expend') expandedKeys.value = arr
    else checkedKeys.value = arr
  } else {
    if (type === 'expend') expandedKeys.value = []
    else checkedKeys.value = []
  }
}
/**
 * 获取半选全选的节点
 */
const getMenuAllCheckedKeys = () => {
  // 目前被选中的菜单节点
  let checkedKeys = packageTreeRef.value.checkedKeys;
  // 半选中的菜单节点
  let halfCheckedKeys = packageTreeRef.value.halfCheckedKeys;
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/**
 * 提交方法
 */
const onSubmit = async () => {
  await formRef.value?.validateFields()
  formState.menuIds = getMenuAllCheckedKeys().join()
  let res = null
  if (currentType.value === ModalType.ADD) {
    res = await createPackageApi(formState)
  } else {
    res = await updatePackage(formState)
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
        :label-col=" { style: { width: '80px' } }"
        :wrapper-col="{ span: 24 }"
    >
      <a-form-item label="套餐名称" name="packageName" :rules="[{ required: true, message: '请输入套餐名称' }]">
        <a-input v-model:value="formState.packageName" placeholder="套餐名称"></a-input>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formState.remark" placeholder="添加备注" :rows="4"/>
      </a-form-item>
      <div>
        <a-dropdown class="ml-20px">
          <span class="">
            关联菜单
            <MoreOutlined class="font-400 font-size-16px "/>
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="expandOrSelectAllChange('expend',true)">
                <a href="javascript:;">展开全部</a>
              </a-menu-item>
              <a-menu-item @click="expandOrSelectAllChange('expend',false)">
                <a href="javascript:;">折叠全部</a>
              </a-menu-item>
              <a-menu-divider/>
              <a-menu-item @click="expandOrSelectAllChange('all',true)">
                <a href="javascript:;">全选</a>
              </a-menu-item>
              <a-menu-item @click="expandOrSelectAllChange('all',false)">
                <a href="javascript:;">全不选</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-tree  class="ml-50px mt-10px" ref="packageTreeRef" v-model:expandedKeys="expandedKeys"
                v-model:checkedKeys="checkedKeys"
                v-model:selectedKeys="selectedKeys" checkable
                :tree-data="treeData"
                :field-names="{children: 'children',title: 'title',key: 'id',}"></a-tree>
      </div>
    </a-form>
  </a-drawer>
</template>


<style scoped>

</style>