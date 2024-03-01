<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, shallowRef } from "vue";
import { Column } from '@antv/g2plot'
import { getWorkAreaOutPutValueApi, getWorkPlaceOutputValueApi } from "@/api/analyse";
import { convertOutpuValue, getStartDateAndEndDate } from "@/utils";
import dayjs from "dayjs";
const today = dayjs(new Date()).format('YYYY-MM-DD')
const segmentedData = reactive(['今日', '本周', '本月', '本年']);
const segmentedValue = ref(segmentedData[0]);
const rangePickerValue = ref<string[]>([today, today])
const activeKey = ref('station')
const stationChartRef = ref()
const sectionChartRef = ref()

const rankingListData = ref<{ title: string; total: number }[]>([])

const getWorkPlaceOutputValue = async (time: string[]) => {
  const { data } = await getWorkAreaOutPutValueApi({ time })
  const tem: { title: string, total: number }[] = []
  data.forEach((item) => {
    tem.push({
      title: item.workAreaName,
      total: convertOutpuValue(item.outputValue)
    })
  })
  rankingListData.value = tem
}

const rangPickerChange = async (dates: string[]) => {
  await getWorkPlaceOutputValue(dates)
  segmentedValue.value = segmentedData[-1]
}

const segmentedChange = async (value: string) => {
  const {
    yearStartDate,
    yearEndDate,
    monthStartDate,
    monthEndDate,
    weekStartDate,
    weekEndDate
  } = getStartDateAndEndDate(new Date())
  switch (value) {
    case '今日':
      rangePickerValue.value = [today, today]
      break;
    case '本周':
      rangePickerValue.value = [weekStartDate, weekEndDate]
      break;
    case '本月':
      rangePickerValue.value = [monthStartDate, monthEndDate]
      break;
    case '本年':
      rangePickerValue.value = [yearStartDate, yearEndDate]
      break;
  }
  await getWorkPlaceOutputValue(rangePickerValue.value)
}

let renderOnce = false
const tabsChange = async (activeKey: string) => {
  if (activeKey === 'section' && !renderOnce) {
    const { data } = await getWorkPlaceOutputValueApi({ workPlaceType: activeKey })
    const formatData = data.map((item: any) => {
      let workplaceName = item.workplaceName
      if(item.workplaceName.includes('-')){
        console.log(item.workplaceName);
        workplaceName = item.workplaceName.split('-')[0].charAt(0) + '-' + item.workplaceName.split('-')[1].charAt(0)
      }
      return {
        workplaceName: workplaceName,
        value: convertOutpuValue(item.value),
        type: item.type
      }
    })
    setTimeout(() => {
      new Column(sectionChartRef.value, {
        data: formatData,
        isStack: true,
        xField: 'workplaceName',
        yField: 'value',
        seriesField: 'type',
        height: 300,
        label: {
          position: 'middle', // 'top', 'bottom', 'middle',
          layout: [
            // 柱形图数据标签位置自动调整
            { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // 数据标签文颜色自动调整
            { type: 'adjust-color' },
          ],
        },
        legend: {
          layout: 'horizontal',
          position: 'top-left'
        }
      }).render()
      renderOnce = true
    })
  }
}
const column = shallowRef<Column>()
onMounted(async () => {
  const { data } = await getWorkPlaceOutputValueApi({ workPlaceType: activeKey.value })
  await getWorkPlaceOutputValue(rangePickerValue.value)
  const formatData = data.map((item: any) => {
    return {
      workplaceName: item.workplaceName,
      value: convertOutpuValue(item.value),
      type: item.type
    }
  })

  column.value = new Column(stationChartRef.value, {
    data: formatData,
    isStack: true,
    xField: 'workplaceName',
    yField: 'value',
    seriesField: 'type',
    height: 300,
    label: {
      position: 'middle', // 'top', 'bottom', 'middle',
      layout: [
        // 柱形图数据标签位置自动调整
        { type: 'interval-adjust-position' },
        // 数据标签防遮挡
        { type: 'interval-hide-overlap' },
        // 数据标签文颜色自动调整
        { type: 'adjust-color' },
      ],
    },
    legend: {
      layout: 'horizontal',
      position: 'top-left'
    }
  })
  column.value?.render()
})
onBeforeUnmount(() => {
  column.value?.destroy()
  column.value = undefined
})
</script>
<template>
  <div class="bg-[var(--bg-color)]" rd-8px>
    <a-row>
      <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
        <a-tabs size="large" v-model:activeKey="activeKey" @change="tabsChange"
          :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <a-tab-pane key="station" tab="车站">
            <div pl-32px pb-32px ref="stationChartRef"></div>
          </a-tab-pane>
          <a-tab-pane key="section" tab="区间">
            <div pl-32px pb-32px ref="sectionChartRef"></div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
        <div>
          <div flex items-center pl-50px h-57px mb-24px style="border-bottom: 1px solid rgba(5, 5, 5, 0.06)">
            <div>
              <a-segmented class="segmented" mr-24px @change="segmentedChange" v-model:value="segmentedValue"
                :options="segmentedData" />
            </div>
            <a-range-picker m-l-24px v-model:value="rangePickerValue" :style="{ width: '256px' }" valueFormat="YYYY-MM-DD"
              @change="rangPickerChange" />
          </div>
          <div pl-72px pb-32px pr-32px>
            <h4>产值完成情况</h4>
            <ul class="rankingList">
              <li v-for="(item, index) in rankingListData" :key="index">
                <span :class="`rankingItemNumber ${index < 3 ? 'active' : ''}`">
                  {{ index + 1 }}
                </span>
                <span class="rankingItemTitle" :title="item.title">
                  {{ item.title }}
                </span>
                <span class="rankingItemValue">
                  {{ item.total }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped lang="scss">
.rankingList {
  margin: 25px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    margin-top: 16px;
    zoom: 1;

    &::before,
    &::after {
      display: table;
      content: " ";
    }

    &::after {
      clear: both;
      height: 0;
      font-size: 0;
      visibility: hidden;
    }

    span {
      color: var(--text-color);
      font-size: 14px;
      line-height: 22px;
    }

    .rankingItemNumber {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-top: 1.5px;
      margin-right: 16px;
      font-weight: 600;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      background-color: #fafafa;
      border-radius: 20px;

      &.active {
        color: #fff;
        background-color: #314659;
      }
    }

    .rankingItemTitle {
      flex: 1;
      margin-right: 8px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

@media screen and (max-width: 992px) {
  .segmented {
    display: none;
  }

  .rankingList {
    li {
      span:first-child {
        margin-right: 8px;
      }
    }
  }
}
</style>