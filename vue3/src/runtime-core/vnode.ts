import { isArray, isObject, isString, ShapeFlags } from "../shared/index"

export function createVNode(type, props:any = {}, children = null) {
  // type 是什么类型?
  const shapeFlag = isString(type) ?
    ShapeFlags.ELEMENT :
    isObject(type) ?
    ShapeFlags.STATEFUL_COMPONENT : 0;

  const vnode = { // 虚拟节点可以表示dom结构, 也可以表示组件
    type,
    props,
    children,
    component: null, // 组件的实例
    el: null,        // 虚拟节点和真实节点做一个映射关系
    key: props.key,
    shapeFlag,       // vue3里面非常优秀的做法,代表: 虚拟节点类型--> ):元素, ):组件
  }

  if(isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN; // 如果在或的过程中有一个是1就是1,把两个数相加
  }else{
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }
  return vnode
}