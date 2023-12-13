<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {useRouter} from "vue-router";
import {reactive, ref} from "vue";
import {FormState} from "@/pages/excel/export/component/ExportFrom.vue";
import ExportForm from './component/ExportFrom.vue'
import {createExportExcelApi} from "@/api/excel";
import {message} from "ant-design-vue";

const router = useRouter()
const formState = reactive<FormState>({
  templateName: '',
  exportType: undefined,
  exportService: '',
  exportFields: ''
})
const exportFormRef = ref()
const handleSubmit = async () => {
  formState.exportFields = JSON.stringify(exportFormRef.value.dataSource)
  console.log(formState)
  const res = await createExportExcelApi(formState)
  if(res.code === 200) {
    message.success(res.message)
    router.go(-1)
  }
}
</script>
<template>
  <PageContainer>
    <template #footer>
      <a-space>
        <a-button  @click="() => router.go(-1)">取消</a-button>
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </a-space>
    </template>
    <ExportForm ref="exportFormRef" :form-state="formState"></ExportForm>
  </PageContainer>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>