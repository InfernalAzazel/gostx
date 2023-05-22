<template>
    <el-button v-if=" running.id !== -1" type="success" size="small" @click="onStop" plain>ID: {{ running.name }} 名称: {{ running.name }} 运行中</el-button>
    <el-table :data="proxy" style="width: 100%">
        <el-table-column prop="id" label="ID"/>
        <el-table-column prop="name" label="Name"/>
        <el-table-column fixed="right" label="Operations">
            <template #default="scope">
                <el-button type="warning" size="small" plain @click="onConnect(scope.$index)">连接</el-button>
                <el-button type="primary" size="small" plain>编辑</el-button>
                <el-button type="info" size="small" plain>分享</el-button>
                <el-popconfirm title="你确定要删除这个吗?" @confirm="onDeleteRow(scope.$index)">
                    <template #reference>
                        <el-button type="danger" size="small" plain>删除</el-button>
                    </template>
                </el-popconfirm>

            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import {useProcessesStore, useProxyStore} from "@/store";
import type {Proxy} from "@/typed";

const {proxy, writeProxy, readProxy} = useProxyStore()!
const {runCommand, cmdID, kill, running} = useProcessesStore()!
const onDeleteRow = (index: number) => {
    proxy.value.splice(index, 1)
    writeProxy(proxy.value)
    readProxy()
    if(cmdID.value === index){
      kill()
    }
}

const onConnect = (index: number) => {
    running.value = proxy.value.find(item => item.id === index + 1) as Proxy
    runCommand(index, running.value.cmd || '')
}
const onStop  = () => {
  kill()
}

</script>
