import { effect } from "../reactivity/index";
import { ShapeFlags } from "../shared/index";
import { createAppAPI } from "./apiCreateApp"; // 用户调用的createApp方法
import { createComponentInstance, setupComponent } from "./component";
import { getSequence } from './sequence'

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
  const mountElement = (vnode, container, anchor) => {
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
    hostInsert(el, container, anchor);
  }
  const mountChildren = (children, container) => {
    for(let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }
  const patchElement = (n1, vnode, container) => {
    // 如果n1, vnode 类型一样, 表明我的节点需要复用,直接改属性
    let el = vnode.el = n1.el;
    const oldProps = n1.props || {};
    const newProps = vnode.props || {};
    // 比对前后属性的元素差异
    patchProps(oldProps, newProps, el);
    patchChildren(n1, vnode, el);
  }
  const patchProps = (oldProps, newProps, el) => {
    if(oldProps !== newProps) {
      // 新的属性需要覆盖老的
      for(const key in newProps) {
        const prev = oldProps[key];
        const next = newProps[key];
        if(prev !== next) {
          hostPatchProp(el, key, prev, next);
        }
      }
      // 老的有的属性 新的没有, 删除老的属性
      for(const key in oldProps) {
        if(!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    }
  }
  const patchKeyChildren = (c1, c2, el) => {
    console.log('diff算法->开始')
    // 内部优化策略
    // abc    i = 0;
    // abde
    let i = 0;
    let e1 = c1.length - 1; // 老儿子的最后一项的索引
    let e2 = c2.length - 1; // 新儿子的最后一项的索引
    while (i <= e1 && i <= e2) { // 头指针, 从前往后比
      const n1 = c1[i];
      const n2 = c2[i];
      if(isSameVnodeType(n1, n2)) {
        patch(n1, n2, el); // 会递归比对子元素
      }else {
        break;
      }
      i++;
    }
    //  abc
    // dabc
    while(i <= e1 && i <= e2) { // 尾指针, 从后往前比
      const n1 = c1[e1];
      const n2 = c2[e2];
      if(isSameVnodeType(n1, n2)) {
        patch(n1, n2, el); // 会递归比对子元素
      }else {
        break;
      }
      e1--;
      e2--;
    }

    // 只考虑 元素新增和删除的情况
    // abc => abcd (i = 3 / e1 = 2 / e2 = 3)
    // abc => dabc (i = 0 / e1 = -1 / e2 = 0)
    
    // 只要 i > e1, 表示新增属性
    if(i > e1) {
      if(i <= e2) { // 表示有新增的部分
        // 先根据 e2 取他的下一个元素 喝 数组长度进行比较
        const nextPos = e2 + 1;
        const anchor = nextPos < c2.length ? c2[nextPos].el : null;
        while(i <= e2) {
          patch(null, c2[i], el, anchor);
          i++;
        }
      }
    }else if(i > e2) { // 删除
      // abcd => abc (i = 3, e1 = 3, e2 = 2)
      while(i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    }else {
      // 无规律的情况
      // ab {cde} fg => ab {dech} fg (i = 2, s1 = 2, e1 = 4, s2 = 2, e2 = 5)
      const s1 = i;
      const s2 = i;
      // 新的索引 和 key 做成一个映射表
      const keyToNewIndexMap = new Map();
      for(let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        keyToNewIndexMap.set(nextChild.key, i);
      }
      console.log(keyToNewIndexMap); // {'D' => 2, 'E' => 3, 'C' => 4, 'H' => 5}
      // [0, 0, 0, 0] => [3, 4, 2, 0] ,剩余的0表示新增
      const toBePatch = e2 - s2 + 1;
      const newIndexToOldMapIndex = new Array(toBePatch).fill(0);
      // 只是做了相同属性的diff, 位置还没有变化
      for(let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        let newIndex = keyToNewIndexMap.get(prevChild.key); // 获取新的索引
        if(newIndex === undefined) {
          // 老的有, 新的没有, 直接删除老的节点
          hostRemove(prevChild.el)
        }else {
          // i + 1, 防止从第0个开始, 这样会重复渲染, 为0的表示新增
          newIndexToOldMapIndex[newIndex - s2] = i + 1;
          patch(prevChild, c2[newIndex], el)
        }
      }

      // 最长递增子序列 [0, 1] => [0, 1, 2, 3], j 当前序列的最后一项的索引
      let increasingIndexSequence = getSequence(newIndexToOldMapIndex);
      let j = increasingIndexSequence.length - 1;
      console.log(newIndexToOldMapIndex, increasingIndexSequence, j)

      for(let i = toBePatch - 1; i >= 0; i--) {
        const nextIndex = s2 + i; // {edch} 从后往前插, 找到 h 的索引
        const nextChild = c2[nextIndex]; // 找到 h
        let anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null; // 找到当前元素的下一个元素, 当前元素插入到它之前
        if(newIndexToOldMapIndex[i] === 0) { // 表示要新增的元素
          patch(null, nextChild, el, anchor);
        }else {
          // 根据参照物, 把元素插入对应位置即可, 但是dom操作太多,性能不佳(有些节点可以不动, 尽量少的dom操作)
          if(j < 0 || i !== increasingIndexSequence[j]) {
            // 没有考虑有些节点不动的情况
            hostInsert(nextChild.el, el, anchor);
          }else {
            j--;
          }
        }
      }
      console.log('diff算法->结束')
    }

  }
  const patchChildren = (n1, vnode, el) => {
    const c1 = n1.children;
    const c2 = vnode.children;
    const prevShapeFlag = n1.shapeFlag;     // 老的元素类型
    const shapeFlag = vnode.shapeFlag;  // 新的元素类型
    // 老的是文本, 新的是文本 => 覆盖老的
    // 老的是数组, 新的是文本 => 覆盖老的
    // 老的是文本, 新的是数组 => 老的节点移除老的文本, 生成新的节点, 然后插入
    // 老的是数组, 新的是数组 => diff算法
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) { // 新的是文本元素, 直接覆盖
      if(c2 !== c1) {
        hostSetElementText(el, c2);
      }
    }else {
      // 新的是数组
      if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // diff 算法
        patchKeyChildren(c1, c2, el);
      }else {
        // 老的可能是文本
        if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 移除老的文本
          hostSetElementText(el, '');
        }
        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 把新的插入
          for(let i = 0; i < c2.length; i++) {
            patch(null, c2[i], el);
          }
        }
      }
    }
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
        console.log('更新逻辑')
        patch(prev, next, container);
      }
    })
  }
  const upDateComponent = (n1, vnode, container) => {

  }
  const processElement = (n1, vnode, container, anchor) => {
    if(n1 === null) {
      mountElement(vnode, container, anchor)
    }else {
      // 比较两个虚拟节点
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
  const isSameVnodeType = (n1, n2) => {
    return n1.type === n2.type && n1.key === n2.key
  }
  const patch = (n1, vnode, container, anchor = null) => {
    let { shapeFlag } = vnode;
    /* & 按位与: 都是1才是1
     * 1100 & 0001 => 0000 => 0
     * 1100 & 1010 => 1000 => 8
    */
    if(n1 && !isSameVnodeType(n1, vnode)) {
      hostRemove(n1.el); // 删除老节点, 老节点的虚拟节点上对应着真实节点
      n1 = null;
    }
    if(shapeFlag & ShapeFlags.ELEMENT) {
      // 元素
      processElement(n1, vnode, container, anchor);
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


