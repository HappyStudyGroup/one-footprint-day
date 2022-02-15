
// 类型推断
// 特性: 
// 场景: 
//  1. 当赋值时会推断, (不赋值是any)

//  2. 函数默认会进行推断, 函数会根据右边的赋值, 推导左边的类型
//  3. 返回值的推断
const sum = (a:string, b:string) => {
  return {a, b}
}
//  4. 属性推断
let school = { // 需要限制必须要添加类型
  name: 'zf',
  age: 18
}
let { name } = school;

interface ISchool {
  name:string,
  age:number,
  address:{
    n:string
  }
}
type n = ISchool['address']['n']; // 接口取属性, 只能用 []
// 类型的反推

type MySchool = typeof school;

export {}