const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;            // aa-aa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;      // aa:aa
const startTagOpen = new RegExp(`^<${qnameCapture}`);     // 匹配标签名  [1]
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 标签的结束名字  [0]
                  //      style=                     "xxx"     | 'xxx'    |  xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/;

const startTagClose = /^\s*(\/?)>/;


/*  AST 语法树 <div style="color:red;"><span>{{name}}</span></div>
 const ast = {
   tag: 'div',
   type: 1,
   attrs: [{style: "color: red;"}],
   children: [
     { tag: 'span', type: 1, attrs:[], children, parent }
   ],
   parent: null
 }
*/

export function parseHTML(html) {
  function createASTElement(tag, attrs) { // vue3里面支持多个根元素(外层加了一个空元素), vue2只有一个根元素
    return {
      tag,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }
  let root = null;
  let currentParent;
  let stack = [];
  // 根据开始标签,结束标签,文本内容,生成一个ast语法树
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs);
    if(!root) {
      root = element;
    }
    currentParent = element;
    stack.push(element);  // [div] -> [div, div] -> [div, div, span]
  }
  function end(tagName) {
    let element = stack.pop(); // [div, div] -> [div] -> []
    currentParent = stack[stack.length - 1]
    if(currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }
  function chars(text) {
    text = text.replace(/\s/g, '')
    if(text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }

  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if(start) {
      let match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length); // 获取元素
      // 查找属性
      let end, attr;
      // 不是开头标签的结尾就一直解析
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || '' });
      }
      if(end) {
        advance(end[0].length);
        return match
      }
    }
  }
  while(html) {
    let textEnd = html.indexOf('<');
    if(textEnd === 0) {
      let startTagMatch = parseStartTag();
      if(startTagMatch) { // 开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }
      // 结束标签
      let endTagMatch = html.match(endTag);
      if(endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1])
        continue;
      }
    }
    /**
     *  <div style="color:red;">
          <span>{{name}}</span>
        </div>
      </div>
     */
    let text;
    if(textEnd > 0) { // 开始解析文本
      text = html.substring(0, textEnd);
    }
    if(text) {
      advance(text.length);
      chars(text)
    }
  }
  return root
}