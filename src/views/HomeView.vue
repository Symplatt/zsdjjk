<template>
  <div class="jjk-home">
    <div class="content-wrapper">
      <h1 class="page-title">
        <span class="title-en">子世代咒回IF</span>
        <span class="title-cn">咒术师档案库</span>
      </h1>

      <div class="char-grid">
        <a
          v-for="char in characters"
          :key="char.id"
          :href="getDetailLink(char.id)"
          target="_blank"
          class="char-card"
          :style="{ '--theme-color': char.color }"
        >
          <div class="bg-text">{{ char.id }}</div>

          <div class="card-indicator"></div>

          <div class="card-content">
            <div class="card-header">
              <span class="grade-tag">{{ char.info.grade }}</span>
              <span class="org-text">所属：{{ char.info.affiliation }}</span>
            </div>
            <h2 class="char-name">{{ char.name }}</h2>
            <div class="card-footer">
              <span class="view-more">ACCESS GRANTED -></span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import charactersData from '@/data/characters.json'
  import type { Character } from '@/types'
  import { useRouter } from 'vue-router'

  // 强制类型转换
  const characters = charactersData as Character[]
  const router = useRouter()

  // 生成详情页链接
  const getDetailLink = (id: string) => {
    const routeData = router.resolve({ name: 'character-detail', params: { id } })
    return routeData.href
  }
</script>

<style scoped>
  /* 引入 JJK 风格字体 */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Shippori+Mincho:wght@800&display=swap');

  /* 首页全屏容器样式 */
  .jjk-home {
    --jjk-black: #0a0a0a;
    --jjk-red: #a30000;
    --font-brush: 'Shippori Mincho', 'Noto Serif SC', serif;

    box-sizing: border-box;
    min-height: 100vh;
    padding: 60px 20px;
    font-family: var(--font-brush);
    color: #fff;
    background-color: var(--jjk-black);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* 标题区域样式 */
  .page-title {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-bottom: 60px;
    text-align: center;
  }

  .title-en {
    font-family: sans-serif;
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--jjk-red);
    text-transform: uppercase;
    letter-spacing: 0.5em;
    opacity: 0.8;
  }

  .title-cn {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 900;
    letter-spacing: 0.1em;
    text-shadow:
      4px 4px 0 var(--jjk-red),
      -2px -2px 0 #333;
  }

  /* 网格布局样式 */
  .char-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 30px;
  }

  /* 卡片基础样式 */
  .char-card {
    position: relative;
    display: flex;
    height: 160px;
    overflow: hidden;
    color: #ddd;
    text-decoration: none;
    background: #141414;
    border: 1px solid #333;

    /* 切角效果 */
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  /* 悬停效果 */
  .char-card:hover {
    z-index: 10;
    border-color: var(--theme-color);
    box-shadow: 0 0 30px rgb(0 0 0 / 80%);
    transform: translateY(-5px) scale(1.02);
  }

  /* 悬停时背景文字变色 */
  .char-card:hover .bg-text {
    color: var(--theme-color);
    opacity: 0.1;
  }

  /* 悬停时指示条发光 */
  .char-card:hover .card-indicator {
    width: 12px;
    box-shadow: 0 0 15px var(--theme-color);
  }

  /* 悬停时名字发光 */
  .char-card:hover .char-name {
    color: #fff;
    text-shadow: 0 0 10px var(--theme-color);
  }

  /* 卡片背景装饰字 */
  .bg-text {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 0;
    font-family: sans-serif;
    font-size: 5rem;
    font-weight: 900;
    color: #fff;
    pointer-events: none;
    opacity: 0.03;
    transition: all 0.3s ease;
  }

  /* 左侧指示条 */
  .card-indicator {
    flex-shrink: 0;
    width: 6px;
    background-color: var(--theme-color);
    transition: all 0.3s ease;
  }

  /* 卡片内容区 */
  .card-content {
    z-index: 1;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    padding: 25px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #888;
  }

  .grade-tag {
    padding: 2px 8px;
    font-family: sans-serif;
    color: #fff;
    letter-spacing: 1px;
    background: #333;
    border-radius: 2px;
  }

  .char-name {
    margin: 0;
    font-size: 2.2rem;
    font-weight: 900;
    color: #eee;
    transition: color 0.3s ease;
  }

  .card-footer {
    text-align: right;
  }

  .view-more {
    font-family: sans-serif;
    font-size: 0.8rem;
    font-weight: bold;
    color: #555;
    letter-spacing: 2px;
  }

  /* 移动端适配 */
  @media (width <= 768px) {
    .page-title {
      margin-bottom: 40px;
    }

    .title-cn {
      font-size: 1.8rem;
    }

    .char-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
