<script setup lang="ts">
import ProTable from '@/components/pro-table/index.vue'
import {onMounted, ref, watch} from "vue";
import {
  exportWorkPlaceRelevanceCollectListApi,
  getWorkPlaceListNoPageApi,
  getWorkPlaceRelevanceCollectList, uploadRelevanceListApi
} from "@/api/workplace";
import {useTable} from "@/composables/useTable.ts";
import {theme} from "ant-design-vue";
import Upload from '@/components/upload/index.vue'
import ExportButton from '@/components/exportButton/index.vue'
import {getSectionalApi} from "@/api/division";

const {token} = theme.useToken()
const activeKey = ref('');
const segmentData = ref<any[]>([])
const columns = ref<any[]>([
  {title: '序号', dataIndex: 'serial_number', width: 80, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'list_code', width: 100},
  {title: '项目名称', dataIndex: 'list_name', width: 120},
  {title: '项目特征', dataIndex: 'list_characteristic', width: 120, ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 80, align: 'center'},
  {
    title: '工程量', dataIndex: 'quantities', width: 100, align: 'center',
    customCell: () => {
      return {
        style: {
          'font-weight': 'bold'
        }
      }
    }
  },
  {
    title: '合计', dataIndex: 'allotQuantities', width: 100, align: 'center',
    customCell: () => {
      return {
        style: {
          color: token.value.colorPrimary,
          'font-weight': 'bold'
        }
      }
    }
  },
])
const {tableData, pagination, loading, getTableData} = useTable(getWorkPlaceRelevanceCollectList,{sectionalEntry: activeKey.value})
const open = ref(false)
watch(activeKey, () => {
  getTableData({sectionalEntry: activeKey.value})
})

onMounted(async () => {
  const res = await getWorkPlaceListNoPageApi();
  setTimeout(() => {
    res.data.forEach(item => {
      if (item.workPlaceType === 'section') {
        const column: any = {
          title: item.workPlaceName.split('-')[0].charAt(0) + '-' + item.workPlaceName.split('-')[1].charAt(0) + '区间',
          children: [
            {title: '左线', dataIndex: item.workPlaceCode + '_left_quantities', width: 100, align: 'center'},
            {title: '右线', dataIndex: item.workPlaceCode + '_right_quantities', width: 100, align: 'center'}
          ]
        }
        columns.value.push(column)
      } else {
        columns.value.push({
          title: item.workPlaceName,
          dataIndex: item.workPlaceCode + '_all_quantities',
          width: 120,
          align: 'center'
        })
      }
    })
  }, 0)
})
getSectionalApi({divisionType: '分部工程'}).then(res => {
  if(res.code === 200){
    segmentData.value = res.data
  }
})

</script>
<template>
  <div>

    <pro-table bordered v-if="columns.length > 7"  border @search="(params) => getTableData({...params, ...{sectionalEntry: activeKey}})" :loading="loading"
               @refresh="() => getTableData({sectionalEntry: activeKey})" :pagination="pagination" :data-source="tableData" :scroll="{x: 1500, y: 455}"
               :columns="columns">
      <template #toolLeft>
          <a-tabs v-if="segmentData.length > 1" v-model:activeKey="activeKey">
            <a-tab-pane key="" tab="全部"></a-tab-pane>
            <a-tab-pane v-for="item in segmentData" :key="item.id" :tab="item.divisionName"></a-tab-pane>
          </a-tabs>
      </template>
      <template #toolRight>
        <a-space>
          <a-button type="primary" @click="() => open = true">导入数据</a-button>
          <ExportButton :request="exportWorkPlaceRelevanceCollectListApi" :init-params="{sectionalEntry: activeKey}" file-name="车站区间工程量汇总表"></ExportButton>
        </a-space>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex.endsWith('_quantities')">
          {{ record[column.dataIndex] === '0.00' ? '' : record[column.dataIndex] }}
        </template>
      </template>
    </pro-table>
    <upload :request="uploadRelevanceListApi" v-model:open="open" width="70%" :is-multiple="false" :show-template="false"
            :upload-type="['xlsx']"></upload>
  </div>
</template>


<style scoped>
.ant-tabs-top >:deep(.ant-tabs-nav::before) {
  border-bottom: none;
}
</style>