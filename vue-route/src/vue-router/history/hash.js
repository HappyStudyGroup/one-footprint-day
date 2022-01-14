import History from "./base";

function ensureSlash() {
  if(window.location.hash) {
    return
  }
  window.location.hash = '/'
}

function getHash() {
  return window.location.hash.slice(1)
}

export default class HashHistory extends History {
  constructor(router) {
    super(router)
    // 默认hash模式需要加 /#/
    ensureSlash();
  }
  setupListener() {
    // hashchange的性能不如popState好用, 监听浏览器历史纪录的变化
    window.addEventListener('hashchange', () => {
      // 根据当前hash值去匹配对应的组件
      this.transitionTo(getHash())
    })
  }
  getCurrentLocation() {
    return getHash()
  }
  push(location) {
    window.location.hash = location
  }
}