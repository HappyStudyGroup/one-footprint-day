# -
综合知识学习规划以及进度

#### 1. node

#### 2. vue2 源码分析 + 手写
>面试技巧: http://zhufengpeixun.com/jiagou/vue-apply/interview-1.html
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
##### vue2 和 vue3 的区别
>1. 对 `Typescript` 支持不友好(所有属性都放在this对象上, 难以推断组建的数据类型)
>2. 大量的API挂载再Vue对象的原型上, 难以实现 `TreeShaking`
>3. 跨平台支持不友好
>4. CompositionAPI, 受 ReactHook 启发
>5. 对虚拟DOM进行了重写, 对模板的编辑进行了优化操作...

#### 4. ts
* TS核心应用, 数据类型, 接口, 泛型内置类型
* TS中类型推断, 条件类型, 内置类型, 自定义类型等
* Vue3应用详解, Vue3+ts项目实战, 全家桶应用及项目中权限处理

#### 5. webpack
* 安装
* $ npm install webpack webpack-cli --save-dev
* 入口(entry)
* src\index.js
* webpack.config.js
* 输出(output)

#### 6. gulp
* 安装
* $ npm install --global gulp-cli
* $ npm init
* $ npm install gulp --save-dev
* gulp 不再支持同步任务
* Gulp 提供了两个强大的组合方法： series() 和 parallel()，允许将多个独立的任务组合为一个更大的操作。
  1. 如果需要让任务（task）按顺序执行，请使用 series() 方法
  2. 如果希望以最大并发来运行的任务（tasks），可以使用 parallel() 方法将它们组合起来

#### 7. nginx
>`服务器为了安全分为内核和用户空间, 同步异步发生在用户空间, 阻塞非阻塞发生在内核, 读写服务器资源都是需要经过内核, 用户空间没有权限`
```
1. 同步非阻塞
  产生问题: 用户怎么拿到返回结果?
  解决方案: 1. 轮询(select); 2. 回调(node);
2. 同步阻塞
3. 异步阻塞(IO多路复用, nginx使用的模式)
4. 异步非阻塞
目前支持IO多路复用的系统调用有select, poll, epoll, 后端返回比较慢的选择 epoll, 后端快的选择 轮询select
:时间模式:描述:
:select:单个进程打开的最大连接数为1024,文件描述符太多会导致性能下降:
:poll:和select基本一样, 用链表存储文件描述符, 没有最大连接数限制:
:epoll:在每个文件描述符上设置callback来实现,FD就绪后才会调用callback,活跃socket少的话性能高,活跃socket多的话性能低:
```
* 应用场景:
  1. 静态资源服务器
  2. 反向代理服务
  3. API接口服务
* nginx优势:
  1. 高并发高性能
  2. 可扩展性好
  3. 高可靠性
  4. 热布置
  5. 开源许可证
* 学习环境
  1. 操作系统
  2. 环境确认
    1. 启用网卡
    2. 关闭防火墙
    3. 确认停用
    4. 安装依赖模块
* nginx的架构
  1. 轻量
  2. 架构
    1. 工作流程
      多进程单线程-进程worker数一般设置为cpu核数, 避免出现进程争抢cpu, 导致频繁上下文切换
    2. IO多路复用(异步阻塞IO)
    3. CPU亲和
    4. sendfile(动静文件分离的来源, 一些不参与业务逻辑的静态页面,直接内核读写, 不需要经过用户空间)
      1. 零拷贝传输空间(请求-->内核-->缓存区-->拷贝-->用户空间-->业务处理-->内核-->返回)
* nginx安装
  1. 版本分类
  2. 下载地址
  3. CentOS下YUM安装
* 目录
  1. 安装目录
  2. 日志切割文件
  3. 主配置文件
  4. cgi配置
  5. 编码转换映射转换为文件
  6. 扩展名文件