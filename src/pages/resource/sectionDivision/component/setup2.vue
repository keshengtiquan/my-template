<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getWorkPlaceListNoPageApi} from "@/api/workplace";

interface ListType {
  name: string;
  key: string;
}

const emits = defineEmits(['change'])
const props = defineProps<{
  stationActive: string[],
  sectionActive: string[]
}>()
const createWorkPlaceList = (data: any[], type: string): ListType[] => {
  return data
      .filter((item) => item.workPlaceType === type)
      .map((item) => {
        return {name: item.workPlaceName, key: item.id};
      });
};

const stationList = ref<ListType[]>([{name: "全部", key: "all"}]);
const sectionList = ref<ListType[]>([{name: "全部", key: "all"}]);
const stationActiveList = ref<string[]>(props.stationActive);
const sectionActiveList = ref<string[]>(props.sectionActive);

const handleClick = (item: ListType, activeList: any, list: any) => {
  if (item.key === "all") {
    if (activeList.value.includes("all")) {
      activeList.value = [];
      return;
    } else {
      activeList.value = list.value.map((v: ListType) => v.key);
    }
    return;
  }
  if (activeList.value.includes(item.key)) {
    activeList.value = activeList.value.filter((v: any) => v !== item.key);
    if (activeList.value.includes("all")) {
      activeList.value = activeList.value.filter((v: any) => v !== "all");
    }
  } else {
    activeList.value = [...activeList.value, item.key];
    if (activeList.value.length === list.value.length - 1) {
      activeList.value = [...activeList.value, "all"];
    }
  }
};

const handleSectionClick = (item: ListType) => {
  handleClick(item, sectionActiveList, sectionList);
  emits('change', [...stationActiveList.value.filter(item => item !== 'all'), ...sectionActiveList.value.filter(item => item !== 'all')])
};

const handleStationClick = (item: ListType) => {
  handleClick(item, stationActiveList, stationList);
  emits('change', [...stationActiveList.value.filter(item => item !== 'all'), ...sectionActiveList.value.filter(item => item !== 'all')])
};

onMounted(async () => {
  const {data} = await getWorkPlaceListNoPageApi();
  stationList.value.push(...createWorkPlaceList(data, "station"));
  sectionList.value.push(...createWorkPlaceList(data, "section"));
  if (stationList.value.length - 1 === props.stationActive.length) {
    handleStationClick({name: "全部", key: "all"})
  }
  if (sectionList.value.length - 1 === props.sectionActive.length) {
    handleSectionClick({name: "全部", key: "all"})
  }
});
</script>

<template>
  <div>
    <a-form>
      <a-form-item label="车站">
        <div class="flex flex-wrap gap-2">
          <a-tag
              v-for="item in stationList"
              :key="item.key"
              cursor-pointer
              :color="stationActiveList.includes(item.key) ? '#108ee9' : ''"
              @click="handleStationClick(item)"
          >
            {{ item.name }}
          </a-tag>
        </div>
      </a-form-item>
      <a-divider dashed/>
      <a-form-item label="区间">
        <div class="flex flex-wrap gap-2">
          <a-tag
              v-for="item in sectionList"
              :key="item.key"
              cursor-pointer
              :color="sectionActiveList.includes(item.key) ? '#108ee9' : ''"
              @click="handleSectionClick(item)"
          >
            {{ item.name }}
          </a-tag>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
</style>