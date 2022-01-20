import { forEachValue } from '../util'
import { Module } from './module';


export class ModuleCollection {
  constructor(options) { // 遍历用户的属性对数据进行格式化
    this.root = null;
    this.register([], options);
  }
  getNamespace(path) { // path: ['a'] || ['a', 'c']
    let module = this.root;
    return path.reduce((namespace, key) => {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }
  register(path, rootModule) {
    let newModule = new Module(rootModule);
    if(path.length === 0) {
      this.root = newModule
    }else {
      // 需要将当前模块,定义在父模块上
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }
    if(rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        this.register(path.concat(moduleName), module);
      })
    }
  }

}