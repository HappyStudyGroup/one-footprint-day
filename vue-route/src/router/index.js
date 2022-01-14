import Vue from 'vue'
import VueRouter from '@/vue-router'
import Home from '../views/Home.vue'

/** 第一个参数就是Vue的构造函数, 为了保证 vue 版本保持一致
Vue.use = function (plugin, options) {
  plugin.install(this, options)
}
*/
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
      { path: 'a', component: {
          render(h) { // html + js
            return <h1>hello a</h1>
            // return h(`div`, null, 'hello a')
          }
        }
      },
      {
        path: 'b', component: { render(h) { return <h1>hello b</h1> } }
      },
      {
        path: '/c', component: { render(h) { return <h1>hello c</h1> } }
      }
    ]
  }
]

// vueRouter 是一个构造函数, 前端路由实现 1.hash 2.history
// 当前都叫 spa 应用, 路径切换可以重新渲染组件(不刷新页面)
// hash 特点丑, 兼容性好, location.hash = 'xx'; 监听 'hashchange'
// history 漂亮和正常路径一样, 但需要服务端支持, history.pushState = {{}, null, 'xx'}; 监听 'popState'
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    console.log(1);
    next()
  }, 1000)
})
router.beforeEach((to, from, next) => {
  setTimeout(() => {
    console.log(2);
    next()
  }, 1000)
})
export default router
