<script setup lang="ts">
import Header from './header.vue';
import Footer from "./footer.vue";
// Props & Emits
interface Props {
  title?: string
}

</script>

<template>
  <div class="layout">
    <div>
      <Header />
    </div>
    <div class="content">
      <router-view />
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
.content {
  flex:1
}

</style>