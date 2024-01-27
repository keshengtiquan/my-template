import {
  endOfMonth,
  endOfQuarter, endOfWeek,
  endOfYear,
  format,
  getMonth,
  getQuarter, getWeek,
  startOfMonth,
  startOfQuarter, startOfWeek,
  startOfYear
} from "date-fns";

let modules = import.meta.glob('../pages/**/*')

export const isUrl = (inputStr: string) => {
  const urlPattern = /^(?:http|https):\/\/\S+/;
  // 使用正则表达式测试输入字符串
  return urlPattern.test(inputStr);
}
/**
 * 转换菜单
 * @param data
 */
export const generateRoutes = (data: any[]) => {
  // console.log(modules)
  return data.map(item => {
    const obj: any = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      meta: {
        title: item.title,
        icon: item.icon,
        hideInMenu: item.hideInMenu,
        isIframe: item.isIframe,
        url: item.url,
        affix: item.affix,
        hideInBreadcrumb: item.hideInBreadcrumb,
        hideChildrenInMenu: item.hideChildrenInMenu,
        keepAlive: item.keepAlive,
        target: item.target,
        menuSort: item.menuSort,
        permission: item.permission,
        status: item.status,
        activeMenu: item.activeMenu
      }
    }
    if(item.children && item.children.length > 0){
      obj.children = generateRoutes(item.children)
    }else if(item.isIframe){
      obj.component = modules['../pages/common/iframe.vue']
    }else if(item.component){
      obj.component = modules[`../pages${item.component}.vue`]
    }
    return obj
  })
}

/**
 * @description 提取菜单树中的每一项uniqueId
 * @param tree 树
 * @param uniqueId 每一项的uniqueId的字段名称，如果是id可省略
 * @returns 每一项uniqueId组成的数组
 */
export const extractPathList = (tree: any[], uniqueId?: string): any => {
  if (!Array.isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  const id = uniqueId ? uniqueId : 'id'
  const expandedPaths: Array<number | string> = [];
  for (const node of tree) {
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      extractPathList(node.children, id);
    }
    expandedPaths.push(node[id]);
  }
  return expandedPaths;
};

/**
 * 获取树形结构的所有叶子节点ID
 * @param tree
 */
export const extractChildrenIdList = (tree: any[]) => {
  if (!Array.isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  const idList: Array<string> = []
  const dfs = (nodes: any[]) => {
    for (const node of nodes) {
      const hasChildren = node.children && node.children.length > 0;
      if (hasChildren) {
        dfs(node.children);
      } else {
        idList.push(node["id"]);
      }
    }
  };

  dfs(tree);
  return idList
}

/**
 * 字节转换方法
 * @param bytes 字节大小
 */
export const formatByte = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


/**
 *  节流函数
 * @param fn 节流方法
 * @param wait 间隔时间
 */
export const throttle = (fn: Function, wait: number) => {
  let timer: any = null
  return () => {
    if(timer) return
    timer = setTimeout(()=> {
      fn()
      timer = null
    },wait)
  }
}

/**
 * 文件下载方法  blob
 * @param data
 * @param fileName
 */
// export const getExcelFile = (data: any,fileName?: string) => {
//   let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//   const a = document.createElement('a');
//   a.href = URL.createObjectURL(blob);
//   a.download = fileName + '.xlsx';
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   window.URL.revokeObjectURL(a.href);
// }

export const getNameFromDateAndType = (date: Date, type: string) => {
  if (type === 'year') {
    const yearName = format(date, 'yyyy年计划')
    const log = format(date, 'yyyy')
    const yearStartDate = format(startOfYear(new Date(parseInt(log), 0)), 'yyyy-MM-dd')
    const yearEndOfYear = format(endOfYear(new Date(parseInt(log), 0)), 'yyyy-MM-dd')
    return { name: yearName, type: 'year', year: Number(log), startDate: yearStartDate, endDate: yearEndOfYear }
  } else if (type === 'quarter') {
    const quarter = getQuarter(date)
    const quarterName = `第${quarter}季度`
    const quarterStartDate = format(startOfQuarter(date), 'yyyy-MM-dd')
    const quarterEndDate = format(endOfQuarter(date), 'yyyy-MM-dd')
    const year = Number(format(date, 'yyyy'))
    return {
      name: `${format(date, 'yyyy年')}${quarterName}计划`,
      type: 'quarter',
      year: year,
      quarter: quarter,
      startDate: quarterStartDate,
      endDate: quarterEndDate,
    }
  } else if (type === 'month') {
    const year = Number(format(date, 'yyyy'))
    const quarter = getQuarter(date)
    const month = getMonth(date)
    const monthName = `${month + 1}月`
    const monthStartDate = format(startOfMonth(date), 'yyyy-MM-dd')
    const monthEndDate = format(endOfMonth(date), 'yyyy-MM-dd')
    return {
      name: `${format(date, 'yyyy年')}${monthName}计划`,
      year,
      quarter,
      month: month + 1,
      type: 'month',
      startDate: monthStartDate,
      endDate: monthEndDate,
    }
  } else if (type === 'week') {
    const year = Number(format(date, 'yyyy'))
    const quarter = getQuarter(date)
    const month = getMonth(date)
    const week = getWeek(date)
    const weekStartDate = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const weekEndDate = format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    return {
      name: `${format(date, 'yyyy年')}第${week}周计划`,
      year,
      quarter,
      month,
      week: week,
      type: 'week',
      startDate: weekStartDate,
      endDate: weekEndDate,
    }
  }
}


export const getStartDateAndEndDate = (date: Date) => {
  const log = format(date, 'yyyy')
  const yearStartDate = format(startOfYear(new Date(parseInt(log), 0)), 'yyyy-MM-dd')
  const yearEndDate = format(endOfYear(new Date(parseInt(log), 0)), 'yyyy-MM-dd')
  const monthStartDate = format(startOfMonth(date), 'yyyy-MM-dd')
  const monthEndDate = format(endOfMonth(date), 'yyyy-MM-dd')
  const weekStartDate = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const weekEndDate = format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  return {
    yearStartDate,
    yearEndDate,
    monthStartDate,
    monthEndDate,
    weekStartDate,
    weekEndDate,
  }
}