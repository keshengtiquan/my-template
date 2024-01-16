<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useRoute} from "vue-router";
import {useTable} from "@/composables/useTable.ts";
import {addListPlanDetailApi, deletePlanDetailApi, getPlanDetailApi, updatePlanDetail} from "@/api/issued";
import {onMounted, ref, reactive, UnwrapRef, createVNode} from "vue";
import {getWorkArea} from "@/api/dept";
import {cloneDeep} from 'lodash-es';
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import ListSelect from '@/components/list-select/index.vue'
import {getPlanExcludeApi} from "@/api/list";

const route = useRoute();
const columns = ref<any[]>([
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'listCode', width: 120, search: true, valueType: 'input', align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 120, search: true, valueType: 'input', align: 'center'},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, search: true, valueType: 'input', ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 50, align: 'center'},
  {title: '清单工程量', dataIndex: 'quantities', width: 80, align: 'center'},
  {title: '单价', dataIndex: 'unitPrice', width: 100, align: 'center'},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
])
const editableData: UnwrapRef<Record<string, any>> = reactive({});
const editColumns = ref<string[]>([])
const listSelectRef = ref()
const tableRef = ref()
const {tableData, getTableData, loading, pagination} = useTable(getPlanDetailApi, {planName: route.query.planName as string})
/**
 * 编辑
 * @param id
 */
const edit = (id: string) => {
  editableData[id] = cloneDeep(tableData.value.filter(item => id === item.id)[0])
};

/**
 * 取消编辑
 * @param id
 */
const cancel = (id: string) => {
  delete editableData[id];
};
/**
 * 保存
 * @param record
 */
const save = async (record: any) => {
  // Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  const planQuantities: any = {}
  editColumns.value.forEach(item => {
    planQuantities[item] = editableData[record.id][item]
  })
  const params = {
    listId: editableData[record.id]['id'],
    planQuantities: planQuantities,
    planName: route.query.planName as string
  }
  const res = await updatePlanDetail(params)
  if (res.code === 200) {
    await getTableData(tableRef.value.onReload())
    message.success(res.message)
    delete editableData[record.id];
  }
};
/**
 * 删除
 * @param record
 */
const deletePlanDetail = (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.listName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deletePlanDetailApi({listId: record.id, planName: route.query.planName as string}).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      message.info('取消删除');
    },
  });
}
/**
 * 添加清单提交方法
 */
const listSelectSubmit =async (listIds: string[]) => {
  if(listIds.length === 0) return
  const res = await addListPlanDetailApi({listIds, planName: route.query.planName as string})
  if(res.code === 200) {
    message.success(res.message)
    await getTableData(tableRef.value.onReload())
  }
}

onMounted(async () => {
  const workAreaResults = await getWorkArea()
  workAreaResults.data.forEach((item: any) => {
    columns.value.splice(-1, 0, {
      title: item.deptName,
      dataIndex: item.id,
      width: 100,
    })
    editColumns.value.push(item.id)
  })
})
</script>
<template>
  <PageContainer :title="route.query.planName as string">
    <pro-table v-if="columns.length > 8" ref="tableRef" :scroll="{x: 1500}" :columns="columns" :data-source="tableData"
               :loading="loading"
               :pagination="pagination"
               @refresh="() => getTableData()" @search="(params) => getTableData(params)">
      <template #toolLeft>
        <a-button type="primary" @click="listSelectRef.showModal()">添加清单</a-button>
      </template>
      <template #bodyCell=" { column,text,record }">
        <template v-if="editColumns.includes(column.dataIndex)">
          <div>
            <a-input-number v-if="editableData[record.id]" class=" w-full" :min="0"
                            v-model:value="editableData[record.id][column.dataIndex]"
                            @pressEnter=""/>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'actions'">
          <div>
            <a-space v-if="editableData[record.id]">
              <a-typography-link @click="save(record)">保存</a-typography-link>
              <a-popconfirm title="确定取消编辑?" @confirm="cancel(record.id)">
                <a>取消</a>
              </a-popconfirm>
            </a-space>
            <a-space v-else>
              <a @click="edit(record.id)">编辑</a>
              <a class="text-red" @click="deletePlanDetail(record)">删除</a>
            </a-space>
          </div>
        </template>
      </template>
    </pro-table>
    <list-select ref="listSelectRef" :request="getPlanExcludeApi"
                 @submit="listSelectSubmit"
                 :initParams="{planName: route.query.planName as string}" :hasPagination="true"></list-select>
  </PageContainer>
</template>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>