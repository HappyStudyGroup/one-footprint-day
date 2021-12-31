import { isSameVnode } from './index'

function createComponent(vnode) {
  let i = vnode.data;
  if((i = i.hook) && (i = i.init)) {
    /**
     * init()方法做了两件事:
     * 1) 创建实例,调用了_init()方法
     * 2) 手动调用$mount方法,将组件编译成了虚拟DOM
     */
    i(vnode);
  }
  if(vnode.componentInstance) { // 如果虚拟节点上有组件的实例，说明这个虚拟节点是组件
    return true
  }
  return false
}

export function createElm (vnode) {// 根据虚拟节点创建真实节点
  let { tag, children, data, key, text, vm } = vnode;
  
  if(typeof tag === 'string') {
    // 如果是组件，就根据组件创建出组件对应的真实节点
    if(createComponent(vnode)) {
      return vnode.componentInstance.$el
    }
    vnode.el = document.createElement(tag); // 用vue的指令时,可以通过vnode拿到真实dom
    updateProperties(vnode);
    children.forEach(child => { // 如果有儿子节点, 就递归
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

export function patch(oldVnode, vnode) {
  // 1. oldVnode 是一个组件
  if(!oldVnode) {
    return createElm(vnode); // 根据虚拟节点创建元素
  }
  // 2. 初次渲染 oldVnode 是一个真实的dom
  const isRealElement = oldVnode.nodeType
  if(isRealElement) {
    const oldElm = oldVnode; // id="app"
    const parentElm = oldElm.parentNode; // body
    let el = createElm(vnode);
    parentElm.insertBefore(el, oldElm.nextSibling); // 将创建的节点插入到原有节点的下一个
    parentElm.removeChild(oldElm);  // 移除老的节点
    return el; // vm.$el
  } else {
    // 3. diff算法, 两个虚拟节点的对比
    // 3.1 如果两个虚拟节点标签不一致, 那就直接替换掉就结束
    if(oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }
    // 3.2 标签一样但是是两个文本元素 { tag: undefined, text } { tag: undefined, text }
    if(!oldVnode.tag) { // 标签相同, 而且是文本
      if(oldVnode.text !== vnode.text) {
        return oldVnode.el.textContent = vnode.text
      }
    }
    // 3.3 元素相同, 复用老节点, 且更新属性
    let el = vnode.el = oldVnode.el
    // 用老的属性和新的虚拟节点进行比对
    updateProperties(vnode, oldVnode.data);

    // 4. 更新儿子
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if(oldChildren.length > 0 && newChildren.length > 0) {
      //    1.老的有儿子 新的也有 dom-diff
      updateChildren(el, oldChildren, newChildren)
    }else if(oldChildren.length > 0) {
      //    2.老的有儿子 新的没儿子 => 删除老儿子
      el.innerHTML = '';
    }else if(newChildren.length > 0) {
      //    3.老的没儿子 新的有儿子 => 在老节点上增加儿子即可
      newChildren.forEach(child => {
        el.appendChild(createElm(child));
      })
    }

    

  }
}



function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0; // 老的头索引
  let oldEndIndex = oldChildren.length - 1; // 老的尾索引
  let oldStartVnode = oldChildren[0]; // 老的开始节点
  let oldEndVnode = oldChildren[oldEndIndex]; // 老的结束节点

  let newStartIndex = 0; // 新的头索引
  let newEndIndex = newChildren.length - 1; // 新的尾索引
  let newStartVnode = newChildren[0]; // 新的开始节点
  let newEndVnode = newChildren[newEndIndex]; // 新的结束节点

  function makeIndexByKey(oldChildren) {
    let map = {};
    oldChildren.forEach((item, index) => {
      map[item.key] = index; // { A: 0, B: 1, ... }
    })
    return map
  }
  let map = makeIndexByKey(oldChildren)
  // 双指针优化策略
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if(!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    }else if(!oldEndVnode){
      oldEndVnode = oldChildren[--oldEndIndex];
    }else if(isSameVnode(oldStartVnode, newStartVnode)) {
      // 1. 向后插入
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }else if(isSameVnode(oldEndVnode, newEndVnode)) {
      // 2. 向前插入
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if(isSameVnode(oldStartVnode, newEndVnode)) {
      // 3. 老头新尾, 老头插入到老尾下一个元素的前面
      patch(oldStartVnode, newEndVnode)
      // dom 操作会具备移动性
      parent.insertBefore(oldStartVnode.el, oldEndVnode.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    }else if(isSameVnode(oldEndVnode, newStartVnode)) {
      // 4. 老尾新头, 老尾插入到老头的前面
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    }else {
      // 5. 复杂情况, 去老的里面查找当前 老节点索引和key的关系
      // 5.1) 没有(插入到)当前oldStartIndex前面
      // 5.2) 有(就移动到)当前oldStartIndex前面, 同时原来的位置进行标记, 后续不再处理
      // 5.3) 知道newStartIndex === newEndIndex, 剩下老的如果还有,则全部删除
      let moveIndex = map[newStartVnode.key]
      if(moveIndex === undefined) {
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      }else {
        let moveNode = oldChildren[moveIndex];
        oldChildren[moveIndex] = undefined;
        patch(moveNode, newStartVnode); // 如果找到了, 需要两个虚拟节点比对
        parent.insertBefore(moveNode.el, oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex];
    }
    // 为什么v-for增加key属性, key为什么不能用index
  }
  if(newStartIndex <= newEndIndex) { // 新的比老节点多, 直接插入
    for(let i = newStartIndex; i <= newEndIndex; i++) {
      // 向前插入, 向后插入 区分: 看下一个节点有没有值
      let nextEle = newChildren[newEndIndex + 1] === null ? null : newChildren[newEndIndex + 1].el
      // 如果 insertBefore 传入 null 等价于 appendChild
      parent.insertBefore(createElm(newChildren[i]), nextEle)
    }
  }
  if(oldStartIndex <= oldEndVnode) {
    // 老的比新的节点多, 删除多余节点
    for(let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i];
      if(child !== undefined) {
        parent.removeChild(child.el);
      }
    }
  }


}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.data || {}; // 属性
  let el = vnode.el; // 真实dom元素
  // 1. 老节点上的属性新的没有, 删除老的属性
  for(let key in oldProps) {
    if(!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  let newStyle = newProps.style || {}; // {color:blue;}
  let oldStyle = oldProps.style || {}; // {backgroundColor:red;}
  for(let key in oldStyle) { // 新老样式对比, 如果直接先清空
    if(!newStyle[key]) {
      el.style[key] = '';
    }
  }
  // 2. 新节点上的属性老的没有, 直接用新的覆盖
  for(let key in newProps) {
    if(key === 'style') {
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    }else if(key === 'class'){
      el.className = newProps.class
    }else {
      el.setAttribute(key, newProps[key])
    }
  }
}