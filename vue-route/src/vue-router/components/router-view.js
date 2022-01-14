export default {
  functional: true, // 函数式组件, 里面没有this
  name: 'router-view',
  props: {},
  render(h, { data, parent }) { // class组件, Vue.extend; 函数式组件: 函数可以节省性能, 缺陷就是没有实例
    let route = parent.$route; // 会做依赖收集
    let depth = 0;
    let records = route.matched;
    data.routerView = true; // 渲染router-view时标记它是一个routerView
    // 看之前渲染过几个router-view, 渲染流程 父 -> 子
    while(parent) {
      // $vnode: 组件的虚拟节点(描述组件本身, $vnode.tag: 'vue-component-1-xx');
      // _vnode: 组件的内容(组件对应的渲染结果, _vnode.tag: 'div' )
      if(parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$parent;
    }
    let record = records[depth];
    if(!record) {
      return h()
    }
    return h(record.component, data)
  }
}