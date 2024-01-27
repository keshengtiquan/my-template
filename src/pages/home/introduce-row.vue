<script setup lang="ts">
import IntroduceCard from "@/pages/home/component/introduce-card.vue";
import * as dayjs from "dayjs";
import Trend from './component/trend.vue'
import Field from './component/field.vue'
import { onBeforeUnmount, onMounted, ref} from "vue";
import {Area, Progress, Column} from '@antv/g2plot';
import {getIntroduceApi} from "@/api/analyse";
import {Introduce} from "@/api/analyse/types.ts";

const monthlyChart = ref()
const yearChart = ref()
const progressChart = ref()
const area = ref()
const tinyColumn = ref()
const progress = ref()
const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 6,
  style: {marginBottom: '24px'},
}
const introduceData = ref<Introduce>({
  dailyIntroduceData: {
    dailyOutputValue: '',
    weekOutputValue: '',
    weekRate: '',
    dayRate: '',
  },
  monthIntroduceData: {
    data: {
      completionOutputValue: '',
      planOutputValue: '',
      completionRate: '',
    },
    chartData: []
  },
  yearIntroduceData: {
    data: {
      completionOutputValue: '',
      planOutputValue: '',
      completionRate: '',
    },
    chartData: []
  },
  totalityIntroduceData: {
    progress: 0,
    progressText: 0,
    lastProgress: '',
  }
})
onMounted(async () => {
  const {data} = await getIntroduceApi()
  introduceData.value = data

  area.value = new Area(monthlyChart.value, {
    height: 46,
    xField: 'x',
    yField: 'y',
    data: data.monthIntroduceData!.chartData,
    xAxis: false,
    yAxis: false,
    smooth: true,
    padding: [0, -20, 0, -20],
    meta: {
      y: {
        alias: '产值'
      }
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        fillOpacity: 0.6
      };
    },
  });
  area.value.render();

  tinyColumn.value = new Column(yearChart.value, {
    height: 46,
    autoFit: true,
    data: data.yearIntroduceData!.chartData,
    xField: 'x',
    yField: 'y',
    xAxis: false,
    yAxis: false,
    meta: {
      y: {
        alias: '产值'
      }
    },
  })
  tinyColumn.value.render()

  progress.value = new Progress(progressChart.value, {
    height: 46,
    autoFit: true,
    percent: data.totalityIntroduceData!.progress,
    barWidthRatio: 0.2,
    color: '#1890ff',
    tooltip: {

    }
  })
  progress.value.render()
})
onBeforeUnmount(() => {
  area.value?.destroy()
  area.value = undefined
  tinyColumn.value?.destroy()
  tinyColumn.value = undefined
  progress.value?.destroy()
  progress.value = undefined
})
</script>
<template>
  <a-row :gutter="24">
    <a-col v-bind="{ ...topColResponsiveProps }">
      <IntroduceCard title="日产值" :indicatorSpecification="`${dayjs(new Date()).format('YYYY-MM-DD')}日产值`">
        <template #top>
          <span style="color: var(--text-color)">¥{{ introduceData?.dailyIntroduceData?.dailyOutputValue }}</span>
        </template>
        <div class="absolute" style="bottom: 0">
          <Trend :flag="Number(introduceData.dailyIntroduceData.dayRate) > 0 ? 'up' : 'down'" style="color: var(--text-color-4)">
            日同比
            <span class="">{{introduceData.dailyIntroduceData.dayRate}}%</span>
          </Trend>
          <Trend :flag="Number(introduceData.dailyIntroduceData.weekRate) > 0 ? 'up' : 'down'" style="color: var(--text-color-4)">
            周同比
            <span class="">{{introduceData.dailyIntroduceData.weekRate}}%</span>
          </Trend>
        </div>
        <template #bottom>
          <Field label="日产值" :value="`￥${introduceData.dailyIntroduceData.dailyOutputValue}`"></Field>
        </template>
      </IntroduceCard>
    </a-col>
    <a-col v-bind="{ ...topColResponsiveProps }">
      <IntroduceCard title="本月产值" :indicator-specification="`${dayjs(new Date()).format('YYYY-MM')}月产值`">
        <template #top>
          <span style="color: var(--text-color)">¥ {{introduceData.monthIntroduceData.data.completionOutputValue}}</span>
        </template>
        <div ref="monthlyChart"></div>
        <template #bottom>
          <Field label="完成率" :value="`${introduceData.monthIntroduceData.data.completionRate}%`"></Field>
        </template>
      </IntroduceCard>
    </a-col>
    <a-col v-bind="{ ...topColResponsiveProps }">
      <IntroduceCard title="年度产值" :indicator-specification="`${dayjs(new Date()).format('YYYY')}年产值`">
        <template #top>
          <span style="color: var(--text-color)">¥ {{introduceData.yearIntroduceData.data.completionOutputValue}}</span>
        </template>
        <div ref="yearChart"></div>
        <template #bottom>
          <Field label="完成率" :value="`${introduceData.yearIntroduceData.data.completionRate}%`"></Field>
        </template>
      </IntroduceCard>
    </a-col>
    <a-col v-bind="{ ...topColResponsiveProps }">
      <IntroduceCard title="项目总体进度" indicator-specification="完成率">
        <template #top>
          <span style="color: var(--text-color)">{{introduceData.totalityIntroduceData.progressText}}%</span>
        </template>
        <div ref="progressChart"></div>
        <template #bottom>
          <Trend flag="up" style="margin-right: 16px; color: var(--text-color-4) ">
            月增长
            <span class="">{{introduceData.totalityIntroduceData.lastProgress}}%</span>
          </Trend>
        </template>
      </IntroduceCard>
    </a-col>
  </a-row>
</template>
<style scoped>
.a {
  color: #975FE4;
}
</style>