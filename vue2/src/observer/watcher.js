import { popTarget, pushTarget } from "./dep";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.options = options;
    this.id = id++;

    this.getter = exprOrFn
    this.deps = [];
    this.depsId = new Set(); // 去重复属性,防止重复监听
    this.get(); // 调用传入的函数, render方法, 此时会对模板中的数据进行取值
  }

  get() { // 这个方法中会对属性进行取值操作
    pushTarget(this); // 1.Dep.target = watcher
    this.getter();    // 2.取值
    popTarget();      // 4.清空watcher
  }
  addDep(dep) {
    let id = dep.id
    if(!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this)
    }
  }
  update() {
    this.get()
  }

  // 当属性取值时, 需要记住这个watcher, 数据变化时, 去执行自己记住的watcher
}


export default Watcher