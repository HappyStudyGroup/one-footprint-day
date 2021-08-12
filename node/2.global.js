// node 中的全局对象
// window global
// this this不是global
// console.log(this) // {}
// console.log(window) // node 中无法访问window, 浏览器环境下的全局变量

// global中的属性可以被直接访问到
// console.log(Object.keys(global))
// console.dir(global, { showHidden: true })
/* [
  'global',        
  'clearInterval', 
  'clearTimeout',  
  'setInterval',   
  'setTimeout',    
  'queueMicrotask',     // 微任务， v11 版本后才有
  'performance',   
  'clearImmediate',
  'setImmediate',       // 宏任务
]
*/
// 都是global上的属性
// process              // 进程, 整个应用
// Buffer               // 二进制

// require module exports __filename __dirname 都不是global上的属性，但是可以直接被访问

// 全局变量：(可以在当前文件中直接访问的变量)
// console.log(Object.keys(process))
/**process常用属性
 * version
 * platform   darwin / win32 代表的是不同的系统(系统文件的存放位置 /etc/xxx)
 * 
 * kill  杀死进程
 * exit  退出进程
 * nextTick   node中的微任务，当前执行栈的底部，优先级比promise高
 * cwd()  当前的工作目录
 * env    环境变量
 * argv   执行时所需的参数
 * stdout stderr stdin
 * 
 */


// 1. 如果运行以下不在 I/O 周期（即主模块）内的脚本，则执行两个计时器的顺序是非确定性的，因为它受进程性能的约束
setTimeout(() => {
  console.log('非 I/O循环：setTimeout')
}, 0)

setImmediate(() => {
 console.log('非 I/O循环：setImmediate') 
})

// 2. 如果你把这两个函数放入一个 I/O 循环内调用，setImmediate 总是被优先调用
const fs = require('fs');

fs.readFile('./nodejs事件循环.jpg', () => {
  // I/O操作完毕后，微任务操作完毕后，调用的方法 setImmediate
  setTimeout(() => {
    console.log('timeout');
  }, 0)
  setImmediate(() => {
    console.log('immediate');
  })
})

// timer 存放定时器的, poll 轮询处理 I / O 回调的, check setImmediate
// 每次执行一个宏任务完毕后会清空微任务（执行顺序和浏览器一致）
// node >= v11.x
// nextTick 微任务，I/O 宏任务
