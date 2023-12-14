<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {VueDraggable} from "vue-draggable-plus";

export interface FormState {
  templateName: string;
  exportType: string | undefined;
  exportService: string;
  exportFields: string;
  sheetName: string;
}
const props = withDefaults(defineProps<{
  formState: FormState
}>(),{})

const formRef = ref();
const tableRef = ref()
const dataSource = ref<any[]>([]);
const columns = [
  {
    title: '列', dataIndex: 'col',
    customCell: () => {
      return {
        class: 'move',
        onmouseenter: (event: Event) => {
          (event.target as HTMLElement).style.cursor = 'move'
        }
      };
    }
  },
  {title: 'Excel单元格名称', dataIndex: 'excelFiled'},
  {title: '数据库字段名称', dataIndex: 'filed'},
  {title: '列宽', dataIndex: 'width'},
  {title: '操作', dataIndex: 'actions', align: 'center'},
]
/**
 * 新增模板字段
 */
const handleAdd = () => {
  dataSource.value.push({
    col: columnIndexToColumnLetter(dataSource.value.length + 1),
    filed: '',
    excelFiled: '',
    width: ''
  })
}
/**
 * 删除表格行
 * @param record
 */
const deleteRow = (record: Record<any, any>) => {
  const index = dataSource.value.findIndex(item => item.col === record.col)
  dataSource.value.splice(index, 1)
  updateCol()
}

/**
 * 更新col的字段，删除行后使用
 */
const updateCol = () => {
  dataSource.value.forEach((item, index) => {
    item.col = columnIndexToColumnLetter(index + 1)
  })
}

/**
 * 数字转字母
 * @param index
 */
const columnIndexToColumnLetter = (index: number): string => {
  let columnLetter = ''
  while (index > 0) {
    const remainder = (index - 1) % 26
    columnLetter = String.fromCharCode(65 + remainder) + columnLetter
    index = Math.floor((index - 1) / 26)
  }
  return columnLetter
}

onMounted(async () => {
  await nextTick(() => {
    console.log(83)
    if(props.formState.exportFields){
      dataSource.value = JSON.parse(props.formState.exportFields)
    }
  })
})

defineExpose({dataSource})
</script>
<template>
  <a-card title="模板设置">
    <a-form ref="formRef"
            :model="formState"
            :label-col=" { style: { width: '110px', } }"
            :wrapper-col="{ span: 24 }">
      <a-row :gutter="10">
        <a-col :span="8">
          <a-form-item label="模板名称" name="templateName" :rules="[{ required: true, message: '请输入模板名称' }]">
            <a-input v-model:value="formState.templateName" placeholder="模板名称"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="文件类型" name="exportType" :rules="[{ required: true, message: '请输入文件类型' }]">
            <a-select v-model:value="formState.exportType" placeholder="文件类型">
              <a-select-option value="xlsx">xlsx</a-select-option>
              <a-select-option value="csv">csv</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="页签名称" name="sheetName" :rules="[{ required: true, message: '请输入页签名称' }]">
            <a-input v-model:value="formState.sheetName" placeholder="页签名称"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="导出服务" name="exportService" :rules="[{ required: true, message: '请输入导出服务' }]">
<!--            <a-input v-model:value="formState.exportService" placeholder="导出服务"></a-input>-->
            {{formState.exportService}}
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <a-card title="字段设置" class="mt-20px">
    <a-row>
      <a-col :span="24">
        <VueDraggable v-model="dataSource" :animation="150" handle=".move"  target=".ant-table-tbody">
          <a-table id="mytb" ref="tableRef" :data-source="dataSource" :pagination="false" :columns="columns">
            <template #bodyCell="{ column, record, index }">
              <template v-if="['filed', 'excelFiled'].includes(column.dataIndex)">
                <a-input
                    :name="column.dataIndex"
                    v-model:value="dataSource[index][column.dataIndex]"
                    style="margin: -5px 0"
                />
              </template>
              <template v-else-if="column.dataIndex === 'width'">
                <a-input-number
                    :name="column.dataIndex"
                    v-model:value="dataSource[index][column.dataIndex]"
                    style="margin: -5px 0"
                    class="w-full"
                    :step="10"
                />
              </template>
              <template v-else-if="column.dataIndex === 'actions'">
                <TooltipIcon title="删除">
                  <DeleteOutlined style="color: red" @click="deleteRow(record)"/>
                </TooltipIcon>
              </template>
            </template>
          </a-table>
        </VueDraggable>
        <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" @click="handleAdd">
          新增字段
        </a-button>
      </a-col>
    </a-row>
  </a-card>
</template>



<style scoped>

</style>