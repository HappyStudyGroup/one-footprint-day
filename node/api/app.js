var http = require('http')
var fs = require('fs')
var express = require('express')
var path = require('path')
var mysql = require('../utils/mysql')


var indexRouter = require('./routes/index');
// var usersRoute = require('./routes/users');


var app = express()
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
// app.get('/', indexRouter)
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

app.listen(3434, console.log("application is start at port 3434"));

module.exports = app;
