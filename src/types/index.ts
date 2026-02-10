// 定义番外篇的数据结构
export interface ExtraStory {
  title: string
  content: string
}

// 定义六维图的数据结构
export interface RadarStats {
  cursed_energy: string // 咒力
  technique: string     // 术式
  domain: string        // 领域
  talent: string        // 天赋
  physical: string      // 体术
  intellect: string     // 智慧
}

// 定义基础信息结构
export interface BasicInfo {
  grade: string       // 等级
  technique: string   // 术式
  affiliation: string // 所属
  domain: string      // 领域
}

// 定义角色总表结构
export interface Character {
  id: string
  name: string
  color: string
  avatar: string
  info: BasicInfo
  radar: RadarStats
  bio: string
  extras: ExtraStory[]
}