/**
 * vue2.0 中就是一个构造函数 class
 * 
 */

import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./render"

function Vue(options) {
  // 用户new Vue的时候, 调用 _init 方法进行初始化
  this._init(options)
}

/**
 * 可以拆分逻辑到不同的文件中
 * 更利于代码维护, 这就是模块化的概念
 * 主逻辑非常小,且清晰
 */
initMixin(Vue);         // 扩展初始化方法
lifecycleMixin(Vue);    // 扩展_update方法
renderMixin(Vue);       // 扩展_render方法

export default Vue