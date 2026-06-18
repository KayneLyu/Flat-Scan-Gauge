<script setup lang="ts">
const title = '平扫测厚仪自动风环控制系统客户端 v1.2.5'
</script>

<template>
  <div class="header">
    <div class="title">
      {{ title }}
    </div>
    <div class="status">

    </div>
    <div class="info">

    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  -webkit-app-region: drag; /* 可拖拽窗口 */
  background-color: var(--color-sidebar-bg);
  border-bottom: 2px solid var(--color-border-line);
}
.title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
}
</style>