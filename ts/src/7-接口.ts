
// 接口 用来描述对象的结构, 根据接口可以提供一些新的类型, 为别人使用

// 接口可以被实现, 被继承, type不可以
// type 可以写联合类型, 接口不可以
// 总之, 能用接口就用接口, 不能用就用type

// interface 可以描述 属性, 方法, 类
// 1. 描述对象
interface IFullName {
  firstName:string,
  lastName:string
}

const fullName = (obj:IFullName):IFullName => {
  return obj
}

fullName({ firstName: 'z', lastName: 'f' })

// -------------------------
// 2. 描述函数
interface IFullName2 {
  (firstName: string, lastName: string):string
}
type FullName2 = (firstName: string, lastName: string) => string
const fullName2:FullName2|IFullName2 = (firstName:string, lastName:string):string => {
  return firstName + lastName
}
fullName2('z', 'f')

// 混合类型 如:计数器
// 场景: 一个函数返回一个函数, 返回的函数有属性
interface ICount {
  ():number;
  count:number
}
const fn:ICount = () => {
  return ++fn.count
}
fn.count = 0;
console.log(fn());
console.log(fn());

// 接口的特性
interface IVegetables {
  taste:string,
  color:string,
  // readonly size?:number,
  // type?:string
  // [xxx:string]:any // 任意接口
  readonly [xxx:string]:any // 任意接口
}
// 1.) 如果定义的值比接口的多,可以采用类型断言(as)直接断言成对应接口
const tomato:IVegetables = ({
  size: 10,
  taste: 'sour',
  color: 'red'
} as IVegetables)
// 2.) 多个同名接口会自动合并
interface IVegetables {
  size:number
}
const tomato2:IVegetables = {
  size: 10,
  taste: 'sour',
  color: 'red'
}
// 3.) 继承, 扩展
interface ITomato extends IVegetables {
  size:number
}
const tomato3:ITomato = {
  size: 10,
  taste: 'sour',
  color: 'red'
}
const tomato4:IVegetables = {
  size: 10,
  taste: 'sour',
  color: 'red',
  type: function(){}
}
// 如果接口中 [xxx:index] <=> 可索引接口
interface IArr {
  [xxx:number]:any
}
let arr:IArr = [1, '2', {}, function(){}]
console.log(tomato, tomato2, tomato3, tomato4);

// --------------------------------

// 3. 接口可以被类来实现
interface Speakable { // 接口中的内容都是抽象, 没有具体的实现
  name:string|number,
  speak():void, // 描述类的原型方法, 这里的 void 表示不关心方法的返回值
}
interface ChineseSpeakable {
  speakChinese():void,
}
class Speak implements Speakable, ChineseSpeakable {
  speakChinese(): void {
    throw new Error("Method not implemented.")
  }
  name!: string;
  speak(): number {
    return 123
  }
  
}
let s = new Speak();
s.speak()

// 抽象类 不能被实例化
abstract class Animal { // 抽象类中可以包含抽象方法和抽象属性
  abstract name:string; // 可以没有实现, 也可以有实现
  eat() { // 有实现
    console.log('eat');
  }
}
class Tom extends Animal { // 抽象属性, 子类必须实现
  name!: string;
}

//-------------------------
// 类的实例
class Person { // 给person增加属性
  // name!:string;
  constructor(public name:string){
    this.name = name;
  }
}
interface IClass<T> { // 表示是一个构造函数类型
  new (name:string):T // 可以用类当成类型
}
// {new (name:string):any} <=> new (name:string) => any <=> IClass
function createInstance<T>(clazz:IClass<T>, name:string) {
  return new clazz(name)
}
class Dog {
  constructor(public name:string){
    this.name = name;
  }
}
let r = createInstance<Person>(Person, '李雷')
console.log('Person: ', r.name);
let r2 = createInstance<Dog>(Dog, 'Polly')
console.log('Dog: ', r2.name);


// 泛型 就是当调用时传入具体类型 先用一个标识来占位

export {}