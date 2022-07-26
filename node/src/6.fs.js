const path = require('path')
const fs = require('fs')
const http = require('http')


const regStyle = /<style>[\s\S]*<\/style>/
const regScript = /<script>[\s\S]*<\/script>/
const filePath = path.join(__dirname, './tests/index.html')
const fileExt = path.extname(filePath);
const fileName = path.basename(filePath, fileExt);

fs.readFile(filePath, 'utf-8', (err, dataStr) => {
  if(err) {
    return console.log('读取文件失败：', err.message)
  }
  console.log('读取成功!');
  resolveCss(dataStr);
  resolveJs(dataStr);
  resolveHtml(dataStr);
})
function resolveCss (htmlStr) {
  const r1 = regStyle.exec(htmlStr);
  const newCss = r1 ? r1[0].replace('<style>', '').replace('</style>', '') : "";
  // writeFile 不存在就创建文件, 重复使用是覆盖
  fs.writeFile(path.join(__dirname, `./tests/${fileName}.css`), newCss, (err) => {
    if(err) {
      return console.log('css写入失败: ', err.message)
    }
    console.log('css写入成功!');
  })
}
function resolveJs (htmlStr) {
  const r1 = regScript.exec(htmlStr);
  const newCss = r1 ? r1[0].replace('<script>', '').replace('</script>', '') : "";
  // writeFile 不存在就创建文件, 重复使用是覆盖
  fs.writeFile(path.join(__dirname, `./tests/${fileName}.js`), newCss, (err) => {
    if(err) {
      return console.log('script写入失败: ', err.message)
    }
    console.log('script写入成功!');
  })
}

function resolveHtml(htmlStr) {
  const newHtml = htmlStr.replace(regStyle, `<link rel='stylesheet' type='text/css' href='./index.css' >`)
    .replace(regScript, `<script type='text/javascript' src='./index.js'></script>`)
  fs.writeFile(path.join(__dirname, './tests/clock.html'), newHtml, err => {
    if(err) {
      return console.log('新的 html 写入失败: ', err.message)
    }
    console.log('新的 html 写入成功!');
  })
}


// 读取全部文件信息，在完成时调用回调函数，文件较大时，等待时间较长。
// const server = http.createServer(function(req, res) {
//   fs.readFile(path.join(__dirname, '/README.md'), 'utf-8', (err, data) => {
//     /**
//      * 读取成功时：err = null
//      * 读取失败时：data = undefined
//      */
//     if(err) {
//       return console.log('读取文件失败：', err.message)
//     }
//     res.setHeader('Content-Type','text/html;charset=utf-8');
//     res.end(data)
//   })
// })
// // 写入文件
// fs.writeFile(path.join(__dirname, './tests/1.txt'), 'abcd', (err) => {
//   if(err) {
//     return console.log('写入文件失败：', err.message)
//   }
//   console.log('写入成功');
// })
// 使用 `流` 处理
// const server = http.createServer(function(req, res) {
//   const stream = fs.createReadStream(__dirname + '/README.md');
//   res.setHeader('Content-Type','text/html;charset=utf-8'); // 设置响应头，防止中文乱码
//   stream.pipe(res)
// })
// server.listen(3000, () => {
//   console.log("http server is running at http://127.0.0.1:3000");
// })