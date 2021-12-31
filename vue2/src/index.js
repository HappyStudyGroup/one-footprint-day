import { compileToFunctions } from "./compiler/index"
import { initGlobalAPI } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"
import { createElm, patch } from './vdom/patch'

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

// let vm1 = new Vue({
//   data() {
//     return {name: 'zf'}
//   }
// })

// let render1 = compileToFunctions(`<div id="a" a="1" >
//   <li key="A" style="background:red;">A</li>
//   <li key="B" style="background:yellow;">B</li>
//   <li key="C" style="background:blue;">C</li>
//   <li key="D" style="background:green;">D</li>
//   <li key="F" style="background:gray;">F</li>
// </div>`) // 将模板编译成render函数
// let oldVnode = render1.call(vm1) // 老的虚拟节点


// let el = createElm(oldVnode)
// document.body.appendChild(el)

// let vm2 = new Vue({
//   data() {
//     return {name: 'jw'}
//   }
// })

// let render2 = compileToFunctions(`<div id="b" b="2">
//   <li key="N" style="background:purple;">N</li>
//   <li key="A" style="background:red;">A</li>
//   <li key="C" style="background:blue;">C</li>
//   <li key="B" style="background:yellow;">B</li>
//   <li key="E" style="background:pink;">E</li>
//   <li key="D" style="background:green;">D</li>
// </div>`) // 将模板编译成render函数
// let newVnode = render2.call(vm2) // 老的虚拟节点

// setTimeout(() => {
//   patch(oldVnode, newVnode)
// }, 1000)

export default Vue