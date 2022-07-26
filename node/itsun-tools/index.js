// 这是包的入口文件
const date = require('./src/dateFormat.js');
const escape = require('./src/htmlEscape.js');

// 对外共享的成员
module.exports = {
  ...date,
  ...escape
}