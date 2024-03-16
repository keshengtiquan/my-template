<script setup lang="ts">
import { computed, CSSProperties } from "vue";
import { useAppStore } from '@/store'
import { storeToRefs } from "pinia";

const appStore = useAppStore()
const { layoutSetting } = storeToRefs(appStore)
defineProps<{
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
  if (layoutSetting.value.layout === "side" || layoutSetting.value.layout === "mix") {
    defaultStyle.width = `calc(100% - ${layoutSetting.value.collapsed ? 48 : 230}px)`
  }
  if (layoutSetting.value.layout === "top") {
    defaultStyle.width = '100%'
  }
  return defaultStyle
})
</script>
<template>
  <div pt-10px px-10px>
    <div class="bg-[var(--bg-page-container)] ">
      <!-- <div flex justify-between>
        <div flex items-center of-hidden>
          <slot name="title">
          </slot>
        </div>
        <div>
          <slot name="extra" />
        </div>
      </div> -->
      <div p-x-10px >
        <slot name="content" />
      </div>
    </div>
    <div>
      <div :class="contentCls">
        <slot />
      </div>
    </div>
    <div class="h-56px" v-if="$slots.footer">
    </div>
    <div v-if="$slots.footer" class="fixed bottom-0 bg-[var(--bg-color)] w-full h-56px shadow flex ">
      <div class="flex justify-end items-center px-16px" :style="footerCls">
        <slot name="footer">
        </slot>
      </div>
    </div>
  </div>
</template>


<style scoped>
.ant-tabs-top> :deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
