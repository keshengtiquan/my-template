<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  placement?: string
}>(), {
  placement: 'top'
})
</script>
<template>
  <a-tooltip :placement="placement">
    <template #title>
      <span>{{title}}</span>
    </template>
    <slot/>
  </a-tooltip>
</template>
<style scoped>

</style>