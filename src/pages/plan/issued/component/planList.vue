<script setup lang="ts">
import ProTable from '@/components/pro-table/index.vue'
import {generatePlanApi, getPlanListApi, getReportPlanApi} from "@/api/issued";
import {createVNode, ref, toRefs, watch} from "vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import {getNameFromDateAndType} from "@/utils";
import {useTable} from "@/composables/useTable.ts";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {useRouter} from "vue-router";
import DataMoadl from "@/pages/plan/issued/component/dataMoadl.vue";

const props = defineProps<{
  planType: string
}>()
const planTypeMap: Record<string, string> = {
  year: '年度计划',
  quarter: '季度计划',
  month: '月度计划',
  week: '周计划',
}

const { planType } = toRefs(props);
const modalRef = ref()
const router = useRouter()
const columns = [
  {title: '计划类型', dataIndex: 'planType', width: 110,},
  {title: '计划名称', dataIndex: 'planName', width: 110,search: true, valueType: 'input',},
  {title: '计划产值', dataIndex: 'planOutPutValue', width: 110,},
  {title: '计划开始时间', dataIndex: 'startDate', width: 110,},
  {title: '计划结束时间', dataIndex: 'endDate', width: 110,},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
]
const handleSubmit = (date: string) => {
  generatePlan(date)
}
const generatePlan = async (date: string) => {
  const planTime = getNameFromDateAndType(new Date(date), props.planType)
  console.log(planTime)
  const {data} = await getReportPlanApi({
    planType: props.planType,
    currentDate: new Date(date)
  })
  if (data) {
    Modal.confirm({
      centered: true,
      title: '警告',
      icon: createVNode(ExclamationCircleOutlined),
      content: `${planTime!.name}已存在，是否重新生成？ `,
      async onOk() {
        const res = await generatePlanApi({
          planType: props.planType,
          currentDate: new Date(date)
        })
        if (res.code === 200) {
          if (res.data.length > 0) {
            await getTableData({planType: planType.value})
            message.success(`${planTime!.name}重新生成成功`)
          } else {
            message.info('没有可生成的计划')
          }
        } else {
          message.error(`${planTime!.name}重新生成失败`)
        }
      },
      onCancel() {
        message.info('操作已取消')
      },
    });
  } else {
    const res = await generatePlanApi({
      planType: props.planType,
      currentDate: new Date(date)
    })
    if (res.code === 200) {
      if (res.data.length > 0) {
        await getTableData({planType: planType.value})
        message.success(`${planTime!.name}生成成功`)
      } else {
        message.info('没有可生成的计划')
      }
    } else {
      message.error(`${planTime!.name}生成失败`)
    }
  }
}
const {tableData, getTableData, loading, pagination} = useTable(getPlanListApi, {planType: planType.value})
watch(planType, () => {
  getTableData({planType: planType.value})
})
const toDetail = (record: any) => {
  router.push({path: '/plan/issued/detail', query: {planName: record.planName}})
}
</script>
<script lang='ts'>
export default {
  name: "IssuedIndex"
}
</script>
<template>
  <pro-table :data-source="tableData" :loading="loading" :pagination="pagination" @refresh="() => getTableData({planType})"
             @search="(params) => getTableData({...params, ...{planType}})" :columns="columns">
    <template #toolLeft>
      <a-button type="primary" @click="modalRef.showModal()">生成计划</a-button>
    </template>
    <template #bodyCell=" { column,record }">
      <template v-if="column.dataIndex === 'planType'">
        {{planTypeMap[record.planType]}}
      </template>
      <template v-else-if="column.dataIndex === 'planName'">
        <a-typography-link @click="toDetail(record)">{{ record.planName }}</a-typography-link>
      </template>
      <template v-else-if="column.dataIndex === 'actions'">
        <a-space>
          <TooltipIcon title="编辑">
            <EditOutlined class="text-blue" @click=""/>
          </TooltipIcon>
        </a-space>
      </template>
    </template>
  </pro-table>
  <DataMoadl ref="modalRef" :plan-type="planType" @submit="handleSubmit"></DataMoadl>
</template>
<style scoped>

</style>