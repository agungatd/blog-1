import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import CreateArticle from './views/CreateArticle.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          name: 'detailArticle',
          path: '/home/:id',
          component: () => import(/* webpackChunkName: "about" */ './components/mainContaint.vue')
        }
      ]
    },
    {
      path: '/profile',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Profile.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Chat.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/article',
      name: 'createArticle',
      component: CreateArticle
    }
  ]
})
