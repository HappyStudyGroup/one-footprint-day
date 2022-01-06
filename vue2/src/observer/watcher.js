import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./schedular";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.options = options;
    this.user = options.user; // 标识是用户watcher
    this.sync = options.sync; // 标识是同步watcher
    this.lazy = options.lazy; // 标识是计算属性watcher
    this.dirty = this.lazy;   // 标识有缓存
    this.id = id++;
    if(typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }else {
      // 将getter方法,封装成一个取值函数
      this.getter = function () {
        let path = exprOrFn.split('.')
        let val = vm
        for(let i = 0; i < path.length; i++) {
          val = val[path[i]]
        }
        return val
      }
    }
    this.deps = [];
    this.depsId = new Set(); // 去重复属性,防止重复监听
    this.value = this.lazy ? undefined : this.get(); // 调用传入的函数, render方法, 此时会对模板中的数据进行取值
  }

  get() { // 这个方法中会对属性进行取值操作
    pushTarget(this); // 1.Dep.target = watcher
    let value = this.getter.call(this.vm);    // 2.取值更新 vm._update(vm._render())
    popTarget();      // 4.清空watcher
    return value
  }
  addDep(dep) {
    let id = dep.id
    if(!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this)
    }
  }
  update() { // 如果多次更改同一个数据, 我需要只触发一次(防抖)
    if(this.sync) {
      // 如果是同步watcher
      this.run()
    }else if(this.lazy) { // 计算属性依赖的值更新了
      this.dirty = true;
    }else {
      queueWatcher(this);
    }
  }
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  run() {
    let oldValue = this.value; // 第一次渲染的值
    let newValue = this.get();
    this.value = newValue;
    if(this.user) { // 如果当前是用户watcher, 就执行用户定义的callback
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }

  }
  // 当属性取值时, 需要记住这个watcher, 数据变化时, 去执行自己记住的watcher
}

export default Watcher