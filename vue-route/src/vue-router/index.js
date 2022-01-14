import { createMatcher } from './create-matcher';
import HashHistory from './history/hash';
import BrowserHistory from './history/history';
import { install, _Vue } from './install'
// import动态引入, 语法每次拿值时,都是通过接口获取值, 所以可以拿到最新的值

// 路由的核心原则: 根据路径返回对应的组件
export default class VueRouter {
  constructor(options) {
    // 根据用户的配置,生成一个映射表,稍后跳转时根据路径找到组件来进行渲染
    
    // 创建匹配器后, 核心方法就是匹配
    this.matcher = createMatcher(options.routes || []);
    this.beforeEachHooks = [];
    // 根据当前的mode,创建不同的 history 管理策略
    switch (options.mode) {
      case 'hash':
        this.history = new HashHistory(this)
        break;
      case 'history':
        this.history = new BrowserHistory(this)
        break;
      default:
        break;
    }
  }
  match(location) {
    return this.matcher.match(location);
  }
  push(location) {
    this.history.push(location)
  }
  init(app) {
    // 路由初始化, app 是 vue 根实例
    // 初始化后先根据路径做一次匹配, 后续根据hash值变化再次匹配
    const history = this.history; // history 实例

    const setupListener = () => { // 切片编程
      history.setupListener(); // 监听hashchange
    }
    history.transitionTo(history.getCurrentLocation(), setupListener); // 跳转方法
    history.listen((route) => { // history.current变化了, _route也需要更新,因为是响应式,所以会触发页面更新
      app._route = route;
    })
  }
  beforeEach(fn) {
    this.beforeEachHooks.push(fn)
  }
}


VueRouter.install = install;