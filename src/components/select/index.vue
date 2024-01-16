<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import * as _ from 'lodash'

const props = withDefaults(defineProps<{
  modelValue: any
  request: Function
  fieldNames: {label: string, value: string, options?: any}
  limit?: number,
}>(),{
  limit: 10
})
const emits = defineEmits(['update:modelValue'])
const selectValue = computed({
  set(value: string) {
    emits("update:modelValue", value)
  },
  get(): string {
    return props.modelValue
  },
})
const loading = ref(false)
const optionDate = ref<any[]>([])

const getOptionData = _.debounce(async (value: string) => {
  const params: any = {
    current: 1,
    pageSize: props.limit
  }
  params[props.fieldNames.label] = value
  loading.value = true
  optionDate.value = []
  const {data} = await props.request(params)
  loading.value = false
  if(data){
    optionDate.value = data.results
  }
}, 1000)
onMounted(() => {
  getOptionData('')
})

</script>
<template>
  <a-select
      v-model:value="selectValue"
      :filter-option="false"
      show-search
      :not-found-content="loading ? undefined : null"
      :options="optionDate"
      v-bind="$attrs"
      :fieldNames="fieldNames"
      @search="getOptionData"
  >
    <template v-if="loading" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>



<style scoped>

</style>