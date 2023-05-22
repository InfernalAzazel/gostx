<template>
  <router-view />
</template>
<script lang="ts" setup>
import {provideProxyStore, provideProcessesStore} from "@/store";
provideProxyStore([])
provideProcessesStore(0)
</script>