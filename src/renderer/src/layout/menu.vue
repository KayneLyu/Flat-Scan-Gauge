<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

// 导入所有svg图标组件
import HorizonIcon from "@renderer/assets/svg/Horizon.vue";
import LoopIcon from "@renderer/assets/svg/Loop.vue";
import SettingIcon from "@renderer/assets/svg/settings.vue";
import AlarmIcon from "@renderer/assets/svg/Alarm.vue";
import AutoIcon from "@renderer/assets/svg/Auto.vue";
import ProductIcon from "@renderer/assets/svg/Product.vue";
import DataIcon from "@renderer/assets/svg/Data.vue";

// 图标配置列表：统一管理图标、路由、组件
interface MenuItem {
  path: string // 路由地址
  iconComp: any // 图标组件
  label: string // 标识（可选）
}
const iconList: MenuItem[] = [
  { path: '/', iconComp: HorizonIcon, label: '首页' },
  { path: '/control', iconComp: AutoIcon, label: '自动' },
  { path: '/annular', iconComp: LoopIcon, label: '循环' },
  { path: '/vertical', iconComp: DataIcon, label: '数据' },
  { path: '/product', iconComp: ProductIcon, label: '产品' },
  { path: '/alarm', iconComp: AlarmIcon, label: '告警' },
  { path: '/setting', iconComp: SettingIcon, label: '设置' },
]

const route = useRoute()
const router = useRouter()

// 当前激活菜单索引
const activeIndex = computed(() => {
  return iconList.findIndex(item => item.path === route.path)
})

// 点击图标跳转路由
const handleClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="menu">
    <!-- 滑动高亮条，通过transform实现位移动画 -->
    <div
      class="active-bar"
      :style="{
        transform: `translateX(${activeIndex * 130}px)`
      }"
    ></div>

    <!-- 循环渲染图标 -->
    <div
      v-for="(item, index) in iconList"
      :key="item.path"
      class="menu-item"
      @click="handleClick(item.path)"
    >
      <component
        :is="item.iconComp"
        :class="{ active: index == activeIndex }"
      />
    </div>
  </div>
</template>

<style scoped>
.menu {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  gap: 30px;
  cursor: pointer;
}

/* 顶部滑动高亮横线 */
.active-bar {
  position: absolute;
  top: -3px;
  left: 9px;
  width: 80px;
  height: 4px;
  background: #409eff;
  border-radius: 2px;
  /* 核心滑动动画 */
  transition: transform 0.3s ease;
}

.menu-item {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 默认图标置灰 */
.menu-item :deep(svg) {
  width: 70px;
  height: 70px;
  filter: grayscale(100%);
}

/* 当前激活图标取消置灰 */
.menu-item .active  {
  filter: grayscale(0%);
}
</style>
