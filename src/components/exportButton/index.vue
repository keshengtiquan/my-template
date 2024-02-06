<script setup lang="ts">
import {downloadExcel} from "@/utils/excelExport.ts";
import * as dayjs from "dayjs";
import {ref} from "vue";
const props = defineProps<{
  request: Function,
  initParams?: object,
  fileName: string,
}>()
const exportLoading = ref(false)
const exportExcel = async () => {
  exportLoading.value = true
  const data: any = await props.request(props.initParams)
  exportLoading.value = false
  const uint8Array = new Uint8Array(data.data);
  downloadExcel(uint8Array, `${props.fileName}${dayjs(new Date()).format('YYYY-MM-DD')}`)
}
</script>
<template>
  <a-button :loading="exportLoading" @click="exportExcel">导出数据</a-button>
</template>
<style scoped>

</style>