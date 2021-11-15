import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    children: [
      {
        path: 'home',
        name: 'Home',
        component:() =>import('../views/Home.vue')
      },
      {
        name: 'Menu',
        path: 'menu',
        component:() =>import('../views/Menu.vue')
      },
      {
        path: 'shopBag',
        name: 'ShopBag',
        component:() =>import('../views/ShopBag.vue')
      },
      {
        path: 'my',
        name: 'My',
        component:() =>import('../views/My.vue')
      },
    ]
  },
  {
    path:'/detail/:pid',
    name:'Detail',
    component:() =>import('../views/Detail.vue')
  },
  //路由重定向
  {
    path:'*',
    redirect:{name:'Home'}
  }


]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
