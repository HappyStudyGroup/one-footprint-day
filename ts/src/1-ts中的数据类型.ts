// ts 中拥有的类型

// 1. 基础类型
// 1.1 数字 字符串 布尔类型
// 所有的类型 (: 后面的都是类型) (= 后面的都是值)

let num:number = 10;
let str:string = 'zf';
let bool: boolean = true;

// 1.2 元组 表示长度和个数 (内容存放类型) 都限制好了
let tuple: [string,number,boolean] = ['zf', 11, true];
// 可以向元组中添加内容(只能添加元组中声明的类型),
// 不能通过索引添加属性
tuple.push('world');
tuple[0] = 'Jelly';



// 1.3 数组 存放一类类型的集合
let arr1:number[] = [1, 2, 3];
let str1:string[] = ['1', '2'];

// 1.4 联合类型可以看作并集, 既能使用数字, 又能使用字符串
let arr3:(number|string)[] = [1, '2'];
let arr4:Array<number | string> = [1, 2, 3, '5']; // 泛型
// let arr5:any[] = [1, '2', true]; // 什么都能放


// 1.5 枚举类型 默认下标从0开始
// enum USER_ROLE {
//   USER,
//   ADMIN,
//   MANAGE
// }
// 默认可以正向取出, 也可以反举
// console.log(USER_ROLE.USER, USER_ROLE[0]); // 0 'USER
// 异构枚举 可以在枚举中存放不同的类型
// enum USER_ROLE {
//   USER='a',
//   ADMIN=1,
//   MANAGE
// }
// 可以通过数字, 自动向下推断, 非数字无法反举
// console.log(USER_ROLE.USER, USER_ROLE[0]); // 'a' undefined

// 常量枚举 只提供一个类型, 打包后只有一个值,更干净
// 好处: 有提示功能, 可以使用 . 即 USER_ROLE.USER, 更具有语义化
const enum USER_ROLE{
  USER,
  ADMIN
}
console.log(USER_ROLE.USER);

// any 不进行类型检测 相当于没有写类型, 能不写any尽量不写
let arr:any = ['zf', 11, false, {}, function(){}];
let child = arr[4]; // 所有的子也都是any

// null 和 undefined 任何类型的子类型, 严格模式下(会进行非空检测), 只能将null 和 undefined 赋予给 null undefined
let str2:number | string | undefined;
str2 = undefined

// void 空类型 只能接受 null 和 undefined , 一般用于函数的返回值
// 函数默认返回值 undefined, 默认严格模式下, 不能将 null 赋给 void
let v:void;
// v = null;

// never 永远不 是任何类型的子类型, 可以把 never 赋给任何类型
// 场景: 永远达不到的情况, 1:错误; 2:死循环; 3: 类型判断时会出现never
function myError():never {
  throw new Error()
}
function whileTrue():never{
  while(true){}
}
function byType(val:string|number|boolean){
  if(typeof val === 'string') {
    val // string
  }else if(typeof val === 'number') {
    val // number
  }else {
    val // boolean or never
  }
}
// let n:never = myError();

// Symbol   (Symbol表示独一无二)
let s1 = Symbol('123');
let s2 = Symbol('123');
let obj = {
  [s1]: 'xxx'
}
console.log('Symbol: ', s1 === s2); // false
// console.log(obj[s1]); // 类型“symbol”不能作为索引类型使用

// BigInt 
// Number.MAX_SAFE_INTEGER js 最大数值 2 ** 53
let num1 = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
let num2 = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(2);
console.log('MAX_SAFE_INTEGER: ', Number.MAX_SAFE_INTEGER, Math.log2(Number.MAX_SAFE_INTEGER));
console.log('BigInt: ', num1 === num2);

// 对象类型 非原始数据类型 object
const create = (obj:object) => {}
// create(1); // 基本数据类型
// create(null);
create({});
create([]);
create(function(){})

export {}