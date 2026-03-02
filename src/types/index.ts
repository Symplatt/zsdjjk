// 定义六维图的数据结构
export interface RadarStats {
  cursed_energy: string
  technique: string
  domain: string
  talent: string
  physical: string
  intellect: string
}

// 定义基础信息结构
export interface BasicInfo {
  grade: string
  technique: string
  affiliation: string
  domain: string
}

// 定义角色总表结构
export interface Character {
  id: string
  name: string
  color: string
  avatar: string
  info: BasicInfo
  radar: RadarStats
  'technique-brief': string
  'domain-brief': string
}