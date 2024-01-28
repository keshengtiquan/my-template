<script lang="ts" setup>
import { DocumentEditor } from "@onlyoffice/document-editor-vue";
import {onMounted, ref} from "vue";
import {getDocunmentInfoApi} from "@/api/onlyoffice";

const config = ref()
onMounted(async () => {
  const {data} = await getDocunmentInfoApi({key: '变电所（东南段）.xlsx', fileType: 'xlsx', documentType: 'cell'})
  config.value = data
})
</script>

<template>
    <DocumentEditor  id="docEditor" documentServerUrl="http://keshengtiquan.work:9500/" :config="config"
    />

</template>

<style scoped></style>
