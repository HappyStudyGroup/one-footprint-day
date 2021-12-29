import { initGlobalAPI } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"

function Vue(options) {
  /**
   * initMixin()方法会在Vue原型上添加_init()方法
   * _init()方法做了几件事:
   * 1) 将全局的options合并到自己身上
   * 2) 调用beforeCreate生命周期钩子
   * 3) initState(vm)初始化data/methods/props/watch/computed
   * 4) 调用ceated生命周期钩子
   * 5) 调用$mount方法 - 这个方法只有创建根实例时会调用,子组件是手动调用$mount()方法
   */
  this._init(options)
}

/**
 * 可以拆分逻辑到不同的文件中
 * 更利于代码维护, 这就是模块化的概念
 * 主逻辑非常小,且清晰
 */
initMixin(Vue);         // 扩展初始化方法 _init() 和 $mount()
lifecycleMixin(Vue);    // 扩展_update方法
renderMixin(Vue);       // 扩展_render方法

initGlobalAPI(Vue)      // 混合全局的api

export default Vue