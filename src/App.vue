<script setup lang="ts">
import {useAppStore} from '@/store'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
const appStore = useAppStore()

</script>

<template>
  <a-config-provider
      :locale="zhCN"
      :theme="appStore.theme"
  >
  <router-view/>
  </a-config-provider>
</template>

<style scoped>

</style>
