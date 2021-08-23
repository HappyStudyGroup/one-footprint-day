import { observe } from "./observer/index.js";

export function initState(vm) {
  // 将所有的数据都定义在 vm 属性上, 并且后需更改,需要触发视图更新
  const opts = vm.$options; // 获取用户属性
  if(opts.props) {}
  if(opts.methods) {}

  if(opts.data) { // 数据的初始化
    initData(vm)
  }

  if(opts.computed) {}
  if(opts.watch) {}
  
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