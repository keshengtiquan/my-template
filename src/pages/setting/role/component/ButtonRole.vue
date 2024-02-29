<script lang="ts" setup>
import { useDragModal } from '@/composables/useDragModal';
import { ref } from 'vue';
import { assignAuthApi, getPermissionListApi } from '@/api/permission'
import { getRoleByIdAPi } from '@/api/role';
import { useUserStore } from '@/store';

const modalTitleRef = ref()
const { transformStyle } = useDragModal(modalTitleRef)
const open = ref(false)
const title = ref('')
const roleName = ref('')
const permissionData = ref<any[]>([])
const roleId = ref<string>('')
const loading = ref(true)
const userStore = useUserStore()

const openModal = async (name: string, id: string) => {
  title.value = `${name}-按钮权限`;
  roleName.value = name;
  roleId.value = id;
  open.value = true
  const { data: role } = await getRoleByIdAPi(id)
  const { data } = await getPermissionListApi()
  permissionData.value = data
  if (role.permissions && role.permissions.length > 0) {
    role.permissions.forEach(item => {
      permissionData.value.forEach(permiss => {
        permiss.actions.forEach((action: any) => {
          if (action.id === item.id) {
            action.action = true
          }
        })
      })
    })
  }
  console.log(permissionData.value);
  loading.value = false
}
const handleOk = async () => {
  const selectPermission: any[] = []
  permissionData.value.forEach(item => {
    item.actions.forEach((permiss: any) => {
      if (permiss.action) {
        selectPermission.push({
          id: permiss.id,
          name: permiss.name,
          key: permiss.key,
          sort: permiss.sort,
          desc: permiss.desc,
        })
      }
    })
  })
  await assignAuthApi({ roleId: roleId.value, permissions: selectPermission })
  userStore.getUserInfo()
  close()
}
const close = () => {
  open.value = false
}

const allChecked = (checked: boolean, desc: string) => {
  const permission = permissionData.value.find(item => item.desc === desc)
  permission.actions.forEach((action: any) => {
    action.action = checked
  })
}
const singleChecked = (_checked: boolean, desc: string) => {
  const permission = permissionData.value.find(item => item.desc === desc)
  const length = permission.actions.length
  const checkedLength = permission.actions.filter((item: any) => item.action).length
  console.log(length, checkedLength);
  if(length === checkedLength) {
    permission.all = true
  }else {
    permission.all = false
  }
}
defineExpose({ openModal, open })
</script>
<template>
  <a-modal v-model:open="open" width="40%" @ok="handleOk" @cancel="close">
    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move">{{ title }}</div>
    </template>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
    <a-skeleton v-if="loading" active :paragraph="{ rows: 4 }" />
    <div my-10px v-for="tag in permissionData">
      <span style="margin-right: 8px; font-weight: 500;">{{ tag.desc }}:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag v-model:checked="tag.all" @change="(checked: boolean) => allChecked(checked, tag.desc)">
          全选
        </a-checkable-tag>
        <a-checkable-tag v-for="(item, index) in tag.actions" :key="item.id"
          v-model:checked="tag.actions[index]['action']" @change="(checked: boolean) => singleChecked(checked, tag.desc)">
          {{ item.name }}
        </a-checkable-tag>
      </a-space>
    </div>

  </a-modal>
</template>
<style lang="scss" scoped></style>