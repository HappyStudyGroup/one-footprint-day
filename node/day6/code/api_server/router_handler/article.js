const db = require("../db")

const path = require('path')


exports.publicArticle = (req, res) => {
  // console.log(req.body); // 文本类型的数据
  // console.log('-----------分割线-----------');
  // console.log(req.files); // 文件类型的数组数据
  if (req.files.length === 0 || req.files[0].fieldname !== 'cover_img') return res.cc("文章封面是必选参数")

  // 整理文章信息
  const articleInfo = {
    ...req.body,
    cover_img: path.join('/uploads', req.files[0].fieldname),
    pub_date: new Date(),
    author_id: req.user.id
  }
  const sql = `insert into ev_articles set ?`
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')
    // 发布文章成功
    res.send({ status: 0, message: '发布文章成功' })
  })
}