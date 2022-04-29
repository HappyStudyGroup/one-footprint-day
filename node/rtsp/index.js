const express = require('express')
const fs = require('fs');
const path = require('path');
const requestmanager = require('../utils/RequestManager')


var router = express.Router();

router.get('/', function (req, res) {
  console.log('Carmeras Server is Runing...');
  res.writeHead(200, { 'Content-Type': 'text/html' })
  fs.readFile(process.cwd() + '/video/index.html', 'utf-8', function(err, data) {
    if(err) {
      res.send('解析html失败')
    }else {
      res.end(data)
    }
  })
});

/* GET users listing. */
router.post('/', function (req, res) {
  var cfg = req.body
  let result = new requestmanager().Open(cfg)
  res.json(result)
});

router.post('/close', function (req, res) {
  var cfg = req.body
  new requestmanager().Close(cfg)
  res.json({ state: 'close the rtsp stream success.' })
})

module.exports = router;