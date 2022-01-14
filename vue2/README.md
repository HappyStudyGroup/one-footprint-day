
```
#           rollup和babel的桥梁  babel核心模块  es6-es5        启动webpack服务
npm install rollup-plugin-babel @babel/core @babel/preset-env rollup-plugin-serve
```

###### 响应式原理
>核心点考察的是: 数组和对象类型当值变化时如何劫持. 
>对象内部通过 defineReactive 方法, 使用 Object.defineProperty 将属性进行劫持(只会劫持已经存在的属性); 
>数组则是通过重写数组的方法来实现.
>回答时可以带一些相关知识点(多层对象递归劫持,等)

##### 观察者模式 和 发布/订阅 的区别和场景
>-Vue中响应式数据变化就是典型的观察者模式
>-Vue中的事件绑定就是发布订阅模式
>观察者模式中观察者和被观察者是存在关联的. 发布订阅模式中订阅者和发布者没有关联, 所以观察者模式中 包含了 发布订阅模式 (watcher 和 dep)

##### vue组件中写name选项有哪些好处和作用
>写name的好处是可以给组件添加名字, 可以通过vm.$options.name 获取
>$broadcast 及 $dispatch 都是根据名字查找对应的组件

##### vue组件间传值的方式以及区别
>props 和 $emit, 父组件向子组件传递数据通过props传递, 子组件传递数据给父组件通过$emit触发事件
>$parent, $children
>$attrs, $listeners (vue2.4)
>provide, inject
>$refs
>eventBus 跨组件传递数据
>vuex状态管理

##### vue的父子组件渲染的先后顺序;
>1.渲染父组件时会创建父组件的虚拟节点(vm._render()), 其中可能包含子组件的标签;
>2.在创建虚拟节点时,获取组件的定义,使用Vue.extend生成组件的构造函数;
>3.调用vm._update方法,内部使用patch根据虚拟节点生成真实节点, 创建组件的实例,然后调用$mount方法重新渲染;

##### v-if 和 v-show的区别
>v-if在编译过程中会被转化成三元表达式,条件不满足时不渲染此节点;
>v-show会被编译成指令, 条件不满足时控制样式将此对应节点隐藏(内部其他指令依旧会继续执行)

##### Vue.use 干什么用的?
```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 插件不能重复加载(单例模式)
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    // 把Vue传入args,放在第一个参数
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```
##### vue-router钩子的执行流程?
>1.导航被触发
>2.在失活的组件里调用 beforeRouteLeave 守卫;
>3.调用全局的 beforeEnter 守卫;
>4.再重用的组件里调用 beforeRouteUpdate 守卫(2.2+);
>5.在路由配置里调用 beforeEnter;
>6.解析异步路由组件;
>7.在被激活的组件里调用 beforeRouteEnter;
>8.调用全局的 beforeResolve 守卫(2.5+);
>9.导航被确认;
>10.调用全局的 afterEach 钩子;
>11.触发 DOM 更新;
>12.调用 beforeRouteEnter 守卫中 传给 next 的回调函数, 创建好的组件实例会作为回调函数的参数传入;

##### vue-router的两种模式区别?
>hash模式: `hash` + `hashChange` 兼容性好但是不美观, 地址会带有  `#`;
>history模式: `historyApi` + `popState` + `pushState` 美观, 但是刷新页面会出现404,需要后端进行配置;

##### v-for的列表尽量使用事件委托
>for循环生成的列表, 如果为每一项增加事件, 少量还好, 子项多了性能会大大降低
>原因: 在JavaScript中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能，因为需要不断的与dom节点进行交互，访问dom的次数越多，引起浏览器重绘与重排的次数也就越多，就会延长整个页面的交互就绪时间，这就是为什么性能优化的主要思想之一就是减少DOM操作的原因；如果要用事件委托，就会将所有的操作放到js程序里面，与dom的操作就只需要交互一次，这样就能大大的减少与dom的交互次数，提高性能.
>事件委托原理: 是利用事件的冒泡原理来实现的，何为事件冒泡呢？就是事件从最深的节点开始，然后逐步向上传播事件，举个例子：页面上有这么一个节点树，div>ul>li>a;比如给最里面的a加一个click点击事件，那么这个事件就会一层一层的往外执行，执行顺序a>li>ul>div，有这样一个机制，那么我们给最外面的div加点击事件，那么里面的ul，li，a做点击事件的时候，都会冒泡到最外层的div上，所以都会触发，这就是事件委托，委托它们父级代为执行事件。
>案例如下:
```js
<ul id="test">
  <li><p>11111111111</p></li>
  <li><div>22222222<span>12121</span></div></li>
  <li><span>3333333333</span></li>
  <li>4444444</li>
</ul>
<script>
  window.onload = function() {
    const ul = document.querySelector('#test');
    ul.onclick = function(ev) {
      var ev = ev || window.event;
      var target = ev.target || ev.srcElement;
      while(target !== ul) {
        const nodeName = target.nodeName.toLowerCase()
        if(nodeName === 'li') {
          console.log(nodeName);
          break;
        }
        console.log('parentNode: ', nodeName, target.parentNode.nodeName.toLowerCase() );
        target = target.parentNode
      }
    }
  }
</script>
```
##### keep-alive 是如何作用的?
>使用的是缓存 ,主要算法是 `LRU`, 最近最久未使用.(缓存的是虚拟dom)

##### vue使用了哪些设计模式?
>工厂模式 - 传入参数即创建不同的实例(createElement)
>单例模式 - 整个程序有且仅有一个实例(插件的使用)
>发布订阅模式
>观察者模式 - `watcher` 和 `dep` 的关系
>代理模式(防抖和节流) - 返回替代: 给某个对象提供一个代理对象,由代理对象控制原对象的引用(如vue3的proxy)
>装饰模式: @装饰器的用法
>中介者模式 - 一个行为设计模式通过提供统一的接口让系统的不同部分进行通信(vuex)
>策略模式 - 指对象某个行为,但是在不同的场景中,该行为有不同的实现方案

