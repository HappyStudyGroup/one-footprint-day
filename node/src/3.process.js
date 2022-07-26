/**
 * process    可以解析整个程序中的参数
 * nextTick   node中的微任务，当前执行栈的底部，优先级比promise高
 * cwd()      当前的工作目录
 * env        环境变量
 * argv       执行时所需的参数
 */

// 1. 环境变量(1.全局环境变量, 2.局部环境变量)
// cross-env 可以跨平台设置环境
// console.log(process.env.path) // path 设置一些局部变量 set key=value / export key=value
// 局部环境变量在哪设置, 在哪生效, 其他地方运行不生效
if(process.env.NODE_ENV === 'production') {
  console.log('打包')
}else{
  console.log('启动服务')
}

// 2. webpack --config --env --port --mode 
// console.log(process.argv)  // 执行环境时的参数, 前两个固定, code runner, 如: node webpack xxx xxx 或者 node 文件名
// 用户可以解析这些参数  webpack (-p --port key) (3000 值)

// reduce 收敛函数, 例如: 执行 node .\3.process.js --p 30 -c 5
// console.log(process.argv.slice(2)) // ['--p', '30', '-c', '5']
// let userObj = process.argv.slice(2).reduce((memo, current, index, arr) => {
//   if(current.includes('--')) {
//     memo[current.slice(2)] = arr[index + 1]
//   }else if(current.includes('-')) {
//     memo[current.slice(1)] = arr[index + 1]
//   }
//   return memo
// }, {})
// console.log(userObj) // { p: '30', c: '5' }

// 3. 解析参数的模块 yargs(webpack) , commander
// 例如: npm install commander
// const program = require('commander')

// program.version('1.0.0')
/**program.command
 * 
 * 注意: command 不能和option一起使用
 */
// program.command('create').action((...args) => {
//   const Command = args[1]
//   console.log('创建项目', Command.args)
// })
/**program.option(key, des, default: (可选参数))
 * {@params}key, 命令名
 * {@params}des, 描述
 * {@params}default, 默认值
 * 写法如下:
 * 1. program.option('--key', des)          // node .\3.process.js --key        // true
 * 2. program.option('--key', des, default) // node .\3.process.js --key        // default
 * 3. program.option('--key <value>', des)  // node .\3.process.js --key=xxx    // "xxx"
 * 4. program.option('--key <value>', des, default) 
 *    // node .\3.process.js                // default
 *    // node .\3.process.js --key=xxx      // "xxx"
 *    <value> 作用: 
 *    必须使用 --key=xxx 的形式去赋值,且会覆盖默认值, 否则报错:
 *    error: option '--key <value>' argument missing
 * 5. program.option('--no-key', des)
 *    默认值都是 true, 用来设置 Boolean 类型的值
 *    // node .\3.process.js                // true
 *    // node .\3.process.js --no-key       // false
 * 6. program.option('--no-key <value>', des)
 *    和上面用法一样, 不推荐使用
 *    // node .\3.process.js                // true
 *    // node .\3.process.js --no-key=xxx   // "xxx"
 * no- 作用: 
 *    --key(格式如: program.option('--key <value>', des, default))
 *    1. 如果 先定义 --key , 那么 --no-key 不会改变默认值
 *    2. 否则 设置 key=false
 */
// program
  // .option('--test', '测试')
  // .option('--test', '测试', '默认值')
  // .option('--test <value>', '测试')
  // .option('--test <value>', '测试', '默认值')
  // .option('--no-test', '测试', '默认值')
  // .option('--no-test <value>', '测试')
  // .option('--cheese <flavour>', 'cheese flavour', 'mozzarella')
  // .option('--no-cheese', 'plain with no cheese')
  // .parse()

// 指定一个选项，该选项可以用作布尔选项，但可以选择采用选项参数（用方括号声明，如--optional [value]）
// program.option('-c, --cheese [type]', 'Add cheese with optional type');

// program.parse(process.argv)
// program.parse()
// const options = program.opts()
// console.log(options)

// if (options.cheese === undefined) console.log('no cheese')
// else if (options.cheese === true) console.log('add cheese')
// else console.log(`add cheese type ${options.cheese}`)

/** 
*  node .\3.process.js                   // no cheese
*  node .\3.process.js --cheese          // add cheese
*  node .\3.process.js --cheese Jelly    // add cheese type Jelly
*/

/**process.cwd()
 * 当前的工作目录, 默认 code runner 运行时是以当前文件夹的根目录为基准,
 * 这个就是当前的工作目录, E:\sun-projects-github\one-footprint-day\node
 * 
 * __dirname  当前文件所在的文件夹,此路径不能发生变化
 * 在操作文件时,为了防止有歧义, 采用 __dirname + 文件名
 */
 const path = require('path')
 console.log('cwd: ', process.cwd())
 console.log('__dirname: ', __dirname)
 console.log('__filename: ', __filename)
 console.log('path.dirname: ', path.dirname(__dirname))