import { nextTick } from "../util";

let has = {};
let queue = [];
let pending = false;

function flushSchedularQueue() {
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i];
    watcher.run()
  }
  queue = [];
  has = {};
  pending = false;
}

// 多次调用queueWatcher, 如果watcher不是同一个
export function queueWatcher(watcher) {
  // 更新时对watcher去重
  let id = watcher.id;
  if(has[id] == null) {
    queue.push(watcher)
    has[id] = true;
    // 让queue清空
    if(!pending) {
      pending = true;
      nextTick(flushSchedularQueue)
    }
  }
}