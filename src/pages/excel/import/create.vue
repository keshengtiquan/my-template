<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import TooltipIcon from '@/components/tooltip-icon/index.vue'
import {reactive, ref} from "vue";
import Upload from '@/components/upload/index.vue'
import {uploadExcelTemplateApi} from "@/api/excel";

const formState = reactive({
  fileName: '',
  fileType: '',
  sheetName: '',
  skipRows: null,
  serviceName: '',
  importField: ''
})
const columns = [
  {title: '列', dataIndex: 'col'},
  {title: '数据库字段名称', dataIndex: 'filed'},
  {title: 'Excel单元格名称', dataIndex: 'excelFiled'},
  {title: '备注', dataIndex: 'remarks'},
  {title: '操作', dataIndex: 'actions', align: 'center'},
]
const dataSource = ref<any[]>([]);
const open = ref(false)
/**
 * 新增模板字段
 */
const handleAdd = () => {
  dataSource.value.push({
    col: columnIndexToColumnLetter(dataSource.value.length + 1),
    filed: '',
    excelFiled: '',
    remarks: ''
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

/**
 * 设置不同的placeholder
 * @param dataIndex
 */
const checkPlaceholder = (dataIndex: string) => {
  switch (dataIndex) {
    case 'filed':
      return '请输入数据库字段'
    case 'excelFiled':
      return '请输入Excel单元格'
    case 'remarks':
      return '请输入备注'
    default:
      return ''
  }
}
</script>
<template>
  <PageContainer>
    <template #footer>
      <a-button type="primary">提交</a-button>
    </template>
    <a-card title="模板设置">
      <a-form ref="formRef"
              :model="formState"
              :label-col=" { style: { width: '110px', } }"
              :wrapper-col="{ span: 24 }">
        <a-row :gutter="10">
          <a-col :span="8">
            <a-form-item label="模板名称" name="fileName" :rules="[{ required: true, message: '请输入模板名称' }]">
              <a-input v-model:value="formState.fileName" placeholder="模板名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="文件类型" name="fileType" :rules="[{ required: true, message: '请选择文件名称' }]">
              <a-input v-model:value="formState.fileType" placeholder="模板名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="上传模板" name="importField" :rules="[{ required: true, message: '请选择文件名称' }]">
              <a-button @click="() => open = true">
                <upload-outlined></upload-outlined>
                上传
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="解析页签名称" name="sheetName" :rules="[{ required: true, message: '请选择文件名称' }]">
              <a-input v-model:value="formState.sheetName" placeholder="模板名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="从第几行开始" name="skipRows" :rules="[{ required: true, message: '请输入行号' }]">
              <a-input-number class="w-full" v-model:value="formState.skipRows" placeholder="行号"></a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="服务名称" name="importField" :rules="[{ required: true, message: '请输入服务名称' }]">
              <a-input-number class="w-full" v-model:value="formState.importField"
                              placeholder="服务名称"></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card title="模板字段" class="mt-20px">
      <a-table :data-source="dataSource" :pagination="false" :columns="columns">
        <template #bodyCell="{ column, record, index }">
          <template v-if="['filed', 'excelFiled', 'remarks'].includes(column.dataIndex)">
            <a-input
                v-model:value="dataSource[index][column.dataIndex]"
                style="margin: -5px 0"
                :placeholder="checkPlaceholder(column.dataIndex)"
            />
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <TooltipIcon title="删除">
              <DeleteOutlined style="color: red" @click="deleteRow(record)"/>
            </TooltipIcon>
          </template>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" @click="handleAdd">
        新增字段
      </a-button>
    </a-card>
    <Upload v-model:open="open" :isMultiple="true" :request="uploadExcelTemplateApi" width="70%" :uploadType="['xlsx']"></Upload>
  </PageContainer>
</template>
<style scoped>

</style>
