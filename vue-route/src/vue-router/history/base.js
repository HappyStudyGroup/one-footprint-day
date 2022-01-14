
export function createRoute(record, location) {
  let res = [];
  if(record) {
    while(record) {
      // 根据组件渲染原则, 先父后子, 所以一旦有父,直接向外循环,以前在数组前插入
      res.unshift(record)
      record = record.parent
    }
  }
  return {
    ...location,
    matched: res
  }
}

function runQueue(queue, iterator, cb) {
  function next(index) {
    if(index >= queue.length) {
      // 一个都没有或者钩子全部执行完毕, 直接调用cb渲染
      return cb()
    }else {
      let hook = queue[index]
      iterator(hook, () => {
        next(index+1)
      })
    }
  }
  next(0)
}

export default class History {
  constructor(router) {
    this.router = router;
    // 核心: 需要将current属性变成响应式的, 后续current变化,触发更新视图
    // /about/a => [/about, /about/a]
    this.current = createRoute(null, {
      path: '/'
    })
  }

  // 根据路径进行组件渲染, 数据变化 <-> 更新视图(数据必须是响应式)
  transitionTo(location, onComplete) { // 默认会执行一次
    let route = this.router.match(location);
    
    // 更新之前执行钩子
    let queue = [].concat(this.router.beforeEachHooks)
    console.log(queue);
    const iterator = (hook, cb) => {
      hook(route, this.current, cb)
    }
    runQueue(queue, iterator, () => {
      this.current = route; // current变量的引用地址变了
      this.cb && this.cb(route); // 更新页面
      onComplete && onComplete(); // 调用后, hash变化后会再次调用transitionTo
    });
  }
  listen(cb) {
    this.cb = cb;
  }
}