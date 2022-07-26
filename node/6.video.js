var express = require('express');
var app = express();

app.all('*', function(req, res, next) {             //设置跨域访问
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.listen(3434, function() {
  console.log("application is start at: http://localhost:3434")
});
app.use('/', require('./video'))


//404判断
app.use(function (req, res) {
  res.send('404 not found');
});
