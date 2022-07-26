const path = require('path')
const fs = require('fs')
const http = require('http')


const server = http.createServer();

server.on('request', (req, res) => {
  /**
   * req 请求对象，包含与客户端相关的数据和属性
   * req 响应对象，访问与服务器相关的数据和属性
   */
  const url = req.url
  const method = req.method
  let content= `Your request url is ${url}, and 请求类型是 ${method}`
  console.log('someone visit our web server.', content);
  // 把请求的 URL 地址映射为具体的文件路径
  let fpath = ''
  if (url === '/') {
    fpath = path.join(__dirname, './tests/clock.html')
  } else {
    fpath = path.join(__dirname, './tests', url)
  }
  // 根据 "映射" 过来的文件路径, 读取文件的内容
  fs.readFile(fpath, 'utf-8', (err, fileConStr) => {
    if(err) {
      return console.log('读取文件失败: 404 not found');
    }
    console.log('读取文件成功!');
    // 为了防止中文显示乱码问题
    // res.setHeader('Content-Type', 'text/html;charset=utf-8')
    // res.end 将内容响应给客户端
    res.end(fileConStr)
  })


  
})

server.listen(8080, () => {
  console.log('Server running at http://127.0.0.1:8080');
})