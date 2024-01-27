<script setup lang="ts">
import Tooltip from '@/components/tooltip-icon/index.vue'
defineProps<{
  title: string,
  indicatorSpecification: string
}>()
</script>
<template>
  <div class="bg-[var(--bg-color)] font-size-14px rd-8px shadow">
    <div class="p-x-24px pt-20px pb-8px" style="color: rgba(0, 0, 0, 0.88)">
      <div>
        <div>
          <div class="h-22px font-size-14px flex justify-between" style="line-height: 22px;color: var(--text-color-3)">
            <span>{{title}}</span>
            <Tooltip :title="indicatorSpecification">
              <InfoCircleOutlined />
            </Tooltip>
          </div>
          <div class="h-38px mt-4px mb-0 font-size-30px font-300" style="line-height: 38px">
            <slot name="top"></slot>
          </div>
        </div>
        <div class="h-46px mb-12px relative">
          <slot></slot>
        </div>
        <div class="mt-8px pt-9px " style="border-top: 1px solid rgba(5, 5, 5, 0.06)">
          <slot name="bottom">

          </slot>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';
}
</style>