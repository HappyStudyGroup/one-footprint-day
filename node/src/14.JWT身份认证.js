const express = require('express');

const app = express();

const { expressjwt } = require('express-jwt')
const jwt = require('jsonwebtoken')


const cors = require('cors')
app.use(cors())

// 解析 post 表单的数据的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// 1. 定义 secret 密钥, 越复杂越好
const secretKey = `itsun No1 ^_^`

// 2. 注册将 JWT 字符串解析还原成JSON对象的中间件
// unless 配置不需要访问权限的接口
// 注意：只要配置成功了 express-jwt 中间件，就可以把解析出来的用户信息，挂载到 req.auth 属性上
app.use(expressjwt({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

// 3. 登录接口, 向 Session 中存数据
app.post('/api/login', (req, res) => {
  // 校验用户的提交的登录信息是否正确
  const body = req.body;
  console.log('body: ', body);
  if(body.username !== 'admin' || body.password !== '000000') {
    return res.send({ status: 1, msg: '登录失败!' })
  }
  // jwt.sign 参数: 用户的信息、加密的密钥、配置对象{可以配置当前 token 的有效期}
  // 切记: 不要把密码等相关敏感信息放到这里加密, 不安全.
  const token = jwt.sign({ username: body.username }, secretKey, { expiresIn: '60s' })
  res.send({ status: 0, msg: '登录成功!', token })
})

// 4. 测试获取用户信息
app.get('/admin/getInfo', (req, res) => {
  res.send({ status: 0, msg: '查询成功', data: req.auth })
})


// 5. 在路由的最后增加 捕获错误 中间件, 防止错误导致程序崩溃
app.use((err, req, res, next) => {
  // token 解析失败导致的报错
  if(err.name === 'UnauthorizedError') {
    return res.send({ status: 401, msg: '无效的token' })
  }
  // 其他原因导致的错误
  res.send({ status: 500, msg: '未知错误' })
  next(err);
})

app.listen(80, () => {
  console.log('Server running at http://127.0.0.1');
})