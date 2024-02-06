<script lang="ts" setup>
import {DocumentEditor} from "@onlyoffice/document-editor-vue";
import {onMounted, ref} from "vue";
import {getDocunmentInfoApi} from "@/api/onlyoffice";

const config = ref()

onMounted(async () => {
  const {data} = await getDocunmentInfoApi({
    user: {id: '123', group: '234', name: 'lijianbo'},
    key: 1234,
    url: '/temp/workPlaceList.xlsx',
    fileType: 'xlsx',
    documentType: 'cell',
    title: '车站区间工程量表'
  })
  config.value = data
})
</script>

<template>
  <DocumentEditor id="docEditor" documentServerUrl="http://keshengtiquan.work:9500/" :config="config"
  />

</template>

<style scoped></style>
