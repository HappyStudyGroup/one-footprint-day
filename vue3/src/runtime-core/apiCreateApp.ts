import { createVNode } from "./vnode";

export function createAppAPI(render) {
  return function (rootComponent) {
    const app = { // 和平台无关
      mount(container) {
        // 用户调用的mount方法

        const vnode = createVNode(rootComponent);
        render(vnode, container);
      }
    }
    return app
  }
}