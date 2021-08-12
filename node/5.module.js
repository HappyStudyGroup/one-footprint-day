/**
 * 1. 常见的模块有哪些?
 * es6Module  (import / export)
 * commonjs   (require / module.export)
 * seajs cmd require amd(define require) 过时了
 * 项目打包js使用: umd 统一模块规范(可以兼容 commonjs + cmd + amd + 挂载到全局)
 * es6模块叫静态导入(变量提升) import()支持动态导入  commonjs 动态导入
 */

/**模块化的好处
 * 1. 解决命名冲突问题, 如果用唯一标识解决冲突,会导致调用时路径过长
 * 2. 方便管理我们的代码(一个文件一个功能, 每个文件都是一个模块)
 */

/**commonjs模块化的规范
 * 1. 每个文件都是一个模块
 * 2. 我要给别人用 module.exports 导出给别人用的内容
 * 3. 别人使用这个 require 去引用
 * 原理: 通过函数隔离作用域(会将 module.exports 返回给当前变量)
 * 如: let result = function() {
 *    var a = 'hello'
 *    module.exports = a
 *    return module.exports
 * }()
 */

// 引用类型和非引用类型的区别
// 导出的是引用类型,变化后重新获取最新的值
// 读取方式是同步的
let result = require('./a')
console.log(result)

/**2. 如何让一个字符串执行
 * 1. eval 执行时会向上查找变量,导致作用域混乱问题
 *  例: const a = 1; eval('console.log(a)')
 * 2. new Function, 最后一个值是函数中的内容, 前面的参数是函数的参数
 */

let func = new Function('a', 'console.log(a)')
func('new Function: ', 100)
// node中实现模块化, 靠的不是new Function, 靠的是自己的核心模块
/**node 将模块分成三类
 * 1. 核心模块, fs, path, util等等
 * 2. 自定义文件模块
 * 3. 第三方模块 (需要安装, 使用方式和核心模块一致)
 */

// 1) 虚拟机模块, 创建沙箱环境
// 用法像 eval, 但是执行字符串时是一个沙箱环境
let vm = require('vm')
vm.runInThisContext('console.log(100)')
// 2) fs 模块, 读取的文件不存在会报错,写入的文件不存在会创建
let fs = require('fs') // 文件操作问题, 可能会导致文件读取路径有问题
// 带有sync就是同步读取
let file = fs.readFileSync('./a.js') // 一般情况下能立即拿到返回值的是同步(有返回值不一定是同步)
let exists = fs.existsSync('./a.js') // 文件是否存在
console.log(exists, file)

// 3) path模块, 专门用来解析路径的: resolve, join, dirname, extname...等
const path = require('path')
console.log(path.join(__dirname, 'a.js'))
// resolve 解析出一个绝对路径, 如果只传入一个名字, 用 process.cwd()解析出路径
console.log(path.resolve(__dirname, 'a.js'))
// join 支持/拼接, resolve 遇到 / 就变成了根路径
let parent = path.dirname('a/b/c/a.js')// 取父路径
let ext = path.extname('a/b/c/a.js')   // 取扩展名
console.log(parent, ext)


/**3. 调试代码, useA.js
 * 通过chrome
 */


