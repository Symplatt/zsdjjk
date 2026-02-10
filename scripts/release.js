// scripts/release.js
// 一键执行 git add . && git commit -m "xxx" && git push && npm run deploy

import { execSync } from 'child_process'

const msg = process.argv.slice(2).join(' ').trim()

if (!msg) {
  console.error('❌ 请提供 commit message')
  process.exit(1)
}

try {
  console.log('🔹 git add .')
  execSync('git add .', { stdio: 'inherit' })

  console.log(`🔹 git commit -m "${msg}"`)
  execSync(`git commit -m "${msg}"`, { stdio: 'inherit' })

  console.log('🔹 git push')
  execSync('git push', { stdio: 'inherit' })

  console.log('🔹 npm run deploy')
  execSync('npm run deploy', { stdio: 'inherit' })

  console.log('✅ 全流程完成')
} catch (err) {
  console.error('❌ 执行失败')
  process.exit(1)
}
