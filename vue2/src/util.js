
let callbacks = [];
let waiting = false;


function flushCallbacks() {
  for (let i = 0; i < callbacks.length; i++) {
    let callback = callbacks[i];
    callback()
  }
  waiting = false
}
// 批处理, 第一次打开定时器, 后续只更新列表, 之后执行清空逻辑
// 1. 第一次cb 是渲染watcher更新操作 (渲染watcher执行的过程是同步的)
// 2. 第二次cb 用户传入的回调
export function nextTick(cb) {
  callbacks.push(cb); // 默认的cb是渲染逻辑, 用户的逻辑放到渲染逻辑之后即可
  if(!waiting) {
    // 多次调用nextTick 只会开启一个Promise
    waiting = true;
    // 1. promise先看支持不支持
    // 2. mutationObserver
    // 3. setImmediate
    // 4. setTimeout
    // vue3 next-tick 采用了promise

    Promise.resolve().then(flushCallbacks);
  }

}

// nextTick 肯定有异步功能

export const isObject = (val) => typeof val === 'object' && val !== null;
const LIFECYCLE_HOOKS = [
  'beforeCreated',
  'created',
  'beforeMounted',
  'mounted',
  'beforeDestory',
]
const strats = {};
function mergeHook (parentVal, childVal) {
  if(childVal) {
    if(parentVal) {
      return parentVal.concat(childVal)
    }else {
      return [childVal]
    }
  }else { // 儿子没有，使用父亲的
    return parentVal
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
// strats.data = function () {}
strats.components = function (parentVal, childVal) {
  const res = Object.create(parentVal);
  if(childVal) {
    for(let key in childVal) {
      res[key] = childVal[key]
    }
  }
  return res
}
export function mergeOptions(parent, child) {
  const options = {}
  // {a：1} {a: 2} => {a:2}
  // {a: 1} {}     => {a:1}
  // 自定义策略
  // 1. 如果父有儿子也有, 应该儿子替换父亲
  // 2. 如果父亲有儿子没有，用父亲的
  for(let key in parent) {
    mergeField(key)
  }
  for(let key in child) {
    if(!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    // 策略模式
    if(strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }
    if(isObject(parent[key]) && isObject(child[key])) {
      options[key] = [ ...parent[key], ...child[key] ]
    }else {
      if(child[key]) {
        options[key] = child[key]
      }else {
        options[key] = parent[key]
      }
    }
  }
  return options
}

function makeUp(str) {
  const map = {}
  str.split(',').forEach(tagName => {
    map[tagName] = true
  })
  return (tag) => (map[tag] || false)
}

export const isReservedTag = makeUp('a,p,div,ul,li,span,input,button,b,textarea');
