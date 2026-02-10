<!-- App.vue -->
<template>
  <div class="app">
    <NavigationBar v-if="!$route.meta.hideNavbar" />

    <div class="app-content">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
        </KeepAlive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
      </RouterView>
    </div>

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
