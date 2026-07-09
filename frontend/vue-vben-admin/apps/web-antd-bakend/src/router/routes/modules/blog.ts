import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:file-text',
      order: 200,
      title: '文章管理',
    },
    name: 'BlogArticle',
    path: '/blog/article',
    component: () => import('#/views/blog/article/list.vue'),
  },
];

export default routes;
