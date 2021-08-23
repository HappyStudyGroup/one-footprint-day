let oldArrayPrototypeMethods = Array.prototype;
// 不能直接改写数组原有方法, 不可靠, 只有被vue控制的数组才改写

export let arrayMethods = Object.create(Array.prototype)
let methods = [ // 这些都可以改变原数组
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];

methods.forEach(method => { // AOP切片编程
  arrayMethods[method] = function(...args) { // 重写数组方法
    // 更新视图(自己的操作)
    console.log('数组劫持')
    let result = oldArrayPrototypeMethods[method].call(this, ...args)
    // 有可能用户新增的数据是对象格式, 也需要进行拦截
    // 只对增加的方法进行拦截
    let inserted;
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice': // splice(0, 1, xxx)
        inserted = args.splice(2)
        break;
      default:
        break;
    }
    if(inserted) ob.observeArray(inserted);
    return result;
  }
})
