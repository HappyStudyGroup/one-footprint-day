import { mergeOptions } from "../util";

export function initGlobalAPI(Vue) {
  Vue.options = {}; // 用来存储全局的配置
  Vue.mixin = function(mixin) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
  Vue.options._base = Vue;    // Vue的构造函数
  Vue.options.components = {} // 用来存放组件的定义
  Vue.component = function (id, definition) {
    definition.name = definition.name || id;
    definition = this.options._base.extend(definition);  // 通过对象产生一个构造函数
    this.options.components[id] = definition;
  }
  let cid = 0;
  Vue.extend = function(options) { // 子组件初始化时会 new VueComponent(options)
    const Super = this;
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    // 继承Vue, 保证内部this 都是指向Vue
    Sub.cid = cid++;
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.component = Super.component;
    // 每次声明组件，都会把父级的定义放在自己的身上
    Sub.options = mergeOptions(Super.options, options);
    return Sub;
  }
}

/**
 * 1. Vue.component => Vue.extend方法 => 生成子类的构造函数
 * 2. 如果组件添加了 data.hook.init componentOptions 里面放的 Ctor
 * 3. 创建真实节点时 会调用 init 钩子 new Ctor({}).$mount() 内部会再给组件添加一个watcher.
 * 会将渲染的节点放到当前实例上
 */