
const db = require('../db/index')


exports.getArticleCates = (req, res) => {
  const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
  db.query(sql, (err, results) => {
    if(err) return res.cc(err)
    res.send({
      status: 0,
      message: "获取文章分类数据成功!",
      data: results
    })
  })
}

exports.addArticleCates = (req, res) => {
  const sql = `select * from ev_article_cate where name=? or alias=?`
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    const isNameSame = results[0].name === req.body.name
    const isAliasSame = results[0].alias === req.body.alias
    if(err) return res.cc(err)
    // 分类别名 和 分类名称 都被占用
    if(results.length === 2) return res.cc("分类名称和别名被占用，请更换后重试")
    if(results.length === 1 && isNameSame && isAliasSame) {
      return res.cc("分类名称和别名被占用，请更换后重试")
    }
    // 分类别名 和 分类名称 分别被占用
    if(results.length === 1 && isNameSame) {
      return res.cc("分类名称被占用，请更换后重试")
    }
    if(results.length === 1 && isAliasSame) {
      return res.cc("分类别名被占用，请更换后重试")
    }
    const sqlAdd = `insert into ev_article_cate set ?`
    db.query(sqlAdd, req.body, (err, results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) return res.cc("新增分类失败")
      res.send({ status: 0, message: "新增分类成功" })
    })
  })
}

exports.getArtCateById = (req, res) => {
  const sql = `select * from ev_article_cate where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc("获取文章详情失败")
    res.send({ status: 0, message: "获取文章信息成功", data: results[0] })
  })
}

exports.deleteCateById = (req, res) => {
  const sql = `select * from ev_article_cate where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc("该文章分类不存在")
    // 用逻辑删除比较合适, 而且数据库用的是标记删除
    // const sqlDel = `delete from ev_article_cate where id=?`
    const sqlDel = `update ev_article_cate set is_delete=1 where id=?`
    db.query(sqlDel, req.params.id, (err, results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) return res.cc("删除分类失败")
      res.send({ status: 0, message: "删除分类成功" })
    })
  })
}

exports.updateArtCate = (req, res) => {
  // 查询 分类名称 和 分类别名 是否被占用 的 SQL 语句
  const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
  db.query(sql, [req.query.id, req.query.name, req.query.alias], (err, results) => {
    if(err) return res.cc(err)
    const isNameSame = results[0]?.name === req.query.name
    const isAliasSame = results[0]?.alias === req.query.alias
    if(err) return res.cc(err)
    // 分类别名 和 分类名称 都被占用
    if(results.length === 2) return res.cc("分类名称和别名被占用，请更换后重试")
    if(results.length === 1 && isNameSame && isAliasSame) {
      return res.cc("分类名称和别名被占用，请更换后重试")
    }
    // 分类别名 和 分类名称 分别被占用
    if(results.length === 1 && isNameSame) {
      return res.cc("分类名称被占用，请更换后重试")
    }
    if(results.length === 1 && isAliasSame) {
      return res.cc("分类别名被占用，请更换后重试")
    }
    const sqlUpdate = `update ev_article_cate set ? where id=?`
    db.query(sqlUpdate, [req.query, req.query.id], (err, results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) return res.cc("修改分类失败")
      res.send({ status: 0, message: "修改分类成功" })
    })
  })
}