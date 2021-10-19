import { isArray, isInteger } from "../shared/index";

export function effect(fn, options:any = {}) { // effect => vue2中的watcher
  const effect = createReactiveEffect(fn, options);
  if(!options.lazy) {
    effect();
  }
  return effect
}

let activeEffect; // 用来存储当前的 effect 函数, 方便 effect 和用到的数据关联
let uid = 0;
let effectStack = []; // 栈型结构
function createReactiveEffect(fn, options) {
  const effect = function() {
    if(!effectStack.includes(effect)) { // 防止递归执行，死循环
      try {
        activeEffect = effect;
        effectStack.push(activeEffect);
        return fn(); // 用户的逻辑，内部会对数据进行取值操作，在取值时 可以拿到这个 activeEffect
      }finally{
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }
  effect.id = uid++;
  effect.deps = []; // 用来表示 effect中依赖那些属性
  effect.options = options;
  return effect;
}

// {object:{key:[effect1, effect2, ...]}}
const targetMap = new WeakMap(); // {object: {age: [effect，...]}}

// 将属性和 effect 进行关联
export function track(target, key) {
  if(activeEffect == undefined) {
    return;
  }
  let depsMap = targetMap.get(target);
  if(!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if(!dep) {
    // 同一个属性只会有一个 effect， 所以用 Set 去重
    depsMap.set(key, (dep = new Set))
  }
  
  if(!dep.has(activeEffect)) { // 如果没有 effect，就把effect放到集合里
    dep.add(activeEffect);
    activeEffect.deps.push(dep); // 双向记忆的过程
  }
}
// trigger 属性
export function trigger(target, type, key, value?, oldValue?) {
  const depsMap = targetMap.get(target);
  if(!depsMap) {
    return;
  }

  const run = effects => {
    if(effects) {
      effects.forEach(effect => effect())
    }
  }
  // 数组有特殊情况
  // effect中使用了 length, 改 length 是可以触发更新,
  // 但是如果没有使用length, 就不会触发更新
  if(key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
      // map 可以循环
      if(key === 'length' || key >= value) { // 如果改的长度, 小于数组原有的长度时,应该更新视图
        console.log(key, value)
        run(dep);
      }
    })
  }else {
    // 对象的处理
    if(key != void 0) { // 说明修改了 key
      run(depsMap.get(key));
    }
    switch (type) {
      case 'add':
        if(isArray(target)) {// 通过索引给数组增加选项
          if(isInteger(key)) {
            run(depsMap.get('length')); // 如果页面中直接使用了数组,也会对数组取值操作,会对length进行收集,新增属性时,直接出发length即可;
          }
        }
        break;
    
      default:
        break;
    }
  }
}
