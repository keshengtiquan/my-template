export interface Role {
  id: number
  tenantId: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope: string
  status: string
  remark: string
  createDept: any
  createBy: string
  updateBy: string
  createTime: string
  updateTime: string
  menus: Menu[]
  permissions: permission[]
}

export interface Menu {
  menuId: number
}

export interface permission {
  id: string
  name: string
  key: string
  desc: string
  sort: number
}