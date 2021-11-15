# -
综合知识学习规划以及进度

#### 1. node
* Vue响应式原理



#### 2. vue2 源码分析 + 手写
>第一周
* Vue响应式原理, 模板编译原理, 虚拟DOM原理, vue初渲染
* Vue中生命周期原理, mixin原理, 依赖收集原理, 异步更新原理
* Vue中组件渲染原理, Vue.extend原理, Vue.use插件原理
* Vue Diff原理, Vue Router原理(多级路由/动态路由/多种路由模式)

>第二周
* Vuex原理剖析
* Vuex模块, 命名空间原理, 辅助函数, 动态模块注册, 插件编写
* VueSSR原理, Vue中单元测试, mocha, chai, jest, karama

#### 3. vue3.0

#### 4. ts
* TS核心应用, 数据类型, 接口, 泛型内置类型
* TS中类型推断, 条件类型, 内置类型, 自定义类型等
* Vue3应用详解, Vue3+ts项目实战, 全家桶应用及项目中权限处理

#### 5. webpack
* 安装
  $ npm install webpack webpack-cli --save-dev
* 入口(entry)
* src\index.js
* webpack.config.js
* 输出(output)

#### 6. gulp
* 安装
  $ npm install --global gulp-cli
  $ npm init
  $ npm install gulp --save-dev
* gulp 不再支持同步任务
* Gulp 提供了两个强大的组合方法： series() 和 parallel()，允许将多个独立的任务组合为一个更大的操作。
  1. 如果需要让任务（task）按顺序执行，请使用 series() 方法
  2. 如果希望以最大并发来运行的任务（tasks），可以使用 parallel() 方法将它们组合起来