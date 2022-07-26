const express = require('express')
const app = express();

// 1. 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));

// 4. 在配置 cors 中间件之前， 配置 JSONP 接口
app.get('/api/jsonp', (req, res) => {
  // 定义 JSONP 接口具体的实现过程
  // 1. 得到函数名称
  const funcName = req.query.callback;
  // 2. 定义要发送到客户端的数据
  const data = { name: 'Hisun', age: 18 }
  // 3. 拼接一个函数调用字符串
  const scriptStr = `${funcName}(${JSON.stringify(data)})`
  // 4. 把拼接的字符串，响应给客户端
  res.send(scriptStr);
})

// 2. 在路由之前, 配置 cors 中间件, 从而解决接口跨域问题
const cors = require('cors');
app.use(cors());


// 3. 把路由模块注册到app
const router = require('./apiRoute/index.js');
app.use('/api', router);







// 启动服务器
app.listen(80, () => {
  console.log('Express server running at http://127.0.0.1');
})