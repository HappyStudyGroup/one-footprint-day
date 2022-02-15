
// 函数想要表示类型
// 考虑入参和函数的返回值
// 声明 不赋值 就是 any 类型
// 1. function函数关键字声明
function sum1(a:string, b:string):string {
  return a + b
}


// 2. 表达式声明
// 你如果定义了类型, 可以把一个类型兼容的函数赋予它
type Sum = (a1:string,b1:string) => string
let sum2:Sum = (a:string, b:string):string => {
  return a + b
}
sum2('1', '2');

// 可选参数 ? , 默认值
// b? 表示可以不传递
let sum3 = (a:string, b?:string) => {}
let sum4 = (a:string, b:string='b') => {}

// 剩余参数
let sum5 = (...args:(number|string|object)[]) => {
  console.log(args);
}
sum5(1, 2, '3', 4, {})

// * 函数的重载
// 希望把一个字符串或者数字转换成数组
// 123 => [1,2,3]
// '123' => ['1','2','3']
function toArray(value:number):number[]
function toArray(value:string):string[]
function toArray(value:number|string) {
  if(typeof value === 'string') {
    return value.split('');
  }else {
    return value.toString().split('').map(item => parseInt(item))
  }
}
toArray(123);
toArray('123');



export {}