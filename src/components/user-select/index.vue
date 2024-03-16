<script setup lang="ts">
import { getCompanyDeptListApi } from '@/api/setting/company-dept';
import { getUserListApi } from '@/api/setting/user';
import { useTreeSelect } from '@/composables/useTreeSelect';
import { message } from 'ant-design-vue';
import { computed, onMounted, reactive, ref } from 'vue';
const columns1 = [
  { title: '操作', dataIndex: 'actions', align: 'center', width: 80 },
  { title: '用户名', dataIndex: 'nickName', },
  { title: '账号', dataIndex: 'userName', },
]
const columns2 = [
  { title: '操作', dataIndex: 'actions', align: 'center', width: 80 },
  { title: '用户名', dataIndex: 'nickName', align: 'center' },
]
const props = defineProps<{
  modelValue: any[],
  tenantId?: number,
}>()
const emits = defineEmits(['update:modelValue'])
const selectValue = computed({
  set(value: any[]) {
    emits("update:modelValue", value)
  },
  get(): any[] {
    return props.modelValue
  },
})
const formRef = ref()
const formState = reactive({
  nickName: '',
})
const userList = ref([])
const userCurrent = ref()
const userPageSize = ref()
const userTotal = ref()
const selectedKeys = ref()

/**
 * 添加用户
 */
const addUser = (record: any) => {
  if (selectValue.value.findIndex(item => item.id === record.id) === -1) {
    selectValue.value.push(record)
  } else {
    message.warn('该记录已经添加')
  }
}
const addAllUser = () => {
  userList.value.forEach((item: any) => {
    if (selectValue.value.findIndex(i => i.id === item.id) === -1) {
      selectValue.value.push(item)
    }
  })
}
/**
 * 删除用户
 */
const delUser = (record: any) => {
  const index = selectValue.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    selectValue.value.splice(index, 1)
  }
}
/**
 * 删除全部用户
 */
const delAllUser = () => {
  selectValue.value = []
}
/**
 * 用户列表分页
 */
const handleTableChange = async (pagination: { total: number, current: number, pageSize: number, showSizeChanger: boolean }) => {
  await getUserData({ current: pagination.current, pageSize: pagination.pageSize, ...(props.tenantId && { tenantId: props.tenantId }) })
}
/**
 * 查询用户
 */
const onFinish = async () => {
  await getUserData({ ...formState, ...(props.tenantId && { tenantId: props.tenantId }) })
}
/**
 * 重置查询
 */
const resetForm = async () => {
  formState.nickName = ''
  await getUserData({ ...(props.tenantId && { tenantId: props.tenantId }) })
};
/**
 * 获取用户列表
 */
const getUserData = async (params: any) => {
  const { data: users } = await getUserListApi(params)
  userList.value = users.results
  userTotal.value = users.total
  userCurrent.value = users.current
  userPageSize.value = users.pageSize
}

const { treeData } = useTreeSelect(getCompanyDeptListApi)
const onSelectNode = async () => {
  await getUserData({ companyDeptId: selectedKeys.value[0] })
}
onMounted(async () => {
  await getUserData({ ...(props.tenantId && { tenantId: props.tenantId }) })
})
</script>
<template>
  <a-row :gutter="10">
    <a-col :span="7">
      <div flex-2 max-h-530px overflow-auto border-1 b-solid border-warmGray-2>
        <a-tree :tree-data="treeData" v-if="treeData && treeData.length > 0" v-model:selectedKeys="selectedKeys"
          @select="onSelectNode" defaultExpandAll
          :fieldNames="{ children: 'children', title: 'deptName', key: 'id' }" />
      </div>
    </a-col>
    <a-col :span="11">
      <div>
        <div class="mb-10px">
          <a-form ref="formRef" layout="inline" @finish="onFinish" :model="formState">
            <a-form-item>
              <a-input placeholder="请输入用户名称" v-model:value="formState.nickName" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">查询</a-button>
              <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="overflow-auto h-500px">
          <a-table :columns="columns1" :dataSource="userList" @change="handleTableChange"
            :pagination="{ total: userTotal, position: ['bottomLeft'], current: userCurrent, pageSize: userPageSize, showSizeChanger: true, }"
            bordered size="small">
            <template #title>
              <div flex justify-between>
                <span>待选择列表 {{ userList.length }} 条</span>
                <span><a-button type="dashed" size="small" @click="addAllUser">添加当前数据</a-button></span>
              </div>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'actions'">
                <a-button type="dashed" size="small" @click="addUser(record)">添加</a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>

    </a-col>
    <a-col :span="6">
      <a-table bordered :columns="columns2" size="small" :dataSource="selectValue">
        <template #title>
          <div flex justify-between>
            <span>已选择：{{ selectValue.length }} </span>
            <span><a-button type="dashed" danger size="small" @click="delAllUser">全部移除</a-button></span>
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'actions'">
            <a-button type="dashed" size="small" danger @click="delUser(record)">移除</a-button>
          </template>
        </template>
      </a-table>
    </a-col>
  </a-row>
</template>
<style scoped></style>import { getCompanyDeptListApi } from '@/api/setting/company-dept';
