<template>
  <a-modal v-model:open="visible" @cancel="handleCancel" destroyOnClose v-bind="$attrs" @ok="handleOk">

    <div class="mt-25px">
      <div ref="container" class="drag" @dragenter.prevent="onDragenter" @dragover.prevent="onDragOver"
           @drop.prevent="onDrop">
        <div class="inner">
          <inbox-outlined style="font-size: 60px;"></inbox-outlined>
        </div>
        <div class="inner support">
          {{ `拖拽文件${isMultiple ? '或文件夹' : ''}上传，支持的文件类型：` }}<span
            v-for="item in props.uploadType">{{ item }}</span>
        </div>
        <div class="inner">
          每个文件允许的最大尺寸：{{ props.limit }}M
        </div>
      </div>
      <div class="btns">
        <a-button type="primary" @click="uploadFile">文件选择</a-button>
        <input ref="uploadFileRef" @change="fileChange" style="display: none" type="file" :multiple="isMultiple">
        <a-button v-if="isMultiple" type="primary" @click="uploadFiles">文件夹选择</a-button>
        <input ref="uploadFileRefs" @change="filesChange" style="display: none" type="file" webkitdirectory mozdirectory
               odirectory>
        <a v-if="showTemplate" @click="exportTemplate">导入模版下载</a>
      </div>
      <a-table :columns="columns" :data-source="fileList" :pagination="false">
        <template #bodyCell="{ column, record,index }">
          <template v-if="column.dataIndex === 'fileSize'">
            {{ formatByte(record.fileSize) }}
          </template>
          <template v-else-if="column.dataIndex === 'index'">
            {{ index + 1 }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-tooltip v-if="record.status > 0 && record.status < 100" title="取消上传">
              <CloseOutlined style="font-size: 16px;" @click="cancelUpload(index)"/>
            </a-tooltip>
            <a-tooltip v-else title="删除">
              <DeleteOutlined style="font-size: 16px;" @click="deleteFile(index)"/>
            </a-tooltip>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag v-if="record.status == 0">未开始</a-tag>
            <a-tag v-else-if="record.status == 100" color="green">已完成</a-tag>
            <a-tag v-else-if="record.status == -2" color="green">上传失败</a-tag>
            <a-tag v-else-if="record.status == -1" color="red">取消上传</a-tag>
            <a-progress v-else :percent="record.status" :show-info="false"/>
          </template>
        </template>
      </a-table>
      <div style="margin: 10px 0" class="flex justify-between">
        <div>
          <a-tag color="#108ee9">文件数量：{{ fileList.length }}</a-tag>
          <a-tag color="#2db7f5">成功上传：{{ finishUpload }}</a-tag>
          <a-tag color="#87d068">总上传：{{ formatByte(finishUploadSize) }}</a-tag>
        </div>
        <a-button type="primary" :loading="loading" @click="beginUploadThrottle">开始上传</a-button>
      </div>
    </div>
    <a-modal centered :afterClose="resultClose" @ok="resultClose" v-model:open="resultVisible" width="50%" title="上传结果">
      <a-table :columns="resultColumns" :data-source="uploadRes" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <a @click="openResultsDetail(record)">查看详情</a>
          </template>
        </template>
      </a-table>
      <a-modal centered  v-model:open="resultDetailVisible" @ok="() => {resultDetailVisible = false}" width="50%" title="上传详情" >
        <a-table :pagination="{size: 'small'}" size="small" :columns="resultDetailColumns" :data-source="resultDetailData" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'data'">
              {{ JSON.stringify(record.data) }}
            </template>
          </template>
        </a-table>
      </a-modal>
    </a-modal>
  </a-modal>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {InboxOutlined, DeleteOutlined, CloseOutlined} from '@ant-design/icons-vue';
import {formatByte, throttle} from '@/utils'
import axios from "axios";
import {message} from "ant-design-vue";
import {downloadTemplateApi} from "@/api/excel";
import {downloadExcel, exportExcel} from "@/utils/excelExport.ts";
import * as dayjs from "dayjs";

const resultVisible = ref(false)
const resultDetailVisible = ref(false)
const columns = [
  {title: '序号', dataIndex: 'index', align: 'center', width: 80},
  {title: '文件名', dataIndex: 'fileName', align: 'center', width: 350},
  {title: '文件类型', dataIndex: 'fileType', align: 'center', width: 150},
  {title: '文件大小', dataIndex: 'fileSize', align: 'center', width: 150},
  {title: '状态', dataIndex: 'status', align: 'center'},
  {title: '操作', dataIndex: 'action', align: 'center', width: 150}
]
const resultColumns = [
  {title: '文件名称', dataIndex: 'fileName', align: 'center'},
  {title: '成功', dataIndex: 'success', align: 'center'},
  {title: '失败', dataIndex: 'failed', align: 'center'},
  {title: '操作', dataIndex: 'action', align: 'center'}
]
const resultDetailColumns = [
  {title: '行号', dataIndex: 'row',width: 60, align: 'center'},
  {title: '错误信息', dataIndex: 'error', align: 'center'},
  {title: '错误数据', dataIndex: 'data', align: 'center',ellipsis: true},
]

const emits = defineEmits(['update:open', 'submit'])
const props = withDefaults(defineProps<{
  uploadType: Array<string>,
  limit?: number,
  request: Function,
  serviceName?: string,
  open: boolean,
  isMultiple?: boolean,
  showTemplate?: boolean,
  removeField?: string[],
  showResults?: boolean
}>(), {
  uploadType: () => [],
  limit: 2,
  isMultiple: false,
  showTemplate: true,
  showResults: true
})
const visible = computed({
  set(value: boolean) {
    emits("update:open", value)
  },
  get(): boolean {
    return props.open
  },
})
const container = ref()
const fileList = ref<any[]>([])
const fileArray = ref<File[]>([])
const uploadFileRef = ref()
const uploadFileRefs = ref()
const cancelArray = ref<any[]>([])
const loading = ref<boolean>(false)
const uploadRes = ref<any[]>([])
const resultDetailData = ref<any[]>()

//文件选择按钮事件
const uploadFile = () => {
  uploadFileRef.value.click()
}
//文件夹按钮事件
const uploadFiles = () => {
  uploadFileRefs.value.click()
}
//选择文件后
const filesChange = (e: any) => {
  readBtnFile(e)
  uploadFileRefs.value.value = null
}
//选择文件后
const fileChange = (e: any) => {
  readBtnFile(e)
  uploadFileRef.value.value = null
}

//提取文件的扩展名
const extractFileType = (filename: string) => {
  // 使用正则表达式匹配文件名中的文件类型
  const fileTypeRegex = /\.([0-9a-z]+)(?:[\?#]|$)/i;
  const match = fileTypeRegex.exec(filename);

  if (match) {
    return match[1]; // 返回匹配到的文件类型
  } else {
    return "未知类型"; // 如果未匹配到则返回未知类型，你可以根据需要修改这里的返回值
  }
}

// 按钮选择文件后读取文件
const readBtnFile = (e: any) => {
  if (fileList.value.length === 1 && !props.isMultiple) {
    message.info('最多只能上传一个文件')
    return
  }
  const files = [...e.target.files]
  for (const filesKey in files) {
    if (Object.prototype.hasOwnProperty.call(files, filesKey)) {
      const extract = extractFileType(files[filesKey].name)
      if (!props.uploadType?.includes(extract)) {
        message.error(`所选的文件【${files[filesKey].name}】格式不正确`)
        //校验失败
        uploadFileRef.value.value = ''
        uploadFileRefs.value.value = ''
      } else if (files[filesKey].size > props.limit * 1024 * 1024) {
        message.error(`所选的文件【${files[filesKey].name}】大小超过${props.limit}M`)
        uploadFileRef.value.value = ''
        uploadFileRefs.value.value = ''
      } else {
        const item = files[filesKey]
        fileList.value.push({
          status: 0,
          fileName: item.name,
          fileSize: item.size,
          fileType: extractFileType(item.name),
          index: new Date().getTime()
        })
        fileArray.value.push(item)
      }
    }
  }
  // beginUpload()
}


//开始上传方法
const beginUpload = async () => {
  if (fileArray.value.length === 0 || fileList.value.length === 0) {
    message.info('请先选择文件')
    return
  }
  loading.value = true
  //重新点击上传
  cancelArray.value = []
  fileList.value.forEach(item => {
    item.status = 0
  })

  //开始上传
  // const {data: ossData} = await getOssSignature(props.callback)

  const tasks: any[] = []

  fileArray.value.forEach((file, index) => {
    const formdata = new FormData()
    formdata.append('file', file)
    const CancelToken = axios.CancelToken
    const source = CancelToken.source();
    cancelArray.value.push(source)

    tasks.push(() => props.request(formdata, {
      headers: {"Content-Type": "multipart/form-data"},
      onUploadProgress: function (progressEvent: any) {
        if (progressEvent.event.lengthComputable) {
          fileList.value[index].status = progressEvent.loaded / progressEvent.total * 100;
        }
      },
      cancelToken: source.token
    }))
  })
  let nextIndex = 0
  let finishCount = 0
  for (let i = 0; i < 6 && i < tasks.length; i++) {
    _run()
  }

  function _run() {
    const currentIndex = nextIndex;
    const task = tasks[nextIndex]

    nextIndex++

    task()
        .then((res: any) => {
          finishCount++
          uploadRes.value.push(res)
          if (nextIndex < tasks.length) {
            _run()
          } else if (finishCount === tasks.length && props.showResults) {
            message.success('上传完成')
            resultVisible.value = true
            loading.value = false
          }
        })
        .catch((err: any) => {
          finishCount++
          if (currentIndex < tasks.length && err.code == "ERR_CANCELED") {
            fileList.value[currentIndex].status = -1
            _run()
          } else if (currentIndex < tasks.length && err.code != "ERR_CANCELED") {
            fileList.value[currentIndex].status = -2
            _run()
          } else if (finishCount === tasks.length) {
            loading.value = false
          }
        }).finally(() => {
      loading.value = false
    })
  }

}

const beginUploadThrottle = throttle(beginUpload, 500)

const finishUpload = computed(() => {
  return fileList.value.filter((item) => item.status == 100).length
})

const finishUploadSize = computed(() => {
  let finishArr = fileList.value.filter((item) => item.status == 100)
  return finishArr.reduce((total, currentValue) => {
    return total + currentValue.fileSize
  }, 0)
})

const deleteFile = (index: number) => {
  fileList.value.splice(index, 1)
  fileArray.value.splice(index, 1)
  Array.from(uploadFileRef.value.files).splice(index, 1)
}

const cancelUpload = (index: number) => {
  const source = cancelArray.value[index]
  source.cancel('取消上传')
  fileList.value[index].status = '-1'
}

const onDrop = async (e: any) => {
  if (fileList.value.length === 1 && !props.isMultiple) {
    message.info('最多只能上传一个文件')
    return
  }
  if (e.dataTransfer.items.length > 1 && !props.isMultiple) {
    message.info('一次只能上传一个文件')
    return
  }
  for (const item of e.dataTransfer.items) {
    const entry = item.webkitGetAsEntry()
    const files = await readFile(entry)
    files.forEach(item => {
      fileList.value.push({
        status: 0,
        fileName: item.name,
        fileSize: item.size,
        fileType: extractFileType(item.name),
        index: new Date().getTime()
      })
      fileArray.value.push(item)
    })
  }
}
//拖拽读取方法
const readFile = (entry: any): Promise<Array<File>> => {
  return new Promise((resolve, reject) => {
    const files: any[] = [];
    if (entry.isDirectory) {
      if (!props.isMultiple) {
        message.warn('不能上传文件夹')
        return
      }
      // 文件夹
      const reader = entry.createReader();
      reader.readEntries((entries: any) => {
        const entryPromises = entries.map((subEntry: any) => readFile(subEntry));
        Promise.all(entryPromises)
            .then((subFiles) => {
              console.log(subFiles)
              for (const subFileArray of subFiles) {
                files.push(...subFileArray);
              }
              resolve(files);
            })
            .catch(reject);
      });
    } else {
      entry.file((f: any) => {
        const extractFileName = extractFileType(f.name)
        if (!props.uploadType?.includes(extractFileName)) {
          message.error(`所选的文件【${f.name}】格式不正确`)
        } else if (f.size > props.limit * 1024 * 1024) {
          message.error(`所选的文件【${f.name}】大小超过${props.limit}M`)
        } else {
          files.push(f);
        }
        resolve(files);
      });
    }
  });
};

const onDragenter = () => {

}
const onDragOver = () => {

}

const handleOk = () => {
  emits('submit', uploadRes.value)
  emits('update:open', false)
  handleCancel()
}

const resultClose = () => {
  uploadRes.value = []
  resultVisible.value = false
}
const openResultsDetail = (record: any) => {
  console.log(record)
  resultDetailVisible.value = true
  resultDetailData.value = record.failedList
}

const handleCancel = () => {
  loading.value = false
  fileList.value = []
  fileArray.value = []
  uploadRes.value = []
}
/**
 * 下载模版
 */
const exportTemplate = async () => {
  const data = await downloadTemplateApi({serviceName: props.serviceName, removeField: props.removeField})
  const buffer = await exportExcel(data)
  downloadExcel(buffer, `导入模版${dayjs(new Date()).format('YYYY-MM-DD')}`)
}
</script>

<style lang="scss" scoped>
.drag {
  width: 100%;
  height: 200px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .inner {
    display: flex;
    justify-content: center;
    color: #1677ff;
  }

  .support {
    color: #000;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
}

.upload-drag-icon {
  font-size: 60px;
  color: var(--theme);
}

.btns {
  padding: 10px 0;

  button {
    margin-right: 10px;
  }
}

</style>
