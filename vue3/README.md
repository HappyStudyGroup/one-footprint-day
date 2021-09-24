#### 3. vue3.0
>`切记`: 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

#### setup 组件创建前触发, 包含 props, context 两个参数
```js
$ props 响应式对象
$ context = { attrs, slots, emit }
```
#### ref 响应式引用, 底层使用 defineProperty
>ref 接收参数并将其包裹在一个带有 value property 的对象中返回，然后可以使用该 property 访问或更改响应式变量的值.
#### reactive, 底层使用Proxy
#### toRefs
>如果 title 是可选的 prop，则传入的 props 中可能没有 title 。在这种情况下，toRefs 将不会为 title 创建一个 ref 。你需要使用 toRef
```js
import { toRef } from 'vue'
setup(props) {
  const title = toRef(props, 'title')
  console.log(title.value)
}
```
#### provide/inject
>确保通过 provide 传递的数据不会被 inject 的组件更改，我们建议对提供者的 property 使用 readonly
```js
import { provide, reactive, readonly, ref } from 'vue'
const location = ref('North Pole')
provide('location', readonly(location))
```
#### 在 setup 内注册生命周期钩子
>前缀为 on：即 mounted 看起来会像 onMounted
>onMounted 钩子函数的回调
#### watch 响应式更改, computed 计算属性
#### watchEffect
```js
//  watch() 和 watchEffect() 在 DOM 挂载或更新之前运行副作用，所以当侦听器运行时，模板引用还未被更新
watchEffect(() => {
  console.log(root.value) // => <div>This is a root element</div>
}, { flush: 'post' })
```




#### 自定义修饰符
```js
// <my-component v-model.capitalize="myText"></my-component>
// 当组件的 created 生命周期钩子触发时，modelModifiers prop 会包含 capitalize，且其值为 true
props: {
  modelValue: String,
  modelModifiers: {
    default: () =>({})
  }
},
emits: ['update:modelValue'],
created() {
  console.log(this.modelModifiers) // { capitalize: true }
},
methods: {
  emitValue(e) {
    let value = e.target.value
    if (this.modelModifiers.capitalize) {
      value = value.charAt(0).toUpperCase() + value.slice(1)
    }
    this.$emit('update:modelValue', value)
  }
},
template: `<input
  type="text"
  :value="modelValue"
  @input="emitValue">`
```

#### 插槽
```html
<ul>父组件
  <li v-for="( item, index ) in items">
    <slot :item="item" :index="index" :another-attribute="anotherAttribute"></slot>
  </li>
</ul>

1. 独占默认插槽的缩写语法;
即, 当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用
<todo-list v-slot:default="slotProps">
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
或者
<todo-list v-slot="slotProps">
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
或者 (解构, 重命名, 赋初始值)
<todo-list v-slot="{item, info: item, index = 0}">
  <span class="green">{{ slotProps.item }}</span>
</todo-list>

2. 注意其余情况，v-slot 只能添加在 <template> 上 ;
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>
3. 插槽缩写(#default || #slot-name || #slot-name="slotProps")
<template #header>
  <h1>Here might be a page title</h1>
</template>
```