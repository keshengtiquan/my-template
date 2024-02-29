<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import { getUserListApi } from "@/api/user";
import { useTable } from "@/composables/useTable.ts";
import { generateLogApi, getProjectLogListApi } from "@/api/projectLog";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store";
import { onMounted, ref } from "vue";
import { getWorkArea } from "@/api/dept";
import { theme } from "ant-design-vue";

const router = useRouter()
const userStore = useUserStore()
const { token } = theme.useToken()
const generateLogDate = ref()
const columns = ref<any[]>([
  {
    title: '序号',
    align: 'center',
    width: 50,
    customRender: ({ index }: {index: string}) => `${(pagination.value.current - 1) * pagination.value.pageSize + parseInt(index) + 1}`,
  },
  { title: '填报时间', dataIndex: 'fillDate', width: 150, align: 'center', search: true, valueType: 'date' },
  {
    title: '填报人', dataIndex: 'fillUser', width: 200, search: true, valueType: 'querySelect', align: 'center',
    request: getUserListApi, fieldNames: { label: 'nickName', value: 'nickName' }
  },
  {
    title: '完成产值(元)', dataIndex: 'outPutValue', width: 150, align: 'center',
    customCell: () => {
      return {
        style: {
          'font-weight': 'bold',
          color: token.value.colorPrimaryText
        }
      }
    }
  },
  { title: '创建人', dataIndex: 'createBy', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 200 },
  { title: '更新人', dataIndex: 'updateBy', width: 120 },
  { title: '更新时间', dataIndex: 'updateTime', width: 200 },
  { title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right' },
])
const { tableData, getTableData, loading, pagination } = useTable(getProjectLogListApi)
const toDetail = (record: any) => {
  router.push({
    path: '/projectLog/detail', query: {
      logId: record.id,
      workAreaId: userStore.userInfo!.deptId,
      fillDate: record.fillDate
    }
  })
}

const generateLog = async () => {
  await generateLogApi({ date: generateLogDate.value })
}
onMounted(async () => {
  const workAreaResults = await getWorkArea()
  workAreaResults.data.forEach((item: any) => {
    columns.value.splice(-5, 0, {
      title: item.deptName + '-产值(元)',
      dataIndex: item.id,
      width: 150,
      align: 'center'
    })
  })
})
</script>
<template>
  <PageContainer>
    <pro-table v-if="columns.length > 9" :columns="columns" :data-source="tableData" :loading="loading"
      :pagination="pagination" :scroll="{ x: 1500 }" @refresh="() => getTableData()"
      @search="(params) => getTableData(params)">
      <template #toolLeft>
        <a-space>
          <a-date-picker v-model:value="generateLogDate" valueFormat="YYYY-MM-DD" />
          <a-button type="primary" @click="generateLog">手动触发</a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltipIcon title="编辑">
              <EditOutlined class="text-blue" @click="toDetail(record)" />
            </TooltipIcon>
          </a-space>
        </template>
      </template>
    </pro-table>
  </PageContainer>
</template>
<style scoped></style>