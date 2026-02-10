<template>
  <header class="site-header">
    <div class="header-inner page-container">
      <div class="logo">LOGO</div>
      <nav class="nav-menu">
        <RouterLink
          v-for="item in navList"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
  const navList = [
    { name: '首页', path: '/' },
    { name: '关于', path: '/about' },
  ]
</script>

<style scoped>
  .site-header {
    display: flex;
    align-items: center;
    height: var(--header-height);
    border-bottom: 1px solid #eee;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-item {
    margin-left: 20px;
    color: #333;
    text-decoration: none;
  }

  .nav-item.active {
    font-weight: bold;
    color: #42b983; /* Vue Green */
  }
</style>
