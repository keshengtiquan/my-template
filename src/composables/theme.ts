import { useDark, useToggle } from '@vueuse/core'
import { theme } from 'ant-design-vue'

export const isDark = useDark()
export const toggleDark = useToggle(isDark)

export const useTheme = () => {
  const { useToken } = theme
  const { token } = useToken()

  return {
    token,
  }
}
