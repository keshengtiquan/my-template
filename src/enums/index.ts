/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export enum ModalType {
  ADD = 'add',
  Edit = 'edit',
}

export enum FileType {
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export enum WorkPlaceTypeEnum {
  STATION = 'station',
  SECTION = 'section',
}
