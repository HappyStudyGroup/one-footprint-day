import {compileToFunctions} from "./compiler/index";
import {mountComponent} from "./lifecycle.js";
import {initState} from "./state";
import {nextTick} from "./util/index";

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options; // 实例上有个属性 $options, 表示用户传入的所有属性

    // 初始化状态
    initState(vm);
    if(vm.$options.el) { // 数据可以挂载到页面
      vm.$mount(vm.$options.el);
    }
  }
  Vue.prototype.$nextTick = nextTick;
  Vue.prototype.$mount = function(el) {
    el = document.querySelector(el);
    const vm = this;
    const options = vm.$options
    vm.$options.el = el;
    // 如果有render方法, 直接使用
    // 如果没有render, 有template
    // 没有render, 也没有template, 去找外部模板

    if(!options.render) {
      let template = options.template;
      if(!template && el) {
        // outerHTML火狐不兼容, 处理方法: 
        // const ele = document.createElement('div')
        // ele.appendChild(document.querySelector('#app'))
        // template = ele.innerHTML
        template = el.outerHTML;
      }
      // 如何将模板编译成render函数
      options.render = compileToFunctions(template);
    }

    mountComponent(vm, el); // 组件挂载
  }
}

