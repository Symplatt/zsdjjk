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
  /* 引入谷歌字体 */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Shippori+Mincho:wght@800&display=swap');

  /* 页面根容器样式 */
  .jjk-body {
    /* 定义黑色背景变量 */
    --jjk-black: #0a0a0a;

    /* 定义深灰背景变量 */
    --jjk-dark-gray: #1f1f1f;

    /* 定义浅灰文字变量 */
    --jjk-light-gray: #d4d4d4;

    /* 定义主题红变量 */
    --jjk-red: #a30000;

    /* 定义强调色变量 */
    --jjk-accent: var(--jjk-red);

    /* 定义书法字体变量 */
    --font-brush: 'Shippori Mincho', 'Noto Serif SC', serif;

    /* 定义正文字体变量 */
    --font-body: 'Noto Serif SC', serif;

    /* 固定定位 */
    position: fixed;

    /* 顶部对齐 */
    top: 0;

    /* 左侧对齐 */
    left: 0;

    /* 设置最高层级 */
    z-index: 999;

    /* Flex 布局居中内容 */
    display: flex;

    /* 垂直居中 */
    align-items: center;

    /* 水平居中 */
    justify-content: center;

    /* 宽度占满屏幕 */
    width: 100vw;

    /* 高度占满屏幕 */
    height: 100vh;

    /* 清除默认内边距 */
    padding: 0;

    /* 清除默认边距 */
    margin: 0;

    /* 隐藏溢出内容 */
    overflow: hidden;

    /* 应用字体 */
    font-family: var(--font-body);

    /* 应用文字颜色 */
    color: var(--jjk-light-gray);

    /* 应用背景色 */
    background-color: var(--jjk-black);

    /* 设置噪点背景图片 */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  }

  /* 截图包裹容器 */
  .capture-wrapper {
    /* 相对定位 */
    position: relative;

    /* 宽度占视口 90% */
    width: 90vw;

    /* 最大宽度限制 */
    max-width: 1100px;

    /* 高度占视口 85% */
    height: 85vh;
  }

  /* 布局网格 */
  .layout-grid {
    /* 包含边框和内边距 */
    box-sizing: border-box;

    /* Grid 布局 */
    display: grid;

    /* 定义两列比例 */
    grid-template-columns: 40% 1fr;

    /* 定义列间距，从 3vw 减小到 2vw 使布局更紧凑 */
    gap: 2vw;

    /* 高度拉伸 */
    align-items: stretch;

    /* 宽度填满 */
    width: 100%;

    /* 高度填满 */
    height: 100%;
  }

  /* 左侧立绘列 */
  .portrait-column {
    /* 相对定位 */
    position: relative;

    /* Flex 居中 */
    display: flex;
    align-items: center;
    justify-content: center;

    /* 宽度填满 */
    width: 100%;

    /* 高度填满 */
    height: 100%;

    /* 隐藏溢出 */
    overflow: hidden;
  }

  /* 立绘外框 */
  .portrait-frame {
    /* 相对定位 */
    position: relative;

    /* Flex 居中 */
    display: flex;
    align-items: center;
    justify-content: center;

    /* 尺寸填满 */
    width: 100%;
    height: 100%;

    /* 背景色 */
    background-color: var(--jjk-dark-gray);

    /* 边框样式 */
    border: 2px solid var(--jjk-black);

    /* 错位阴影效果 */
    box-shadow:
      5px 5px 0 var(--jjk-accent),
      -2px -2px 0 var(--jjk-light-gray);
  }

  /* 立绘图片 */
  .portrait-frame img {
    /* 尺寸填满 */
    width: 100%;
    height: 100%;

    /* 裁剪适应 */
    object-fit: cover;

    /* 顶部对齐 */
    object-position: top center;

    /* 默认灰度滤镜 */
    filter: grayscale(20%) contrast(110%) brightness(95%);

    /* 过渡效果 */
    transition: filter 0.3s ease;
  }

  /* 悬停去除灰度 */
  .portrait-frame:hover img {
    filter: grayscale(0%) contrast(110%);
  }

  /* 立绘装饰文字 */
  .portrait-text {
    /* 绝对定位 */
    position: absolute;

    /* 书法字体 */
    font-family: var(--font-brush);

    /* 字体大小 */
    font-size: clamp(32px, 4vh, 50px);

    /* 字重 */
    font-weight: 900;

    /* 红色字体 */
    color: var(--jjk-accent);

    /* 字间距 */
    letter-spacing: 0.5vh;

    /* 文字描边 */
    text-shadow: 2px 0 0 #000;

    /* 禁止交互 */
    pointer-events: none;

    /* 透明度 */
    opacity: 0.9;

    /* 竖排文字 */
    writing-mode: vertical-rl;
  }

  /* 左上角定位 */
  .text-top-left {
    top: 2vh;
    left: 1vw;
  }

  /* 右下角定位 */
  .text-bottom-right {
    right: 1vw;
    bottom: 2vh;
  }

  /* 右侧信息列 */
  .info-column {
    /* Flex 垂直排列 */
    display: flex;
    flex-direction: column;

    /* 水平居中 */
    align-items: center;

    /* 高度填满 */
    height: 100%;

    /* 隐藏溢出 */
    overflow: hidden;
  }

  /* 内部容器宽度统一 */
  .info-header,
  .stats-row,
  .bio-section {
    width: 100%;
    max-width: 700px;
  }

  /* 头部区域 */
  .info-header {
    /* 禁止压缩 */
    flex-shrink: 0;

    /* 底部内边距减小 */
    padding-bottom: 0.5vh;

    /* 底部外边距减小，更紧凑 */
    margin-bottom: 1vh;

    /* 文本左对齐 */
    text-align: left;

    /* 红色下划线 */
    border-bottom: 0.4vh solid var(--jjk-accent);
  }

  /* 角色名字 */
  .character-name {
    /* 清除边距 */
    margin: 0;

    /* 书法字体 */
    font-family: var(--font-brush);

    /* 字体大小 */
    font-size: clamp(40px, 6vh, 80px);

    /* 字重 */
    font-weight: 900;

    /* 行高 */
    line-height: 1;

    /* 颜色 */
    color: white;

    /* 大写 */
    text-transform: uppercase;

    /* 字间距 */
    letter-spacing: 0.2vw;

    /* 文字阴影 */
    text-shadow:
      0.3vh 0.3vh 0 var(--jjk-accent),
      -1px -1px 0 var(--jjk-black);
  }

  /* 副标题ID */
  .sub-name {
    /* 块级显示 */
    display: block;

    /* 顶部边距 */
    margin-top: 0.5vh;

    /* 正文字体 */
    font-family: var(--font-body);

    /* 字体大小 */
    font-size: clamp(14px, 1.5vh, 20px);

    /* 粗体 */
    font-weight: bold;

    /* 颜色 */
    color: var(--jjk-accent);

    /* 大写 */
    text-transform: uppercase;

    /* 字间距 */
    letter-spacing: 0.3em;
  }

  /* 数据统计行 */
  .stats-row {
    /* Flex 布局 */
    display: flex;

    /* 禁止压缩 */
    flex-shrink: 0;

    /* 移除间距，交由 space-between 控制 */
    gap: 0;

    /* 垂直居中 */
    align-items: center;

    /* 关键：两端对齐，左侧文字贴左，右侧图贴右 */
    justify-content: space-between;

    /* 固定高度 */
    height: 35vh;

    /* 减少底部边距 */
    margin-bottom: 1vh;
  }

  /* 左侧属性列表 */
  .quick-stats {
    /* Flex 垂直排列 */
    display: flex;
    flex-direction: column;

    /* 元素间距 */
    gap: 1.5vh;

    /* 垂直居中 */
    justify-content: center;

    /* 右内边距，保持文字与分割线的距离 */
    padding-right: 20px;

    /* 右边框分割线 */
    border-right: 2px solid var(--jjk-dark-gray);
  }

  /* 单个属性 */
  .stat-item {
    /* Flex 布局 */
    display: flex;

    /* 基线对齐 */
    align-items: baseline;

    /* 关键：左对齐，确保文字靠左 */
    justify-content: flex-start;
  }

  /* 属性标签 */
  .stat-label {
    /* 固定宽度 */
    width: 3em;

    /* 右边距 */
    margin-right: 1em;

    /* 字体大小 */
    font-size: clamp(14px, 1.6vh, 16px);

    /* 颜色 */
    color: #888;

    /* 两端对齐 */
    text-align-last: justify;
  }

  /* 属性值 */
  .stat-val {
    /* 书法字体 */
    font-family: var(--font-brush);

    /* 字体大小 */
    font-size: clamp(20px, 2.5vh, 28px);

    /* 颜色 */
    color: white;

    /* 不换行 */
    white-space: nowrap;
  }

  /* 特殊属性值 */
  .stat-val.special {
    /* 更大字号 */
    font-size: clamp(24px, 3vh, 32px);

    /* 红色高亮 */
    color: var(--jjk-accent);

    /* 红色光晕 */
    text-shadow: 0 0 5px rgb(163 0 0 / 50%);
  }

  /* 雷达图容器 */
  .radar-chart-container {
    /* 相对定位 */
    position: relative;

    /* 高度填满 */
    height: 100%;

    /* 正方形 */
    aspect-ratio: 1 / 1;

    /* 移除负右边距，自然对齐 */
    margin-right: 0;
  }

  /* SVG */
  .radar-svg {
    /* 尺寸填满 */
    width: 100%;
    height: 100%;

    /* 允许溢出 */
    overflow: visible;
  }

  /* 网格线 */
  .radar-grid {
    /* 填充色 */
    fill: rgb(255 255 255 / 5%);

    /* 线条颜色 */
    stroke: #aaa;

    /* 透明度 */
    stroke-opacity: 0.5;

    /* 线条宽度 */
    stroke-width: 2;
  }

  /* 轴线 */
  .radar-axis {
    stroke: #aaa;
    stroke-opacity: 0.5;
    stroke-width: 1.5;
  }

  /* 数据多边形 */
  .radar-data-polygon {
    /* 投影 */
    filter: drop-shadow(0 0 8px var(--jjk-accent));

    /* 填充红色，半透明 */
    fill: rgb(163 0 0 / 25%);

    /* 描边红色 */
    stroke: var(--jjk-accent);

    /* 描边宽度 */
    stroke-width: 2.5;

    /* 动画 */
    transition: all 0.5s ease;
  }

  /* 雷达图文字 */
  .radar-label {
    /* 书法字体 */
    font-family: var(--font-brush);

    /* 字号 */
    font-size: clamp(16px, 2vh, 20px);

    /* 字重 */
    font-weight: 900;

    /* 阴影 */
    text-shadow: 2px 2px 0 #000;

    /* 填充白色 */
    fill: #fff;
  }

  /* 档案区 */
  .bio-section {
    /* 相对定位 */
    position: relative;

    /* 自动填充剩余高度 */
    flex-grow: 1;

    /* 允许收缩 */
    min-height: 0;

    /* 清除内边距 */
    padding: 0;

    /* 背景色 */
    background-color: rgb(10 10 10 / 70%);

    /* 边框 */
    border: 1px solid var(--jjk-light-gray);

    /* 切角 */
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  }

  /* 档案区边框装饰 */
  .bio-section::before {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    content: '';
    border: 1px solid rgb(255 255 255 / 20%);
  }

  /* 滚动区域 */
  .bio-scroll-container {
    /* 盒模型 */
    box-sizing: border-box;

    /* 高度填满 */
    height: 100%;

    /* 内边距 */
    padding: 2vh 2vw;

    /* 允许垂直滚动 */
    overflow-y: auto;

    /* 滚动条颜色 */
    scrollbar-color: var(--jjk-accent) #111;

    /* 细滚动条 */
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

  /* 档案标签 */
  .bio-tag {
    /* 粘性定位 */
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

    /* 背景色 */
    background: var(--jjk-accent);
    box-shadow: 3px 3px 0 rgb(0 0 0 / 80%);
    transform: skewX(-15deg);
  }

  /* 标签文字反向倾斜 */
  .bio-tag span {
    display: block;
    transform: skewX(15deg);
  }

  /* 正文 */
  .bio-text p {
    margin: 0 0 1.2em;
    font-size: clamp(14px, 1.8vh, 18px);
    line-height: 1.8;
    color: #ccc;
    text-align: justify;
  }

  /* 换行保留 */
  .pre-wrap {
    white-space: pre-wrap;
  }

  /* 引用块 */
  .bio-text blockquote {
    padding: 1em;
    margin: 1.5em 0;
    font-style: italic;
    color: #ddd;
    background: rgb(163 0 0 / 10%);
    border-left: 4px solid var(--jjk-accent);
  }

  /* 引用标题 */
  .bio-text blockquote h6 {
    margin: 0 0 0.5em;
    font-family: var(--font-brush);
    font-size: 1.2em;
    color: var(--jjk-accent);
  }

  /* 404 样式 */
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

  /* 移动端适配 */
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
