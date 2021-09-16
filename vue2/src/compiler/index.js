import { generate } from "./generate";
import { parseHTML } from "./parse";


export function compileToFunctions(template) {
  let root = parseHTML(template);
  let code = generate(root); // 生成代码

  let render = `with(this){return ${code}}`
  let fn = new Function(render); // 可以让字符串变成函数

  return fn
}
