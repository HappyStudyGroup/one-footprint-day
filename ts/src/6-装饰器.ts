
// 装饰器(语法糖)  前端中使用 stage-3 可能后期会有变化
// 扩展属性和方法
// 必须定义在 类 上面

function modifier(target:Function) { // 修饰类本身, 当前参数就是类
  target.prototype.say = function() {
    console.log('say');
  }
}
function toUpperCase(target:any, key:string) {// target 指类的原型, key指属性
  let value:string = target[key];
  Object.defineProperty(target, key, {
    get() {
      return value.toUpperCase()
    },
    set(newValue) {
      value = newValue
    }
  })
}
function toDouble(num:number) {
  return function (target:any, key:string) {// target 指类, key指属性
    let value:number = target[key];
    Object.defineProperty(target, key, {
      get() {
        return value * num
      },
      set(newValue) {
        value = newValue
      }
    })
  }
}
function Enum(target:any, key:string, descriptor:PropertyDescriptor) {
  // defineProperty 中的属性 configurable writable enumerable value
  descriptor.enumerable = false;
}

function params(target:any, key:string, index: number) {
  //            Person           getName     0
  console.log(target, key, index);
  
}


@modifier
class Person {
  say!:Function;
  @toUpperCase
  name:string = 'zf';
  @toDouble(3) // 装饰器就是一个函数, 函数返回函数
  static age:number = 10;

  @Enum
  getName(a:string, @params xx:string) {}
}
let person = new Person()
console.log(person);
person.say()
console.log(person.name);
console.log(Person.age);





























export {}