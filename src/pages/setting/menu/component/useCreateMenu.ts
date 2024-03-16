import {createMenuApi} from "@/api/setting/menu";

export const useCreateMenu = () => {
  
  const createMenu = async (data: object) => {
    return await createMenuApi(data)
  }
  
  return  {
    createMenu
  }
}