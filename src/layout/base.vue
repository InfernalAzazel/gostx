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
        <el-button type="primary">导入配置</el-button>
        <div class="w-2"></div>
        <el-button type="primary" @click="()=> visible = true">创建服务</el-button>
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
    <el-dialog v-model="visible" :show-close="false">
      <template #header="{close, titleId, titleClass }">
        <div>
          <h4 :id="titleId" :class="titleClass">创建</h4>
        </div>
      </template>
      <div class="w-full">
        <el-form class="w-full" ref="ruleFormRef" :model="formInline" :rules="rules" size="default">
          <el-form-item prop="name">
            <el-input v-model="formInline.name" placeholder="我的US服务器" />
          </el-form-item>
          <el-form-item prop="cmd">
            <el-input v-model="formInline.cmd" placeholder="-L=:7890 -F=http2://:443" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
              <span class="dialog-footer">
                  <el-button type="primary" @click="onCreateServer(ruleFormRef)">确定</el-button>
                  <el-button @click="visible = false">取消</el-button>
              </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { FormInstance, FormRules } from "element-plus";

const router = useRouter();
const currentRoute = router.options.routes[0].redirect;
const children = router.options.routes[0].children;
const radio = ref(currentRoute?.toString() || "");
const visible = ref(false);
const ruleFormRef = ref<FormInstance>();
const formInline = reactive({
  name: "",
  cmd: ""
});
const rules = reactive<FormRules>({
  name: [
    { type: "string", required: true, message: "请输入服务器名称", trigger: "blur" }

  ],
  cmd: [
    { type: "string", required: true, message: "请输 Gost 命令", trigger: "blur" }
  ]
});


const onSelect = (value: string) => {
  router.push(value);
};

const onClearLog = () => {
};

const onCreateServer = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      visible.value = false;

      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });

};
const openLink = () => {
  // shell.open('https://github.com/InfernalAzazel/GostForWindow')
};
onMounted(async () => {

});
</script>
<style scoped></style>