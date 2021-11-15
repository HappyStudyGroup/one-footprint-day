const { series, parallel, src, dest, symlink } = require("gulp")
const fs = require("fs")
const babel = require("gulp-babel"); // Babel is a JavaScript compiler.

async function asyncAwaitTask() {
  /**
    * fs.readFile(filename,[encoding],[callback(err,data)]) 读取文件的函数。
    * 它接受一个必选参数  filename
    * 第二个参数  encoding是可选的，表示文件的字符编码。
    * callback 是回调函数，用于接收文件的内容
    * 如果不指定  encoding ，则  callback 就是第二个参数。回调函数提供两个参数  err 和  data
    * 如果指定了  encoding ， data 是一个解析后的字符串，
    * 否则  data 将会是以  Buffer 形式表示的二进制数据。
  */
  const { version } = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  console.log(version);
  await Promise.resolve('some result');
}

function destCssFile() {
  return src('antd.css').pipe(dest('dist/'))
}

function symlinkCssFile() {
  return src('antd.css').pipe(symlink('output/'))
}

function destJsFile() {
  return src('src/*.js').pipe(babel({presets: ["@babel/env"]})).pipe(dest('output/'))
}

function clean(cb) {
  cb();
}

function build(cb) {
  cb();
}


exports.build = build;
exports.default = series(asyncAwaitTask, destCssFile, /* symlinkCssFile, */destJsFile, parallel(clean, build))