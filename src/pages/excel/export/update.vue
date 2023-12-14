<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ExportForm from './component/ExportFrom.vue'
import {useRouter, useRoute} from "vue-router";
import {onMounted, reactive} from "vue";
import {FormState} from "@/pages/excel/export/component/ExportFrom.vue";
import {getExportExcelOneApi, updateExportExcelApi} from "@/api/excel";
import {ref} from "vue";
import {message} from "ant-design-vue";
const router = useRouter();
const route = useRoute()
const id = route.query.id as string
const exportFormRef = ref()
const formState = reactive<FormState>({
  templateName: '',
  exportType: undefined,
  exportService: '',
  exportFields: '',
  sheetName: ''
})
const handleSubmit = async () => {
  formState.exportFields = JSON.stringify(exportFormRef.value.dataSource)
  const res = await updateExportExcelApi(formState)
  if(res.code === 200) {
    message.success(res.message)
    router.go(-1)
  }
}
onMounted(async () => {
  const res = await getExportExcelOneApi(id)
  Object.assign(formState, res.data)
})
</script>
<template>
  <PageContainer title="更新导出模版">
    <template #footer>
      <a-space>
        <a-button  @click="() => router.go(-1)">取消</a-button>
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </a-space>
    </template>
    <ExportForm v-if="formState.exportFields" ref="exportFormRef" :form-state="formState"></ExportForm>
  </PageContainer>
</template>
<style scoped>

</style>