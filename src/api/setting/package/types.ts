
export type createOptions = {
  packageName: string,
  remark: string,
  menuIds: string
}

export type getList = {
  current: number,
  pageSize: number,
}

export type updatePackage = {
  packageName: string,
  menuIds: string,
  remark: string,
}