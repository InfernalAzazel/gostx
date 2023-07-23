import {createInjectionState} from '@vueuse/core'
import type {Proxy, SettingYaml} from "./typed";
import {ref} from "vue";
import yaml from 'js-yaml';
import {ipcRenderer} from 'electron'

export const [provideProxyStore, useProxyStore] = createInjectionState((initialValue: Proxy[]) => {
    const proxy = ref(initialValue)
    const gostPath = ref<string | undefined>(undefined)
    const readSetting = () => {
        ipcRenderer.send('read-setting')
        ipcRenderer.on('read-setting', (event, data) => {
            yaml.loadAll(data, (doc: any) => {
                if (doc) {
                    const settingYamlDoc = doc as SettingYaml
                    gostPath.value = settingYamlDoc.path!
                    proxy.value = settingYamlDoc.proxy?.map((item, index) => {
                        return {id: index + 1, ...item}
                    }) || [];
                }
            });
        })

    }
    const writeSetting = () => {
        const result = proxy.value?.map(({id, ...rest}) => rest)
        const settingYaml: SettingYaml = {path: gostPath.value, proxy: result}
        const text = yaml.dump(settingYaml)
        ipcRenderer.send('write-setting', text)
    }
    return {proxy, gostPath, readSetting, writeSetting}
})

export const [provideProcessesStore, useProcessesStore] = createInjectionState((initialValue: boolean) => {
    // state
    const runState = ref<boolean>(initialValue)
    const cmdID = ref<number>(-1)
    const outputs = ref<string[]>([])

    const running = ref<Proxy>({id: -1, name: '', cmd: ''})
    const runCommand = (id: number, command: string | undefined, value: string) => {
        cmdID.value = id
        let args = value.split(" ");
        ipcRenderer.send('run-command',command, args)
        // 监听命令的输出
        ipcRenderer.on('command-output', (event, data) => {
            outputs.value.push(data)
        })
        ipcRenderer.send('get-command-state')
        ipcRenderer.on('get-command-state', (event, state) => {
            runState.value = state;
        })

    }
    const kill =  () => {
        if (cmdID.value !== -1) {
            cmdID.value = -1
            running.value = {id: -1, name: '', cmd: ''}
        }
        ipcRenderer.send('command-kill')
    }

    return {cmdID, running, outputs, runCommand, kill}
})