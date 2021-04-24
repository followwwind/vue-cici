import Vue from 'vue'
import Router from 'vue-router'
import {getToken, getUser} from '@/utils/store';
import Map from '@/pages/Map'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/app/index'
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: () => import('@/pages/HelloWorld'), 
      hidden: true
    },
    {
      path: '/404',
      component: () => import('@/pages/errorPage/404'), 
      name: '404',
      hidden: true
    },
    {
      path: '/401',
      component: () => import('@/pages/errorPage/401'), 
      name: '401',
      hidden: true
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/Register'),
    },
    {
      path: '/map',
      name: 'Map',
      component: Map, 
      // hidden: true
    },
    {
      path: '/app',
      // name: 'Layout',
      component: () => import('@/pages/Layout'),
      // meta: {requireAuth: true},
      children: [
        {
          path: '/',
          redirect: '/app/index'
        },
        {
          path: '/app/index',
          name: 'Index',
          component: () => import('@/pages/user/Index'), 
          hidden: true
        },
        {
          path: '/app/setting',
          name: 'Info',
          component: () => import('@/pages/user/Setting'), 
          hidden: true
        },
        // {
        //   path: '/app/order',
        //   name: 'Order',
        //   component: () => import('@/pages/user/Order'), 
        //   hidden: true
        // },
        // {
        //   path: '/app/hotel/:id',
        //   name: 'Hotel',
        //   component: () => import('@/pages/user/Info'), 
        //   hidden: true
        // },
        // {
        //   path: '/app/menu/:id',
        //   name: 'Menu',
        //   component: () => import('@/pages/user/Menu'), 
        //   hidden: true
        // }
      ]
    },
    {
      path: '/admin',
      // name: 'Layout',
      component: () => import('@/pages/AdminLayout'),
      meta: {requireAuth: true},
      children: [
        {
          path: '/',
          redirect: '/admin/user'
        },
        {
          path: '/admin/user',
          name: 'User',
          component: () => import('@/pages/admin/User'), 
          hidden: true
        },
        {
          path: '/admin/userPermission',
          name: 'userPermission',
          component: () => import('@/pages/admin/UserPermission'), 
          hidden: true
        },
        {
          path: '/admin/learn',
          name: 'learn',
          component: () => import('@/pages/admin/Learn'), 
          hidden: true
        },
        {
          path: '/admin/category',
          name: 'category',
          component: () => import('@/pages/admin/Category'), 
          hidden: true
        },
        {
          path: '/admin/knowledge',
          name: 'knowledge',
          component: () => import('@/pages/admin/Knowledge'), 
          hidden: true
        },
        {
          path: '/admin/knowComment',
          name: 'knowComment',
          component: () => import('@/pages/admin/KnowComment'), 
          hidden: true
        },
        {
          path: '/admin/question',
          name: 'question',
          component: () => import('@/pages/admin/Question'), 
          hidden: true
        },
        {
          path: '/admin/questionComment',
          name: 'questionComment',
          component: () => import('@/pages/admin/QuestionComment'), 
          hidden: true
        },
        {
          path: '/admin/info',
          name: 'Info',
          component: () => import('@/pages/common/Info'), 
          hidden: true
        }
      ]
    },
    // {
    //   path: '/hotel',
    //   // name: 'Layout',
    //   component: () => import('@/pages/HotelLayout'),
    //   meta: {requireAuth: true},
    //   children: [
    //     {
    //       path: '/',
    //       redirect: '/hotel/room'
    //     },
    //     {
    //       path: '/hotel/room',
    //       name: 'Room',
    //       component: () => import('@/pages/hotel/Room'), 
    //       hidden: true
    //     },
    //     {
    //       path: '/hotel/comment',
    //       name: 'Comment',
    //       component: () => import('@/pages/hotel/Comment'), 
    //       hidden: true
    //     },
    //     {
    //       path: '/hotel/order',
    //       name: 'Order',
    //       component: () => import('@/pages/hotel/Order'), 
    //       hidden: true
    //     },
    //     {
    //       path: '/hotel/menuOrder',
    //       name: 'MenuOrder',
    //       component: () => import('@/pages/hotel/MenuOrder'), 
    //       hidden: true
    //     },
    //     {
    //       path: '/hotel/menu',
    //       name: 'Menu',
    //       component: () => import('@/pages/hotel/Menu'), 
    //       hidden: true
    //     },
    //     {
    //       path: '/hotel/money',
    //       name: 'Money',
    //       component: () => import('@/pages/hotel/Money'), 
    //       hidden: true
    //     },
    //     {
    //       path: '/hotel/info',
    //       name: 'Info',
    //       component: () => import('@/pages/common/Info'), 
    //       hidden: true
    //     },
    //     {
    //       path: '/hotel/setting',
    //       name: 'Setting',
    //       component: () => import('@/pages/hotel/Setting'), 
    //       hidden: true
    //     }
    //   ]
    // },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)){  // 判断该路由是否需要登录权限
    // let token = getToken();
    let token = 'cici';
    let user = getUser();
    if (user && token) {
      next();
    }else {
      next({ path: '/login' });
    }
  }else {
    next();
  }
});

export default router;
