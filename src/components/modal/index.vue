<script setup lang="ts">
import { useDragModal } from '@/composables/useDragModal'
import { computed, ref } from 'vue';
const modalTitleRef = ref()
const { transformStyle } = useDragModal(modalTitleRef)
const props = defineProps<{
  modelValue: boolean
  title: string
}>()
const emits = defineEmits(['update:modelValue'])
const modelValue = computed({
  set(value: undefined | boolean) {
    emits("update:modelValue", value)
  },
  get(): undefined | boolean {
    return props.modelValue
  },
})
</script>
<template>
  <a-modal ref="modalRef" v-model:open="modelValue" :wrap-style="{ overflow: 'hidden' }" v-bind="$attrs">
    <slot></slot>
    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move;">{{ title }}</div>
    </template>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>
<style scoped></style>