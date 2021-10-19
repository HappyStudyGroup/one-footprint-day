

export const nodeOps = {
  createElement(type) {
    return document.createElement(type)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(child, parent, anchor = null) {
    parent.insertBefore(child, anchor); // 参照物anchor不传, 相当于appendChild
  },
  remove(child) {
    const parent = child.parentNode;
    if(parent) {
      parent.removeChild(child)
    }
  }
}
