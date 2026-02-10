import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // 使用 Hash 模式，避免部署时的路径问题
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { keepAlive: true }
    },
    {
      // 修改详情页路由配置
      path: '/character/:id',
      name: 'character-detail',
      component: () => import('@/views/CharacterDetail.vue'),
      // 添加这两个 meta 字段
      meta: {
        hideNavbar: true, // 隐藏导航栏
        hideFooter: true  // 隐藏 Footer
      }
    },
    {
      // 匹配所有未知路径，跳转到首页或404
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router