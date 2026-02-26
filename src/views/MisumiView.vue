<template>
  <div class="jjk-body">
    <div class="capture-wrapper">
      <div class="layout-grid">
        <div class="portrait-column">
          <div class="portrait-frame">
            <img :src="resolvePath('/images/三角初音.png')" alt="三角初音" />
            <div class="portrait-text text-bottom-right">丰川家族</div>
          </div>
        </div>

        <div class="info-column custom-scroll">
          <header class="info-header">
            <span class="sub-name">MISUMI HATSUNE</span>
            <h1 class="character-name">三角初音</h1>
          </header>

          <div class="stats-row">
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-label">等级</span>
                <span class="stat-val special">特级</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">术式</span>
                <span class="stat-val">塞壬咒颂</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">所属</span>
                <span class="stat-val">月神</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">领域</span>
                <span class="stat-val">谧海悼歌</span>
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
                <polygon class="radar-data-polygon" :points="hatsunePoints" />
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

          <header class="info-header secondary-header">
            <span class="sub-name">MISUMI UIKA (SHIKIGAMI)</span>
            <h1 class="character-name" style="font-size: 40px">三角初华</h1>
          </header>

          <div class="stats-row">
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-label">等级</span>
                <span class="stat-val special" style="font-size: 24px">特级怨灵</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">术式</span>
                <span class="stat-val">■■</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">所属</span>
                <span class="stat-val">三角初音</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">领域</span>
                <span class="stat-val">无</span>
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
                <polygon class="radar-data-polygon" :points="uikaPoints" />

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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { resolvePath } from '@/utils/assets'

  // --- 数据计算逻辑 (Hardcoded) ---

  const getScore = (rank: string): number => {
    if (rank === '■') return 110
    const scores: Record<string, number> = { A: 90, B: 75, C: 60, D: 45, E: 20, X: 0 }
    return scores[rank] || 50
  }

  const generatePoints = (stats: number[]) => {
    const center = { x: 100, y: 100 }
    const maxRadius = 80
    const angles = [240, 300, 0, 60, 120, 180] // 对应：咒力, 术式, 领域, 天赋, 体术, 智慧

    return stats
      .map((score, index) => {
        const angleRad = angles[index] * (Math.PI / 180)
        const radius = (score / 100) * maxRadius
        const x = center.x + radius * Math.cos(angleRad)
        const y = center.y + radius * Math.sin(angleRad)
        return `${x},${y}`
      })
      .join(' ')
  }

  // 初音数据: 咒力A, 术式■, 领域A, 天赋A, 体术B, 智慧B
  const hatsunePoints = computed(() => {
    const ranks = ['A', '■', 'A', 'A', 'B', 'B']
    const scores = ranks.map((r) => getScore(r))
    return generatePoints(scores)
  })

  // 初华数据: 咒力■, 术式A, 领域X, 天赋E, 体术A, 智慧E
  const uikaPoints = computed(() => {
    const ranks = ['■', 'A', 'X', 'E', 'A', 'E']
    const scores = ranks.map((r) => getScore(r))
    return generatePoints(scores)
  })
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700;900&family=Shippori+Mincho:wght@800&display=swap');

  /* --- 样式完全复用 CharacterDetail.vue --- */
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
    font-family: var(--font-body);
    color: var(--jjk-light-gray);
    background-color: var(--jjk-black);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  }

  .capture-wrapper {
    position: relative;
    width: 90vw;
    max-width: 1200px;
    height: 100vh;
    padding: 5vh 30px 8vh;
  }

  .layout-grid {
    display: grid;
    grid-template-columns: 45% 1fr;
    gap: 2vw;
    width: 100%;
    height: 100%;
  }

  .portrait-column {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .portrait-frame {
    position: relative;
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
    filter: grayscale(20%) contrast(110%) brightness(95%);
  }

  .portrait-text {
    position: absolute;
    font-family: var(--font-brush);
    font-size: clamp(32px, 4vh, 50px);
    font-weight: 900;
    color: var(--jjk-accent);
    letter-spacing: 0.5vh;
    text-shadow: 2px 0 0 #000;
    writing-mode: vertical-rl;
  }

  .text-bottom-right {
    right: 1vw;
    bottom: 2vh;
  }

  .info-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 10px;

    /* 允许在内容过多时滚动，因为有两个面板 */
    overflow-y: auto;
  }

  /* 隐藏滚动条但保留功能 */
  .info-column::-webkit-scrollbar {
    width: 4px;
  }

  .info-column::-webkit-scrollbar-thumb {
    background: var(--jjk-accent);
  }

  .info-header,
  .stats-row {
    flex-shrink: 0;
    width: 100%;
    max-width: 700px;
  }

  .info-header {
    margin-bottom: 1vh;
    text-align: left;
    border-bottom: 0.4vh solid var(--jjk-accent);
  }

  .secondary-header {
    margin-top: 2vh; /* 两个面板之间的间距 */
  }

  .character-name {
    margin: 0;
    font-family: var(--font-brush);
    font-size: 60px;
    font-weight: 900;
    line-height: 1;
    color: white;
    text-shadow:
      0.3vh 0.3vh 0 var(--jjk-accent),
      -1px -1px 0 var(--jjk-black);
  }

  .sub-name {
    display: block;
    font-family: var(--font-body);
    font-size: 20px;
    font-weight: bold;
    color: var(--jjk-accent);
    letter-spacing: 0.3em;
  }

  .stats-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 35vh;
    margin-bottom: 1vh;
  }

  .quick-stats {
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
    padding-right: 40px;
    border-right: 2px solid var(--jjk-dark-gray);
  }

  .stat-item {
    display: flex;
    align-items: baseline;
  }

  .stat-label {
    width: 3em;
    margin-right: 1em;
    font-size: 20px;
    color: #888;
    text-align-last: justify;
  }

  .stat-val {
    font-family: var(--font-brush);
    font-size: 28px;
    color: white;
  }

  .stat-val.special {
    font-size: 30px;
    color: var(--jjk-accent);
    text-shadow: 0 0 5px rgb(163 0 0 / 50%);
  }

  .radar-chart-container {
    position: relative;
    height: 100%;
    aspect-ratio: 1 / 1;
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
  }

  .radar-label {
    font-family: var(--font-brush);
    font-size: 20px;
    font-weight: 900;
    text-shadow: 2px 2px 0 #000;
    fill: #fff;
  }

  /* 移动端适配 */
  @media (aspect-ratio <= 1/1) {
    .jjk-body {
      position: relative;
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
      overflow: visible;
    }

    .stats-row {
      flex-direction: column;
      height: auto;
      margin-bottom: 40px;
    }

    .quick-stats {
      align-items: center;
      width: 100%;
      padding-right: 0;
      padding-bottom: 20px;
      border-right: none;
      border-bottom: 2px solid var(--jjk-dark-gray);
    }

    .radar-chart-container {
      width: 80%;
      margin: 20px 0;
    }
  }
</style>
