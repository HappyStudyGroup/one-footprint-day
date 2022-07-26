const express = require('express')

const router = express.Router();


router.get('/get', (req, res) => {
  const query = req.query;
  res.send({
    status: 0,
    msg: 'GET 请求成功',
    data: query
  })
})


router.post('/post', (req, res) => {
  const body = req.body;
  res.send({
    status: 0,
    msg: 'POST 请求成功',
    data: body
  })
})

router.put('/put', (req, res) => {
  const body = req.body;
  res.send({
    status: 0,
    msg: 'PUT 请求成功',
    data: body
  })
})

router.delete('/delete', (req, res) => {
  const body = req.body;
  res.send({
    status: 0,
    msg: 'DELETE 请求成功',
    data: body
  })
})

module.exports = router;