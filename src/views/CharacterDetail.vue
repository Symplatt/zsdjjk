<template>
  <div class="jjk-body">
    <div class="container" v-if="char">
      <div class="portrait-column">
        <div class="portrait-frame">
          <img :src="resolvePath(char?.avatar || '')" :alt="char?.name" />

          <div class="portrait-text text-top-right">{{ char?.info.affiliation }}</div>

          <div class="portrait-text text-bottom-right">{{ char?.info.grade }}</div>
        </div>
      </div>

      <div class="info-column">
        <header>
          <span class="sub-name">{{ char?.id.toUpperCase() }}</span>
          <h1 class="character-name">{{ char?.name }}</h1>
        </header>

        <div class="stats-row">
          <div class="radar-chart-container">
            <svg class="radar-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <polygon
                class="radar-grid"
                points="100,20 169.28,60 169.28,140 100,180 30.72,140 30.72,60"
              />
              <polygon
                class="radar-grid"
                points="100,52 141.57,76 141.57,124 100,148 58.43,124 58.43,76"
              />
              <polygon
                class="radar-grid"
                points="100,84 113.86,92 113.86,108 100,116 86.14,108 86.14,92"
              />

              <line class="radar-axis" x1="100" y1="100" x2="100" y2="20" />
              <line class="radar-axis" x1="100" y1="100" x2="169.28" y2="60" />
              <line class="radar-axis" x1="100" y1="100" x2="169.28" y2="140" />
              <line class="radar-axis" x1="100" y1="100" x2="100" y2="180" />
              <line class="radar-axis" x1="100" y1="100" x2="30.72" y2="140" />
              <line class="radar-axis" x1="100" y1="100" x2="30.72" y2="60" />

              <polygon class="radar-data-polygon" :points="radarPoints" />

              <text class="radar-label" x="100" y="15">咒力</text>
              <text class="radar-label" x="175" y="55">术式</text>
              <text class="radar-label" x="175" y="150">领域</text>
              <text class="radar-label" x="100" y="195">天赋</text>
              <text class="radar-label" x="25" y="150">体术</text>
              <text class="radar-label" x="25" y="55">智慧</text>
            </svg>
          </div>

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

    <div v-else class="not-found-jjk">
      <h2>查无此人</h2>
      <p>该档案不存在或已被销毁。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import charactersData from '@/data/characters.json'
  import type { Character, RadarStats } from '@/types'
  import { resolvePath } from '@/utils/assets'

  // 获取路由实例
  const route = useRoute()

  // 根据 URL 参数查找角色数据
  const char = computed<Character | undefined>(() => {
    const id = route.params.id as string
    return (charactersData as Character[]).find((c) => c.id === id)
  })

  // 将等级转换为数值分数
  const getScore = (rank: string): number => {
    // 基础容错处理
    if (!rank) return 50

    // 等级对应的分数映射
    const rankMap: Record<string, number> = {
      '■': 100, // 最高级
      A: 80,
      B: 70,
      C: 60,
      D: 50,
      E: 40,
    }

    // 判断是否为最高级或特级
    if (rank.includes('■') || rank.includes('特')) {
      return rankMap['■']
    }

    // 获取首字母并大写
    const firstChar = rank.charAt(0).toUpperCase()

    // 返回对应分数或默认值
    return rankMap[firstChar] ?? 60
  }

  // 计算 SVG 多边形顶点坐标
  const radarPoints = computed(() => {
    // 将响应式对象赋值给局部变量以锁定类型
    const currentC = char.value
    // 如果对象不存在则返回空字符串
    if (!currentC) return ''

    const stats: RadarStats = currentC.radar
    const center = { x: 100, y: 100 }
    const maxRadius = 80

    // 获取六个维度的分数
    const scores = [
      getScore(stats.cursed_energy),
      getScore(stats.technique),
      getScore(stats.domain),
      getScore(stats.talent),
      getScore(stats.physical),
      getScore(stats.intellect),
    ]

    // 将分数转换为 SVG 坐标点
    const points = scores.map((score, index) => {
      // 计算每个点的角度
      const angle = (index * 60 - 90) * (Math.PI / 180)
      const radius = (score / 100) * maxRadius
      const x = center.x + radius * Math.cos(angle)
      const y = center.y + radius * Math.sin(angle)
      return `${x},${y}`
    })

    return points.join(' ')
  })
</script>

<style scoped>
  /* 引入谷歌字体 */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Shippori+Mincho:wght@800&display=swap');

  /* 定义组件级全局样式 */
  .jjk-body {
    /* 定义主题颜色变量 */
    --jjk-black: #0a0a0a;
    --jjk-dark-gray: #1f1f1f;
    --jjk-light-gray: #d4d4d4;
    --jjk-red: #a30000;
    --jjk-accent: var(--jjk-red);
    --font-brush: 'Shippori Mincho', 'Noto Serif SC', serif;
    --font-body: 'Noto Serif SC', serif;

    /* 固定定位以覆盖原有布局 */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

    /* 强制占满整个视口 */
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;

    /* 禁用页面级滚动 */
    overflow: hidden;
    font-family: var(--font-body);
    color: var(--jjk-light-gray);
    background-color: var(--jjk-black);

    /* 设置 SVG 噪点背景 */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  }

  /* 主容器 Grid 布局 */
  .container {
    box-sizing: border-box;
    display: grid;

    /* 左侧占 35vw 右侧自适应 */
    grid-template-columns: 35vw 1fr;
    gap: 2vw;
    align-items: stretch;
    width: 100vw;
    height: 100vh;
    padding: 2vh 2vw;
  }

  /* 左侧立绘列样式 */
  .portrait-column {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  /* 立绘外框样式 */
  .portrait-frame {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--jjk-dark-gray);
    border: 2px solid var(--jjk-black);

    /* 红色错位阴影效果 */
    box-shadow:
      5px 5px 0 var(--jjk-accent),
      -2px -2px 0 var(--jjk-light-gray);
  }

  /* 立绘图片样式 */
  .portrait-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;

    /* 默认灰度滤镜 */
    filter: grayscale(20%) contrast(110%) brightness(95%);
    transition: filter 0.3s ease;
  }

  /* 鼠标悬停去除灰度 */
  .portrait-frame:hover img {
    filter: grayscale(0%) contrast(110%);
  }

  /* 立绘上的文字通用样式 */
  .portrait-text {
    position: absolute;
    font-family: var(--font-brush);
    font-size: 4vh;
    font-weight: 900;
    color: var(--jjk-accent);
    letter-spacing: 0.5vh;
    text-shadow: 2px 0 0 #000;
    pointer-events: none;
    opacity: 0.9;
    writing-mode: vertical-rl;
  }

  /* 右上角定位 */
  .text-top-right {
    top: 2vh;
    right: 1vw;
  }

  /* 右下角定位 */
  .text-bottom-right {
    right: 1vw;
    bottom: 2vh;
  }

  /* 右侧信息列样式 */
  .info-column {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  /* 头部样式 */
  header {
    position: relative;
    flex-shrink: 0;
    padding-bottom: 1vh;
    margin-bottom: 2vh;
    border-bottom: 0.4vh solid var(--jjk-accent);
  }

  /* 角色大标题样式 */
  .character-name {
    margin: 0;
    font-family: var(--font-brush);

    /* 响应式字体大小 */
    font-size: clamp(32px, 6vh, 80px);
    font-weight: 900;
    line-height: 1;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.2vw;
    text-shadow:
      0.3vh 0.3vh 0 var(--jjk-accent),
      -1px -1px 0 var(--jjk-black);
  }

  /* 副标题样式 */
  .sub-name {
    display: block;
    margin-top: 0.5vh;
    font-family: var(--font-body);
    font-size: clamp(12px, 1.5vh, 20px);
    font-weight: bold;
    color: var(--jjk-accent);
    text-transform: uppercase;
    letter-spacing: 0.3em;
  }

  /* 数据统计行样式 */
  .stats-row {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: 35vh;
    margin-bottom: 2vh;
  }

  /* 雷达图容器 */
  .radar-chart-container {
    position: relative;
    height: 100%;
    aspect-ratio: 1 / 1;
  }

  /* 雷达图 SVG 样式 */
  .radar-svg {
    width: 100%;
    height: 100%;
    overflow: visible;

    /* 旋转雷达图角度 */
    transform: rotate(-30deg) scale(0.9);
  }

  /* 网格线条样式 */
  .radar-grid {
    fill: rgb(255 255 255 / 2%);
    stroke: #555;
    stroke-width: 1;
  }

  /* 轴线样式 */
  .radar-axis {
    stroke: #555;
    stroke-width: 1;
  }

  /* 数据区域多边形样式 */
  .radar-data-polygon {
    filter: drop-shadow(0 0 8px var(--jjk-accent));
    fill: rgb(163 0 0 / 60%);
    stroke: var(--jjk-accent);
    stroke-width: 2.5;
    transition: all 0.5s ease;
  }

  /* 雷达图文字标签样式 */
  .radar-label {
    font-family: var(--font-brush);
    font-size: 16px;
    font-weight: 900;
    text-shadow: 2px 2px 0 #000;
    fill: #fff;

    /* 抵消父级旋转保持文字水平 */
    transform: rotate(30deg);
    transform-origin: center;
    transform-box: fill-box;
  }

  /* 快速属性列表容器 */
  .quick-stats {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1.5vh;
    justify-content: center;
    padding-left: 2vw;
    margin-left: 2vw;
    border-left: 2px solid var(--jjk-dark-gray);
  }

  /* 单个属性项 */
  .stat-item {
    display: flex;
    align-items: baseline;
  }

  /* 属性名标签 */
  .stat-label {
    width: 3em;
    margin-right: 1em;
    font-size: 1.5vh;
    color: #888;
    text-align-last: justify;
  }

  /* 属性值 */
  .stat-val {
    font-family: var(--font-brush);
    font-size: 2.2vh;
    color: white;
    white-space: nowrap;
  }

  /* 特殊属性值高亮 */
  .stat-val.special {
    font-size: 2.5vh;
    color: var(--jjk-accent);
    text-shadow: 0 0 5px rgb(163 0 0 / 50%);
  }

  /* 底部滚动档案区域 */
  .bio-section {
    position: relative;
    flex-grow: 1;
    min-height: 0;
    padding: 0;
    background-color: rgb(10 10 10 / 70%);
    border: 1px solid var(--jjk-light-gray);

    /* 切角效果 */
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  }

  /* 档案区域边框装饰 */
  .bio-section::before {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    content: '';
    border: 1px solid rgb(255 255 255 / 20%);
  }

  /* 滚动内容容器 */
  .bio-scroll-container {
    box-sizing: border-box;
    height: 100%;
    padding: 2vh 2vw;
    overflow-y: auto;
    scrollbar-color: var(--jjk-accent) #111;
    scrollbar-width: thin;
  }

  /* Webkit 滚动条样式 */
  .bio-scroll-container::-webkit-scrollbar {
    width: 6px;
  }

  .bio-scroll-container::-webkit-scrollbar-track {
    background: #111;
  }

  .bio-scroll-container::-webkit-scrollbar-thumb {
    background: var(--jjk-accent);
  }

  /* 机密档案标签 */
  .bio-tag {
    position: sticky;
    top: 0;
    z-index: 10;
    display: inline-block;
    padding: 0.5vh 1.5vw;
    margin-bottom: 2vh;
    font-family: var(--font-brush);
    font-size: 1.8vh;
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

  /* 档案文本段落 */
  .bio-text p {
    margin: 0 0 1.2em;
    font-size: clamp(14px, 1.6vh, 18px);
    line-height: 1.8;
    color: #ccc;
    text-align: justify;
  }

  /* 保留换行符的工具类 */
  .pre-wrap {
    white-space: pre-wrap;
  }

  /* 引用块样式 */
  .bio-text blockquote {
    padding: 1em;
    margin: 1.5em 0;
    font-style: italic;
    color: #ddd;
    background: rgb(163 0 0 / 10%);
    border-left: 4px solid var(--jjk-accent);
  }

  .bio-text blockquote h6 {
    margin: 0 0 0.5em;
    font-family: var(--font-brush);
    font-size: 1.1em;
    color: var(--jjk-accent);
  }

  /* 404 页面样式 */
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

  .not-found-jjk h2 {
    margin-bottom: 2vh;
    font-size: 5vh;
  }

  .not-found-jjk p {
    font-size: 2vh;
    color: var(--jjk-light-gray);
  }

  /* 移动端竖屏适配 */
  @media (aspect-ratio <= 1/1) {
    .jjk-body {
      position: relative;
      height: auto;
      overflow: auto;
    }

    .container {
      grid-template-rows: 60vh auto;
      grid-template-columns: 1fr;
      height: auto;
      overflow: visible;
    }

    .info-column {
      height: auto;
    }

    .stats-row {
      flex-direction: column;
      height: auto;
    }

    .radar-chart-container {
      width: 80%;
      height: auto;
      margin-bottom: 20px;
    }

    .bio-section {
      flex-grow: 0;
      height: 500px;
    }
  }
</style>
