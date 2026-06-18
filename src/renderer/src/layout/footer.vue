<script setup lang="ts">
import Menu from './menu.vue';
</script>

<template>
  <div class="footer">
    <div class="logo">
      <img src="../assets/images/logo.png" alt="">
    </div>
    <div class="menu">
      <Menu />
    </div>

    <div class="close">

    </div>
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  background-color: var(--color-sidebar-bg);
  border-top: 2px solid var(--color-border-line);
}
img {
  width: 150px;
  height: 60px;
  filter: brightness(150%);
  object-fit: contain;
}
</style>