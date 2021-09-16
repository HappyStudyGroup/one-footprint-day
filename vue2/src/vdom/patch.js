
export function patch(oldVnode, vnode) {
  // oldVnode 是一个真实的dom

  const isRealElement = oldVnode.nodeType
  if(isRealElement) {
    // 初次渲染
    const oldElm = oldVnode; // id="app"
    const parentElm = oldElm.parentNode  // body

    let el = createElm(vnode);
    parentElm.insertBefore(el, oldElm.nextSibling); // 将创建的节点插入到原有节点的下一个
    parentElm.removeChild(oldElm);  // 移除老的节点
    
    return el
  } else {
    // diff算法
  }

}

function createElm (vnode) {// 根据虚拟节点创建真实节点
  let { tag, data, key, text, children, vm } = vnode;

  if(typeof tag === 'string') {
    // tag 可能是组件, 暂不考虑
    vnode.el = document.createElement(tag); // 用vue的指令时,可以通过vnode拿到真实dom
    updateProperties(vnode)
    children.forEach(child => { // 如果有儿子节点, 就递归
      vnode.el.appendChild(createElm(child))
    })
  }else {
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