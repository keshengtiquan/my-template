<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import TooltipIcon from '@/components/tooltip-icon/index.vue'
import {onMounted, reactive, ref} from "vue";
import Upload from '@/components/upload/index.vue'
import {createTemplateApi, getTemplateOneApi, updateTemplateApi, uploadExcelTemplateApi} from "@/api/excel";
import {VueDraggable} from 'vue-draggable-plus'
import {message} from "ant-design-vue";
import { useRoute,useRouter} from "vue-router";

const formState = reactive({
  fileName: '',
  fileType: '',
  sheetName: null,
  skipRows: null,
  serviceName: '',
})
const router = useRouter()
const route = useRoute()
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
  {title: '备注', dataIndex: 'remarks'},
  {title: '操作', dataIndex: 'actions', align: 'center'},
]
const dataSource = ref<any[]>([]);
const open = ref(false)
const sheetNameOption = ref<any[]>([]) //解析页签的option
const templateExcelName = ref('') // 上传的文件名称
const tableRef = ref()
const templateFields = ref() //上传文件的sheet页的字段
const currentTableField = ref<string[]>() // 当前选择的页签的表头数据
const title = ref('创建导入模版')
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
 * 文件上传完成后的返回结果
 */
const onSubmit = (values: { sheetNames: any[], fileName: string, sheetFields: any }[]) => {
  const option: { value: string, label: string }[] = []
  values[0].sheetNames.forEach(item => {
    option.push({
      value: item,
      label: item,
    })
  })
  sheetNameOption.value = option
  templateExcelName.value = values[0].fileName
  templateFields.value = values[0].sheetFields
}

/**
 * 解析页签的改变事件
 * @param value
 */
const onSelectChange = (value: string) => {
  currentTableField.value = templateFields.value[value]
  setTableField()
}

/**
 * 选择页签后设置table
 */
const setTableField = () => {
  dataSource.value = []
  //将文件的表头设置到表格
  currentTableField.value!.forEach(item => {
    dataSource.value.push({
      col: columnIndexToColumnLetter(dataSource.value.length + 1),
      filed: '',
      excelFiled: item,
      remarks: ''
    })
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

/**
 * 删除上传的文件
 */
const deleteUpdate = () => {
  templateExcelName.value = ''
  sheetNameOption.value = []
  formState.sheetName = null
  dataSource.value = []
}

/**
 * 页面的提交方法
 */
const handleSubmit = async () => {
  const { id } = route.query
  const params: any = {
    importTemplate: templateExcelName.value,
    importTemplateField: currentTableField.value,
    importField: dataSource.value,
    fileName: formState.fileName,
    fileType: formState.fileType,
    sheetName: formState.sheetName,
    skipRows: formState.skipRows,
    serviceName: formState.serviceName,
  }
  let res: any = {}
  if(id) {
    params.id = id
    res = await updateTemplateApi(params)
  }else {
    res = await createTemplateApi(params)
  }
  if(res.code === 200) {
    message.success(res.message)
    router.go(-1)
  }
}

onMounted(async () => {
  const { id } = route.query
  if( id ){
    title.value = '更新导入模版'
    const res = await getTemplateOneApi( (id as string) )
    Object.assign(formState,res.data)
    //表头数据
    currentTableField.value = res.data.importTemplateField
    //上传表名称
    templateExcelName.value = res.data.importTemplate
    //发导入字段
    dataSource.value = res.data.importField
  }
})

</script>
<template>
  <PageContainer :title="title">
    <template #footer>
      <a-space>
        <a-button  @click="() => router.go(-1)">取消</a-button>
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </a-space>
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
              <a-button v-if="!templateExcelName" @click="() => open = true">
                <upload-outlined></upload-outlined>
                上传
              </a-button>
              <span v-else class="text-blue">
                {{ templateExcelName }}
                <TooltipIcon title="删除">
                  <DeleteOutlined class="text-red" @click="deleteUpdate"/>
                </TooltipIcon>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="8">
            <a-form-item label="解析页签名称" name="sheetName" :rules="[{ required: true, message: '请选择文件名称' }]">
              <a-select v-model:value="formState.sheetName" placeholder="请选择要解析的sheet页签"
                        :options="sheetNameOption" @change="onSelectChange"></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="从第几行开始" name="skipRows" :rules="[{ required: true, message: '请输入行号' }]">
              <a-input-number class="w-full" v-model:value="formState.skipRows" placeholder="行号"></a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="服务名称" name="serviceName" :rules="[{ required: true, message: '请输入服务名称' }]">
              <a-input class="w-full" v-model:value="formState.serviceName"
                              placeholder="服务名称"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card title="模板字段" class="mt-20px">
      <VueDraggable v-model="dataSource" :animation="150" handle=".move" target=".ant-table-tbody">
        <a-table id="mytb" ref="tableRef" :data-source="dataSource" :pagination="false" :columns="columns">
          <template #bodyCell="{ column, record, index }">
            <template v-if="['filed', 'excelFiled', 'remarks'].includes(column.dataIndex)">
              <a-input
                  :name="column.dataIndex"
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
      </VueDraggable>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" @click="handleAdd">
        新增字段
      </a-button>
    </a-card>
    <Upload v-model:open="open" @submit="onSubmit" :isMultiple="false" :request="uploadExcelTemplateApi" width="70%"
            :uploadType="['xlsx']"></Upload>
  </PageContainer>
</template>
<style scoped>

</style>
