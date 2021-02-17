import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载
const Login = () => import('views/login/Login.vue')
const Home = () => import('views/home/Home.vue')
const Welcome = () => import('views/home/childrenCpn/Welcome.vue')
const Users = () => import('views/home/childrenCpn/users/Users.vue')
const Rights = () => import('views/home/childrenCpn/permissionList/authority/Rights.vue')
const Roles = () => import('views/home/childrenCpn/permissionList/roles/Roles.vue')
const GoodsList = () => import('views/home/childrenCpn/goods/GoodsList.vue')
const GoodsCategory = () => import('views/home/childrenCpn/goods/GoodsCategory.vue')
const ClassificationParams = () => import('views/home/childrenCpn/goods/ClassificationParams.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome',component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/roles', component: Roles },
      { path: '/categories', component: GoodsCategory },
      { path: '/params', component: ClassificationParams },
      { path: '/goods', component: GoodsList }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转过来
  // next 是一个函数，表示放行
  // next() 放行， next('/login') 强制跳转登录页面
  if(to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  // 访问请求是否携带token 未携带跳转至login页面
  if(!tokenStr) return next('/login')
  next()
})

export default router
