const express = require('express')
const session = require('express-session')



const app = express();

// 1. 配置 Session 中间件
app.use(session({
  secret: 'itsun',
  resave: false,
  saveUninitialized: true
}))
// 托管静态页面
// app.use(express.static('../day6/code/01.session案例/pages'))
app.use(express.static('../src'))
// 解析 post 提交过来的表单
app.use(express.urlencoded({ extended: false }))

// 2. 登录接口, 向 Session 中存数据
app.post('/api/login', (req, res) => {
  // 校验用户的提交的登录信息是否正确
  const body = req.body;
  if(body.username !== 'admin' || body.password !== '000000') {
    return res.send({ status: 1, msg: '登录失败!' })
  }
  req.session.user = body;        // 将用户信息, 存储到 Session 中
  req.session.islogin = true;     // 将登录状态, 存储到 Session 中

  res.send({ status: 0, msg: '登录成功!' })
})

// 3. 获取用户信息的接口
app.get('/api/username', (req, res) => {
  if(!req.session.islogin) {
    return res.send({ status: 1, msg: 'fail' })
  }
  res.send({ status: 0, msg: 'success', username: req.session.user.username })
})
// 4. 退出登录接口, 清空用户信息
app.post('/api/logout', (req, res) => {
  // 清空当前客户端对应的 Session 信息
  req.session.destroy();
  res.send({ status: 0, msg: '退出登录成功' })
})


app.listen(80, () => {
  console.log('Server running at http://127.0.0.1');
})