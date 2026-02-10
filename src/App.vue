<!-- App.vue -->
<template>
  <div class="app">
    <!-- 导航栏 -->
    <NavigationBar />

    <!-- 内容区域 -->
    <div class="app-content">
      <RouterView v-slot="{ Component }">
        <!-- 仅缓存路由 meta 中标记为 keepAlive 的组件 -->
        <KeepAlive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
        </KeepAlive>
        <!-- 不缓存的组件直接渲染 -->
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
      </RouterView>
    </div>

    <!-- 根据路由元信息决定是否隐藏 Footer -->
    <Footer v-if="!$route.meta.hideFooter" />
  </div>
</template>

<script setup lang="ts" name="App">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import NavigationBar from './components/NavigationBar.vue'
  import Footer from './components/Footer.vue'

  const route = useRoute()

  // 计算属性：不是404页面时显示回到顶部
  const showBackToTop = computed(() => route.name !== 'not-found')
</script>

<!-- <style></style> -->
