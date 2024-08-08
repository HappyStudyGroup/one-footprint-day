const http = require('http');
const fs = require('fs');
const path = require('path');
// const cors = require('cors')
 
const PORT = 3010; // 服务器端口
const FLV_FILE = path.resolve(__dirname, './static/response.flv')
 
const app = http.createServer((req, res) => {
  const stat = fs.statSync(FLV_FILE);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
 
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(FLV_FILE, { start, end });
    const head = {
      'Access-Control-Allow-Origin': '*',
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/x-flv',
    };
    
    res.writeHead(200, head);
    file.pipe(res);
  } else {
    const head = {
      'Access-Control-Allow-Origin': '*',
      'Content-Length': fileSize,
      'Content-Type': 'video/x-flv',
    };
    res.writeHead(200, head);
    fs.createReadStream(FLV_FILE).pipe(res);
  }
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});