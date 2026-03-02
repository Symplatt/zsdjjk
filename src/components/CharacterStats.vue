<template>
  <div class="stats-row">
    <div class="quick-stats">
      <div class="stat-item">
        <span class="stat-label">等级</span>
        <span class="stat-val special">{{ character.info.grade }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">术式</span>
        <span class="stat-val">{{ character.info.technique }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">所属</span>
        <span class="stat-val">{{ character.info.affiliation }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">领域</span>
        <span class="stat-val">{{ character.info.domain }}</span>
      </div>
    </div>

    <div class="radar-chart-container">
      <svg
        class="radar-svg"
        style="display: block; width: 100%; height: 100%; overflow: visible"
        viewBox="-50 -30 300 260"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="red-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              flood-color="#a30000"
              flood-opacity="0.8"
            />
          </filter>
        </defs>

        <polygon
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="2"
          points="60,30.72 140,30.72 180,100 140,169.28 60,169.28 20,100"
        />
        <polygon
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="2"
          points="76,58.43 124,58.43 148,100 124,141.57 76,141.57 52,100"
        />
        <polygon
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="2"
          points="92,86.14 108,86.14 116,100 108,113.86 92,113.86 84,100"
        />

        <line
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="1.5"
          x1="100"
          y1="100"
          x2="60"
          y2="30.72"
        />
        <line
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="1.5"
          x1="100"
          y1="100"
          x2="140"
          y2="30.72"
        />
        <line
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="1.5"
          x1="100"
          y1="100"
          x2="180"
          y2="100"
        />
        <line
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="1.5"
          x1="100"
          y1="100"
          x2="140"
          y2="169.28"
        />
        <line
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="1.5"
          x1="100"
          y1="100"
          x2="60"
          y2="169.28"
        />
        <line
          stroke="rgba(170, 170, 170, 0.5)"
          stroke-width="1.5"
          x1="100"
          y1="100"
          x2="20"
          y2="100"
        />

        <polygon
          :points="radarPoints"
          fill="rgba(163, 0, 0, 0.25)"
          stroke="#a30000"
          stroke-width="2.5"
          filter="url(#red-glow)"
          style="transition: all 0.5s ease"
        />

        <text
          fill="#ffffff"
          style="
            font-family: var(--font-brush);
            font-size: 20px;
            font-weight: 900;
            text-shadow: 2px 2px 0 #000;
          "
          x="50"
          y="20"
          text-anchor="end"
        >
          咒力
        </text>
        <text
          fill="#ffffff"
          style="
            font-family: var(--font-brush);
            font-size: 20px;
            font-weight: 900;
            text-shadow: 2px 2px 0 #000;
          "
          x="150"
          y="20"
          text-anchor="start"
        >
          术式
        </text>
        <text
          fill="#ffffff"
          style="
            font-family: var(--font-brush);
            font-size: 20px;
            font-weight: 900;
            text-shadow: 2px 2px 0 #000;
          "
          x="195"
          y="100"
          dominant-baseline="middle"
          text-anchor="start"
        >
          领域
        </text>
        <text
          fill="#ffffff"
          style="
            font-family: var(--font-brush);
            font-size: 20px;
            font-weight: 900;
            text-shadow: 2px 2px 0 #000;
          "
          x="150"
          y="185"
          dominant-baseline="hanging"
          text-anchor="start"
        >
          天赋
        </text>
        <text
          fill="#ffffff"
          style="
            font-family: var(--font-brush);
            font-size: 20px;
            font-weight: 900;
            text-shadow: 2px 2px 0 #000;
          "
          x="50"
          y="185"
          dominant-baseline="hanging"
          text-anchor="end"
        >
          体术
        </text>
        <text
          fill="#ffffff"
          style="
            font-family: var(--font-brush);
            font-size: 20px;
            font-weight: 900;
            text-shadow: 2px 2px 0 #000;
          "
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
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Character, RadarStats } from '@/types'

  const props = defineProps<{
    character: Character
  }>()

  const getScore = (rank: string | undefined): number => {
    if (!rank) return 50

    const rankMap: Record<string, number> = {
      '■': 110,
      A: 90,
      B: 75,
      C: 60,
      D: 45,
      E: 20,
      X: 0,
    }

    if (rank.includes('■') || rank.includes('特')) return 110

    const firstChar = rank.charAt(0).toUpperCase()
    return rankMap[firstChar] ?? 60
  }

  const radarPoints = computed(() => {
    if (!props.character || !props.character.radar) return ''

    const stats: RadarStats = props.character.radar
    const center = { x: 100, y: 100 }
    const maxRadius = 80

    const scores = [
      getScore(stats.cursed_energy),
      getScore(stats.technique),
      getScore(stats.domain),
      getScore(stats.talent),
      getScore(stats.physical),
      getScore(stats.intellect),
    ]

    const angles = [240, 300, 0, 60, 120, 180]

    const points = scores.map((score, index) => {
      const angleRad = angles[index]! * (Math.PI / 180)
      const radius = (score / 100) * maxRadius
      const x = center.x + radius * Math.cos(angleRad)
      const y = center.y + radius * Math.sin(angleRad)
      return `${x},${y}`
    })

    return points.join(' ')
  })
</script>

<style scoped>
  .stats-row {
    display: flex;
    flex-shrink: 0;
    gap: 0;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 700px;
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
    font-size: 20px;
    color: #888;
    text-align-last: justify;
  }

  .stat-val {
    font-family: var(--font-brush);
    font-size: 28px;
    color: white;
    white-space: nowrap;
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
    margin-right: 0;
  }
</style>
