### 安装

```
npm install itsun-tools
```

### 导入

```
const itsun = require('itsun-tools')
```

### 格式化时间

```js
// 调用 dateFormat 对时间进行格式化
const dtStr = itsun.dateFormat(new Date());
console.log(dtstr);
// 结果: 2022-07-08 14:42:00
```

### 转义 HTML 中的特殊字符
```js
// 带转换的 HTML 字符串
const htmlStr = '<h1 title="abc">这是h1标签<span>123&nbsp;</span></h1>';
// 调用 htmlEscape 方法进行转换
let str = itsun.htmlEscape(htmlStr);
console.log(str);
// 结果: &lt;h1 title=&quot;abc&quot;&gt;这是h1标签&lt;span&gt;123&amp;nbsp;&lt;/span&gt;&lt;/h1&gt;
```

### 还原 HTML 中的特殊字符

```js
// 待还原的 HTML 字符串
const nstr = itsun.htmlUnEscape(str);
console.log(nstr)
// 结果: <h1 title="abc">这是h1标签<span>123&nbsp;</span></h1>
```

### 开源协议
ISC