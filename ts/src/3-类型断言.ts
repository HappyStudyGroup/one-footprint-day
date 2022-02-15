
// 1. 联合类型, 默认是并集

let str:string|number; // 没有初始化时,只能调用两者类型中的共同方法
// str.toString
// str.valueOf

// 会根据赋值, 推导后续的方法
str = 1;
str.toFixed();
str = 'zf';
str.toLowerCase();

let ele:HTMLElement | null = document.getElementById('#app');
ele!.style.color = 'red'; // ! 非空断言, 表示一定有值
ele?.style?.color; // 可以取值, 但是不能赋值(es11)


// 可以做断言操作, 也能解决这个问题, as 强转类型
let ele1:HTMLElement | null = document.getElementById('#app');
// (<HTMLElement>ele1).style.color = 'red'; // 这个和jsx语法有冲突, 尽量不采用
(ele1 as HTMLElement).style.color = 'red';
// ele1 as boolean // 断言不能断言不存在的属性

// 双重断言(不建议使用, 会破坏原有类型)
(ele1 as any) as boolean

// 字面量类型
type Direction = 'up'|'down'|'left'|'right'; // 类型别名
let direction:Direction;
direction = 'down'; // 值只能是上面Direction中的一个


export {}