import {createInjectionState} from '@vueuse/core'
import type {Proxy, ProxyYaml} from "./typed";
import {ref} from "vue";
import yaml from 'js-yaml';
import {ipcRenderer} from 'electron'

export const [provideProxyStore, useProxyStore] = createInjectionState((initialValue: Proxy[]) => {
    const proxy = ref(initialValue)
    const readProxy = () => {
        let proxyYaml = ''
        ipcRenderer.send('read-proxy')
        ipcRenderer.on('read-proxy', (event, data) => {
            proxyYaml = data as string
            yaml.loadAll(proxyYaml, (doc: any) => {
                if (doc) {
                    const proxyYamlDoc = doc as ProxyYaml
                    proxy.value = proxyYamlDoc.proxy?.map((item, index) => {
                        return {id: index + 1, ...item}
                    }) || [];
                }
            });
        })

    }
    const writeProxy = (value: Proxy[]) => {
        const result = value.map(({id, ...rest}) => rest)
        const proxyYaml: ProxyYaml = {proxy: result}
        const text = yaml.dump(proxyYaml)
        ipcRenderer.send('write-proxy', text)
    }
    return {proxy, readProxy, writeProxy}
})

export const [provideProcessesStore, useProcessesStore] = createInjectionState((initialValue: number) => {
    // state
    const pid = ref(initialValue)
    const cmdID = ref(-1)
    const outputs = ref<string[]>([])
    const running = ref<Proxy>({id: -1, name: '', cmd: ''})
    const runCommand = (id: number | undefined, value: string) => {
        if (pid.value !== 0) {
            kill();
        }
        cmdID.value = id
        let args = value.split(" ");
        ipcRenderer.send('run-command', args)
        // 监听命令的输出
        ipcRenderer.on('command-output', (event, data) => {
            outputs.value.push(data)
        })

        // 监听命令的错误输出
        ipcRenderer.on('command-error', (event, data) => {
            outputs.value.push(data)
        })

        // 监听命令结束
        ipcRenderer.on('command-close', (event, code) => {
            console.log('Command finished with code', code)
        })
        ipcRenderer.send('get-command-pid')
        ipcRenderer.on('get-command-pid', (event, childPID) => {
            pid.value = childPID;
        })

    }
    const kill =  () => {
        if (cmdID.value !== -1) {
            cmdID.value = -1
            running.value = {id: -1, name: '', cmd: ''}
        }
        ipcRenderer.send('command-kill', pid.value)
    }
    return {pid, cmdID, running, outputs, runCommand, kill}
})