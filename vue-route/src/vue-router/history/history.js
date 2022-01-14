import History from "./base";

export default class BrowserHistory extends History {
  constructor(router) {
    super(router)
  }
  setupListener() {
    // 监听popstate事件, 进行路由跳转
    window.addEventListener('popstate', () => {
      // 监听的是浏览器的前进后退
      this.transitionTo(this.getCurrentLocation())
    })
  }
  getCurrentLocation() {
    return window.location.pathname
  }
  push(location) {
    // 跳转时采用 H5 的 api, 这里路径切换无法触发popstate, 因此需要使用回调进行页面更新
    this.transitionTo(location, () => {
      window.history.pushState({}, null/* 标题 */, location)
    }); // 可以去匹配视图
  }
}