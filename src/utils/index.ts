
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
      extractPathList(node.children, node[id]);
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