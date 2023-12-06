<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, CSSProperties} from "vue";
import {useAppStore} from '@/store'
import {storeToRefs} from "pinia";

const appStore = useAppStore()
const {layoutSetting} = storeToRefs(appStore)
const route: any = useRoute()
const props = defineProps<{
  title?: string
}>()
const contentCls = computed(() => {
  const cls: string[] = [
    'flex flex-col flex-1 ',
  ]
  if (layoutSetting.value.contentWidth === 'Fluid')
    cls.push('w-full')
  else if (layoutSetting.value.contentWidth === 'Fixed')
    cls.push(...['max-w-1200px w-1200px', 'mx-auto'])
  return cls
})

const footerCls = computed<CSSProperties>(() => {
  const defaultStyle: CSSProperties = {
    transition: 'all 0.2s'
  }
  if(layoutSetting.value.layout === "side" || layoutSetting.value.layout === "mix"){
    defaultStyle.width = `calc(100% - ${layoutSetting.value.collapsed ? 48 : 230}px)`
  }
  if(layoutSetting.value.layout === "top") {
    defaultStyle.width = '100%'
  }
  return defaultStyle
})
</script>
<template>
  <div>
    <div class="bg-[var(--bg-page-container)] px-24px mb-16px pt-12px pb-5px">
      <a-breadcrumb v-if="!route.meta.hideInBreadcrumb">
        <template v-if="route.matched?.length">
          <a-breadcrumb-item v-for="item in route.matched" :key="item.path">
            {{ item.meta?.title }}
          </a-breadcrumb-item>
        </template>
      </a-breadcrumb>
      <div flex justify-between>
        <div flex items-center my-4px of-hidden>
          <slot name="title">
            <span text-20px line-height-32px mr-12px mb-0 truncate font-600>{{
                title ? title : route.meta?.title
              }}</span>
          </slot>
        </div>
        <div>
          <slot name="extra"/>
        </div>
      </div>
      <div  w-full>
        <slot name="content"/>
      </div>
    </div>
    <div class="mx-24px">
      <div :class="contentCls">
        <slot/>
      </div>
    </div>
    <div class="fixed bottom-0 bg-[var(--bg-color)] w-full h-56px shadow flex ">
      <div class="flex justify-end items-center" :style="footerCls">
        <slot name="footer"/>
      </div>
    </div>
  </div>
</template>


<style scoped>
.ant-tabs-top > :deep(.ant-tabs-nav) {
  margin: 0;
}
</style>