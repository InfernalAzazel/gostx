<template>
  <div class="h-[70vh] overflow-hidden">
    <div ref="innerRef" class="overflow-auto h-[100%]">
      <div v-if="outputs.length !== 0">
        <p v-for="item in outputs" :key="item"
           class="scrollbar-demo-item">{{ item }}
        </p>
      </div>
      <el-empty v-else description="没有数据" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {useProcessesStore} from "@/store";

const {outputs} = useProcessesStore()!
const innerRef = ref<HTMLDivElement>();

const nextTick = () => {
  innerRef.value!.scrollTop = innerRef.value!.scrollHeight;
};

onMounted(async () => {
  nextTick();

});
</script>
<style>

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>