import {compileToFunctions} from "./compiler/index";
import {callHook, mountComponent} from "./lifecycle.js";
import {initState} from "./state";
import {mergeOptions, nextTick} from "./util";

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = mergeOptions(vm.constructor.options, options);
    // vm.$options = options; // 实例上有个属性 $options, 表示用户传入的所有属性
    // 初始化状态
    callHook(vm, 'beforeCreated')
    initState(vm);
    callHook(vm, 'created')
    if(vm.$options.el) { // 数据可以挂载到页面
      vm.$mount(vm.$options.el);
    }
  }
  // Vue.prototype.$nextTick = nextTick;
  Vue.prototype.$mount = function(el) {
    el = el && document.querySelector(el);
    const vm = this;
    const options = vm.$options
    vm.$el = el;
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
    callHook(vm, 'beforeMount')
    mountComponent(vm, el); // 组件挂载
  }
}


// 1. vm.$mount(el) - 查找模板并转换然后生成真实DOM渲染到el中
// 2. complieToFunctions(template) - 将template模板先转换成AST抽象语法树，然后再生成虚拟DOM, 最后通过New Function()和with()函数生成render()函数
//    2.1) parseHTML(template) - 将模板转换成AST抽象语法树
//    2.2) generate(ast) - 将AST转换生成虚拟DOM
// 3. mountComponent(vm, el) - 将虚拟DOM生成真实DOM并渲染到el中
// 4. vm._update() 初次渲染DOM或更新DOM 



// ------------- 组件的生成 ------------------
// 1. 组件就是一个继承了Vue类的子类
// 2. 第一次渲染，生成真实DOM时(createElm)，模板中可能会有组件的标签, 比如： <my-component></my-component>
// 3. 递归调用createElm(vnode), createElm(vnode)中调用createComponent(vnode)
// 4. createComponent(vnode)中调用组件中自定义的hook中的init()方法
// 5. init()方法调用组件原型上继承的$mount()
// 6. 调用组件继承的 $mount())方法, 将组件的template编译转化
// 7. 调用mountComponent(vm, el) el为空，说明只是创建组件template的虚拟DOM
// 8. vm._update(vm._render()) - 将组件的template的虚拟DOM生成真实DOM
// 9. vm.$el = patch(vm.$el, vnode) - vm.$el不存在, 说明只是生成虚拟DOM
