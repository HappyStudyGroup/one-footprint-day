const http = require('http')
const fs = require('fs')
const express = require('express')
const path = require('path')
let mysql = require('../utils/mysql')


// let indexRouter = require('./routes/index');
// var usersRoute = require('./routes/users');


let app = express()
const cors = require('cors');
app.use(cors())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))



app.all('*', function(req, res, next) {             //设置跨域访问
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 接口
app.get('/', function(req, res) {
  if(req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile(process.cwd() + '/api/routes/index.html', 'utf-8', function(err, data) {
      if(err) {
        res.send('解析html失败')
      }else {
        res.end(data)
      }
    })
  }
})
app.get('/api', function(req, res) {
  let sql = `SELECT * FROM user`;
  let sqlArr = [];
  let callback = (err, data) => {
    if(err) {
      console.log('连接出错了')
    }else {
      res.send({ 'list': data })
    }
  }
  mysql.sqlConnect(sql, sqlArr, callback)
})

let index = 0;
const table = 'user';
let name = '小红' + index;
let gender = index % 2 === 0 ? 'female' : 'male';
let age = index + 10;
let address = ['', '北京市', '河北省', '西安市', '江苏省'][Math.random() + 3];

app.get('/add', function(req, res) {
  index++;
  let sql = `insert into ${table} ('user_name', 'gender', 'age', 'address') values(${name}, ${gender}, ${age}, ${address})`
  let sqlArr = []
  let callback = (err, data) => {
    if(err) {
      console.log('连接出错了')
    }else {
      res.send('mysql成功新增数据!')
    }
  }
  mysql.sqlConnect(sql, sqlArr, callback)
})


let server = app.listen(3434, function() {
  console.log(server.address(), "application is start at port 3434")
});

module.exports = app;
