import Vue from 'vue';
import { applyMixin } from './mixin'
import { ModuleCollection } from './module/module-collection';
import { forEachValue } from './util';

const getState = (store, path) => { // store.state 获取的是最新状态
  return path.reduce((rootState, current) => {
    return rootState[current];
  }, store.state)
}

const installModule = (store, path, module, rootState) => {
  // 状态: 需要将子模块的状态定义在根模块上
  let namespaced = store._modules.getNamespace(path)
  if(path.length > 0) { // 子模块
    // 将子模块定义在父模块上
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current]
    }, rootState)
    store._withCommiting(() => {
      Vue.set(parent, path[path.length - 1], module.state); // 将子模块的state定义成响应式的
    })
  }
  module.forEachMutation((mutation, key) => {
    store.mutations[namespaced+key] = (store.mutations[namespaced + key] || [])
    store.mutations[namespaced+key].push((payload) => mutation.call(store, getState(store, path), payload))
  })
  module.forEachAction((action, key) => {
    store.actions[namespaced+key] = (store.actions[namespaced + key] || [])
    store.actions[namespaced+key].push((payload) => action.call(store, store, payload))
  })
  module.forEachGetters((getter, key) => {
    store.wrapGetters[namespaced + key] = () => {
      return getter.call(store, getState(store, path))
    }
  })
  module.forEachChildren((childModule, key) => {
    installModule(store, path.concat(key), childModule, rootState)
  })
  // 所有的模块的getters都会合并到一个对象里
}

function resetStoreVM(store, state) {
  const computed = {};
  forEachValue(store.wrapGetters, (fn, key) => {
    computed[key] = fn; // 存放所有的getters
    Object.defineProperty(store.getters, key, {
      get:() => {
        return store._vm[key]
      }
    })
  })
  store._vm = new _Vue({
    data: {
      $$state: state
    },
    computed
  })
  if(store.strict) {
    store._vm.$watch(() => store._vm._data.$$state, () => {
      console.assert(store._commiting, '在mutation之外修改了状态')
    }, { sync: true, deep: true }); // watcher执行是异步的
  }
}

export let _Vue;
export class Store {
  constructor(options) { // this.$store
    // 可能用户会有嵌套的module
    // options => 格式化成一个树结构
    this._modules = new ModuleCollection(options);
    this.mutations = {}; // 将所有的mutations都放在这里
    this.actions = {}; // 将所有的mutations都放在这里
    this.getters = {};
    this.wrapGetters = {}; // 临时存放的
    let state = options.state
    this._subscribes = [];

    this.strict = options.strict;
    this._commiting = false;
    this._withCommiting = function (fn) { // 严格模式下监听, mutation里面如果有异步代码就会提示错误
      let commiting = this._commiting;
      this._commiting = true;
      fn(); // 修改状态的逻辑
      this._commiting = commiting;
    }

    installModule(this, [], this._modules.root, state);
    resetStoreVM(this, state);

    // plugins 默认插件就会从上往下顺序执行
    options.plugins.forEach(plugin => plugin(this))
  }
  get state() {
    return this._vm._data.$$state
  }
  commit = (type, payload) => {
    if(this.mutations[type]) {
      this._withCommiting(() => {
        this.mutations[type].forEach(fn => fn(payload)); // 所有的mutation执行完毕
        // 数据更新触发 subscribe
      })
      this._subscribes.forEach(fn => fn({ type, payload }, this.state))
    }
  }
  dispatch = (type, payload) => {
    if(this.actions[type]) {
      this.actions[type].forEach(fn => fn(payload))
    }
  }
  subscribe (fn) {
    this._subscribes.push(fn)
  }
  replaceState (localState) {
    this._withCommiting(() => {
      this._vm._data.$$state = localState; // 这么写虽然更改了, 但是内部代码是写死的
    })
  }
}

export const install = (Vue) => {
  _Vue = Vue; // 方便其他地方使用Vue
  applyMixin(Vue)
}
