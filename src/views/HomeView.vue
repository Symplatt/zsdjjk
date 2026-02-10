<template>
  <div class="home-container">
    <h1 class="page-title">档案库</h1>

    <div class="char-grid">
      <a
        v-for="char in characters"
        :key="char.id"
        :href="getDetailLink(char.id)"
        target="_blank"
        class="char-card"
        :style="{ '--theme-color': char.color }"
      >
        <div class="card-indicator"></div>
        <div class="card-content">
          <h2 class="char-name">{{ char.name }}</h2>
          <div class="char-meta">
            <span class="grade-tag">{{ char.info.grade }}</span>
            <span class="org-text">{{ char.info.affiliation }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import charactersData from '@/data/characters.json'
  import type { Character } from '@/types'
  // 引入 useRouter
  import { useRouter } from 'vue-router'

  const characters = charactersData as Character[]
  // 获取 router 实例
  const router = useRouter()

  // 定义一个方法来生成详情页链接
  const getDetailLink = (id: string) => {
    // 使用 router.resolve 生成完整的 URL
    const routeData = router.resolve({ name: 'character-detail', params: { id } })
    return routeData.href
  }
</script>

<style scoped>
  .home-container {
    max-width: 1000px;
    padding: 40px 20px;
    margin: 0 auto;
  }

  .page-title {
    margin-bottom: 30px;
    font-size: 2rem;
    color: #333;
  }

  .char-grid {
    display: grid;

    /* 响应式网格布局，最小宽度 300px */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .char-card {
    display: flex;
    height: 100px;
    overflow: hidden;
    color: inherit;
    text-decoration: none;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .char-card:hover {
    box-shadow: 0 5px 15px rgb(0 0 0 / 15%);
    transform: translateY(-3px);
  }

  .card-indicator {
    width: 6px;

    /* 使用 CSS 变量应用角色主题色 */
    background-color: var(--theme-color);
  }

  .card-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding: 15px 20px;
  }

  .char-name {
    margin: 0 0 8px;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .char-meta {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 0.9rem;
    color: #666;
  }

  .grade-tag {
    padding: 2px 6px;
    font-weight: bold;
    background: #f0f0f0;
    border-radius: 4px;
  }
</style>
