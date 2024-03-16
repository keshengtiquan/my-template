<script setup lang="ts">

</script>
<template>
  <a-card title="快捷导航" mb-8px>
    <a-card-grid v-for="item in 6" cursor-pointer>
      <span class="flex flex-col items-center">
        <component is="HomeOutlined"  />
        <span class="text-md mt-2">首页</span>
      </span>
    </a-card-grid>
  </a-card>
</template>
<style scoped></style>