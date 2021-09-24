var express = require('express');
var router = express.Router();

var dbConfig = require('../../utils/mysql')

/* GET home page */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'index' })

  let sql = `SELECT * FROM user`;
  let sqlArr = [];
  let callback = (err, data) => {
    if(err) {
      console.log('连接出错了')
    }else {
      res.send({ 'list': data })
    }
  }

  dbConfig.sqlConnect(sql, sqlArr, callback)

});

module.exports = router;