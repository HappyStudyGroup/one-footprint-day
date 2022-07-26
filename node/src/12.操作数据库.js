const mysql = require('mysql')

// 1. 建立和数据库的连接关系
const db = mysql.createPool({
  host: '127.0.0.1',    // 数据库的 IP 地址
  user: 'root',         // 账号
  password: '123456',   // 密码
  database: 'my_db_01'   // 指定操作的数据库
})

// 2. 测试 mysql 模块是否正常连接
// db.query('select 1', (err, res) => {
//   if(err) {
//     return console.log('连接失败: ', err.message);
//   }
//   console.log('连接成功!', res);
// })

// 3. 查询 users 表中所有的数据
const sqlStr = 'select * from users'

db.query(sqlStr, (err, res) => {
  if(err) {
    return console.log('查询失败: ', err.message);
  }
  // 注意: 如果执行的 sql语句是select 查询语句, 执行结果 res 是一个数组
  console.log('查询成功!');
})

// 4. 向 users表中插入数据, ? 用来占位
// const user = { username: 'Jelly', password: '123456' }
// 一般方式
// const sqlStr2 = 'insert into users (username, password) values (?, ?)'
// db.query(sqlStr2, ['spider-man', 'abcd123'], (err, res) => {})
// 便捷方式
// const sqlStr2 = 'insert into users set ?'
// db.query(sqlStr2, user, (err, res) => {
//   if(err) {
//     return console.log('插入失败: ', err.message);
//   }
//   // 注意: 如果执行的 sql语句是 insert into 语句, 执行结果 res 是一个对象
//   // affectedRows === 1, 表示插入成功
//   if(res.affectedRows === 1) {
//     console.log('插入成功!');
//   }
// })

// 5. update 更新数据
// const user3 = { id: 5, username: 'spider-man', password: '123456' };
// // 一般方式
// // const sqlStr3 = 'update users set username=?, password=? where id=?'
// // db.query(sqlStr3, [user3.username, user3.password, user3.id], (err, res) => {})
// // 便捷方式
// const sqlStr3 = 'update users set ? where id=?'
// // 便捷方式, 批量更新多个属性
// db.query(sqlStr3, [user3, user3.id], (err, res) => {
//   if(err) {
//     return console.log('更新失败: ', err.message);
//   }
//   // affectedRows === 1, 表示更新成功
//   if(res.affectedRows === 1) {
//     console.log('更新成功!');
//   }
// })

// 6. delete 删除数据
// const sqlStr4 = 'delete from users where id=?'
// db.query(sqlStr4, 3, (err, res) => {
//   if(err) return console.log('删除失败: ', err.message);
//   if(res.affectedRows === 1) {
//     console.log('删除成功!');
//   }
// })

// 7. 标记删除(逻辑删除)
// const sqlStr5 = `update users set status=? where id=?`
// db.query(sqlStr5, [1, 8], (err, res) => {
//   if(err) {
//     return console.log('标记删除失败: ', err.message);
//   }
//   // affectedRows === 1, 表示标记删除成功
//   if(res.affectedRows === 1) {
//     console.log('标记删除成功!');
//   }
// })