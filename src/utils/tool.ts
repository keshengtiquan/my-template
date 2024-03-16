const tool: {
  localStorage: {
    set: Function
    get: Function
    remove: Function
    clear: Function
  }
} = {
  localStorage: {
    set(key: string, value: any) {
      const _set = JSON.stringify(value)
      return localStorage.setItem(key, _set)
    },
    get(key: string) {
      let data = localStorage.getItem(key)
      if (data) {
        data = JSON.parse(data)
      }
      return data
    },
    remove(key: string) {
      return localStorage.removeItem(key)
    },

    clear() {
      return localStorage.clear()
    },
  },
}
export default tool
