<script setup lang="ts">
import {onMounted, ref} from "vue";
import iconData from './icon-data.ts'
const selectIcon = ref()
const current = ref(1)
const total = ref(iconData.length)
const iconListData = ref<string[]>([])
const pageSize = ref(35)


const getData = (page: number, pageSize: number) => {
  iconListData.value = iconData.slice(page * pageSize, page * pageSize + pageSize)
}

onMounted(() => {
  getData(1, 35)
})

</script>
<template>
    <a-popover placement="bottom" trigger="click" >
      <template #content>
        <ul class="iconList">
          <li
              v-for="(item, key) in iconListData"
              :key="key"
              :title="item"
              class="icon-item w-full border border-solid cursor-pointer"
          >
            <Component :is="item" />
          </li>
        </ul>
        <a-pagination v-model:current="current" size="small" :showSizeChanger="false" :page-size="pageSize" @change="(page:number,pageSize:number) => getData(page,pageSize)" :total="total" show-less-items />
      </template>
      <a-input :value="selectIcon" readOnly>
        <template #addonBefore>
          <LogoutOutlined />
        </template>
      </a-input>
    </a-popover>
</template>
<style scoped>
.iconList {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(7, 14.2%);
  grid-template-rows: repeat(5, 20%);
  grid-row-gap: 5px;
  grid-column-gap: 5px;
}
.icon-item {
  list-style-type: none;
}
</style>