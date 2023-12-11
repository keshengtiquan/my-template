

export default <T>(dataSource: Array<T>) => {
  let dragItem: T
  let targItem: T
  const customRow = (record: T) => {
    return {
      draggable: true,
      ondrag(e: DragEvent) {
        e.stopPropagation();
        dragItem = record
      },
      ondrop(e: DragEvent) {
        e.stopPropagation();
        targItem = record
      },
      ondragend(e: DragEvent) {
        e.stopPropagation();
        if (dragItem !== targItem) {
          const dragItemIndex = dataSource.indexOf(dragItem);
          const targItemIndex = dataSource.indexOf(targItem);
          dataSource.splice(targItemIndex, 0, dataSource.splice(dragItemIndex, 1)[0])
          // 解构交换
          // [dataSource[dragItemIndex], dataSource[targItemIndex]] = [dataSource[targItemIndex], dataSource[dragItemIndex]]
        }
      },
      ondragover(e: DragEvent) {
        e.stopPropagation();
        return false
      }
    }
  }
  
  return {
    customRow
  }
}
