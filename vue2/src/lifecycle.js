import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch";

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this;
    // 首次渲染需要用虚拟节点更新真实dom


    // 初始化渲染的时候, 会创建新节点, 将老节点删掉
    // 第一次渲染完毕后, 拿到新的节点, 下次在渲染的时候替换上次渲染的结果
    vm.$options.el = patch(vm.$options.el, vnode);
  }
}

export function mountComponent(vm, el) {
  
  // 默认vue通过watcher进行渲染 = 渲染watcher(每一个组件都有一个渲染watcher)
  let updateComponent = () => {
    vm._update(vm._render()); // _render()返回虚拟节点, _update()将虚拟节点变成真实dom
  }

  new Watcher(vm, updateComponent, () => {}, true);  // updateComponent()

}