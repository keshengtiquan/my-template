<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { CloseOutlined, MoreOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import {useMultiTab} from "@/store/modules/multi-tab";
import {storeToRefs} from "pinia";
import {useAppStore} from "@/store";
import {computed, ref} from "vue";
const multiTabStore = useMultiTab()
const { list, activeKey } = storeToRefs(multiTabStore)
const { layoutSetting } = storeToRefs(useAppStore())
const tabStyle = computed<CSSProperties>(() => {

  const style: CSSProperties = {

  }

  if (layoutSetting.value.multiTabFixed) {
    style.position = 'fixed'
    style.top = `${layoutSetting.value.headerHeight}px`
    style.zIndex = 0
  }
  if(layoutSetting.value.layout === 'side'){
    if(layoutSetting.value.fixedHeader && !layoutSetting.value.multiTabFixed) {
      style.marginTop=`${layoutSetting.value.headerHeight}px`
    }
    if(layoutSetting.value.multiTabFixed){
      style.width = `calc(100% - 230px)`
    }
  }
  if(layoutSetting.value.layout === 'top'){
    if(layoutSetting.value.fixedHeader && layoutSetting.value.multiTab) {
      style.marginTop=`${layoutSetting.value.headerHeight}px`
    }
    if(layoutSetting.value.fixedHeader && layoutSetting.value.multiTabFixed) {
      style.marginTop = 0
    }
  }
  if(layoutSetting.value.layout === 'mix'){
    style.marginTop=`${layoutSetting.value.headerHeight}px`
    if(layoutSetting.value.multiTabFixed){
      style.marginTop=0
    }
    if(layoutSetting.value.menu){
      style.marginLeft = `${layoutSetting.value.collapsed ? 48 : 230}px`
      style.width = `calc(100% - ${layoutSetting.value.collapsed ? 48 : 230}px)`
      style.transition = 'all 0.2s'
    }
  }

  return style
})
const tabsRef = ref()

const handleSwitch = ({ key }: any, current: string) => {
  if (key === 'closeCurrent')
    multiTabStore.close(activeKey.value)
  else if (key === 'closeLeft')
    multiTabStore.closeLeft(current)
  else if (key === 'closeRight')
    multiTabStore.closeRight(current)
  else if (key === 'closeOther')
    multiTabStore.closeOther(current)
  else if (key === 'refresh')
    multiTabStore.refresh(activeKey.value)
}

const isCurrentDisabled = computed(() => {
  return list.value.length === 1 || (list.value.filter(v => !v.affix).length <= 1)
})

const leftDisabled = (key: string) => {
  // 判断左侧是否还有可关闭的
  const index = list.value.findIndex(v => v.fullPath === key)
  return index === 0 || (list.value.filter(v => !v.affix).length <= 1)
}

const rightDisabled = (key: string) => {
  // 判断右侧是否还有可关闭的
  const index = list.value.findIndex(v => v.fullPath === key)
  return index === list.value.length - 1 || (list.value.filter(v => !v.affix).length <= 1)
}
const otherDisabled = computed(() => {
  return list.value.length === 1 || (list.value.filter(v => !v.affix).length <= 1)
})
</script>

<template>
  <div v-if="layoutSetting.multiTabFixed" :style="{ height: `${62}px` }" />
  <a-tabs
      ref="tabsRef"
      :active-key="activeKey"
      :style="tabStyle"
      class="bg-white dark:bg-#242525 w-100% pro-ant-multi-tab"
      pt-10px
      type="card"
      size="small"
      :tab-bar-gutter="5"
      @update:active-key="multiTabStore.switchTab"
  >
    <a-tab-pane v-for="item in list" :key="item.fullPath">
      <template #tab>
        <a-dropdown :trigger="['contextmenu']">
          <div style="height: 22px;">
            {{  item.title }}
            <button v-if="activeKey === item.fullPath" class="ant-tabs-tab-remove" style="margin: 0;" @click.stop="multiTabStore.refresh(item.fullPath)">
              <ReloadOutlined :spin="item.loading" />
            </button>
            <button v-if="!item.affix && list.length > 1" class="ant-tabs-tab-remove" style="margin: 0;" @click.stop="multiTabStore.close(item.fullPath)">
              <CloseOutlined />
            </button>
          </div>
          <template #overlay>
            <a-menu @click="handleSwitch($event, item.fullPath)">
              <a-menu-item key="closeCurrent" :disabled="isCurrentDisabled || activeKey !== item.fullPath">
                <!-- 关闭当前 -->
                关闭当前
              </a-menu-item>
              <a-menu-item key="closeLeft" :disabled="isCurrentDisabled || leftDisabled(item.fullPath)">
                <!-- 关闭左侧 -->
                关闭左侧
              </a-menu-item>
              <a-menu-item key="closeRight" :disabled="isCurrentDisabled || rightDisabled(item.fullPath)">
                <!-- 关闭右侧 -->
                关闭右侧
              </a-menu-item>
              <a-menu-item key="closeOther" :disabled="isCurrentDisabled || otherDisabled">
                <!-- 关闭其他 -->
                关闭其他
              </a-menu-item>
              <a-menu-item key="refresh" :disabled="!isCurrentDisabled">
                <!-- 刷新当前 -->
                刷新当前
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tab-pane>
    <template #leftExtra>
      <div class="w-24px" />
    </template>
    <template #rightExtra>
      <div class="w-48px flex item-center justify-center">
        <a-dropdown :trigger="['hover']">
          <MoreOutlined class="text-16px" />
          <template #overlay>
            <a-menu @click="handleSwitch($event, activeKey)">
              <a-menu-item key="closeOther" :disabled="isCurrentDisabled || otherDisabled">
                <!-- 关闭其他 -->
                关闭其他
              </a-menu-item>
              <a-menu-item key="refresh">
                <!-- 刷新当前 -->
                刷新当前
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </template>
  </a-tabs>
</template>

<style lang="scss" >
.pro-ant-multi-tab{
  .ant-tabs-nav-operations{
    display: none !important;
  }
}
.ant-tabs-top > .ant-tabs-nav {
  margin: 0;
}
</style>
