import Dep from "./observer/dep.js";
import { observe } from "./observer/index.js";
import Watcher from "./observer/watcher.js";
import { isObject } from "./util.js";

export function initState(vm) {
  // 将所有的数据都定义在 vm 属性上, 并且后需更改,需要触发视图更新
  const opts = vm.$options; // 获取用户属性
  if(opts.props) {
    initProps(vm)
  }
  if(opts.methods) {
    initMethod(vm)
  }

  if(opts.data) { // 数据的初始化
    initData(vm)
  }
  if(opts.computed) {
    initComputed(vm, opts.computed)
  }
  if(opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function Proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      // if(newValue === vm[source][key]) return;
      vm[source][key] = newValue
    }
  })
}

function initData(vm) {
  // 数据劫持 Object.defineProperty
  let data = vm.$options.data;
  // 对 data 类型进行判断, 如果是函数, 获取函数返回值作为对象
  // data.call(vm), 保证 this 始终指向 当前实例
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  // 通过vm._data 获取劫持后的数据, 用户就可以拿到_data, 
  // 将_data中的数据全部放到 vm 上
  for(let key in data) {
    Proxy(vm, '_data', key); // vm.name => vm._data.name
  }

  // 观测这个数据
  observe(data);
}

function initProps() {}
function initMethod() {}
function initComputed(vm, computed) {
  // computed 的原理是Watcher
  // _computedWatchers 存放所有计算属性对应的watcher
  const watchers = vm._computedWatchers = {};
  for(let key in computed) {
    const userDef = computed[key]; // 获取用户的定义函数
    const getter = typeof userDef === 'function'? userDef : userDef.get;
    // 获取getter函数, lazy: true 表示是计算属性
    // Watcher内部根据lazy属性, 是否需要调用getter
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true })
    // 计算属性可以直接通过vm来进行取值, 将属性定义到实例上
    defineComputed(vm, key, userDef);
  }
}
const sharedPropertyDefinition = { // 属性描述器
  enumerable: true,
  configurable: true,
  get: () => {}
}
// 将属性定义到vm上
function defineComputed(target, key, userDef) {
  if(typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
  }else {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = userDef.set || (() => {})
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
function createComputedGetter(key) {
  return function () { // 通过watcher添加缓存
    // 拿到刚才的watcher
    let watcher = this._computedWatchers[key];
    // 如果dirty = true, 调用用户的方法, 默认第一次取值 true
    if(watcher.dirty) {
      watcher.evaluate()
    }
    if(Dep.target) { // watcher指代的是 计算属性watcher
      watcher.depend() // 渲染watcher也一并收集
    }
    return watcher.value
  }
}
function initWatch(vm, watch) {
  // watch 的原理是Watcher
  for(let key in watch) {
    // 获取key 对应的值
    const handler = watch[key]
    if(Array.isArray(handler)) {
      // 如果传递的是数组, 就循环依次创建
      for(let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    }else {
      // 单纯的key value
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, key, handler, options) {
  if(isObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if(typeof handler === 'string') { // 获取methods中的方法替换handler
    handler = vm.$options.methods[handler]
  }
  // 参数的格式化
  return vm.$watch(key, handler, options)
}


export function stateMixin(Vue) {
  Vue.prototype.$watch = function(exprOrFn, cb, options) {
    // 用户 watcher
    const vm = this
    options.user = true; // 标识是用户watcher
    new Watcher(vm, exprOrFn, cb, options)
  }
}