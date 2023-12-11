<template>
  <a-form
      ref="formRef"
      :model="formState"
  >
    <a-form-item label="解析页签名称" name="sheetName" >
      <a-select v-model:value="formState.sheetName"   placeholder="Tags Mode" >
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Activity zone" name="region">
      <a-select v-model:value="formState.region" placeholder="please select your zone">
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const formState = reactive({
  sheetName: undefined,
  region: undefined,
});
</script>

<style scoped>

</style>