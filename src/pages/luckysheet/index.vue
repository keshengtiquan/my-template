<!--<script setup lang="ts">-->
<!--import { nextTick, onMounted} from "vue";-->
<!--import LuckySheet from "luckyexcel";-->
<!--import {useLuckySheetStore} from "@/store";-->
<!--import { exportExcel} from "@/utils/excelExport.ts";-->
<!--import {storeToRefs} from "pinia";-->
<!--const luckySheetStore = useLuckySheetStore()-->
<!--const {request} = storeToRefs(luckySheetStore)-->
<!--const transformFileToLucky = (file: File) => {-->
<!--    LuckySheet.transformExcelToLucky(file,-->
<!--      function(exportJson: any){-->
<!--        // exportJson就是转换后的数据-->
<!--        nextTick(() => {-->
<!--          window.luckysheet.destroy();-->
<!--          // 将拿到的数据创建表格-->
<!--          luckysheet.create({-->
<!--            container: 'luckysheet', // luckysheet is the container id-->
<!--            data:exportJson.sheets,-->
<!--            title:exportJson.info.name,-->
<!--            userInfo:exportJson.info.creator,-->
<!--            lang: 'zh', // 设定表格语言-->
<!--            myFolderUrl: window.location.href,-->
<!--            showtoolbarConfig: {-->
<!--              pivotTable: false,  //'数据透视表'-->
<!--              // protection: false, // '工作表保护'-->
<!--              print:false, // '打印'-->
<!--              image: false, // 插入图片-->
<!--            },-->
<!--            showinfobar: false,-->
<!--            options: {-->
<!--              // 其他配置-->
<!--              userImage:'http://qzz-static.forwe.store/public-assets/pgy_kj_pic_logo.png?x-oss-process=image/resize,m_fill,w_72,h_72', // 头像url-->
<!--              userName:'Lucky', // 用户名-->
<!--            }-->
<!--          });-->
<!--        })-->
<!--      },-->
<!--      function(){-->
<!--        console.log('Import failed. Is your fail a valid xlsx?');-->
<!--      }-->
<!--  )-->
<!--}-->

<!--const tableToExcel = async () => {-->
<!--  const data = await request.value({})-->
<!--  const buffer = await exportExcel(data.data)-->
<!--  const file = new File([buffer], 'xxx.xlsx')-->
<!--  return transformFileToLucky(file)-->
<!--}-->
<!--onMounted( () => {-->
<!--  tableToExcel()-->
<!--});-->
<!--</script>-->
<!--<template>-->
<!--  <div style="z-index: 6; position:fixed; left: 0; top: 0;width:100%;height:100%;">-->
<!--    <div>-->
<!--      <div style="position:absolute;top:0px;left:0px;">-->

<!--        <a-button>保存并上传</a-button>-->
<!--      </div>-->
<!--      <div id="luckysheet" style="z-index: 5;margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 30px;"></div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<!--<style scoped>-->

<!--</style>-->