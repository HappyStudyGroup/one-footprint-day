
// 类型保护  具体到某个类型 类型判断

// js typeof instanceof in

function getVal(val:string | number) {
  if(typeof val === 'string') {
    val.padStart
  }else {
    val.toFixed
  }
}

class Dog {

}

class Cat {

}

let getInstance = (clazz: new () => Dog | Cat) => {
  return new clazz
}
let instance = getInstance(Dog)
if(instance instanceof Dog) {
  instance
}else {
  instance
}

// in 操作符
interface Fish {
  swiming: string
}
interface Bird {
  fly: string
}

function getType(animal:Fish | Bird) {
  if('swiming' in animal) {
    animal
  }else {
    animal
  }
}

export {}