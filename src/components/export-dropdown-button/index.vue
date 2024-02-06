<script setup lang="ts">
import {downloadExcel} from "@/utils/excelExport.ts";
import {ref} from "vue";
import * as dayjs from "dayjs";

const props = withDefaults(defineProps<{
  request: Function,
  fileName?: string,
  params?: object
}>(), {
  params: () => ({}),
  fileName: '项目清单'
})
const exportLoading = ref(false)
const exportList = async () => {
  exportLoading.value = true
  const data: any = await props.request(props.params)
  exportLoading.value = false
  const uint8Array = new Uint8Array(data.data);
  downloadExcel(uint8Array, `${props.fileName}${dayjs(new Date()).format('YYYY-MM-DD')}`)
}
</script>
<template>
  <a-dropdown placement="bottomLeft">
    <a-button :loading="exportLoading">导出清单</a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="exportList">
          导出所有
        </a-menu-item>
        <a-menu-item @click="exportList">
          导出当前页
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<style scoped>

</style>