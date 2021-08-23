import { generate } from "./generate";
import { parseHTML } from "./parse";


export function compileToFunctions(template) {
  let root = parseHTML(template);
  let code = generate(root); // 生成代码
  console.log(code)
  // `with(this){return ${code}}`
}
