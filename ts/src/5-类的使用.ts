
// 类 es6  类来调用的静态属性   私有的实例属性   共享的原型属性

class Pointer {
  x!:number // 表示实例上有这个属性, 和 public 等价
  public y!:number
  constructor(x:number, y?:number, ...args:number[]) { // 这些参数 函数中的使用方式, 这里都可以
    this.x = x;
    this.y = y as number;
  }
}

let pointer = new Pointer(1, 2, 3, 4, 5);
console.log(pointer);

// (public private protected) readonly 类的修饰符
// public 表示 父类本身 子类 外面 都可以获取这个属性
// protected 受保护的  父类本身 子类 能访问到这个属性
// private 只有自己能访问到
// protected constructor 则此类不能被 new
// private constructor 则此类不能被 new, 不能被继承
class Animal {
  private name!:string
  public readonly age!:number // 表示此属性赋值后不能被修改
  constructor(name:string, age:number) {
    this.name = name;
    this.age = age;
  }
  // 静态属性 和 静态方法 通过类来调用的就是静态的, 可以被继承
  static type = '动物';
  static getName() {
    console.log('动物类:getName');
    return '动物类'
  }
  say() {
    console.log('动物类: say');
  }
}

let animal = new Animal('动物', 100)

class Cat extends Animal {
  address = '';
  constructor(name:string, age:number, address:string) {
    super(name, age); // <=> Animal.call(this)
    this.address = address;
  }
  static getName() { // 子类重写父类的方法(类上的方法 Cat.getName)
    super.getName(); // 1. 静态方法中的super指代的是父类
    console.log('子类猫类');
    return '子类猫类'
  }
  say() { // 原型上的方法, new Cat().say
    super.say(); // 2. super = Animal.prototype, 原型中的super指代的是父类的原型
    console.log('猫: say');
  }
  // 属性访问器, 来访问私有属性
  private _eat:string = '吃'
  get eat() {
    console.log('猫: 吃');
    return this._eat
  }
  set eat(newValue) {
    this._eat = newValue
  }
}

let tom = new Cat('Tom', 10, '美国');
Cat.getName();
tom.say();
tom.eat; // 原型上属性使用
console.log(tom);

export {}