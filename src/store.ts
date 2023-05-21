import { createInjectionState } from '@vueuse/core'
import {ProxyInterface} from "./typed";
import {ref} from "vue";
import {PROXY_FILE_NAME, PROXY_FILE_TEXT} from "./global";

export const [provideProxyStore, useProxyStore] = createInjectionState( (initialValue: ProxyInterface[]) => {
    const proxy = ref(initialValue)

    return { proxy}
})