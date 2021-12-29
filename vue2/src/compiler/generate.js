
const defaultTagRE = /\{\{((?:.|\r?\n)*?)\}\}/g;

function genProps(attrs) {
  let str = ''
  for(let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]; // name, value
    if(attr.name === 'style') {
      let obj = {};
      attr.value.split(';').forEach(item => {
        if(!item) return; // 处理 style="color:red;"
        let [key, value] = item.split(':');
        obj[key] = value
      })
      attr.value = obj; // { style: { color: red } }
    }
    str += `${attr.name}: ${JSON.stringify(attr.value)},` // {a: "aaa", b: "bbb", ...}
  }
  return `{${str.slice(0, -1)}}`
}

function gen(node) { // 区分是元素还是文本
  if(node.type === 1) { // 元素
    return generate(node);
  }else {               // 文本
    // 1. {{}}
    // 2. 混合文本, {{}} + 文本
    let text = node.text
    // _s => JSON.stringify()的简写
    if(defaultTagRE.test(text)) { // _v(_s(name) + 'aa' + _s(age) + 'haha')
      // 带有{{}}
      let tokens = [];
      let match;
      let index = 0;
      let lastIndex = defaultTagRE.lastIndex = 0;
      while(match = defaultTagRE.exec(text)) {
        // {{name}} aa {{age}} haha
        index = match.index
        if(index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if(lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join('+')})`

    }else {
      return `_v(${JSON.stringify(text)})`
    }
  }
}

function genChildren(el) {
  const children = el.children;
  if(children) {
    return children.map(child => gen(child)).join(',')
  }
}

export function generate(el) {
  // 转换成render代码
  let children = genChildren(el);
  let code = `_c('${el.tag}',${
    el.attrs.length? genProps(el.attrs):'undefined'
  }${
    children? (',' + children) : ''
  })`
  // ast树 => js代码, html -> js代码, 字符串拼接
  return code
}

/**
<div id="app" a="1" b='2'>
  <span style="color:red;">{{name}} <a href="#">hello</a></span>
</div>
render() {
  return _c(
    'div', { id: 'app', a: 1, b: 2 },
    _c(
      'span',
      { style: { color: 'red' } },
      _s(_v(name)),
      _c('a', undefined, _v('hello'))
    )
  )
}
*/