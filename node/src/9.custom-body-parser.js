const querystring = require('querystring')

const bodyParser = (req, res, next) => {
  // 定义中间件具体的业务逻辑
  // 1. 定义一个 str 字符串, 接收客户端发送过来的请求体
  let str = ''
  // 2. 监听 req 的 data事件, 拼接数据
  req.on('data', (chunk) => {
    str += chunk
  })
  // 3. 监听 req 的 end 事件, 这个时候的 str 就是完整的数据
  req.on('end', () => {
    console.log('解析成对象格式: ', str);
    // 把字符串格式的请求体数据, 解析成对象格式
    const body = querystring.parse(str)
    req.body = body;
    console.log(body);
    next();
  })
}

module.exports = bodyParser