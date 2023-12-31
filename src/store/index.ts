import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import useAppStore from './modules/app';
import {useUserStore} from "@/store/modules/user";
import {useMultiTab} from "@/store/modules/multi-tab";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

export default pinia;
export { useAppStore };
export { useUserStore };
export { useMultiTab };