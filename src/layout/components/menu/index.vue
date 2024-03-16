<script setup lang="ts">
import {useAppStore, useUserStore} from '@/store'
import {storeToRefs} from "pinia";
import SubMenu from './sub-menu.vue'
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {extractPathList} from "@/utils";
import {MenuDataItem} from "@/types/gloable";

const appStore = useAppStore()
const useStore = useUserStore()
const {menuData} = storeToRefs(useStore)
const {layoutSetting} = storeToRefs(appStore)
const route = useRoute()
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])
const rootSubmenuKeys = ref(extractPathList(menuData.value, 'path'))

const setOpenKey = (menuData: MenuDataItem[]) => {
  menuData.forEach(item => {
    if(item.children && item.children.length > 0) {
      setOpenKey(item.children)
    }
    if(item.path === route.path){
      openKeys.value = [JSON.parse(item.activeMenu)[0]]
    }
  })
}

onMounted(() => {
  setOpenKey(menuData.value)
})
watch(() => route.path, () => {
  if(!route.path.startsWith('/redirect/'))
    selectedKeys.value = JSON.parse((route.meta.activeMenu as string))
}, {
  immediate: true,
  deep: true
})
const onOpenChange = (openKey: string[]) => {
  if (layoutSetting.value.accordionMode) {
    const latestOpenKey = openKey.find(key => openKeys.value.indexOf(key) === -1);
    if (rootSubmenuKeys.value.indexOf(latestOpenKey) === -1) {
      openKeys.value = openKey;
    } else {
      openKeys.value = latestOpenKey ? [latestOpenKey] : [];
    }
  }
}

</script>

<template>
  <a-menu
      @openChange="onOpenChange"
      :open-keys="layoutSetting.layout === 'top' ? [] : openKeys"
      :selectedKeys="selectedKeys"
      :mode="layoutSetting.layout === 'top' ? 'horizontal' : 'inline'"
      :theme="layoutSetting.theme === 'inverted' ? 'dark' : layoutSetting.theme === 'dark' ? 'dark': 'light'"
      :collapsed="layoutSetting.collapsed"
  >
    <template v-for="item in useStore.menuData" :key="item.path">
      <template v-if="!item.hideInMenu">
        <SubMenu :item="item"/>
      </template>
    </template>
  </a-menu>
</template>