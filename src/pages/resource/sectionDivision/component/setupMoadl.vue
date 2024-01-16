<script setup lang="ts">
import {ref} from 'vue';
import {message} from "ant-design-vue";
import Setup1 from "@/pages/resource/sectionDivision/component/setup1.vue";
import Setup2 from "@/pages/resource/sectionDivision/component/setup2.vue";
import {useRoute} from "vue-router";
import {getOneByIdApi, updateSectionDivisionAPi,} from "@/api/sectionDivision";

const route = useRoute();
const open = ref<boolean>(false);
const selectedRowKeys = ref<string[]>([])
const selectedWorkPlace = ref<string[]>([])
const stationActive = ref<string[]>([]);
const sectionActive = ref<string[]>([]);
const emits = defineEmits(['submit'])
const steps = [
  {title: '选择清单',},
  {title: '选择工点',},
];
const items = steps.map(item => ({key: item.title, title: item.title}));
const current = ref<number>(0);
const showModal = async () => {
  const {data} = await getOneByIdApi({id: route.query.id as string})
  selectedRowKeys.value = data.listIds
  stationActive.value = data.stationList
  sectionActive.value = data.sectionList
  selectedWorkPlace.value = [...stationActive.value, ...sectionActive.value]
  open.value = true;
};

const handleOk = async () => {
  const params = {
    id: route.query.id as string,
    listIds: selectedRowKeys.value,
    workPlaceIds: selectedWorkPlace.value,
  }
  const res = await updateSectionDivisionAPi(params)
  if(res.code === 200) {
    message.success('更新成功')
  }
  emits('submit')
  open.value = false;
};
const onWorkPlaceChange = (values: string[]) => {
  selectedWorkPlace.value = values
}
const afterClose = () => {
  current.value = 0
}
const next = () => {
  current.value++;
};
const prev = () => {
  current.value--;
};
defineExpose({open, showModal})
</script>
<template>
  <a-modal v-model:open="open" :afterClose="afterClose" destroyOnClose width="70%" :footer="null" title="选择清单" @ok="handleOk">
    <a-steps class="px-300px" :current="current" :items="items" size="small"></a-steps>
    <div>
      <div v-show="current === 0">
        <Setup1 v-model:selected-row-keys="selectedRowKeys"></Setup1>
      </div>
      <div v-show="current === 1" class="mt-25px mx-20px">
        <Setup2 :section-active="sectionActive" :station-active="stationActive" @change="onWorkPlaceChange"></Setup2>
      </div>
    </div>
    <div class="text-right mt-20px">
      <a-space>
        <a-button v-if="current > 0" @click="prev">上一步</a-button>
        <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>
        <a-button
            v-if="current == steps.length - 1"
            type="primary"
            @click="handleOk"
        >
          完成
        </a-button>
      </a-space>
    </div>
  </a-modal>
</template>
<style scoped>

</style>