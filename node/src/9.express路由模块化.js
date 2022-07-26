const express = require('express')
const router = express.Router();

router.get('/user/list', (req, res) => {
  res.send('Get user list')
})

router.post('/user/add', (req, res) => {
  res.send('Add new user')
})

// 导出路由对象
module.exports = router;

/**
 * 如何注册router
 *    const express = require('express')
 * 1. const userRouter = require('./express路由模块化.js')
 * 2. const app = express()
 * 3. app.use(userRouter) // 简单使用
 * 4. 可以为路由模块添加统一访问前缀, 如: /api/user/list
 *    app.use('/api', userRouter)
 */