<script setup lang="ts">
import {gantt} from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css";
import {onMounted, ref} from "vue";
import {zoomLevels, originColumns} from './config.ts'
import * as dayjs from "dayjs";
import {getGanttListApi} from "@/api/gantt";

const ganttContainer = ref()
const curZoom = ref('day')

const initGantt = () => {
  setGanttConfig()
  getGanttData()
  gantt.init(ganttContainer.value)

  gantt.ext.tooltips.tooltipFor({
    selector: '.gantt_grid [' + gantt.config.task_attribute + ']',
    html: (event) => {
      if (gantt.config.touch && !gantt.config.touch_tooltip) {
        return
      }
      const targetTaskId = gantt.locate(event)
      if (gantt.isTaskExists(targetTaskId)) {
        const task = gantt.getTask(targetTaskId)
        return gantt.templates.tooltip_text(<Date>task.start_date, <Date>task.end_date, task)
      }
      return null
    },
    global: true
  })
}
const getGanttData = async () => {
  const {data} = await getGanttListApi()
  const tasks = {data};
  gantt.parse(tasks);
  gantt.eachTask(function(task){
    gantt.open(task.id);
  });
}
// 设置甘特图的 基础配置
const setGanttConfig = () => {
  gantt.config.row_height = 25;                 // 行高
  gantt.config.date_format = "%Y-%m-%d %H:%i";  // 日期转换格式
  gantt.i18n.setLocale("cn");                   // 语言
  gantt.config.autosize = "y";                  // 甘特图是否自适应
  gantt.locale.labels.new_task = "新任务";       // 新建任务时的默认label（不过如果是自定义的新增模态框的话，就用不到这个）
  gantt.config.layout = {
    css: "gantt_container",
    cols: [
      {
        width: 500,
        min_width: 300,
        rows: [
          {
            view: "grid",
            scrollX: "gridScroll",
            scrollable: true,
            scrollY: "scrollVer"
          },
          {view: "scrollbar", id: "gridScroll", group: "horizontal"}
        ]
      },
      {resizer: true, width: 1},
      {
        rows: [
          {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
          {view: "scrollbar", id: "scrollHor", group: "horizontal"}
        ]
      },
      {view: "scrollbar", id: "scrollVer"}
    ]
  };

 // gantt.config.order_branch = "marker";         // 允许在同一级别内重排任务，只要是需要重排，order_branch 一定得给 true 或 ‘marker’
  gantt.config.order_branch_free = false;        // 允许在甘特图全部范围内重排任务，如果只给 order_branch_free，而不给 order_branch，排序也是不会生效的。
  gantt.config.lightbox = false;                // 取消灯箱
  gantt.config.fit_tasks = true;                // 自动调整甘特图的大小，以适应所有的任务
  gantt.config.drag_move = false
  gantt.config.drag_resize = false;
  gantt.config.drag_progress = false;//进度条
  gantt.config.drag_links = false;//连线
  gantt.plugins({                           // 导入插件
    marker: true,                                // 日期标识插件，如果不装，之后在配置日期标识线会报错
    tooltip: true,// 鼠标经过时信息
  });
  gantt.templates.task_text = function(start: Date, end: Date, task: any) {
    return `<span style='color: #fff; font-size: 12px'>【${task.text}】${dayjs(start).format('YYYY-MM-DD')}至${dayjs(end).format('YYYY-MM-DD')}完成${task.progress! * 100  }% </span>`;
  };
  // 设置 任务的 class 类名，用于配置 任务完成时的 样式
  gantt.templates.task_class = (_start, _end, task) => {
    if (task.progress === 1)
      return "completed_task";
    return "";
  };
  gantt.templates.tooltip_text = (_start:any, _end:any, task) => {
    let taskDetails =
      `<div><b>任务名称:</b> ${task.text}</div>` +
      `<div><b>开始时间:</b> ${dayjs(task.start_date).format(
        "YYYY-MM-DD"
      )}</div>` +
      `<div><b>结束时间:</b> ${dayjs(task.end_date).format(
        "YYYY-MM-DD"
      )}</div>` +
      `<div><b>当前完成:</b> ${task.progress ? task.progress * 100 : 0}%</div>`;
    return taskDetails ;
  };
}

// 设置Zoom
const setZooms = () => {
  const zoomConfig = {
    levels: zoomLevels,
    // useKey: "ctrlKey",
    // trigger: "wheel",
    element: () => {
      return gantt.$root.querySelector(".gantt_task");
    }
  };
  gantt.ext.zoom.init(zoomConfig);
  gantt.ext.zoom.setLevel("day");
}
// 设置今日时间线
const setDateMarker = () => {
  const dateToStr = gantt.date.date_to_str(gantt.config.task_date);
  const today = new Date(new Date().setHours(0, 0, 0, 0)); // 获取当天零点的时间
  gantt.addMarker({
    start_date: today,
    css: "today",
    text: "今日",
    title: `Today: ${dateToStr(today)}`,
  });
}
// 设置表格列
const setColumns = () => {
  const tempColumns = originColumns.map((item) => {
    const {name, originField, type: colType} = item;
    const temp: any = {...item};

    if (colType === "slider") {
      temp.onrender = (task: any, node: any) => {
        node.innerText = `${Math.round(task[name] * 100)}%`;
      };
    } else if (colType === "number" && originField === "duration") {
      temp.onrender = (task: any, node: any) => {
        node.innerText = `${task.duration}天`;
      }
    }else if (colType === "date" && originField === "end_date") {
      // 如果是 结束日期，显示需要减一天
      temp.onrender = (task: any, node: any) => {
        if (task[name]) {
          const date = dayjs(task[name]).subtract(1, "days");
          node.innerText = date.format("YYYY-MM-DD");
        }
      };
    }
    return temp;
  });
  gantt.config.columns = tempColumns;
}

// 年月日切换方法
const handleChangeZoom = (zoom: string) => {
  curZoom.value = zoom
  gantt.ext.zoom.setLevel(zoom);
}

onMounted(() => {
  initGantt()
  setZooms()
  setDateMarker()
  setColumns()
})
</script>
<template>
  <a-card>
    <a-space class="mb-20px">
      <a-button type="primary" @click="handleChangeZoom(item.name)" :disabled="item.name === curZoom"
                v-for="item in zoomLevels">{{ item.label }}
      </a-button>
    </a-space>
    <div style="width: 100%; height: 100%;font-family: sans-serif;" ref="ganttContainer"></div>
  </a-card>

</template>
<style lang="scss">
.gantt_grid {
  .gantt_grid_scale {
    .gantt_grid_head_cell {
      border-right: 1px solid #d7d7d7;
    }
    .align-right-head {
      text-align: right;
    }
  }

  .gantt_grid_data {
    .gantt_cell {
      border-right: 1px solid #d7d7d7;

      .add-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #70d0c2;
        cursor: pointer;

        &:hover {
          color: #11b09a;
        }
      }
    }
  }
}

// 甘特图 图表区-行头
.gantt_task_scale {
  .gantt_scale_cell {
    .scale-formate-date {
      display: flex;
      flex-direction: column;
      line-height: 18px;
    }
  }
}

// 甘特图 图表区-数据
.gantt_data_area {
  .gantt_task_cell.week_end {
    background-color: #dcdcdc;
  }

  .gantt_task_row.gantt_selected .gantt_task_cell.week_end {
    background-color: #d3d3d3;
  }

  .completed_task {
    border: 1px solid #94ad94;

    .gantt_task_progress {
      background: #accaac;
    }
  }
}
</style>