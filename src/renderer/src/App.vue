<script setup lang="ts">
import Layout from '@renderer/layout/index.vue';


const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <Layout />
</template>
