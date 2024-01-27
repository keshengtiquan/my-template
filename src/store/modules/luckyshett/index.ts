import {defineStore} from "pinia";
import {ref} from "vue";


export const useLuckySheetStore = defineStore('luckysheet', () => {
  const request = ref<Function>(() => {})
  const setRequest = (value: Function) => {
    request.value = value
  }
  return {
    request,
    setRequest
  }
})