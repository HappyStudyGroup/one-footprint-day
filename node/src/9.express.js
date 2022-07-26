const express = require('express');
const userRouter = require('./9.express路由模块化.js'); // 导入路由模块
const customBodyParser = require('./9.custom-body-parser.js');


// 1. 创建 web 服务器
const app = express();

// 4. 对外提供静态资源
app.use(express.static('./images')); // 路径不包括指定的目录,例如 xx/aa
app.use('/images', express.static('./images')); // 路径包含 xx/images/aa

// 5. 注册路由模块
app.use(userRouter); 

// 注意: app.use() 函数作用,就是来注册全局中间件, 连续调用多个中间件时, 多个中间件之间共享 req、res
// 除了错误级别的中间件需要在路由之后配置,其他的中间件都要在路由之前配置
// express@4.16.0+ 内置中间件json, urlencoded
// express < 4.16.0 , 使用 body-parser 插件
// app.use(express.json()) // 服务端解析请求体中的json数据, 否则 req.body = undefined
// app.use(express.urlencoded({ extended: false })) // 服务端解析表单中的 url-encoded 数据, 否则 req.body = undefined

// 6. 注册全局中间件
// const mw = function (req, res, next) {
//   console.log('全局中间件函数');
//   next();
// }
// app.use(mw);
app.use((req, res, next) => {
  console.log('全局中间件函数简化形式');
  // 获取请求到达服务器的时间
  const time = new Date();
  // 为 req 对象, 挂载自定义属性, 从而把时间共享给后面的所有路由
  req.startTime = time;
  next();
})
// 7. 注册局部生效的中间件
const mw1 = function (req, res, next) {
  console.log('局部生效的中间件', req.url);
  next()
}

// 8. 自定义解析表单数据的中间件
app.use(customBodyParser)


// 3. 监听客户端的 GET、 POST 请求，并向客户端响应具体的内容
// express路由, 指客户端请求与服务器处理函数之间的映射关系
// 组成: 请求的类型、请求的 URL 地址、处理函数

// 注册多个局部中间件
// app.get('/', mw, mw1, (req, res) => {})
// app.get('/', [mw, mw1], (req, res) => {})
app.get('/', mw1, (req, res) => {
  // req.query 默认是 {}, 获取 get 形式的参数
  console.log(req.startTime);
  res.send(req.startTime);
})
app.get('/user', (req, res) => {
  // 向客户端响应 数据
  res.send({ name: 'sun', age: 20, gender: '男' })
})
app.post('/user', (req, res) => {

  // 向客户端响应 数据
  res.send(req.body)
})
app.get('/user/:id/:name', (req,res) => {
  // 这里的 :id 是动态参数
  // req.params 是动态匹配到的 URL 参数, 默认也是一个空对象
  console.log(req.params);
  res.send(req.params); 
})

// 2. 启动 web 服务器
app.listen(80, () => {
  console.log('express server running at http://127.0.0.1');
})
