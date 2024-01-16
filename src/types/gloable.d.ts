import {TooltipProps} from "ant-design-vue/es/tooltip";
import {VueNode} from "ant-design-vue/es/_util/type";
import {Breakpoint} from "ant-design-vue/es/_util/responsiveObserve";
import {
  ColumnFilterItem,
  ColumnTitle,
  CompareFn,
  FilterDropdownProps, FilterSearchType, FilterValue,
  SortOrder
} from "ant-design-vue/es/table/interface";

export interface MenuDataItem {
  // 标题
  title: string | (() => VNodeChild)
  // 图标
  icon?: string | (() => VNodeChild)
  // 地址
  path: string
  // 子集菜单
  children?: MenuDataItem[]
  // 同路由中的name，主要是用于保活的左右
  name?: string
  // 是否隐藏当前菜单
  hideInMenu?: boolean
  // 如果使用了隐藏，那么点击当前菜单的时候，可以使用父级的key
  parentKeys?: string[]
  // 是否套用iframe
  isIframe?: boolean
  // 如果当前是iframe的模式，需要有一个跳转的url支撑，其不能和path重复，path还是为路由
  url?: string
  // 是否存在面包屑
  hideInBreadcrumb?: boolean
  // 是否需要显示所有的子菜单
  hideChildrenInMenu?: boolean
  // 是否保活
  keepAlive?: boolean
  // 全连接跳转模式
  target?: '_blank' | '_self' | '_parent'
  activeMenu: string
}

export interface Column {
  title?: ColumnTitle<RecordType>;
  sorter?: boolean | CompareFn<RecordType> | {
    compare?: CompareFn<RecordType>;
    /** Config multiple sorter order priority */
    multiple?: number;
  };
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | TooltipProps;
  filtered?: boolean;
  filters?: ColumnFilterItem[];
  filterDropdown?: VueNode | ((props: FilterDropdownProps<RecordType>) => VueNode);
  filterMultiple?: boolean;
  filteredValue?: FilterValue | null;
  defaultFilteredValue?: FilterValue | null;
  filterIcon?: VueNode | ((opt: {
    filtered: boolean;
    column: ColumnType;
  }) => VueNode);
  filterMode?: 'menu' | 'tree';
  filterSearch?: FilterSearchType<ColumnFilterItem>;
  onFilter?: (value: string | number | boolean, record: RecordType) => boolean;
  filterDropdownOpen?: boolean;
  onFilterDropdownOpenChange?: (visible: boolean) => void;
  filterResetToDefaultFilteredValue?: boolean;
  responsive?: Breakpoint[];
  /** @deprecated Please use `filterDropdownOpen` instead */
  filterDropdownVisible?: boolean;
  /** @deprecated Please use `onFilterDropdownOpenChange` instead */
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  children: Column[]
}