import RouterLink from './components/router-link'
import RouterView from './components/router-view'

export let _Vue

// 需要将install方法单独进行拆分
export function install (Vue, options) {
  _Vue = Vue
  // 需要将当前的根实例提供的router属性,共享给所有子组件

  // 所有子组件初始化的时候, 都会去调用Vue.extend Vue.options
  // 渲染逻辑 => 根组件->父组件->儿组件->孙子组件...
  Vue.mixin({
    beforeCreate() { // 每个组件都会执行这个方法
      // 获取到每个子组件的实例, 给实例添加属性
      if(this.$options.router) {
        this._routerRoot = this; // 把根实例挂载到_routerRoot上
        this._router = this.$options.router; // 路由的实例 new VueRouter
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current); // 定义_route成响应式

      }else {
        // this._routerRoot 指向了当前跟组件的实例
        this._routerRoot = this.$parent && this.$parent._routerRoot
        // this._router = this._routerRoot._router
      }
    }
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route // history.current对象, 里面都是属性
    }
  })
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router // 当前router实例, 都是addRoutes, match, push, ... 方法
    }
  })
  // 注册 RouterView, RouterLink 全局组件
  Vue.component('router-link', RouterLink)
  Vue.component('router-view', RouterView)
}