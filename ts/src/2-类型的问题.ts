
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

























export {}
