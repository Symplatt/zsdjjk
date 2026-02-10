// src/utils/assets.ts

// 把 baseUrl 的获取逻辑放进来
const baseUrl = import.meta.env.BASE_URL

// 获取图片路径
export const resolvePath = (path: string) => {
  if (!path) return ''
  // 如果已经是网络内容，直接返回
  if (path.startsWith('http') || path.startsWith('https')) return path
  // 去掉开头的 / 防止双斜杠
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  return `${baseUrl}${cleanPath}`
}