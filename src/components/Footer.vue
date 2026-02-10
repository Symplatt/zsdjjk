<!-- 底部信息栏 -->

<template>
  <footer class="site-footer">
    <div class="page-container">
      <div class="footer-inner">
        <div class="footer-block footer-main">© Symplatt</div>
        <div class="footer-block footer-disclaimer">本网站为……</div>
        <div class="footer-block footer-privacy">本站不主动收集……</div>
        <div class="footer-block">ICP 备案状态……</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>

<style scoped>
  .site-footer {
    width: 100%;
    background: #000205;
    border-top: 1px solid #252525;
  }

  .footer-inner {
    width: 100%;
    padding: 30px 0;
    font-size: 12px;
    line-height: 1.8;
    color: rgb(132 132 132 / 70%);
  }

  .footer-block {
    margin-bottom: 10px;
  }

  .footer-main {
    font-weight: 500;
    color: rgb(200 200 200 / 80%);
  }

  .footer-credit {
    margin-top: 15px;
    font-size: 11px;
    color: rgb(132 132 132 / 50%);
  }
</style>
