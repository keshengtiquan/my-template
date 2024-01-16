import {gantt} from "dhtmlx-gantt";
export const zoomLevels = [
  {
    name: "day",
    label: "日",
    scale_height: 50,
    min_column_width: 30,
    scales: [
      { unit: "month", format: "%Y年 %F" },
      // { unit: "day", step: 1, format: "%j %D" },
      {
        unit: "day",
        step: 1,
        format: (date: any) => {
          const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
          const day = new Date(date).getDate();
          const weekDay = new Date(date).getDay();
          return `<div class='scale-formate-date'>
          <span class='formate-date'>${day}</span>
<!--          <span class='formate-weekDay'>${weekDays[weekDay]}</span>-->
          </div>`;
        }
      }
    ]
  },
  {
    name: "week",
    label: "周",
    scale_height: 50,
    min_column_width: 50,
    scales: [
      { unit: "month", format: "%Y年 %F" },
      { unit: "week", step: 1, date: "%W周" }
    ]
  },
  {
    name: "month",
    label: "月",
    scale_height: 50,
    min_column_width: 50,
    scales: [
      {
        unit: "quarter",
        step: 1,
        format: (date: any) => {
          const year = new Date(date).getFullYear();
          const month = new Date(date).getMonth();
          const quarter = Math.floor(month / 3 + 1);
          return `${year}年-Q${quarter}`;
        }
      },
      { unit: "month", step: 1, format: "%F" }
    ]
  },
  {
    name: "quarter",
    label: "季",
    scale_height: 50,
    min_column_width: 50,
    scales: [
      { unit: "year", step: 1, format: "%Y年" },
      {
        unit: "quarter",
        step: 1,
        format: (date: any) => {
          const month = new Date(date).getMonth();
          const quarter = Math.floor(month / 3 + 1);
          return `Q${quarter}`;
        }
      }
    ]
  },
  {
    name: "year",
    label: "年",
    scale_height: 50,
    min_column_width: 50,
    scales: [{ unit: "year", step: 1, format: "%Y年" }]
  }
];

export const originColumns = [
  {
    type: "code",
    name: "showCode",
    label: "序号",
    template: gantt.getWBSCode,
    tree: false,
    width: 80,
    min_width: 80,
  },
  {
    type: "input",
    name: "text",
    originField: "text",
    label: "任务名称",
    tree: true,
    width: "*",
    min_width: 160
  },
  {
    type: "select",
    name: "parent",
    originField: "parent",
    hide: true,
    label: "父任务"
  },
  {
    type: "select",
    name: "pre_task",
    originField: "pre_task",
    hide: true,
    label: "前置任务"
  },
  {
    type: "date",
    name: "start_date",
    originField: "start_date",
    label: "开始日期",
    align: "center",
    width: 80,
    min_width: 80
  },
  {
    type: "number",
    name: "duration",
    originField: "duration",
    label: "持续时间",
    align: "center",
    min: 1,
    formatType: "date"
  },
  {
    type: "date",
    name: "end_date",
    originField: "end_date",
    label: "结束时间",
    align: "center",
    disabled: true,
    width: 80,
    min_width: 80
  },
  {
    type: "slider",
    name: "progress",
    originField: "progress",
    label: "进度",
    width: 80,
    align: "center",
    template: (item: any) => {
      if (item.progress >= 1) return "Complete";
      if (item.progress === 0) return "Not started";
      const num = `${Math.round(item.progress * 100)}%`;
      return num;
    }
  },
];