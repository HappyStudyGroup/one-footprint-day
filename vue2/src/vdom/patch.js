
export function patch(oldVnode, vnode) {
  if(!oldVnode) {
    return createElm(vnode); // 根据虚拟节点创建元素
  }
  // 初次渲染 oldVnode 是一个真实的dom
  const isRealElement = oldVnode.nodeType
  if(isRealElement) {
    // 初次渲染
    const oldElm = oldVnode; // id="app"
    const parentElm = oldElm.parentNode; // body
    let el = createElm(vnode);
    parentElm.insertBefore(el, oldElm.nextSibling); // 将创建的节点插入到原有节点的下一个
    parentElm.removeChild(oldElm);  // 移除老的节点
    return el; // vm.$el
  } else {
    // diff算法
  }

}

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

function createElm (vnode) {// 根据虚拟节点创建真实节点
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

function updateProperties(vnode) {
  let newProps = vnode.data || {}; // 属性
  let el = vnode.el; // dom元素
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