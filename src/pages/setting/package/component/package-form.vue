<script setup lang="ts">
import { ref } from 'vue';
import { useVModel } from '@vueuse/core';
import { useTreeSelect } from '@/composables/useTreeSelect';
import { getMenuDataApi } from '@/api/setting/menu';
type FormState = {
  packageName: string,
  remark: string
}
const formRef = ref()
const props = defineProps<{
  modalValue: FormState
}>()
const { getTreeData, treeData } = useTreeSelect(getMenuDataApi)
const emit = defineEmits(['update:modalValue'])
const formState = useVModel(props, 'modalValue', emit)
const expandedKeys = ref<string[]>([])
const checkedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const packageTreeRef = ref()

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
defineExpose({ formRef, checkedKeys,getTreeData, treeData, getMenuAllCheckedKeys })
</script>
<template>
  <a-form ref="formRef" :model="formState" :label-col="{ style: { width: '80px', } }" :wrapper-col="{ span: 24 }">
    <a-form-item label="套餐名称" name="packageName" :rules="[{ required: true, message: '请输入套餐名称' }]">
      <a-input v-model:value="formState.packageName" placeholder="套餐名称"></a-input>
    </a-form-item>
    <a-form-item label="备注" name="remark">
      <a-textarea v-model:value="formState.remark" placeholder="添加备注" :rows="4" />
    </a-form-item>
    <div>
      <a-dropdown class="ml-20px">
        <span class="">
          关联菜单
          <MoreOutlined class="font-400 font-size-16px " />
        </span>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="expandOrSelectAllChange('expend', true)">
              <a href="javascript:;">展开全部</a>
            </a-menu-item>
            <a-menu-item @click="expandOrSelectAllChange('expend', false)">
              <a href="javascript:;">折叠全部</a>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="expandOrSelectAllChange('all', true)">
              <a href="javascript:;">全选</a>
            </a-menu-item>
            <a-menu-item @click="expandOrSelectAllChange('all', false)">
              <a href="javascript:;">全不选</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-tree class="ml-50px mt-10px" ref="packageTreeRef" v-model:expandedKeys="expandedKeys"
        v-model:checkedKeys="checkedKeys" v-model:selectedKeys="selectedKeys" checkable :tree-data="treeData"
        :selectable="false" :field-names="{ children: 'children', title: 'title', key: 'id', }"></a-tree>
    </div>
  </a-form>
</template>
<style scoped></style>