import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        path: "/proxy",
        component: () => import( "./views/proxyServer.vue"),
        meta: { title: "代理" }
      },
      {
        path: "/log",
        component: () => import( "./views/logs.vue"),
        meta: { title: "日志" }
      }
    ],
    component: () => import("./layout/base.vue"),
    meta: { hidden: true },
    path: "/",
    redirect: "/proxy"
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

