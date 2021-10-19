import { isObject } from "../shared/index";
import { mutableHandlers } from "./bseHandlers";


export function reactive(target) {
  // 我们需要将目标变成响应式对象， Proxy
  return createReactObject(target, mutableHandlers);
}

const proxyMap = new WeakMap();
function createReactObject(target, baseHandlers) {
  // 核心的操作就是读取文件时 “依赖收集”，当更新数据时重新执行 effect

  // 如果不是对象，不做代理
  if(!isObject(target)) {
    return target
  }
  const existingProxy = proxyMap.get(target);
  if(existingProxy) {
    return existingProxy
  }
  // 只是对最外层对象代理，默认不会递归，而且不会重新重写对象中的属性
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy); // 将代理的对象和代理后的结果，做一个映射表，缓存起来
  return proxy
}