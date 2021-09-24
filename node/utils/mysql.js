const mysql = require('mysql')

module.exports = {
  config: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'sun'
  },
  // 使用mysql连接池, 连接数据库
  // 连接池对象, 减少数据查询时间
  sqlConnect: function(sql, sqlArr, callback) {
    var pool = mysql.createPool(this.config)
    pool.getConnection((err, conn) => {
      console.log('数据库连接成功!')
      if(err) {
        console.log('数据库连接失败', err)
        return
      }
      // 事件驱动回调
      conn.query(sql, callback)
      // 释放连接
      conn.release()
    })
  }
}

