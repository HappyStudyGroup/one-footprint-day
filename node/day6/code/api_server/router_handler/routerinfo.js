const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`

  db.query(sql, req.user.id, (err, results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc('获取用户信息失败')

    // 用户信息获取成功
    res.send({ status: 0, message: '用户信息获取成功', data: results[0]})
  })

}

// 更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
  const { id, nickname, email } = req.body;
  // const sql = `update ev_users set nickname=?, email=? where id=?`;
  // db.query(sql, [nickname, email, id], (err, results) => {
  const sql = `update ev_users set ? where id=?`;
  db.query(sql, [req.body, id], (err, results) => {
    if(err) return res.cc(err);
    if(results.affectedRows !== 1) return res.cc('更新用户信息失败')
    // 更新用户信息成功
    res.send({ status: 0, message: '更新用户信息成功' })
  })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
  // 更具 id 查询用户的信息
  const sql = `select * from ev_users where id=?`
  db.query(sql, req.user.id, (err, results) => {
    // 执行 SQL 语句失败
    if(err) return res.cc(err)
    // 判断结果是否存在
    if(results.length !== 1) return res.cc('用户不存在')

    // 判断用户输入的旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if(!compareResult) return res.cc('旧密码错误')

    // TODO: 对密码进行加密
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

    const sqlPwd = `update ev_users set password=? where id=?`
    db.query(sqlPwd, [newPwd, req.user.id], (err, results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) return res.cc("更新密码失败")
      res.send({ status: 0, message: "更新密码成功" })
    })

  })
}

// 更换用户头像的处理函数

exports.updateAvator = (req, res) => {
  const sql = `update ev_users set user_pic=? where id=?`
  db.query(sql, [req.body.avator, req.user.id], (err, results) => {
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc("更换头像失败")
    res.send({ status: 0, message: "更换用户头像成功" })
  })
}