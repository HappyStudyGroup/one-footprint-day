## node.js 知识总结
### Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。
### 编程模块化
>遵守固定的规则，把一个大文件拆成独立并相互依赖的多个小模块。
>>1. 提高代码的复用性
>>2. 提高代码的可维护性
>>3. 可以实现按需加载
>nodejs中的模块,分成 3 大类:
>>1. 内置模块(nodejs官方提供, fs、path、http等)
>>2. 自定义模块（用户创建的每个js文件，都是自定义模块
>>3. 第三方模块（由第三方开发出来的模块，使用前需要提前下载）
### nodejs中的模块化规范 -- CommonJS
1. 每个模块内部，module 变量代表当前模块；
2. module 变量是一个对象，它的 exports属性是对外的接口；
3. 加载某个模块，其实就是加载该模块的 module.exports 属性；
>require()加载模块时，会执行模块中的代码，得到的就是 module.exports = {} 指向的对象，默认是{}。
>`module.exports`
>>`module.exports` 单词写起来比较复杂,为了简化向外共享成员,Node提供了 `exports` 对象。默认下：`exports` 和 `module.exports` 指向同一个对象。最终共享的结果，还是以 `module.exports` 指向的对象为准。
>>建议：开发的时候一个文件内尽量使用一种，防止混乱。
### 内置模块的加载机制
1. 在被加载的目录下查找一个叫 package.json 的文件,并寻找 main 属性,作为 require() 的加载入口;
2. 如果目录里没有 package.json 文件, 或者 main 入口不存在或者无法解析, 则 nodejs将试图加载目录下的index.js文件;
3. 如果以上两步都失败了, 则 nodejs会在终端打印错误信息, Error: Cannot find module 'xxx'


### 事件循环
  * 调用堆栈是一个 LIFO 队列（后进先出）
    事件循环不断地检查调用堆栈，以查看是否需要运行任何函数。
    当执行时，它会将找到的所有函数调用添加到调用堆栈中，并按顺序执行每个函数。
  * 消息队列
    用户触发的事件（如单击或键盘事件、或获取响应）也会在此排队。
  * ES6 作业队列
    在当前函数结束之前 resolve 的 Promise 会在当前函数之后被立即执行。
  * process.nextTick()
    当将一个函数传给 process.nextTick() 时，则指示引擎在当前操作结束（在下一个事件循环`滴答`开始之前）时调用此函数。
  * setImmediate()
    传入的任何函数都是在事件循环的下一个迭代中执行。
>总结：
>事件循环会赋予调用堆栈优先级，它首先处理在调用堆栈中找到的所有东西，一旦其中没有任何东西，便开始处理消息队列中的东西。
```js
const bar = () => console.log('bar')
const baz = () => console.log('baz')
const foo = () => {
  console.log('foo')
  setTimeout(bar, 0)
  new Promise((resolve, reject) =>
    resolve('应该在 baz 之后、bar 之前')
  ).then(resolve => console.log(resolve))
  baz()
}
foo() // foo、 baz、 应该在 baz 之后、bar 之前、 bar
```
#### setImmediate() 与 setTimeout(() => {}, 0)（传入 0 毫秒的超时）、process.nextTick() 有何不同？
1. process.nextTick() 的函数会在事件循环的当前迭代中（当前操作结束之后）被执行;
2. setImmediate(), setTimeout(() => {}, 0) 参数传入的任何函数都是在事件循环的下一个迭代中执行的回调;
3. setImmediate(), setTimeout(() => {}, 0) 放入一个 I/O 循环内调用，setImmediate 总是被优先调用;
>结论：process.nextTick() 执行顺序总是优先于其他两者。

### js 的异步编程与回调
  * 回调
    适用于简单的场景
  * Promise/async await - 回调的替代方法
    一种被称为 Promisifying 的技术，使用经典的 JavaScript 函数来接受回调并使其返回 promise。

### 什么是流
>它们是一种以高效的方式处理读/写文件、网络通信、或任何类型的端到端的信息交换。
>在传统的方式中，当告诉程序读取文件时，这会将文件从头到尾读入内存，然后进行处理。
>优点：
>>内存效率: 无需加载大量的数据到内存中即可进行处理。
>>时间效率: 当获得数据之后即可立即开始处理数据，这样所需的时间更少，而不必等到整个数据有效负载可用才开始。

### 操作数据库
>传统型数据库： MySQL、Oracle、SQL Server，也叫 关系型数据库 或 SQL数据库，这三者设计理念相同，用法比较类似。
>>SQL(Structured Query Language) 是结构化查询语言，专门用来访问和处理数据库的编程语言。
>>三个关键点：
```js
1. SQL 是一门数据库编程语言；
2. 使用 SQL 语言编写出来的代码，叫做 SQL 语句；
3. SQL 语言只能在关系型数据库中使用。

```
>新型数据库：Mongodb， 又叫 非关系型数据库 或 NoSQL数据库，它在一定程度上弥补了传统型数据库的缺陷。


### 前后端的身份认证(Authentication)
>身份认证: 又称 "身份验证"、"鉴权", 指通过一定的手段，完成对用户身份的确认。
>1. 服务端渲染：推荐使用 Session 认证机制。
>>HTTP 协议的无状态性：指客户端的每次 HTTP 请求都是独立的，连续多个请求之间没有直接的关系，服务器不会主动保留每次 HTTP 请求的状态。
```
>>突破 HTTP 协议的无状态性：web开发中的专业术语叫 Cookie，类比现实生活中的 `会员身份认证方式`。
什么是Cookie？ 
>>Cookie是`存储在用户浏览器中的一段不超过 4KB 的字符串`。它由一个`名称`（name）、一个`值`（value）和其它几个用于控制 Cookie `有效期`、`安全性`、`使用范围`的`可选属性`组成。
>>不同域名下的 Cookie 相互独立，每次客户端的请求，会自动把当前域名下所有未过期的 Cookie 一同发送到服务器。
Cookie 的几大特点：
1. 自动发送
2. 域名独立
3. 国企期限
4. 4KB 限制
缺点：不具有安全性，存储在浏览器中，很容易被伪造。
改善："会员卡 + 刷卡认证" 的设计理念, 就是 Session认证机制的精髓。
```

>2. 前后端分离：推荐使用 JWT 认证机制。
>>JWT(JSON Web Token)：用户的信息通过 Token 字符串的形式，保存在客户端的浏览器中。服务器通过还原 Token 字符串的形式来认证用户的身份。
```js
// 结构组成：header.payload.signature
// payload 部分才是真正的用户信息, 它是用户信息加过 base64 加密生成的字符串
// header 和 signature 是安全性相关的部分, 只是为了保证 Token 的安全性
```



[node事件环与nextTick](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/ "node事件环与nextTick")
#### 解析参数的模块
[commander](https://www.npmjs.com/package/commander "commander")
[yargs](https://www.npmjs.com/package/yargs "webpack yargs")

>在网络节点中，负责消费资源的电脑，叫做客户端；
>负责对外提供网络资源的电脑，叫做服务器；
>区别：服务器上安装了 Web 服务器软件，例如：IIS、Apache等，通过安装这些服务器软件，就能把一台普通的电脑变成一台 Web 服务器。
#### node 经常使用的插件
* http node.js提供的、用来创建web服务器得模块。
  通过 http 模块提供的 http.createServer() 方法, 就能把一台普通的电脑,变成一台 Web 服务器,从而对外提供 Web 资源服务。
* chalk 设置控制台输出字体的样式
* progress 控制台中创建进度条
* events 事件触发器
* express 一个保持最小规模的灵活的 Node.js Web 应用程序开发框架
  express 中间件: 处理函数中必须有 next 函数 (next函数是实现多个中间件连续调用的关键, 表示把流转关系转交给下一个中间件或者路由)
* 解决跨域问题的方案:
    什么是CORS?--(Cross-Origin Resource Sharing, 跨域资源共享) 由一系列HTTP响应头组成,这些HTTP响应头决定了浏览器是否组织当前 JS 代码跨域获取资源。
    如果接口服务器配置了CORS相关的HTTP响应头(Access-Control-Allow-Origin:<origin> | *)，就可以解除浏览器端的跨域访问限制。
    CORS在浏览器中有兼容性,只支持XMLHttpRequest Level2的浏览器(如:IE10+、Chrome4+、FireFox3.5+)
    1. CORS 主流的解决方案;
    2. JSONP 有缺陷的解决方案,只支持 get 请求;
    使用CROS:
    1. npm install cors 安装中间件
    2. const cors = require('cros') // 导入
    3. app.use(cros) // 配置中间件
* 简单请求: 客户端和服务器之间只发生一次请求。
* 预检请求: 客户端和服务器之间会发生两次请求，OPTION 预检请求（获取服务器是否允许该实际请求）成功后，才会发起真正的请求。
* JSONP 接口
* jsonwebtoken    // 生成 JWT 字符串
* express-jwt     // 将 JWT 字符串解析还原成 JSON 对象
* bcryptjs        // 对用户密码加密
    1. 加密之后,无法被逆向破解;
    2. 同一明文密码多次加密, 得到的加密结果各不相同, 保证安全性;
---
___ 数据验证, 前端的数据永远不可信, 后端才是数据验证的根本所在 ___
* @hapi/joi              // 为表单中携带的每个数据项,定义验证规则
* @escook/express-joi    // 自动对表单数据进行验证
___ 解析
* [multer](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)
  处理 multipart/form-data 类型的表单数据，它主要用于上传文件
  注意: Multer 不会处理任何非 multipart/form-data 类型的表单数据。

---
[滴答]: 每当事件循环进行一次完整的行程时，我们都将其称为一个滴答。