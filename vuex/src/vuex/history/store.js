import { applyMixin } from './mixin'

const forEachValue = (obj, cb) => {
  Object.keys(obj).forEach(key => cb(obj[key], key))
}

export let _Vue;
export class Store {
  constructor(options) { // this.$store
    // 哪里的数据是响应式的? 答: new Vue => data
    let computed = {};
    this.getters = {};
    
    forEachValue(options.getters, (value, key) => {
      // value 是 function, 但是 getters 是属性, 所以需要转化
      computed[key] = () => { // 利用计算属性, 做优化, 如果值不变,就不需要执行用户的方法
        return value.call(this, this.state)
      }
      Object.defineProperty(this.getters, key, {
        // 每次取值都会重新执行用户的方法, 性能差, 我希望第一次取值就把结果缓存下来
        get:() => {
          return this._vm[key]; // 取computed[key](计算属性也会被代理到当前实例上)
        }
      })
    })
    this._vm = new _Vue({
      data: {
        $$state: options.state
      },
      computed
    })
    // new Vue => data 内部会使用代理, 把所有的属性代理到this._vm
    // 注意: vue中不会对 _ 和 $ 开头的属性进行代理操作, 一个 $ 开头就可以, 但是 vuex 里面表示是自己的私有变量,所以加了俩$
    this.mutations = [];
    this.actions = [];
    forEachValue(options.mutations, (fn, key) => {
      this.mutations[key] = (payload) => fn.call(this, this.state, payload)
    })
    forEachValue(options.actions, (fn, key) => {
      this.actions[key] = (payload) => fn.call(this, this, payload)
    })
  }

  get state() { // get xx ES6属性访问器, 原理就是用Object.definePropety(store, 'state', {get,set})
    return this._vm._data.$$state
  }
  commit = (type, payload) => { // 类中的箭头函数, this永远指向Store
    this.mutations[type](payload);
  }
  dispatch = (type, payload) => {
    this.actions[type](payload);
  }
}

export const install = (Vue) => {
  _Vue = Vue; // 方便其他地方使用Vue
  applyMixin(Vue)
}
