import { effect } from "../reactivity/index";
import { ShapeFlags } from "../shared/index";
import { createAppAPI } from "./apiCreateApp"; // 用户调用的createApp方法
import { createComponentInstance, setupComponent } from "./component";

export function createRenderer(options) {
  // options是平台传过来的方法, 不同的平台可以实现不同的实现逻辑
  return baseCreateRenderer(options)
}

function baseCreateRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    setElementText: hostSetElementText,
    insert: hostInsert,
    remove: hostRemove
  } = options;
  const mountElement = (vnode, container) => {
    let { shapeFlag, props } = vnode;
    let el = vnode.el = hostCreateElement(vnode.type);
    // 创建儿子节点
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vnode.children)
    }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el)
    }
    if(props) {
      for(let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    hostInsert(el, container);
  }
  const mountChildren = (children, container) => {
    for(let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }
  const patchElement = (n1, vnode, container) => {

  }
  const mountComponent = (initialVnode, container) => {
    // 组件挂载逻辑 1:创建组件的实例; 2:找到组件的渲染方法; 3:执行render
    // 组件实例要记住当前组件的状态
    const instance = initialVnode.component = createComponentInstance(initialVnode);
    setupComponent(instance); // 找到组件的setup方法
    console.log(instance)

    // 调用render方法, 如果render方法中数据变化了, 重新调用render方法渲染

    setupRenderEffect(instance, initialVnode, container); // 给组件创建一个 effect用于渲染 === vue2中的watch
  }
  const setupRenderEffect = (instance, initialVnode, container) => {
    effect(function componentEffect() {
      if(!instance.isMounted) {
        // 渲染组件中的内容
        const subTree = instance.subTree = instance.render(); // 组件对应的渲染结果
        patch(null, subTree, container)
        instance.isMounted = true;
      }else {
        // 更新逻辑
        let prev = instance.subTree; // 上一次的渲染结果
        let next = instance.render();
        console.log(prev)
        console.log(next)
      }
    })
  }
  const upDateComponent = (n1, vnode, container) => {

  }
  const processElement = (n1, vnode, container) => {
    if(n1 === null) {
      mountElement(vnode, container)
    }else {
      patchElement(n1, vnode, container)
    }
  }
  const processComponent = (n1, vnode, container) => {
    if(n1 === null) {
      mountComponent(vnode, container)
    }else {
      upDateComponent(n1, vnode, container)
    }
  }
  const patch = (n1, vnode, container) => {
    let { shapeFlag } = vnode;
    /* & 按位与: 都是1才是1
     * 1100 & 0001 => 0000 => 0
     * 1100 & 1010 => 1000 => 8
    */
    if(shapeFlag & ShapeFlags.ELEMENT) {
      // 元素
      processElement(n1, vnode, container);
    }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // 组件
      processComponent(n1, vnode, container);
    }
  }
  const render = (vnode, container) => {
    // 将虚拟节点变成真实dom, 挂载到容器上
    patch(null, vnode, container)
  }
  return {
    createApp: createAppAPI(render)
  }
}