import { hasChanged, hasOwn, isArray, isInteger, isObject, isSymbol } from "../shared/index";
import { reactive } from "./reactive";
import { track, trigger } from './effect'

// 工厂函数, 方便拓展
function createGetters() {
  return function get(target, key, receiver) { // 获取对象中的属性会执行此方法
    const res = Reflect.get(target, key, receiver); // 相当于target[key]，Reflect有返回值，设置失败返回 false
    // 如果取得值是 symbol 类型，则忽略
    if(isSymbol(key)) { // 数组中有很多 symbol 的内置方法
      return res
    }
  
    // 依赖收集
    track(target, key)
    console.log(key, '此时数据做了获取操作！')
    if(isObject(res)) { // 当取值是对象时，在进行代理（懒递归）
      return reactive(res)
    }
    return res
  }
}

function createSetters() {
  return function set(target, key, value, receiver) { // 设置对象中的属性会执行此方法
    // vue2 不支持新增属性，vue3可以（因为代理的是外层对象）
    // 新增还是修改？
    const oldValue = target[key]; // 如果是修改， 肯定有老值
    // 看一下有没有这个属性?
    // 第一种：数组新增的逻辑
    // 第二种：对象新增的逻辑
    const hadKey = isArray(target) && isInteger(key)
      ? Number(key) < target.length : hasOwn(target, key);
    
    const res = Reflect.set(target, key, value, receiver);

    if(!hadKey) {
      console.log('新增属性', target, key, value)
      trigger(target, 'add', key, value);
    }else if(hasChanged(value, oldValue)) {
      console.log('修改属性', target, key, value)
      trigger(target, 'set', key, value, oldValue);
    }
    return res
  }
}

const get = createGetters(); // 为了预置参数
const set = createSetters();

export const mutableHandlers = {
  get,
  set
}
