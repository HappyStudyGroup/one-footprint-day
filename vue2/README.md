
```
#           rollup和babel的桥梁  babel核心模块  es6-es5        启动webpack服务
npm install rollup-plugin-babel @babel/core @babel/preset-env rollup-plugin-serve
```

###### 响应式原理
>核心点考察的是: 数组和对象类型当值变化时如何劫持. 
>对象内部通过 defineReactive 方法, 使用 Object.defineProperty 将属性进行劫持(只会劫持已经存在的属性); 
>数组则是通过重写数组的方法来实现.
>回答时可以带一些相关知识点(多层对象递归劫持,等)