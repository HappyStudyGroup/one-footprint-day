import { forEachValue } from "../util";


export class Module {
  constructor(rawModule) {
    this._raw = rawModule;
    this._children = {};
    this.state = rawModule.state;
  }
  get namespaced() {
    return this._raw.namespaced
  }
  getChild(key) {
    return this._children[key]
  }
  addChild(key, module) {
    this._children[key] = module;
  }

  forEachMutation(fn) {
    if(this._raw.mutations) {
      // 如果有就遍历
      forEachValue(this._raw.mutations, fn)
    }
  }
  forEachAction(fn) {
    if(this._raw.actions) {
      // 如果有就遍历
      forEachValue(this._raw.actions, fn)
    }
  }
  forEachGetters(fn) {
    if(this._raw.getters) {
      // 如果有就遍历
      forEachValue(this._raw.getters, fn)
    }
  }
  forEachChildren(fn) {
    if(this._children) {
      // 如果有就遍历
      forEachValue(this._children, fn)
    }
  }
}