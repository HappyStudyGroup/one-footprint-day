
// 什么时候标识类型 什么时候不用标识

// ts自带类型推断的功能
let name; // 当没有赋值的时候, 默认是 any
name = 'zf';
name = 11;

// 默认在初始化的时候会进行类型推导
let name1 = 'zf';

// -------------------------------

// number Number    string String
// 使用基本数据类型时, 会将原始数据类型 包装成 对象类型
11..toString(); // => 11.0.toString() => Number(11).toString()
let number1:number = 11;
let number2:Number = 11;
let number3:number = Number(11); // 11
// let number4:number = new Number(11); // {}, 错误语法,不能把实例赋予基本数据类型
// 类也是一个类型, 可以描述实例
let number5:Number = new Number(11);

/* 
 * 1.对象
 * 语法：{ 属性名：属性值，属性名：属性值 }
 * 属性名 + ？，表示属性是可选的
 * [xx:string]:属性值，表示任意属性
*/
let b: { name:string, age?:number }
b = { name: 'Hisun' }
let c:{name:string, [xx:string]:any}
c = { name: 'Hisun', age: 18, gender: 'male' }
/**
 * 2.函数结构的类型声明
 * 语法：(形参：类型，形参：类型，...) => 返回值
*/
let d: (a:number, b:number) => number;
d = function (a, b) {
  return a + b
}
// 3. 联合类型 |
let e:string|number;
e = 1;
e = '2';

// 4. 字面量类型或值
let f: string|1;
f = 'hello' || 1

// 5. any, 类型为any的值, 可以赋给任何类型
let g;
let h:any;
g = f;

// 6. unknow, 带有安全检查的 any, 不能直接赋给其他的类型
let i:unknown;
// 下面两种方法, 将 unknow 类型 赋给其他类型
if(typeof i === 'string') {
  f = i
}
f = i as any; // 类型断言

// 7. tuple 元组, 也就是固定类型固定长度的数组
let j:[string, number];
j = ['1', 2]

// 8. enum 枚举
type Gender = {
  male: 0,
  female: 1
}
let k:Gender['male'];
k = 0

interface obj {
  name: string;
  age: number;
  // [xx:string]: any;
}

























export {}
