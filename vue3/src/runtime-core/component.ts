import { isFunction } from "../shared/index";

export function createComponentInstance(vnode) {
  const instance = {
    type: vnode.type,
    props: {},
    vnode,
    render: null,
    setupState: null,
    isMounted: false, // 默认组件没有挂载
  }
  return instance
}

export const setupComponent = function (instance) {
  // 1) 源码中会对属性进行初始化

  // 2) 会对插槽进行初始化

  // 3) 调用setup方法
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type; // 组件的虚拟节点
  const { setup } = Component;
  if(setup) {
    const setupResult = setup(); // 获取setup返回值
    // 判断返回值类型, 可能是 function || object
    handleSetupResult(instance, setupResult);
  }

}

function handleSetupResult(instance, setupResult) {
  if(isFunction(setupResult)) {
    instance.render = setupResult; // 获取render方法
  }else {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type; // 组件的虚拟节点
  if(Component.render) {
    instance.render = Component.render; // 默认render的优先级高于setup返回的render
  }else if(!instance.render) {
    // compile(Component.template) 编辑成render函数
  }
  // vue3兼容vue2的属性 data computed watch

  // applyOptions(), vue2和vue3中的setup返回的结果做合并操作
}