<template>
  <div class="jjk-body">
    <div class="capture-wrapper" v-if="char">
      <div class="layout-grid">
        <div class="portrait-column">
          <div class="portrait-frame">
            <img :src="resolvePath(char?.avatar || '')" :alt="char?.name" />
            <div class="portrait-text text-top-left">{{ char?.info.affiliation }}</div>
            <div class="portrait-text text-bottom-right">{{ char?.info.grade }}</div>
          </div>
        </div>

        <div class="info-column">
          <header class="info-header">
            <span class="sub-name">{{ char?.id }}</span>
            <h1 class="character-name">{{ char?.name }}</h1>
          </header>

          <div class="stats-row">
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-label">等级</span>
                <span class="stat-val special">{{ char?.info.grade }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">术式</span>
                <span class="stat-val">{{ char?.info.technique }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">所属</span>
                <span class="stat-val">{{ char?.info.affiliation }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">领域</span>
                <span class="stat-val">{{ char?.info.domain }}</span>
              </div>
            </div>

            <div class="radar-chart-container">
              <svg class="radar-svg" viewBox="-50 -30 300 260" xmlns="http://www.w3.org/2000/svg">
                <polygon
                  class="radar-grid"
                  points="60,30.72 140,30.72 180,100 140,169.28 60,169.28 20,100"
                />
                <polygon
                  class="radar-grid"
                  points="76,58.43 124,58.43 148,100 124,141.57 76,141.57 52,100"
                />
                <polygon
                  class="radar-grid"
                  points="92,86.14 108,86.14 116,100 108,113.86 92,113.86 84,100"
                />

                <line class="radar-axis" x1="100" y1="100" x2="60" y2="30.72" />
                <line class="radar-axis" x1="100" y1="100" x2="140" y2="30.72" />
                <line class="radar-axis" x1="100" y1="100" x2="180" y2="100" />
                <line class="radar-axis" x1="100" y1="100" x2="140" y2="169.28" />
                <line class="radar-axis" x1="100" y1="100" x2="60" y2="169.28" />
                <line class="radar-axis" x1="100" y1="100" x2="20" y2="100" />

                <polygon class="radar-data-polygon" :points="radarPoints" />

                <text class="radar-label" x="50" y="20" text-anchor="end">咒力</text>
                <text class="radar-label" x="150" y="20" text-anchor="start">术式</text>
                <text
                  class="radar-label"
                  x="195"
                  y="100"
                  dominant-baseline="middle"
                  text-anchor="start"
                >
                  领域
                </text>
                <text
                  class="radar-label"
                  x="150"
                  y="185"
                  dominant-baseline="hanging"
                  text-anchor="start"
                >
                  天赋
                </text>
                <text
                  class="radar-label"
                  x="50"
                  y="185"
                  dominant-baseline="hanging"
                  text-anchor="end"
                >
                  体术
                </text>
                <text
                  class="radar-label"
                  x="5"
                  y="100"
                  dominant-baseline="middle"
                  text-anchor="end"
                >
                  智慧
                </text>
              </svg>
            </div>
          </div>

          <div class="bio-section">
            <div class="bio-scroll-container">
              <div class="bio-tag"><span>机密档案</span></div>
              <div class="bio-text">
                <p class="pre-wrap">{{ char?.bio }}</p>
                <blockquote v-for="(extra, index) in char?.extras" :key="index">
                  <h6>{{ extra.title }}</h6>
                  <p class="pre-wrap">{{ extra.content }}</p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found-jjk">
      <h2>查无此人</h2>
      <p>该档案不存在或已被销毁。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 导入 Vue 的计算属性功能
  import { computed } from 'vue'
  // 导入 Vue Router 的路由钩子
  import { useRoute } from 'vue-router'
  // 导入角色数据 JSON 文件
  import charactersData from '@/data/characters.json'
  // 导入 TypeScript 类型定义
  import type { Character, RadarStats } from '@/types'
  // 导入工具函数，用于处理图片路径（修复图片不显示的问题）
  import { resolvePath } from '@/utils/assets'

  // 获取当前路由实例
  const route = useRoute()

  // 计算属性：根据 URL 参数查找对应的角色数据
  const char = computed<Character | undefined>(() => {
    // 获取路由参数中的 id
    const id = route.params.id as string
    // 在数据中查找 id 匹配的角色
    return (charactersData as Character[]).find((c) => c.id === id)
  })

  // 辅助函数：将等级字符串转换为 0-100 的数值
  const getScore = (rank: string): number => {
    // 如果等级为空，默认返回 50
    if (!rank) return 50
    // 定义等级与分数的映射关系
    const rankMap: Record<string, number> = {
      '■': 100,
      A: 90,
      B: 75,
      C: 60,
      D: 45,
      E: 30,
    }
    // 特殊处理：如果是特级或包含黑方块，返回满分
    if (rank.includes('■') || rank.includes('特')) return rankMap['■']
    // 获取等级首字母并大写
    const firstChar = rank.charAt(0).toUpperCase()
    // 返回映射分数，未知等级默认返回 60
    return rankMap[firstChar] ?? 60
  }

  // 计算属性：生成雷达图多边形的顶点坐标字符串
  const radarPoints = computed(() => {
    // 锁定当前角色数据，避免类型为空的警告
    const currentC = char.value
    // 如果没有角色数据，返回空字符串
    if (!currentC) return ''

    // 获取六维数据
    const stats: RadarStats = currentC.radar
    // 定义雷达图中心点
    const center = { x: 100, y: 100 }
    // 定义雷达图最大半径
    const maxRadius = 80
    // 将各项属性转换为分数数组
    const scores = [
      getScore(stats.cursed_energy),
      getScore(stats.technique),
      getScore(stats.domain),
      getScore(stats.talent),
      getScore(stats.physical),
      getScore(stats.intellect),
    ]
    // 定义六个顶点对应的角度
    const angles = [240, 300, 0, 60, 120, 180]

    // 计算每个顶点的 X,Y 坐标
    const points = scores.map((score, index) => {
      // 将角度转换为弧度
      const angleRad = angles[index] * (Math.PI / 180)
      // 根据分数计算半径长度
      const radius = (score / 100) * maxRadius
      // 计算 X 坐标
      const x = center.x + radius * Math.cos(angleRad)
      // 计算 Y 坐标
      const y = center.y + radius * Math.sin(angleRad)
      // 返回坐标字符串
      return `${x},${y}`
    })
    // 拼接所有坐标点
    return points.join(' ')
  })
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Shippori+Mincho:wght@800&display=swap');

  .jjk-body {
    --jjk-black: #0a0a0a;
    --jjk-dark-gray: #1f1f1f;
    --jjk-light-gray: #d4d4d4;
    --jjk-red: #a30000;
    --jjk-accent: var(--jjk-red);
    --font-brush: 'Shippori Mincho', 'Noto Serif SC', serif;
    --font-body: 'Noto Serif SC', serif;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-family: var(--font-body);
    color: var(--jjk-light-gray);
    background-color: var(--jjk-black);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  }

  .capture-wrapper {
    position: relative;
    width: 90vw;
    max-width: 1100px;
    height: 100vh;
    padding: 5vh 30px 8vh;
  }

  .layout-grid {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 40% 1fr;
    gap: 2vw;
    align-items: stretch;
    width: 100%;
    height: 100%;
  }

  .portrait-column {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .portrait-frame {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--jjk-dark-gray);
    border: 2px solid var(--jjk-black);
    box-shadow:
      5px 5px 0 var(--jjk-accent),
      -2px -2px 0 var(--jjk-light-gray);
  }

  .portrait-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    filter: grayscale(20%) contrast(110%) brightness(95%);
    transition: filter 0.3s ease;
  }

  .portrait-frame:hover img {
    filter: grayscale(0%) contrast(110%);
  }

  .portrait-text {
    position: absolute;
    font-family: var(--font-brush);
    font-size: clamp(32px, 4vh, 50px);
    font-weight: 900;
    color: var(--jjk-accent);
    letter-spacing: 0.5vh;
    text-shadow: 2px 0 0 #000;
    pointer-events: none;
    opacity: 0.9;
    writing-mode: vertical-rl;
  }

  .text-top-left {
    top: 2vh;
    left: 1vw;
  }

  .text-bottom-right {
    right: 1vw;
    bottom: 2vh;
  }

  .info-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    overflow: hidden;
  }

  .info-header,
  .stats-row,
  .bio-section {
    width: 100%;
    max-width: 700px;
  }

  .info-header {
    flex-shrink: 0;
    padding-bottom: 0.5vh;
    margin-bottom: 1vh;
    text-align: left;
    border-bottom: 0.4vh solid var(--jjk-accent);
  }

  .character-name {
    margin: 0;
    font-family: var(--font-brush);
    font-size: clamp(40px, 6vh, 80px);
    font-weight: 900;
    line-height: 1;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.2vw;
    text-shadow:
      0.3vh 0.3vh 0 var(--jjk-accent),
      -1px -1px 0 var(--jjk-black);
  }

  .sub-name {
    display: block;
    margin-top: 0.5vh;
    font-family: var(--font-body);
    font-size: clamp(14px, 1.5vh, 20px);
    font-weight: bold;
    color: var(--jjk-accent);
    text-transform: uppercase;
    letter-spacing: 0.3em;
  }

  .stats-row {
    display: flex;
    flex-shrink: 0;
    gap: 0;
    align-items: center;
    justify-content: space-between;
    height: 35vh;
    margin-bottom: 1vh;
  }

  .quick-stats {
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
    justify-content: center;
    padding-right: 40px;
    border-right: 2px solid var(--jjk-dark-gray);
  }

  .stat-item {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
  }

  .stat-label {
    width: 3em;
    margin-right: 1em;
    font-size: clamp(14px, 1.6vh, 16px);
    color: #888;
    text-align-last: justify;
  }

  .stat-val {
    font-family: var(--font-brush);
    font-size: clamp(20px, 2.5vh, 28px);
    color: white;
    white-space: nowrap;
  }

  .stat-val.special {
    font-size: clamp(24px, 3vh, 32px);
    color: var(--jjk-accent);
    text-shadow: 0 0 5px rgb(163 0 0 / 50%);
  }

  .radar-chart-container {
    position: relative;
    height: 100%;
    aspect-ratio: 1 / 1;
    margin-right: 0;
  }

  .radar-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .radar-grid {
    fill: rgb(255 255 255 / 5%);
    stroke: #aaa;
    stroke-opacity: 0.5;
    stroke-width: 2;
  }

  .radar-axis {
    stroke: #aaa;
    stroke-opacity: 0.5;
    stroke-width: 1.5;
  }

  .radar-data-polygon {
    filter: drop-shadow(0 0 8px var(--jjk-accent));
    fill: rgb(163 0 0 / 25%);
    stroke: var(--jjk-accent);
    stroke-width: 2.5;
    transition: all 0.5s ease;
  }

  .radar-label {
    font-family: var(--font-brush);
    font-size: clamp(16px, 2vh, 20px);
    font-weight: 900;
    text-shadow: 2px 2px 0 #000;
    fill: #fff;
  }

  .bio-section {
    position: relative;
    flex-grow: 1;
    min-height: 0;
    padding: 0;
    background-color: rgb(10 10 10 / 70%);
    border: 1px solid var(--jjk-light-gray);
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  }

  .bio-section::before {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    content: '';
    border: 1px solid rgb(255 255 255 / 20%);
  }

  .bio-scroll-container {
    box-sizing: border-box;
    height: 100%;
    padding: 2vh 2vw;
    overflow-y: auto;
    scrollbar-color: var(--jjk-accent) #111;
    scrollbar-width: thin;
    mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  }

  .bio-scroll-container::-webkit-scrollbar {
    width: 6px;
  }

  .bio-scroll-container::-webkit-scrollbar-track {
    background: #111;
  }

  .bio-scroll-container::-webkit-scrollbar-thumb {
    background: var(--jjk-accent);
  }

  .bio-tag {
    position: sticky;
    top: 0;
    z-index: 10;
    display: inline-block;
    padding: 0.5vh 1.5vw;
    margin-bottom: 2vh;
    font-family: var(--font-brush);
    font-size: clamp(14px, 1.8vh, 18px);
    font-weight: bold;
    color: black;
    background: var(--jjk-accent);
    box-shadow: 3px 3px 0 rgb(0 0 0 / 80%);
    transform: skewX(-15deg);
  }

  .bio-tag span {
    display: block;
    transform: skewX(15deg);
  }

  .bio-text p {
    margin: 0 0 1.2em;
    font-size: clamp(14px, 1.8vh, 18px);
    line-height: 1.8;
    color: #ccc;
    text-align: justify;
  }

  .pre-wrap {
    white-space: pre-wrap;
  }

  .bio-text blockquote {
    padding: 1em;
    margin: 1.5em 0;
    color: #ddd;
    background: rgb(163 0 0 / 10%);
    border-left: 4px solid var(--jjk-accent);
  }

  .bio-text blockquote h6 {
    margin: 0 0 0.5em;
    font-family: var(--font-brush);
    font-size: 1.2em;
    color: var(--jjk-accent);
  }

  .not-found-jjk {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: var(--font-brush);
    color: var(--jjk-accent);
    text-shadow: 2px 2px 0 #000;
  }

  @media (aspect-ratio <= 1/1) {
    .jjk-body {
      position: relative;
      display: block;
      height: auto;
      overflow: auto;
    }

    .capture-wrapper {
      width: 100%;
      max-width: none;
      height: auto;
    }

    .layout-grid {
      grid-template-rows: 60vh auto;
      grid-template-columns: 1fr;
      gap: 0;
    }

    .info-column {
      height: auto;
      padding: 20px;
    }

    .stats-row {
      flex-direction: column;
      height: auto;
    }

    .quick-stats {
      align-items: center;
      width: 100%;
      padding-right: 0;
      padding-bottom: 20px;
      border-right: none;
      border-bottom: 2px solid var(--jjk-dark-gray);
    }

    .stat-item {
      justify-content: center;
    }

    .radar-chart-container {
      width: 80%;
      margin: 20px 0;
    }

    .bio-section {
      flex-grow: 0;
      height: 500px;
    }
  }
</style>
