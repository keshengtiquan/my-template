
let modules = import.meta.glob('../pages/**/*')

export const isUrl = (inputStr: string) => {
  const urlPattern = /^(?:http|https):\/\/\S+/;
  // 使用正则表达式测试输入字符串
  return urlPattern.test(inputStr);
}


export const generateRoutes = (data: any[]) => {
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
        status: item.status
      }
    }
    if(item.isIframe){
      obj.component = modules['../pages/common/iframe.vue']
    }else if(item.component){
      obj.component = modules[`../pages${item.component}.vue`]
    }
    if(item.children && item.children.length > 0){
      obj.children = generateRoutes(item.children)
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