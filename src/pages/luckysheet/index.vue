<script lang="ts" setup>
import { DocumentEditor } from "@onlyoffice/document-editor-vue";

const config = {
  document: {
    fileType: "docx",
    key: "test.docx",
    title: "Example Document Title.docx",
    url: "http://192.168.31.115:3000/static/test1.docx"
  },
  documentType: "word",
  editorConfig: {
    callbackUrl: "https://example.com/url-to-callback.ashx"
  }
}
</script>

<template>
  <DocumentEditor id="docEditor" documentServerUrl="http://keshengtiquan.work:9500/" :config="config"
     />
</template>

<style scoped></style>
