<template>
  <div class="jjk-body">
    <div ref="captureNode" class="capture-wrapper" v-if="char">
      <div class="layout-grid">
        <div class="portrait-column">
          <div class="portrait-frame">
            <img :src="resolvePath(char?.avatar || '')" :alt="char?.name" />
          </div>
        </div>

        <div class="info-column">
          <header class="info-header">
            <span class="sub-name">{{ char?.id }}</span>
            <h1 class="character-name">{{ char?.name }}</h1>
          </header>

          <CharacterStats :character="char" />

          <div class="bio-section">
            <div class="bio-text">
              <blockquote>
                <h6>术式：{{ char?.info.technique }}</h6>
                <p class="pre-wrap">{{ char?.['technique-brief'] }}</p>
              </blockquote>
              <blockquote>
                <h6>领域：{{ char?.info.domain }}</h6>
                <p class="pre-wrap">{{ char?.['domain-brief'] }}</p>
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
  import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
  import { useRoute } from 'vue-router'
  import * as htmlToImage from 'html-to-image'

  import charactersData from '@/data/characters.json'
  import type { Character } from '@/types'
  import { resolvePath } from '@/utils/assets'

  const route = useRoute()

  // 定义截图目标的DOM节点引用
  const captureNode = ref<HTMLElement | null>(null)

  // 根据路由参数匹配对应的角色数据
  const char = computed<Character | undefined>(() => {
    const id = route.params.id as string
    return (charactersData as Character[]).find((c) => c.id === id)
  })

  // 将指定DOM节点转换为PNG图片并触发下载
  const takeScreenshot = async () => {
    if (!captureNode.value || !char.value) return

    try {
      const dataUrl = await htmlToImage.toPng(captureNode.value, {
        quality: 1,
        backgroundColor: '#0a0a0a',
        pixelRatio: 2,
      })

      const link = document.createElement('a')
      link.download = `${char.value.name}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('档案生成失败:', error)
    }
  }

  // 监听组合键实现快捷截图功能
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.altKey && event.key.toLowerCase() === 's') {
      event.preventDefault()
      takeScreenshot()
    }
  }

  // 组件挂载时注册键盘事件监听
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  // 组件卸载前移除键盘事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
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
    max-width: 1200px;
    height: 100vh;
    padding: 5vh 30px 8vh;
  }

  .layout-grid {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 45% 1fr;
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
    border-radius: 5px;
    filter: grayscale(20%) contrast(110%) brightness(95%);
    transition: filter 0.3s ease;
  }

  .portrait-frame:hover img {
    filter: grayscale(0%) contrast(110%);
  }

  .info-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    overflow: hidden;
  }

  .info-header,
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
    font-size: 60px;
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
    font-size: 20px;
    font-weight: bold;
    color: var(--jjk-accent);
    text-transform: uppercase;
    letter-spacing: 0.3em;
  }

  .bio-section {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    min-height: 0;
  }

  .bio-text {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: space-between;
  }

  .bio-text p {
    margin: 0 0 1.2em;
    font-size: 22px;
    line-height: 1.8;
    color: #ccc;
    text-align: justify;
  }

  .pre-wrap {
    white-space: pre-wrap;
  }

  blockquote {
    padding: 0.5em 1em 0.1em;
  }

  .bio-text blockquote {
    margin: 0;
    color: #ddd;
    background: rgb(163 0 0 / 10%);
    border-left: 4px solid var(--jjk-accent);
  }

  .bio-text blockquote h6 {
    margin: 0 0 0.5em;
    font-family: var(--font-brush);
    font-size: 1.4em;
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
</style>
