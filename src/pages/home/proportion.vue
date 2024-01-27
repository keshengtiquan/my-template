<script setup lang="ts">
import {Treemap} from '@antv/g2plot';
import {onMounted, ref, onBeforeUnmount} from "vue";
import {getProportion} from "@/api/analyse";

const chartRef = ref();
const treemapPlot = ref()

onMounted(async () => {
  // piePlot.value = new Pie(chartRef.value, {
  //   appendPadding: 10,
  //   data: data.value,
  //   angleField: 'value',
  //   colorField: 'type',
  //   radius: 1,
  //   innerRadius: 0.6,
  //   tooltip: {
  //     customContent: (value, items) => {
  //       const pieData = items.map((item) => ({
  //         type: item.data.type,
  //         value: Number(item.data.value),
  //         value1: Number(item.data.value1)
  //       }));
  //       return `<div>${pieData.length > 0 ? pieData[0].type : [] }</div>
  //               <div>${pieData.length > 0 ? pieData[0].value : [] }</div>
  //               <div>${pieData.length > 0 ? pieData[0].value1 : [] }</div>`
  //     }
  //   },
  //   label: {
  //     type: 'inner',
  //     offset: '-50%',
  //     content: '{value}',
  //     style: {
  //       textAlign: 'center',
  //       fontSize: 14,
  //     },
  //   },
  //   interactions: [],
  //   statistic: {
  //     title: false,
  //     content: {
  //       style: {
  //         whiteSpace: 'pre-wrap',
  //         overflow: 'hidden',
  //         textOverflow: 'ellipsis',
  //       },
  //       content: title.value,
  //     },
  //   },
  // });
  // piePlot.value.render();
  // piePlot.value.on('element:click', (args) => {
  //   const {type} = args.data.data
  //   if (type === '分类一') {
  //     data.value[0] = {type: 'hello', value: 100, value1: 123}
  //     title.value = '变电所'
  //     piePlot.value.changeData(data.value)
  //     piePlot.value.update({statistic: {content: {content: title.value}}})
  //   }
  // });
  const {data: [data]} = await getProportion()
  console.log(data)
  treemapPlot.value = new Treemap(chartRef.value, {
    data: data,
    colorField: 'name',
    legend: {
      position: 'top-left',
    },
    tooltip: {
          customContent: (value, items) => {
            const pieData = items.map((item) => ({
              name: item.name,
              value: item.value,
              finish: item.data.finish,
              color: item.color
            }));
            return `
                  <div class="px-8px py-5px">
                    <div class="py-5px flex items-center">
                        ${pieData.length > 0 ? pieData[0].name : []}
                    </div>
                    <div class="py-5px flex items-center"><div class="h-8px w-8px rd-5px mr-8px" style="background-color: ${pieData.length > 0 ? pieData[0].color : 'red'}">
                        </div><div>总产值：${pieData.length > 0 ? pieData[0].value.toFixed(2) : []}</div></div>
                    <div class="py-5px flex items-center"><div class="h-8px w-8px rd-5px mr-8px" style="background-color: ${pieData.length > 0 ? pieData[0].color : 'red'}">
                        </div><div>完成产值：${pieData.length > 0 ? pieData[0].finish : []}</div></div>
                    <div class="py-5px flex items-center"><div class="h-8px w-8px rd-5px mr-8px" style="background-color: ${pieData.length > 0 ? pieData[0].color : 'red'}">
                        </div><div>完成率：${pieData.length > 0 ? ((pieData[0].finish /  pieData[0].value) * 100).toFixed(2): []}%</div></div>
                  </div>`
          }
    },
    // use `drilldown: { enabled: true }` to
    // replace `interactions: [{ type: 'treemap-drill-down' }]`
    interactions: [{type: 'treemap-drill-down'}],
    // 开启动画
    animation: {},
  });
  treemapPlot.value.render();
})
onBeforeUnmount(() => {
  treemapPlot.value?.destroy()
  treemapPlot.value = undefined
})
</script>
<template>
  <a-card :bordered="false"
          title="分部分项完成占比"
          :style="{height: '100%',}">
    <div ref="chartRef"></div>
  </a-card>
</template>
<style scoped>

</style>