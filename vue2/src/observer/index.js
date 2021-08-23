import { arrayMethods } from "./array";

class Observer{
  constructor(value) {
    // 需要对value属性重新定义
    // value 可能是对象, 也可能是数组
    // value.__ob__ = this // 这种方式回会被循环递归, 死循环
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false,    // 不能被枚举表示, 不能被循环
      configurable: false   // 不能删除此属性
    })
    if(Array.isArray(value)) {
      // 数组不用definePorperty代理, 性能不好
      // 一般都用push, shift, reverse, sort等等, 要重写这些方法增加更新逻辑

      // value.__proto__ = arrayMethods;
      Object.setPrototypeOf(value, arrayMethods); // 循环将属性赋上去
      this.observeArray(value); // 原有数组中的对象, Object.freeze() 冻结用来优化性能

    }else {
      this.walk(value);
    }
  }
  observeArray(value) {
    for(let i = 0; i < value.length; i++) {
      observe(value[i])
    }
  }
  walk(data) {
    // 将对象中的所有key, 重新用definePorperty定义成响应式的
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    })
  }
}

export function defineReactive(data, key, value) {
  // vue2中数据嵌套不要太深, 过深会递归浪费性能
  // value 可能也是一个对象
  observe(value); // 对结果递归拦截

  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      if(newValue === value) return;
      observe(newValue); // 如果用户设置的是一个对象的话, 就继续将用户设置的对象变成响应式的
      value = newValue
    }
  })
}

export function observe(data) {
  // 只对对象类型进行观测, 非对象类型无法观测
  if(typeof data !== 'object' || data == null) {
    return;
  }
  if(data.__ob__) { // 只要有这个属性,表示被观察过
    return;
  }
  // 通过类来实现对数据的观测, 类可以方便扩展, 会产生实例
  return new Observer(data);

}
