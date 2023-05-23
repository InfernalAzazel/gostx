<template>
  <el-container class="h-screen">
    <el-header class="flex items-center bg-slate-50">
      <p class="italic text-clip text-3xl text-blue-400">Gost</p>
      <div class="flex flex-row-reverse w-full">
        <div class="flex items-center">
          <el-button type="info" icon="Star" @click="openLink" link>关于</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="flex flex-row-reverse">
        <el-button type="primary" @click="onClearLog">清空日志</el-button>
        <div class="w-2"></div>
        <el-button type="primary" @click="onSelectFile">设置 Gost</el-button>
      </div>
      <div class=" flex justify-center">
        <el-radio-group v-model="radio">
          <el-radio-button v-for="item in children" :label="item.path" @click="onSelect(item.path)">
            {{ item.meta.title }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {useProcessesStore, useProxyStore} from "@/store";
import {ipcRenderer, shell} from 'electron'

const {proxy, readProxy, writeProxy } = useProxyStore()!
const {outputs} = useProcessesStore()!
const router = useRouter();
const currentRoute = router.options.routes[0].redirect;
const children = router.options.routes[0].children;
const radio = ref(currentRoute?.toString() || "");

const onSelect = (value: string) => {
  router.push(value);
};

const onClearLog = () => {
  outputs.value = []
};
const openLink = () => {
  shell.openExternal('https://github.com/InfernalAzazel/gostx')
};

const onSelectFile = () => {
  ipcRenderer.send('open-file-dialog');
}

onMounted( () => {
  readProxy()
});
</script>
<style scoped></style>