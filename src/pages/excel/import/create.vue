<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {reactive, ref} from "vue";
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
  {title: '单元格名称', dataIndex: 'excelFiled'},
  {title: '备注', dataIndex: 'remarks'},
  {title: '操作', dataIndex: 'option'},
]
const dataSource = ref<any[]>([]);
/**
 * 新增模板字段
 */
const handleAdd = () => {
  dataSource.value.push({
    col: dataSource.value.length + 1,
    filed: '',
    excelFiled: '',
    remarks: ''
  })
}

const columnIndexToColumnLetter = (index: number): string => {
  let columnLetter = ''
  while (index > 0) {
    const remainder = (index - 1) % 26
    columnLetter = String.fromCharCode(65 + remainder) + columnLetter
    index = Math.floor((index - 1) / 26)
  }
  return columnLetter
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
<!--              <a-upload-->
<!--                  v-model:file-list="fileList"-->
<!--                  name="file"-->
<!--                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"-->
<!--              >-->
<!--                <a-button>-->
<!--                  <upload-outlined></upload-outlined>-->
<!--                  上传-->
<!--                </a-button>-->
<!--              </a-upload>-->
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
              <a-input-number class="w-full" v-model:value="formState.importField" placeholder="服务名称"></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card title="模板字段" class="mt-20px">
      <a-table :data-source="dataSource" :pagination="false" :columns="columns"  >
        <template #bodyCell="{ column, text, record, index }">
          <template v-if="column.dataIndex === 'col'">
            {{columnIndexToColumnLetter(record.col)}}
          </template>
          <template v-else-if="['filed', 'excelFiled', 'remarks'].includes(column.dataIndex)">
            <a-input
                v-model:value="dataSource[record.col][column.dataIndex]"
                style="margin: -5px 0"
            />
          </template>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" @click="handleAdd">
        新增字段
      </a-button>
    </a-card>
  </PageContainer>
</template>
<style scoped>

</style>
