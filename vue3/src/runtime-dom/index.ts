import { createRenderer } from "../runtime-core/index";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";


const renderOptions = {...nodeOps, patchProp}; // dom操作

function ensureRenderer() {
  return createRenderer(renderOptions)
}


// createApp(App).mount('#app')
export function createApp(rootComponent) {
  // 1. 根据组件, 创建一个渲染器
  const app = ensureRenderer().createApp(rootComponent);
  const { mount } = app;
  app.mount = function(container) {
    // 1. 挂载时将容器清空, 然后在挂载
    container = document.querySelector(container)
    container.innerHTML = '';
    mount(container)
  }

  return app
}