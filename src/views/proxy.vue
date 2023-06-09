<template>
  <pro-crud
      v-model="form"
      v-model:search="serachForm"
      :columns="columns"
      :menu="menu"
      :data="proxy"
      :detail="detail"
      :before-open="beforeOpen"
      label-width="100px"
      @search="search"
      @submit="submit"
      @delete="deleteRow"
  >
    <template #menu-right="{ size }">
      <el-button
          v-if="running.id !== -1"
          :size="size"
          type="success"
          @click="onStop"
      >
        ID: {{ running.id }} 名称: {{ running.name }} 运行中
      </el-button>
    </template>
    <template #menu="{row ,size }">
      <el-button
          :size="size"
          type="success"
          link
          @click="onConnect(row)"
      >
        连接
      </el-button>
      <el-button
          :size="size"
          type="Warning"
          link
          @click="onClipboard(row)"
      >
        分享
      </el-button>
      <el-popconfirm title="你确定要删除这个吗?" @confirm="deleteRow(row)">
        <template #reference>
          <el-button
              :size="size"
              type="danger"
              link
          >
            删除
          </el-button>
        </template>
      </el-popconfirm>
    </template>
  </pro-crud>
</template>

<script lang="ts" setup>
import {useProcessesStore, useProxyStore} from "@/store";
import type {Proxy} from "@/typed";
import {ipcRenderer} from "electron";
import {ref} from "vue";
import {
  defineCrudBeforeOpen,
  defineCrudColumns,
  defineCrudMenuColumns,
  defineCrudSearch,
  defineCrudSubmit
} from "element-pro-components";

const {proxy, gostPath, writeSetting, readSetting} = useProxyStore()!
const {runCommand, cmdID, kill, running} = useProcessesStore()!

const onConnect = (row: Proxy) => {
  running.value = proxy.value.find(item => item.id === row.id) as Proxy
  if(running.value.id && running.value.cmd){
    runCommand(running.value.id, gostPath.value, running.value.cmd)
  }
}
const onStop = () => {
  kill()
}
const onClipboard = (row: Proxy) => {
  const value = JSON.stringify(proxy.value.find(item => item.id === row.id) as Proxy)
  ipcRenderer.send('on-clipboard', value)

}

const form = ref<Proxy>({})
const serachForm = ref({})
const detail = ref({})
const menu = defineCrudMenuColumns({
  label: '操作',
  addText: '创建',
  detailText: '查看',
  editText: '编辑',
  delText: '删除',
  submitText: '确定',
  resetText: '重设',
  searchReset: false,
  del: false,
})
const columns = defineCrudColumns([
  {
    label: 'ID',
    prop: 'id',
    component: 'el-input',
    add: false,
    edit: false,
    search: false,
    detail: false,
  },
  {
    label: '名称',
    prop: 'name',
    component: 'el-input',
    add: true,
    search: false,
    edit: true,
    detail: true,
    props:{
      placeholder:"我的US服务器"
    }
  },
  {
    label: '命令',
    prop: 'cmd',
    component: 'el-input',
    add: true,
    edit: true,
    search: false,
    detail: true,
    hide: true,
    props:{
      placeholder:"-L=:7890 -F=http2://:443"
    }
  },
])

const createServer = () => {
  readSetting()
  proxy.value.push(form.value)
  writeSetting()
  setTimeout( () => {
    readSetting()
  }, 500)
};

const editServer = () => {
  proxy.value = proxy.value.map(item => {
    if (item.id === form.value.id) {
      return {...form.value};
    }
    return item;
  });
  writeSetting()
  setTimeout( () => {
    readSetting()
  }, 500)
};

const beforeOpen = defineCrudBeforeOpen((done, type, row) => {
  if (type === 'edit') {
    form.value = row || {}
  } else if (type === 'detail') {
    detail.value = row || {}
  }
  done()
})

const search = defineCrudSearch((done, isValid, invalidFields) => {

  console.log('search', serachForm.value, isValid, invalidFields)
  setTimeout(() => {
    done()
  }, 1000)
})

const submit = defineCrudSubmit((close, done, type, isValid, invalidFields) => {
  if (type === 'add') {
    createServer()
    close()
    done()
  } else if (type === 'edit') {
    editServer()
    close()
    done()
  }


})

const deleteRow = (row: Proxy) => {
  if (row.id != null) {
    proxy.value.splice(row.id -1, 1)
    writeSetting()
    readSetting()
    if (cmdID.value === row.id) {
      kill()
    }
  }

}
</script>
