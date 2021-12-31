import { isObject, isReservedTag } from '../util'


export function renderMixin(Vue) {
  Vue.prototype._c = function(...args) { // 创建元素的虚拟节点
    return createElement(this, ...args)
  }
  Vue.prototype._s = function(val) { // 转换成字符串
    return val === null ? '' : (typeof val === 'object') ? JSON.stringify(val) : val
  }
  Vue.prototype._v = function(text) { // 创建文本的虚拟节点
    return createTextVnode(this, text)
  }

  Vue.prototype._render = function () {
    const vm = this;
    let render = vm.$options.render;  // 获取编译后的render方法
    let vnode = render.call(vm);      // 调用render返回虚拟节点
    return vnode
  }
}

/**
 * @description 创建组件的虚拟节点
 * @param {*} vm 
 * @param {*} tag 组件名
 * @param {*} data 组件属性
 * @param {*} key 组件的key
 * @param {*} children 组件的子元素
 * @param {*} Ctor 组件这个类
 */

export function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

export function createElement(vm, tag, data = {}, ...children) {
  // 组件产生虚拟节点需要把组件的构造函数传入
  // new Ctor().$mount()
  // 根据tag名, 需要判断是不是组件
  if(isReservedTag(tag)) {
    return vnode(vm, tag, data, data.key, children, undefined)
  }else {
    // 组件
    let Ctor = vm.$options.components[tag];
    // 对象(vm.components内部使用)或函数(Vue.component)
    // children就是组件的插槽
    return createComponent(vm, tag, data, data.key, children, Ctor)
  }
}

function createComponent(vm, tag, data, key, children, Ctor) {
  const baseCtor = vm.$options._base
  if(isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }
  // 给组件增加生命周期
  data.hook = {
    init(vnode) {
      // 调用子组件的构造函数
      let child = vnode.componentInstance = new vnode.componentOptions.Ctor({})
      child.$mount(); // 手动挂载
    }
  }
  // 组件的虚拟节点拥有hook和当前组件的componentOptions， 其中存放了组件的构造函数
  return vnode(vm, `vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, {
    Ctor,
    // children
  })
}

export function createTextVnode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}
