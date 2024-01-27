import * as Exceljs from 'exceljs'
export interface ExportExcelParamsType {
  style: Record<string, any> //excel表的样式配置
  tableData: any[] //表的数据内容
  headerColumns: { col?: string,width: number;remarks?: string, excelFiled: string; filed: string }[] //表头配置
  sheetName: string //工作表名
}
export const  exportExcel = async (options: ExportExcelParamsType) => {
  const { sheetName, style, headerColumns, tableData } = options
  // 创建工作簿
  const workbook = new Exceljs.Workbook()
  workbook.creator = 'admin'
  workbook.created = new Date()
  // 添加工作表
  const worksheet = workbook.addWorksheet(sheetName)
  if (headerColumns.length > 0) {
    // 设置列头
    const columnsData = headerColumns.map((column) => {
      const width = column.width
      if(column.remarks){
        worksheet.getCell(`${column.col}1`).note = column.remarks
      }
      return {
        header: column.excelFiled,
        key: column.filed,
        width: isNaN(width) ? 20 : width,
      }
    })
    worksheet.columns = columnsData
    // 设置表头样式
    const headerRow = worksheet.getRow(1)
    headerRow.eachCell((cell) => {
      cell.style = style as Partial<Exceljs.Style>
    })
  }
  //设置行数据
  if (tableData.length > 0) {
    // 将传入的数据格式化为exceljs可使用的数据格式
    const data:any[] = []
    tableData.forEach((table) => {
      const obj: Record<any, any> = {}
      headerColumns.forEach((header) => {
        obj[header.filed] = table[header.filed]
      })
      data.push(obj)
    })
    // 添加行
    if (data) worksheet.addRows(data)
    
    // 获取每列数据，依次对齐
    worksheet.columns.forEach((column) => {
      column.alignment = style.alignment as Partial<Exceljs.Alignment>
    })
    // 设置每行的边框
    const dataLength = data.length as number
    const tabeRows = worksheet.getRows(2, dataLength + 1)
    tabeRows!.forEach((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = style.border as Partial<Exceljs.Borders>
      })
    })
  }
  const buffer =  await workbook.xlsx.writeBuffer()
  console.log(buffer)
  return buffer
  
}

export const downloadExcel = (buffer: any, fileName: string) => {
  let blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName + '.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(a.href);
}