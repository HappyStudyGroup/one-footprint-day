
// 泛型
// 特性: 在声明时, 不能确定类型, 只有在使用的时候才能决定类型
// 场景: 函数, 接口, 类型别名, 类

// 1. 函数中使用泛型

function createArray<T>(times:number, val:T) {
  let result = [];
  for (let i = 0; i < times; i++) {
    result.push(val)
  }
  return result
}
let r = createArray<string>(3, 'abc'); // 不传入类型, ts 也会自动推导

// 泛型可以使用多个
// 元组 [string, number] => [number, string]
function swap<T, K>(tuple:[T, K]):[K, T] {
  return [tuple[1], tuple[0]]
}
let r2 = swap(['a', 1]);

// 函数表达式的写法
// interface ISwap<B> {
//   [key:number]:B
// }
// const swap2 = <B>(tuple:ISwap<B>):ISwap<B> => {
//   return [tuple[1], tuple[0]]
// }
interface ISwap {
  <A, B>(tuple: [A, B]) : [B, A]
}
const swap2:ISwap = <A,B>(tuple:[A,B]):[B,A] => {
  return [tuple[1], tuple[0]]
}
let r3 = swap2(['a', 1]);

// 泛型约束 约束泛型的能力, extends 表示T满足后面的条件
const sum = <T extends number>(a:T, b:T):T => {
  return (a + b) as T
}
// 1 和 2 具备数字的能力, 约束T都是number类型, 只要拥有number能加的功能就可以
let r4 = sum(1, 2);

// 具备带有 length 属性
function getType<T extends { length: number }>(obj:T) {
  return obj.length
}
let r5 = getType('12')

// 2. 默认泛型 不传递 默认给类型
interface DStr<T=string>{
  name:T; // 可能是数组, number, string等等
}
type T1 = DStr
type T2 = DStr<number>
let str:T1 = { name: 'hello' };
let str2:T2 = { name: 123 };

// 属性约束
const getVal = <T extends Object, K extends keyof T>(obj:T, key:K) => {
  return obj
}
let v1 = getVal({a: 1, b: 2}, 'a');

type t1 = keyof any; // number, string, symbol
type t2 = keyof string;

// 3. 类中使用泛型
class MyArray <T>{
  public arr:T[] = [];
  add(v:T) {
    this.arr.push(v)
  }
  getMaxNum():T {
    let arr = this.arr;
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
      let current = arr[i];
      current > max ? max = current : void 0;
    }
    console.log(max);
    return max
  }
}
let arr = new MyArray<number>()
arr.add(2);
arr.add(1);
arr.add(5);
arr.getMaxNum();







export {}