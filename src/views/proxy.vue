<template>
    <el-button v-if=" 0 !== -1" type="success" size="small" @click="onStop" plain>ID:  名称:  运行中</el-button>
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
import {onMounted, ref} from "vue";
import { ipcRenderer } from 'electron'

const proxy = ref([])
const onDeleteRow = async (index: number) => {
    // proxy.value.splice(index, 1)
}

const onConnect = async (index: number) => {
    console.log(index)
}
const onStop  = async () => {

}

// 监听命令的输出
ipcRenderer.on('command-output', (event, data) => {
  console.log('Output:', data)
})

// 监听命令的错误输出
ipcRenderer.on('command-error', (event, data) => {
  console.error('Error:', data)
})

// 监听命令结束
ipcRenderer.on('command-close', (event, code) => {
  console.log('Command finished with code', code)
})

onMounted(()=>{
  ipcRenderer.send('run-command', 'ls', ['-la'])
})

</script>
